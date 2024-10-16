import * as crypto from 'crypto'
import { EncryptPasswordInterface, EncryptResponse } from './encrypt-password.interface'

export class EncryptPassword implements EncryptPasswordInterface {
  encrypt(password: string): EncryptResponse {
    const salt = crypto.randomBytes(16).toString('hex')
    const passwordEncrypted = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')

    return {
      salt,
      passwordEncrypted,
    }
  }
  desEncrypt(inputPassword: string, passwordEncrypted: string, salt: string): boolean {
    const inputPasswordEncrypted = crypto.pbkdf2Sync(inputPassword, salt, 1000, 64, 'sha512').toString('hex')

    return inputPasswordEncrypted === passwordEncrypted
  }
}
