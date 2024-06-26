import { Jwt, JwtPayload } from 'jsonwebtoken'

export interface JWTokenInterface {
  generate(payload: string | object | Buffer, secret: string, expire: string): string
  verify(token: string, secret: string): Jwt | JwtPayload | string
}
