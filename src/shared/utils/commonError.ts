import { HttpStatusCode } from '../enum/httpStatusCode'
import { BaseError } from './appErrorException'

export class BadRequestError extends BaseError {
  constructor(description = 'Not found') {
    super('NOT FOUND', HttpStatusCode.BAD_REQUEST, description, true)
  }
}

export class NotAuthorizedError extends BaseError {
  constructor(description = 'Not Authorized') {
    super('NOT AUTHORIZED', HttpStatusCode.NOT_AUTHORIZED, description, true)
  }
}
