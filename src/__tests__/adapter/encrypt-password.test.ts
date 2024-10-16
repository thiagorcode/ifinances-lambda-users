import { EncryptPassword } from '../../adapter/encrypt-password/encrypt-password.adapter'
import * as crypto from 'crypto'
jest.mock('crypto')

describe('Encrypt Password', () => {
  it('Should generated password encrypted with success', () => {
    ;(crypto.randomBytes as jest.Mock).mockImplementation(() => Buffer.from('mocked_random_bytes'))
    ;(crypto.pbkdf2Sync as jest.Mock).mockImplementation(() => Buffer.from('mocked_radom_code'))
    const encryptAdapter = new EncryptPassword()
    const result = encryptAdapter.encrypt('teste123')
    expect(result.passwordEncrypted).toEqual('6d6f636b65645f7261646f6d5f636f6465')
    expect(result.salt).toEqual('6d6f636b65645f72616e646f6d5f6279746573')
  })

  it('Should generated password desencrypted with success', () => {
    ;(crypto.pbkdf2Sync as jest.Mock).mockImplementation(() => Buffer.from('mocked_radom_code'))
    const encryptAdapter = new EncryptPassword()
    const result = encryptAdapter.desEncrypt(
      'teste123',
      '6d6f636b65645f7261646f6d5f636f6465',
      '6d6f636b65645f72616e646f6d5f6279746573',
    )
    expect(result).toEqual(true)
  })
})
