import { HttpStatus } from "@/http-status";

export class HttpError extends Error {
  status: (typeof HttpStatus)[keyof typeof HttpStatus];
  code: string;

  constructor(
    status: (typeof HttpStatus)[keyof typeof HttpStatus],
    message: string,
    code?: string,
  ) {
    super(message);
    this.status = status;
    this.code = code ?? status.statusCode.toString();

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
