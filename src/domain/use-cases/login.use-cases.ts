import { UsersRepositoryInterface } from '../repository/interface/usersRepository.interface'
import { SchemaValidatorInterface } from '../../adapter/schema-validator-adapter'
import { JWTokenInterface } from '../../adapter/jw-token/jw-token.interface'
import { EncryptPasswordInterface } from '../../adapter/encrypt-password/encrypt-password.interface'
import { PayloadUserAuth } from '../../shared'
import { SchemaEnum } from '../../shared/enum/schema'
import { BadRequestError } from '../../shared/utils/commonError'

export class LoginUseCases {
  constructor(
    private repository: UsersRepositoryInterface,
    private jwToken: JWTokenInterface,
    private encryptPassword: EncryptPasswordInterface,
    private schemaValidator: SchemaValidatorInterface,
  ) {}

  async execute(username: string, password: string) {
    console.info('init login-use-case service')
    this.schemaValidator.validate(SchemaEnum.LOGIN, { password, username })

    const user = await this.repository.findByUsername(username)
    if (!user) {
      console.info('user not found')
      throw new BadRequestError('Usuário ou senha incorretos!')
    }

    const isMatchPassword = this.encryptPassword.desEncrypt(password, user.password, user.salt)

    if (!isMatchPassword) {
      console.info('password invalid')
      throw new BadRequestError('Usuário ou senha incorretos!')
    }

    const secretToken = this.jwToken.generate<PayloadUserAuth>(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.TIME_EXP_SECRET_TOKEN ?? '1h',
    )

    const refreshToken = this.jwToken.generate<PayloadUserAuth>(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.TIME_EXP_REFRESH_TOKEN ?? '5h',
    )

    return {
      token: secretToken,
      refreshToken,
      id: user.id,
      email: user.email,
      username: user.username,
    }
  }
}
