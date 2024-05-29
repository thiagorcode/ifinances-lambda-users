import { destr } from 'destr'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UsersTypes } from './../shared/types/users.types'
import { UsersRepository } from '../repository/users.repository'
import { CreateCore } from '../core/create.core'
import { AppErrorException, formatResponse } from '../utils'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      throw new AppErrorException(400, 'Body not found!')
    }
    const body = destr<UsersTypes>(event.body)
    const repository = new UsersRepository()
    const createUserCore = new CreateCore(repository)

    await createUserCore.execute(body)
    return formatResponse(200, {
      message: 'Usuário criado com sucesso!',
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
