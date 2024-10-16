import { AuthorizerUseCases } from '../../domain/use-cases'
import { JWTokenAdapter } from '../../adapter/jw-token/jw-token.adapter'

// fazer o teste igual o da rocketseat

const jwtAdapter = {
  generate() {
    return ''
  },
  verify() {
    return {
      id: 'uuid-test',
      name: 'john doe',
    }
  },
}

describe('Authorizer Use-case', () => {
  describe('success', () => {
    it('Should return success', async () => {
      const authorizerUseCase = new AuthorizerUseCases(jwtAdapter)

      const result = await authorizerUseCase.execute('token')
      expect(result).toEqual({
        isAuthorized: true,
        data: {
          id: 'uuid-test',
          name: 'john doe',
        },
      })
    })
  })

  describe('Error', () => {
    it('Must return unauthorized if the token is not sent', async () => {
      const authorizerUseCase = new AuthorizerUseCases(new JWTokenAdapter('secret'))

      const result = await authorizerUseCase.execute('')
      expect(result.isAuthorized).toEqual(false)
    })
    it("should return an error when the user's password is incorrect", async () => {
      const authorizedUseCases = new AuthorizerUseCases(new JWTokenAdapter('secret'))
      const result = await authorizedUseCases.execute('teste')
      expect(result.isAuthorized).toEqual(false)
    })
  })
})
