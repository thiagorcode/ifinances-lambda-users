import { LoginTypes, UsersTypes } from '../../shared/types'
import { Entity } from '../common/entity'
import { SchemaEnum } from '../../shared/enum/schema'
import { SchemaValidatorInterface } from '../../adapter/schema-validator-adapter/schema-validator.interface'
import { EncryptPasswordInterface } from '../../adapter/encrypt-password/encrypt-password.interface'
import { GenerateTokenInterface } from '../../adapter/generate-token/generate-token.interface'

type User = Omit<UsersTypes, 'id' | 'dtCreated' | 'dtUpdated'>
export class UserAuth extends Entity<User> {
  private encryptPassword: EncryptPasswordInterface
  private generateToken: GenerateTokenInterface
  private constructor(
    { id, dtCreated, dtUpdated, ...props }: UsersTypes,
    encryptPassword: EncryptPasswordInterface,
    generateToken: GenerateTokenInterface,
  ) {
    super(props, id, dtCreated, dtUpdated)
    this.encryptPassword = encryptPassword
    this.generateToken = generateToken
  }

  public toCreateDto() {
    return {
      ...this.props,
      id: this.id,
      dtCreated: this.created,
      dtUpdated: this.updated,
    }
  }

  public static validateRequest({ password, username }: LoginTypes, validator: SchemaValidatorInterface) {
    return validator.validate(SchemaEnum.LOGIN, { password, username })
  }

  public comparePassword(inputPassword: string) {
    const isValidated = this.encryptPassword.desEncrypt(inputPassword, this.props.password, this.props.salt)

    return isValidated
  }

  public generateSecretToken() {
    return this.generateToken.execute(
      {
        id: this.props.id,
        email: this.props.email,
        username: this.props.username,
      },
      'generated_test_1',
      '12h',
    )
  }

  public generateRefreshToken() {
    return this.generateToken.execute(
      {
        id: this.id,
        email: this.props.email,
        username: this.props.username,
      },
      'generated_test_1',
      '62h',
    )
  }

  public static toDomain(
    raw: UsersTypes,
    encryptPassword: EncryptPasswordInterface,
    generateToken: GenerateTokenInterface,
  ): UserAuth {
    return new UserAuth(raw, encryptPassword, generateToken)
  }
}
