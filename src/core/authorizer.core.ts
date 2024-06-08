import jwt from 'jsonwebtoken'

export class AuthorizerCore {
  async execute(headerToken?: string) {
    console.info('init validateAuthorizerToken service')
    try {
      if (!headerToken) {
        return { isAuthorized: false }
      }
      const token = headerToken.split(' ')[1]

      // const kid = jwt.decode(token, { complete: true })?.['header']['kid']
      const jwtSecret = 'generated_test_1'
      const verify = jwt.verify(token, jwtSecret)
      console.info(verify)
      return { isAuthorized: true, data: verify }
    } catch (error) {
      console.error(error)
      return { isAuthorized: false }
    }
  }
}
