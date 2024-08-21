import { BadRequestError } from '../../shared/utils/commonError'
import { UsersTypes } from '../../shared/types'
import { User } from '../entity/user.entity'
import { UsersRepositoryInterface } from '../repository/interface/usersRepository.interface'

export class CreateUseCases {
  constructor(private userRepository: UsersRepositoryInterface) {}

  async execute(user: UsersTypes) {
    console.info('init create service')
    const newUser = User.createUser(user)

    const isUserExist = await this.userRepository.findByUsername(user.username)

    if (isUserExist) {
      throw new BadRequestError('Username já existe')
    }
    await this.userRepository.createUser(newUser)
  }
}
