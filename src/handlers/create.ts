import { destr } from 'destr'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UsersTypes } from './../shared/types/users.types'
import { BaseError, formatResponse } from '../shared/utils'
import { CreateUseCases } from '../domain/use-cases'
import { UsersRepository } from '../domain/repository'
import { DynamoDbAdapter } from '../adapter/dynamodb/dynamodb.adapter'
import { BadRequestError } from '../shared/utils/commonError'
import { withErrorHandler } from 'shared/utils/errorHandler'

const myHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    throw new BadRequestError('Body not found')
  }
  const body = destr<UsersTypes>(event.body)
  const databaseAdapter = new DynamoDbAdapter(process.env.TABLE_NAME ?? '', 'id')
  const repository = new UsersRepository(databaseAdapter)
  const createUserCore = new CreateUseCases(repository)

  await createUserCore.execute(body)
  return formatResponse(200, {
    message: 'Usuário criado com sucesso!',
  })
}

export const handler = withErrorHandler(myHandler)
