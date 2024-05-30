import jwt from 'jsonwebtoken'
import { GenerateTokenInterface } from './generate-token.interface'

export class GenerateTokenAdapter implements GenerateTokenInterface {
  execute(payload: string | object | Buffer, secret: string, expire: string): string {
    return jwt.sign(payload, secret, { expiresIn: expire })
  }
}
