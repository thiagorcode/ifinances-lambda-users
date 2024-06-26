import { LoginTypes, UsersTypes } from '../../shared/types'
import { Entity } from '../common/entity'
import { SchemaEnum } from '../../shared/enum/schema'
import { SchemaValidatorInterface } from '../../adapter/schema-validator-adapter/schema-validator.interface'
import { EncryptPasswordInterface } from '../../adapter/encrypt-password/encrypt-password.interface'
import { JWTokenInterface } from '../../adapter/jw-token/jw-token.interface'

type User = Omit<UsersTypes, 'id' | 'dtCreated' | 'dtUpdated'>
export class UserAuth extends Entity<User> {
  private encryptPassword: EncryptPasswordInterface
  private jwToken: JWTokenInterface

  private constructor(
    { id, dtCreated, dtUpdated, ...props }: UsersTypes,
    encryptPassword: EncryptPasswordInterface,
    jwToken: JWTokenInterface,
  ) {
    super(props, id, dtCreated, dtUpdated)
    this.encryptPassword = encryptPassword
    this.jwToken = jwToken
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
    return this.jwToken.generate(
      {
        id: this.id,
        email: this.props.email,
        username: this.props.username,
      },
      'generated_test_1',
      '12h',
    )
  }

  public generateRefreshToken() {
    return this.jwToken.generate(
      {
        id: this.id,
        email: this.props.email,
        username: this.props.username,
      },
      'generated_test_1',
      '62h',
    )
  }

  public static verifyToken(jwToken: JWTokenInterface, token: string) {
    return jwToken.verify(token, 'generated_test_1')
  }

  public static toDomain(
    raw: UsersTypes,
    encryptPassword: EncryptPasswordInterface,
    generateToken: JWTokenInterface,
  ): UserAuth {
    return new UserAuth(raw, encryptPassword, generateToken)
  }
}
