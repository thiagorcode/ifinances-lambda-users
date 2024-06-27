import { Jwt, JwtPayload } from 'jsonwebtoken'

export interface JWTokenInterface {
  generate<T>(payload: T, expire: string): string
  generate(payload: string | object | Buffer, expire: string): string
  verify(token: string): Jwt | JwtPayload | string
}
