import { destr } from 'destr'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { AppErrorException, formatResponse } from '../shared/utils'
import { UserResetPasswordType } from '../shared'
import { DynamoDbAdapter } from '../adapter/dynamodb/dynamodb.adapter'
import { UsersRepository } from '../domain/repository'
import { ResetPasswordUseCase } from '../domain/use-cases/reset-password.use-cases'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      throw new AppErrorException(400, 'Body not found!')
    }
    const body = destr<UserResetPasswordType>(event.body)
    const databaseAdapter = new DynamoDbAdapter(process.env.TABLE_NAME ?? '', 'id')
    const repository = new UsersRepository(databaseAdapter)
    const resetPasswordUserCore = new ResetPasswordUseCase(repository)

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
