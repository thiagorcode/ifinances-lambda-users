import { usersSchema } from '../shared/schemas'
import DynamoDBRepositoryInterface from '../repository/interface/usersRepository.interface'
import { UsersTypes } from '../shared/types'
import { AppErrorException } from '../shared/utils'

// TODO: Aplicar injenção de depedências
export class CreateCore {
  constructor(private userRepository: DynamoDBRepositoryInterface) {}

  async execute(user: UsersTypes | null) {
    console.info('init create service')

    if (!user) {
      throw new AppErrorException(400, 'Erro desconhecido')
    }
    const isUserExist = await this.userRepository.findByUsername(user?.username)

    if (isUserExist) {
      throw new AppErrorException(400, 'Username já existe')
    }
    const userValidate = usersSchema.parse(user)
    return await this.userRepository.createUser(userValidate)
  }
}
