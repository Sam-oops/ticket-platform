// Ошибка, которую мы бросаем ОСОЗНАННО, зная нужный HTTP-статус.
// errorHandler по ней отличает «отказали намеренно» (401, 404, 409) от
// «что-то неожиданно упало» (500, стек в лог, наружу ничего лишнего).
export class HttpError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(
    status: number,
    message: string,
    options?: { code?: string; details?: unknown },
  ) {
    // super() вызывает конструктор Error — он кладёт message на место.
    super(message);
    // Без этого в логах будет просто "Error", а не "HttpError".
    this.name = 'HttpError';
    this.status = status;
    this.code = options?.code;
    // unknown, а не any: что с этим делать, решает errorHandler.
    this.details = options?.details;
    // Стек начнётся с места, где ошибку создали, а не изнутри конструктора.
    Error.captureStackTrace(this, HttpError);
  }
}
