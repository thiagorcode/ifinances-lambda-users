import { APIGatewayProxyResult } from 'aws-lambda'

interface ResponseParams {
  headers?: {
    [header: string]: boolean | number | string
  }
}

export const formatResponse = (
  statusCode: number,
  body: Record<string, unknown>,
  params?: ResponseParams,
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: params?.headers,
    body: JSON.stringify(body),
  }
}
