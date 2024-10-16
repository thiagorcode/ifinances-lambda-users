import jwt from 'jsonwebtoken'
import { JWTokenInterface } from './jw-token.interface'

export class JWTokenAdapter implements JWTokenInterface {
  private readonly secret: string
  constructor(secret: string) {
    this.secret = secret
  }
  generate(payload: string | object | Buffer, expire: string): string {
    return jwt.sign(payload, this.secret, { expiresIn: expire })
  }

  verify(token: string) {
    return jwt.verify(token, this.secret)
  }
}
