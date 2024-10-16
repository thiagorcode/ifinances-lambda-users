import { JWTokenInterface } from '../../adapter/jw-token/jw-token.interface'
import destr from 'destr'
import { PayloadUserAuth } from '../../shared'
import { NotAuthorizedError } from '../../shared/utils/commonError'

export class RefreshTokenUseCases {
  constructor(private jwToken: JWTokenInterface) {}

  async execute(refreshToken?: string) {
    console.info('init refreshToken service')
    if (!refreshToken) {
      throw new NotAuthorizedError('Not authorized!')
    }
    try {
      const userVerify = this.jwToken.verify(refreshToken)
      const user = destr<PayloadUserAuth>(userVerify)

      const secretToken = this.jwToken.generate<PayloadUserAuth>(
        {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        process.env.TIME_EXP_SECRET_TOKEN ?? '1h',
      )

      const newRefreshToken = this.jwToken.generate<PayloadUserAuth>(
        {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        process.env.TIME_EXP_REFRESH_TOKEN ?? '5h',
      )

      return { secretToken, refreshToken: newRefreshToken }
    } catch (error) {
      console.error(error)
      throw new NotAuthorizedError('Not authorized!')
    }
  }
}
