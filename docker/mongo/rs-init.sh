#!/usr/bin/env bash
# Инициализация одноузлового replica set. Идемпотентно: запускается при каждом
# `docker compose up`.
#
# Зачем replica set, если узел один: многодокументные транзакции MongoDB работают
# ТОЛЬКО на replica set, а вся гарантия отсутствия overselling (Этап 6) построена
# на session.withTransaction. На standalone-mongod первая же транзакция упадёт с
# "Transaction numbers are only allowed on a replica set member or mongos" —
# ошибка, которая выглядит как баг в коде приложения.
#
# Почему ветвление в bash, а не одним .js-файлом для mongosh (это стоило часа):
# mongosh дописывает `await` только к выражениям ВЕРХНЕГО УРОВНЯ скрипта. Стоит
# завернуть rs.status() в функцию — вызов возвращает отклонённый Promise, try/catch
# его не видит, и падение приходит как необработанное "no replset config has been
# received", будто скрипт вообще не запускался. При этом top-level `await` в режиме
# --file запрещён (файл не модуль) — то есть починить внутри mongosh нечем.
# Поэтому: каждый вызов mongosh — одно выражение верхнего уровня, а все условия,
# цикл ожидания и коды выхода живут в shell.

set -euo pipefail

HOST="${MONGO_HOST:-mongo:27017}"
# Хост участника ДОЛЖЕН совпадать с тем, по которому подключается приложение:
# драйвер после connect читает конфиг rs и обращается к участникам по ИХ именам.
MEMBER_HOST="${MONGO_MEMBER_HOST:-mongo:27017}"

if mongosh --host "$HOST" --quiet --eval 'rs.status().ok' >/dev/null 2>&1; then
  echo "[rs-init] replica set уже инициализирован — пропускаю"
  exit 0
fi

echo "[rs-init] инициализирую replica set rs0..."
mongosh --host "$HOST" --quiet --eval \
  "rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: '${MEMBER_HOST}' }] })"

# Выборы занимают ~1-2 секунды. Без ожидания PRIMARY сервер стартует раньше, чем
# узел готов принимать записи, и падает на первом же connect.
for _ in $(seq 1 60); do
  # Пока конфиг не применился, rs.status() ещё бросает NotYetInitialized —
  # ненулевой код выхода mongosh глотаем и считаем это "ещё не готов".
  state="$(mongosh --host "$HOST" --quiet --eval 'rs.status().myState' 2>/dev/null || echo -1)"
  if [ "$state" = "1" ]; then
    echo "[rs-init] готово: узел PRIMARY, транзакции доступны"
    exit 0
  fi
  sleep 0.5
done

echo "[rs-init] ОШИБКА: узел не стал PRIMARY за 30 секунд" >&2
exit 1
