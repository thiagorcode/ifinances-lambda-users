import { APIGatewayProxyEvent } from 'aws-lambda'
import destr from 'destr'
import { z } from 'zod'
import { AppErrorException } from '../utils'

export class ValidateRequestCore {
  static execute<T>(schema: z.ZodSchema, event: APIGatewayProxyEvent) {
    console.info('Validate request core')

    if (!event.body) {
      throw new AppErrorException(400, 'Body not found!')
    }
    const body = destr<T>(event.body)
    try {
      schema.parse(body)
      return body
    } catch (err) {
      throw new AppErrorException(400, `Validation error ${err}`)
    }
  }
}
