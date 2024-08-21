import { Callback, Context, Handler } from 'aws-lambda'
import { formatResponse } from './formatResponse'
import { BaseError } from './appErrorException'
import { HttpStatusCode } from '../../shared/enum/httpStatusCode'

export function withErrorHandler(handle: Handler) {
  return async function <TEvent = any>(event: TEvent, context: Context, callback: Callback) {
    try {
      return await handle(event, context, callback)
    } catch (error) {
      if (error instanceof BaseError) {
        return formatResponse(error.httpCode, {
          message: error.message,
        })
      }
      return formatResponse(HttpStatusCode.INTERNAL_SERVER, {
        message: 'Internal Server Error',
        error,
      })
    }
  }
}
