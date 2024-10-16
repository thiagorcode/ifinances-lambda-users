import { JWTokenAdapter } from './../../adapter/jw-token/jw-token.adapter'

const userDefault = { id: 1, user: 'test1' }

describe('Jw Token Adapter', () => {
  const jwtAdapter = new JWTokenAdapter('test')

  it('Should generated token with success', () => {
    const token = jwtAdapter.generate(userDefault, '1d')
    expect(token).toBeTruthy()
  })
  it('Should generated token with and valid ', () => {
    const token = jwtAdapter.generate(userDefault, '1d')
    const validToken = jwtAdapter.verify(token)

    expect(validToken).toEqual(expect.objectContaining(userDefault))
  })
})
