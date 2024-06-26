import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBAdapterInterface } from './dynamodb-adapter.interface'
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import { FilterBuilder } from './filterBuilder'
import { FilterExpression } from './types'
import { QueryBuilder } from './queryBuilder'
import { UpdateBuilder } from './updateBuilder'

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

  async update<T extends object>(data: T) {
    const { expressionAttributeValues, keysContent, expressionAttributeNames, updateExpression } =
      UpdateBuilder.builder({
        item: data,
        partitionKeyName: this.primaryKey,
        sortKeyName: this.sortKey,
      })
    const params = new UpdateCommand({
      TableName: this.tableName,
      Key: {
        ...keysContent,
      },
      ExpressionAttributeValues: expressionAttributeValues,
      UpdateExpression: updateExpression,
    })
    const hasExpressionAttributeNames = Object.keys(expressionAttributeNames).length > 0

    console.log('70 - params: ', JSON.stringify(params))

    if (hasExpressionAttributeNames) {
      params.input.ExpressionAttributeNames = expressionAttributeNames
    }

    console.log('76 - params: ', JSON.stringify(params))

    await this.dynamodbDocumentClient.send(params)
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

    const response = await this.dynamodbDocumentClient.send(params)

    if (!response.Items?.length) {
      return null
    }
    return response.Items as T
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
