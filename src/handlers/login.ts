import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { AppErrorException, formatResponse } from '../shared/utils'
import { LoginTypes } from '../shared/types/login.types'
import destr from 'destr'
import { LoginUseCases } from '../domain/use-cases'
import { UsersRepository } from '../domain/repository'
import { DynamoDbAdapter } from '../adapter/dynamodb/dynamodb.adapter'
import { SchemaValidatorAdapter, schemaRegistry } from '../adapter/schema-validator-adapter'
import { EncryptPassword } from '../adapter/encrypt-password/encrypt-password.adapter'
import { JWTokenAdapter } from '../adapter/jw-token/jw-token.adapter'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      throw new AppErrorException(400, 'Body not found!')
    }
    const body = destr<LoginTypes>(event.body)
    const database = new DynamoDbAdapter(process.env.TABLE_NAME ?? '', 'id')
    const repository = new UsersRepository(database)
    const jwtTokenAdapter = new JWTokenAdapter(process.env.SECRET_JWT!)
    const encryptPassword = new EncryptPassword()
    const schemaValidator = new SchemaValidatorAdapter(schemaRegistry)

    const loginCore = new LoginUseCases(repository, jwtTokenAdapter, encryptPassword, schemaValidator)

    const userAccess = await loginCore.execute(body.username, body.password)

    return formatResponse(
      200,
      {
        message: 'Acesso realizado com sucesso',
        user: {
          token: userAccess.token,
          id: userAccess.id,
          username: userAccess.username,
          email: userAccess.email,
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
