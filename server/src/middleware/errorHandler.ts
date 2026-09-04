import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import { env } from '../config/env.js';
import { HttpError } from '../lib/HttpError.js';

type ErrorBody = {
  error: { code: string; message: string; details?: unknown };
};

// Дубликат уникального индекса приходит от драйвера как объект с code === 11000,
// а не как класс ошибки Mongoose — отсюда ручная проверка формы.
function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 11000
  );
}

function toBody(error: unknown): { status: number; body: ErrorBody } {
  if (error instanceof HttpError) {
    return {
      status: error.status,
      body: {
        error: {
          code: error.code ?? 'ERROR',
          message: error.message,
          details: error.details,
        },
      },
    };
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return {
      status: 400,
      body: {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Данные не прошли валидацию',
          details: Object.keys(error.errors),
        },
      },
    };
  }

  if (error instanceof mongoose.Error.CastError) {
    return {
      status: 400,
      body: {
        error: { code: 'INVALID_ID', message: 'Некорректный идентификатор' },
      },
    };
  }

  if (isDuplicateKeyError(error)) {
    return {
      status: 409,
      body: { error: { code: 'DUPLICATE', message: 'Такая запись уже есть' } },
    };
  }

  return {
    status: 500,
    body: { error: { code: 'INTERNAL', message: 'Внутренняя ошибка сервера' } },
  };
}

// ВАЖНО: ровно четыре параметра. С тремя Express посчитает это обычным
// middleware и никогда не вызовет как обработчик ошибок.
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Ответ уже начал отправляться — вмешиваться поздно, отдаём Express'у.
  if (res.headersSent) {
    next(error);
    return;
  }

  const { status, body } = toBody(error);

  // Неожиданные ошибки логируем целиком; наружу текст не отдаём.
  if (status >= 500) {
    console.error('[error]', error);
  }

  // details нужны в разработке, в продакшне это утечка внутренностей.
  if (env.NODE_ENV === 'production') {
    delete body.error.details;
  }

  res.status(status).json(body);
}
