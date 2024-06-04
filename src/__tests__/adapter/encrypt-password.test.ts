import { EncryptPassword } from '../../adapter/encrypt-password/encrypt-password.adapter'

describe('Encrypt Password', () => {
  it('Should generated password encrypted with success', () => {
    const encryptAdapter = new EncryptPassword()
    const result = encryptAdapter.encrypt('teste123')
    // expect(result.passwordEncrypted).toEqual(
    //   'a2199666589ed1e0648298412b73e69e3f7fff60046df92836c83ba7c75243523e291c3cc29d935898acacf733f53eb13f78ac1bf26e84f490082ff1339dc100',
    // )
  })
})
