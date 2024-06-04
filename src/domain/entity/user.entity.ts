import { CreateUsers, UnmarshallingUser } from '../../shared/types'
import { Entity } from '../common/entity'
import { EncryptPassword } from '../../adapter/encrypt-password/encrypt-password.adapter'
import { GenerateTokenAdapter } from '../../adapter/generate-token/generate-token.adapter'
export class User extends Entity<CreateUsers> {
  private constructor({ id, dtCreated, dtUpdated, ...props }: CreateUsers) {
    super(props, id, dtCreated, dtUpdated)
  }

  public static createUser(props: CreateUsers) {
    // Inject Dependency
    //(props: CreateUsers, encryptPassword: EncryptPassword)
    const encryptPassword = new EncryptPassword()
    const { passwordEncrypted, salt } = encryptPassword.encrypt(props.password)
    const userProps: CreateUsers = {
      email: props.email,
      username: props.username,
      firstName: props.firstName,
      isActive: props.isActive ?? false,
      password: passwordEncrypted,
      salt,
      isPasswordChange: props.isPasswordChange ?? false,
      lastName: props.lastName,
    }
    const instance = new User(userProps)
    // instance.validate(SchemaEnum.CREATE_USER)

    return instance
  }
  public toCreateDto() {
    return {
      ...this.props,
      id: this.id,
      dtCreated: this.created,
      dtUpdated: this.updated,
    }
  }

  public toDto() {}
  public comparePassword(inputPassword: string) {
    const encryptPassword = new EncryptPassword()
    const isValidated = encryptPassword.desEncrypt(inputPassword, this.props.password, this.props.salt)

    return isValidated
  }

  public generateSecretToken(generateToken: GenerateTokenAdapter) {
    return generateToken.execute(
      {
        id: this.id,
        email: this.props.email,
        username: this.props.username,
      },
      'test123',
      '12h',
    )
  }

  public generateRefreshToken(generateToken: GenerateTokenAdapter) {
    return generateToken.execute(
      {
        id: this.id,
        email: this.props.email,
        username: this.props.username,
      },
      'test123',
      '62h',
    )
  }

  public static toDomain(raw: UnmarshallingUser) {
    const instance = new User(raw)
    return instance
  }
}
