import { UsersRepositoryInterface } from '../repository/interface/usersRepository.interface'
import { AppErrorException } from '../../shared/utils'
import { UserAuth } from '../entity/user-auth.entity'
import { SchemaValidatorInterface } from '../../adapter/schema-validator-adapter'
import { GenerateTokenInterface } from '../../adapter/generate-token/generate-token.interface'
import { EncryptPasswordInterface } from '../../adapter/encrypt-password/encrypt-password.interface'

export class LoginUseCases {
  constructor(
    private repository: UsersRepositoryInterface,
    private generateTokenAdapter: GenerateTokenInterface,
    private encryptPassword: EncryptPasswordInterface,
    private schemaValidator: SchemaValidatorInterface,
  ) {}

  async execute(username: string, password: string) {
    console.info('init login-use-case service')

    UserAuth.validateRequest({ username, password }, this.schemaValidator)
    const dataUser = await this.repository.findByUsername(username)

    if (!dataUser) {
      console.info('user not found')
      throw new AppErrorException(400, 'Usuário ou senha incorretos!')
    }

    const userAuth = UserAuth.toDomain(dataUser, this.encryptPassword, this.generateTokenAdapter)
    console.debug(userAuth)
    const isMatchPassword = userAuth.comparePassword(password)
    console.debug(isMatchPassword)

    if (!isMatchPassword) {
      console.info('password invalid')
      throw new AppErrorException(400, 'Usuário ou senha incorretos!')
    }
    const secretToken = userAuth.generateSecretToken()
    const refreshToken = userAuth.generateRefreshToken()
    console.debug(secretToken)

    return {
      token: secretToken,
      refreshToken,
      id: userAuth.id,
      email: dataUser.email,
      username: dataUser.username,
    }
  }
}
