import { JWTokenInterface } from '../../adapter/jw-token/jw-token.interface'

export class AuthorizerUseCases {
  constructor(private jwToken: JWTokenInterface) {}
  async execute(headerToken?: string) {
    console.info('init validateAuthorizerToken service')
    try {
      if (!headerToken) {
        return { isAuthorized: false }
      }
      const token = headerToken.split(' ')[1]

      const userVerify = this.jwToken.verify(token)
      console.info(userVerify)
      return { isAuthorized: true, data: userVerify }
    } catch (error) {
      console.error(error)
      return { isAuthorized: false }
    }
  }
}
