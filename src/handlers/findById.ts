import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { BaseError, formatResponse } from '../shared/utils'
import { DynamoDbAdapter } from '../adapter/dynamodb/dynamodb.adapter'
import { UsersRepository } from '../domain/repository'
import { FindByIdUseCases } from 'domain/use-cases'
import { BadRequestError } from '../shared/utils/commonError'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.debug('Event:', event)
    const userId = event.pathParameters?.id

    if (!userId) throw new BadRequestError('Query: UserId not found')

    const databaseAdapter = new DynamoDbAdapter(process.env.TABLE_NAME ?? '', 'id')
    const repository = new UsersRepository(databaseAdapter)
    const findByIdCore = new FindByIdUseCases(repository)
    const users = await findByIdCore.execute(userId)

    return formatResponse(200, {
      message: 'Buscas realizada com sucesso!',
      users,
    })
  } catch (err) {
    console.error(err)

    if (err instanceof BaseError) {
      return formatResponse(err.httpCode, {
        message: err.message,
      })
    }
    return formatResponse(500, {
      message: 'some error happened',
    })
  }
}
