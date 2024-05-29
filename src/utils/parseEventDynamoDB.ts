import { unmarshall } from '@aws-sdk/util-dynamodb'

export const parseEventDynamoDB = <T>(data: any | undefined): T | null => {
  if (!data) {
    return null
  }
  return unmarshall(data) as T
}
