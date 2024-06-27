import { JWTokenAdapter } from '../adapter/jw-token/jw-token.adapter'
import { APIGatewayRequestAuthorizerEvent, APIGatewaySimpleAuthorizerWithContextResult } from 'aws-lambda'
import { AuthorizerUseCases } from 'domain/use-cases'

type ContextRequestAuthorizer = {}

export const handler = async (
  event: APIGatewayRequestAuthorizerEvent,
): Promise<APIGatewaySimpleAuthorizerWithContextResult<ContextRequestAuthorizer>> => {
  try {
    console.debug('Event:', event)
    const jwtTokenAdapter = new JWTokenAdapter(process.env.SECRET_JWT!)
    const authorizerCore = new AuthorizerUseCases(jwtTokenAdapter)
    const authorizer = await authorizerCore.execute(event.headers?.authorization ?? '')
    console.info('status', authorizer)
    return { isAuthorized: authorizer.isAuthorized, context: authorizer.data ?? {} }
  } catch (err) {
    console.error('handler error', err)
    return { isAuthorized: false, context: {} }
  }
}
