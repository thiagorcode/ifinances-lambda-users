import { AppErrorException } from '../../shared/utils'
import { UserResetPasswordType } from '../../shared'
import { UsersRepositoryInterface } from '../repository/interface/usersRepository.interface'
import { User } from '../../domain/entity/user.entity'

export class ResetPasswordUseCase {
  constructor(private userRepository: UsersRepositoryInterface) {}

  async execute({ username, newPassword }: UserResetPasswordType) {
    console.info('init resetpassword service')
    const userDb = await this.userRepository.findByUsername(username)

    if (!userDb) {
      throw new AppErrorException(400, 'Username não encontrado')
    }

    const userDomain = User.resetPassword(userDb, newPassword)
    const user = userDomain.toCreateDto()

    return await this.userRepository.update({
      id: user.id,
      password: user.password,
      salt: user.salt,
      dtUpdated: user.dtUpdated,
    })
  }
}
