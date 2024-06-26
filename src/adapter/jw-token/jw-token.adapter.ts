import jwt from 'jsonwebtoken'
import { JWTokenInterface } from './jw-token.interface'

export class JWTokenAdapter implements JWTokenInterface {
  generate(payload: string | object | Buffer, secret: string, expire: string): string {
    return jwt.sign(payload, secret, { expiresIn: expire })
  }

  verify(token: string, secret: string) {
    return jwt.verify(token, secret)
  }
}
