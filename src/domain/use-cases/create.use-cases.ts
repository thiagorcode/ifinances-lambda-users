import { UsersTypes } from '../../shared/types'
import { AppErrorException } from '../../shared/utils'
import { User } from '../entity/user.entity'
import { UsersRepositoryInterface } from '../repository/interface/usersRepository.interface'

export class CreateUseCases {
  constructor(private userRepository: UsersRepositoryInterface) {}

  async execute(user: UsersTypes) {
    console.info('init create service')
    const newUser = User.createUser(user)

    const isUserExist = await this.userRepository.findByUsername(user.username)

    if (isUserExist) {
      throw new AppErrorException(400, 'Username já existe')
    }
    await this.userRepository.createUser(newUser)
  }
}
