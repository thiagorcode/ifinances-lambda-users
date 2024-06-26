import { JWTokenInterface } from '../../adapter/jw-token/jw-token.interface'
import { UserAuth } from '../entity/user-auth.entity'

export class AuthorizerUseCases {
  constructor(private jwToken: JWTokenInterface) {}
  async execute(headerToken?: string) {
    console.info('init validateAuthorizerToken service')
    try {
      if (!headerToken) {
        return { isAuthorized: false }
      }
      const token = headerToken.split(' ')[1]

      const verify = UserAuth.verifyToken(this.jwToken, token)
      console.info(verify)
      return { isAuthorized: true, data: verify }
    } catch (error) {
      console.error(error)
      return { isAuthorized: false }
    }
  }
}
