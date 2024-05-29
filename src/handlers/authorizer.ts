import { APIGatewayRequestAuthorizerEvent, APIGatewaySimpleAuthorizerWithContextResult } from 'aws-lambda'
import { AuthorizerCore } from '../core/authorizer.core'

type ContextRequestAuthorizer = {}

export const handler = async (
  event: APIGatewayRequestAuthorizerEvent,
): Promise<APIGatewaySimpleAuthorizerWithContextResult<ContextRequestAuthorizer>> => {
  try {
    console.debug('Event:', event)
    const authorizerCore = new AuthorizerCore()
    const authorizer = await authorizerCore.execute(event.headers?.authorization ?? '')
    console.info('status', authorizer)
    return { isAuthorized: authorizer.isAuthorized, context: authorizer.data ?? {} }
  } catch (err) {
    console.error('handler error', err)
    return { isAuthorized: false, context: {} }
  }
}
