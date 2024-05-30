export interface EncryptResponse {
  salt: string
  passwordEncrypted: string
}

export interface EncryptPasswordInterface {
  encrypt(password: string): EncryptResponse
  desEncrypt(inputPassword: string, passwordEncrypted: string, salt: string): boolean
}
