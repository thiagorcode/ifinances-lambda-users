export interface GenerateTokenInterface {
  execute(payload: string | object | Buffer, secret: string, expire: string): string
}
