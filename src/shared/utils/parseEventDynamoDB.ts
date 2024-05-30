import { unmarshall } from '@aws-sdk/util-dynamodb'

export const parseEventDynamoDB = <T>(data?: any): T | null => {
  if (!data) {
    return null
  }
  return unmarshall(data) as T
}
