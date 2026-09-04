import express from 'express';

import { HttpError } from './lib/HttpError.js';
import { errorHandler } from './middleware/errorHandler.js';
import { healthRouter } from './routes/health.js';

export function createApp() {
  const app = express();

  // На Этапе 8 ВЫШЕ этой строки появится express.raw() для роута вебхука Stripe:
  // проверка подписи считается по сырому телу, а json() его уже разберёт.
  app.use(express.json());

  app.use(healthRouter);

  // Порядок ниже — не стиль, а семантика. Сначала «ни один роут не подошёл»,
  // потом обработчик ошибок, и только он последним.
  app.use((_req, _res, next) => {
    next(new HttpError(404, 'Маршрут не найден', { code: 'NOT_FOUND' }));
  });

  app.use(errorHandler);

  return app;
}
