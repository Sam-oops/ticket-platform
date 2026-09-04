import { Router } from 'express';
import mongoose from 'mongoose';

export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  const state = mongoose.connection.readyState;
  const connected = state === mongoose.ConnectionStates.connected;

  // Именованный импорт { ConnectionStates } здесь НЕ работает: mongoose — пакет
  // CommonJS, а наш код ESM, и Node не находит такой экспорт статически.
  // Через дефолтный импорт то же значение доступно.
  //
  // 503, а не всегда 200: health-чек, который отвечает «ок» при отвалившейся
  // базе, бесполезен — оркестратор не узнает, что сервис нерабочий.
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'degraded',
    // Обратный маппинг числового enum: ConnectionStates[1] === 'connected'.
    db: mongoose.ConnectionStates[state],
    uptime: Math.round(process.uptime()),
  });
});
