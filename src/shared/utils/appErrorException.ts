import { HttpStatusCode } from '../enum/httpStatusCode'

export class BaseError extends Error {
  public readonly name: string
  public readonly httpCode: HttpStatusCode
  public readonly isOperational: boolean

  constructor(name: string, httpCode: HttpStatusCode, description: string, isOperational: boolean) {
    super(description)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = name
    this.httpCode = httpCode
    this.isOperational = isOperational

    Error.captureStackTrace(this)
    console.error({ name, httpCode, isOperational, description })
  }
}

export class AppErrorException extends BaseError {
  constructor(
    name: string,
    httpCode = HttpStatusCode.INTERNAL_SERVER,
    isOperational = true,
    description = 'internal server error',
  ) {
    super(name, httpCode, description, isOperational)
  }
}
