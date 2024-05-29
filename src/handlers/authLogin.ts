import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import destr from 'destr'
import { UsersRepository } from '../repository/users.repository'
import { AppErrorException, formatResponse } from '../utils'
import { ValidateAuthCore } from '../core/validateAuth.core'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.debug('Event:', event)
    const repository = new UsersRepository()
    const validateAuth = new ValidateAuthCore(repository)

    if (!event.body) {
      throw new AppErrorException(400, 'Body not found!')
    }
    const body = destr<{ username: string; password: string }>(event.body)
    console.debug('Body:', body)
    const userAccess = await validateAuth.execute(body.username, body.password)

    return formatResponse(200, {
      message: 'Acesso realizado com sucesso',
      userAccess,
    })
  } catch (err) {
    console.error(err)

    if (err instanceof AppErrorException) {
      return formatResponse(err.statusCode, {
        message: err.message,
      })
    }
    return formatResponse(500, {
      message: 'Erro inesperado',
    })
  }
}
