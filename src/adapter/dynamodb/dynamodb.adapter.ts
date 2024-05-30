import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBAdapterInterface } from './dynamodb-adapter.interface'
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { FilterBuilder } from './filterBuilder'
import { FilterExpression } from './types'
import { parseEventDynamoDB } from '../../shared/utils/parseEventDynamoDB'
import { QueryBuilder } from './queryBuilder'

export class DynamoDbAdapter implements DynamoDBAdapterInterface {
  private readonly dynamodbClient: DynamoDB
  private readonly dynamodbDocumentClient: DynamoDBDocumentClient
  private readonly tableName: string
  private readonly primaryKey: string
  private readonly sortKey: string

  constructor(tableName: string, primaryKey: string, sortKey?: string) {
    this.dynamodbClient = new DynamoDB()
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(this.dynamodbClient)
    this.tableName = tableName
    this.primaryKey = primaryKey
    this.sortKey = sortKey ?? ''
  }

  public async add<T extends object>(data: T) {
    const params = new PutCommand({
      TableName: this.tableName,
      Item: {
        ...data,
      },
    })

    await this.dynamodbDocumentClient.send(params)
  }

  async get<T extends object>(id: string) {
    const params = new GetCommand({
      TableName: this.tableName,
      Key: {
        [this.primaryKey]: id,
      },
    })
    const { Item } = await this.dynamodbDocumentClient.send(params)
    return Item as T | undefined
  }
  async scan<T extends object>(filters?: FilterExpression[], indexName?: string) {
    const configQuery = FilterBuilder.build(filters)
    const params = new ScanCommand({
      TableName: this.tableName,
      IndexName: indexName,
      FilterExpression: configQuery.filterExpression,
      ExpressionAttributeNames: configQuery.expressionAttributeNames,
      ExpressionAttributeValues: configQuery.expressionAttributeValues,
    })
    const result = await this.dynamodbDocumentClient.send(params)

    if (!result.Items?.length) {
      return null
    }
    return parseEventDynamoDB<T>(result.Items[0])
  }

  async query<T extends object>(partitionKeyValue: string, filters: FilterExpression[], indexName?: string) {
    const { filterExpression, expressionAttributeNames, expressionAttributeValues, keyConditionExpression } =
      QueryBuilder.builder({
        partitionKeyName: this.primaryKey,
        sortKeyName: this.sortKey,
        filters,
        partitionKeyValue,
      })
    const params = new QueryCommand({
      TableName: this.tableName,
      IndexName: indexName,
      FilterExpression: filterExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      KeyConditionExpression: keyConditionExpression,
    })
    const result = await this.dynamodbDocumentClient.send(params)

    return result.Items as T[]
  }
}
