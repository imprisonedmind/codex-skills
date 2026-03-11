export class AppError extends Error {
  readonly code: string;
  readonly cause?: unknown;

  constructor(code: string, message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.cause = options?.cause;
  }
}
