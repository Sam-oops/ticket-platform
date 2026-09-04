import type { Server } from 'node:http';

import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectToDatabase, disconnectFromDatabase } from './db/connect.js';

function installShutdownHandlers(server: Server): void {
  let shuttingDown = false;

  const shutdown = (signal: string): void => {
    // Повторный сигнал при уже идущем завершении игнорируем.
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`[server] получен ${signal}, завершаюсь`);

    server.close(() => {
      void disconnectFromDatabase().finally(() => {
        process.exit(0);
      });
    });
  };

  // Docker при остановке шлёт SIGTERM; без обработки контейнер убивается
  // принудительно через 10 секунд таймаута.
  process.on('SIGTERM', () => {
    shutdown('SIGTERM');
  });
  process.on('SIGINT', () => {
    shutdown('SIGINT');
  });
}

async function main(): Promise<void> {
  await connectToDatabase();

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    console.log(`[server] слушает порт ${String(env.PORT)} (${env.NODE_ENV})`);
  });

  installShutdownHandlers(server);
}

main().catch((error: unknown) => {
  console.error('[server] не удалось запуститься:', error);
  process.exit(1);
});
