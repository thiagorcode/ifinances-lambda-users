import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import destr from 'destr'
import { BaseError, formatResponse } from '../shared/utils'
import { JWTokenAdapter } from '../adapter/jw-token/jw-token.adapter'
import { RefreshTokenUseCases } from '../domain/use-cases/refresh-token.use-cases'
import { BadRequestError } from '../shared/utils/commonError'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      throw new BadRequestError('Body not found')
    }
    const body = destr<{ refreshToken?: string }>(event.body)
    const jwtTokenAdapter = new JWTokenAdapter(process.env.SECRET_JWT!)

    const refreshTokenUseCases = new RefreshTokenUseCases(jwtTokenAdapter)

    const tokens = await refreshTokenUseCases.execute(body.refreshToken)

    return formatResponse(
      200,
      {
        message: 'New Token',
      },
      {
        headers: {
          Authorization: tokens.secretToken,
          'Set-Cookie': `refreshToken=${tokens.refreshToken}; HttpOnly; Secure`,
        },
      },
    )
  } catch (err) {
    console.error(err)

    if (err instanceof BaseError) {
      return formatResponse(err.httpCode, {
        message: err.message,
      })
    }
    return formatResponse(500, {
      message: 'Erro inesperado!',
    })
  }
}
