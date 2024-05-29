export class AppErrorException extends Error {
  readonly statusCode: number
  constructor(statusCode: number, msg: string) {
    super(msg)
    this.name = 'MeuErro'
    this.statusCode = statusCode
  }
}
