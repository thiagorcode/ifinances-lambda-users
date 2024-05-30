import { destr } from 'destr'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UsersRepository } from '../repository/users.repository'
import { AppErrorException, formatResponse } from '../shared/utils'
import { UserResetPasswordType } from '../shared'
import { ResetPasswordCore } from '../core/resetPassword.core'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      throw new AppErrorException(400, 'Body not found!')
    }
    const body = destr<UserResetPasswordType>(event.body)
    const repository = new UsersRepository()
    const resetPasswordUserCore = new ResetPasswordCore(repository)

    await resetPasswordUserCore.execute(body)
    return formatResponse(200, {
      message: 'Senha resetada com sucesso!',
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
      err,
    })
  }
}
