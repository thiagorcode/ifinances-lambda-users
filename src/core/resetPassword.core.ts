import UserRepositoryInterface from '../repository/interface/usersRepository.interface'
import { UserResetPasswordType } from '../shared/types'
import { AppErrorException } from '../utils'
import * as crypto from 'crypto'

export class ResetPasswordCore {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute({ username, newPassword }: UserResetPasswordType) {
    console.info('init resetpassword service')
    const user = await this.userRepository.findByUsername(username)

    if (!user) {
      throw new AppErrorException(400, 'Username não encontrado')
    }
    const salt = crypto.randomBytes(16).toString('hex')
    const password = crypto.pbkdf2Sync(newPassword, salt, 1000, 64, 'sha512').toString('hex')
    return await this.userRepository.resetPassword(user.id, password, salt)
  }
}
