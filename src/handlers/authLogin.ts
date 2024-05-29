import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UsersRepository } from '../repository/users.repository'
import { AppErrorException, formatResponse } from '../utils'
import { LoginCore } from '../core/login.core'
import { ValidateRequestCore } from '../core/validateRequest.core'
import { LoginSchema } from '../shared'
import { LoginTypes } from 'shared/types/login.types'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = ValidateRequestCore.execute<LoginTypes>(LoginSchema, event)
    const repository = new UsersRepository()
    const loginCore = new LoginCore(repository)

    const userAccess = await loginCore.execute(body.username, body.password)

    return formatResponse(
      200,
      {
        message: 'Acesso realizado com sucesso',
        user: {
          token: userAccess.token,
          id: userAccess.id,
          username: userAccess.username,
          email: userAccess.email
        },
      },
      {
        headers: {
          Authorization: userAccess.token,
          'Set-Cookie': `refreshToken=${userAccess.refreshToken}; HttpOnly; Secure`,
        },
      },
    )
  } catch (err) {
    console.error(err)

    if (err instanceof AppErrorException) {
      return formatResponse(err.statusCode, {
        message: err.message,
      })
    }
    return formatResponse(500, {
      message: 'Erro inesperado!',
    })
  }
}
