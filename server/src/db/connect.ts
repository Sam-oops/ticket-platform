import mongoose from 'mongoose';

import { env } from '../config/env.js';

export async function connectToDatabase(): Promise<void> {
  // Никаких useNewUrlParser/useUnifiedTopology — с Mongoose 6 это no-op.
  await mongoose.connect(env.MONGODB_URI);

  const { host, port, name } = mongoose.connection;
  console.log(`[db] подключено: ${host}:${String(port)}/${name}`);

  // Разрыв соединения ПОСЛЕ старта — не повод падать: драйвер переподключается
  // сам, а /health в это время честно отвечает 503.
  mongoose.connection.on('error', (error: Error) => {
    console.error('[db] ошибка соединения:', error.message);
  });
}

export async function disconnectFromDatabase(): Promise<void> {
  await mongoose.disconnect();
  console.log('[db] соединение закрыто');
}
