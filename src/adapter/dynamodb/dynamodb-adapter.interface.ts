import { FilterExpression } from './types'

export interface DynamoDBAdapterInterface {
  add<T extends object>(data: T): Promise<void>
  get<T extends object>(id: string): Promise<T | undefined>
  update<T extends object>(data: T): Promise<void>
  scan<T extends object>(filters?: FilterExpression[], indexName?: string): Promise<T | null>
  query<T extends object>(partitionKeyValue: string, filters: FilterExpression[], indexName?: string): Promise<T[]>
}
