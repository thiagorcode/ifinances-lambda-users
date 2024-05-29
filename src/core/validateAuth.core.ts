import * as crypto from 'crypto'
import jwt from 'jsonwebtoken'
import DynamoDBRepositoryInterface from '../repository/interface/usersRepository.interface'
import { AppErrorException } from '../utils'

export class ValidateAuthCore {
  constructor(private repository: DynamoDBRepositoryInterface) {}

  private comparePassword(password: string, userHashPassword: string, salt: string) {
    const hashPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`)
    return hashPassword === userHashPassword
  }

  async execute(username: string, password: string) {
    console.info('init validateAuth service')
    const user = await this.repository.findByUsername(username)

    if (!user) {
      console.error('user invalid')
      throw new AppErrorException(400, 'Usuário ou senha incorretos!')
    }
    const isMatchPassword = this.comparePassword(password, user.password, user.salt)
    if (!isMatchPassword) {
      console.error('password invalid')
      throw new AppErrorException(400, 'Usuário ou senha incorretos!')
    }

    const jwtSecret = 'teste123'
    const jwtToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      jwtSecret,
      { expiresIn: '12h' },
    )
    return {
      token: jwtToken,
      id: user.id,
      email: user.email,
      username: user.username,
    }
  }
}
