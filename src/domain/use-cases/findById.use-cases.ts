import { UsersRepositoryInterface } from '../repository/interface/usersRepository.interface'
import { AppErrorException } from '../../shared/utils'

export class FindByIdUseCases {
  constructor(private dataRepository: UsersRepositoryInterface) {}

  async execute(id: string) {
    console.info('init finduser service')
    try {
      return await this.dataRepository.findById(id)
    } catch (error) {
      console.error(error)
      throw new AppErrorException(400, 'Erro inesperado, tente novamente mais tarde!')
    }
  }
}
