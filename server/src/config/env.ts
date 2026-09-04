import process from 'process';

type Env = {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  MONGODB_URI: string;
};

function required(name: string): string {
  const value = process.env[name];
  if (value === undefined || value.trim() === '') {
    throw new Error(`Не задана переменная окружения ${name}`);
  }
  return value;
}

function parsePort(raw: string): number {
  const port = Number(raw);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(
      `PORT должен быть целым положительным числом, получено: "${raw}"`,
    );
  }
  return port;
}

function parseNodeEnv(raw: string | undefined): Env['NODE_ENV'] {
  if (raw === undefined || raw.trim() === '') return 'development';
  if (raw === 'development' || raw === 'production' || raw === 'test') {
    return raw;
  }
  throw new Error(
    `NODE_ENV должен быть development | production | test, получено: "${raw}"`,
  );
}

export const env: Env = Object.freeze({
  NODE_ENV: parseNodeEnv(process.env.NODE_ENV),
  PORT: parsePort(required('PORT')),
  MONGODB_URI: required('MONGODB_URI'),
});
