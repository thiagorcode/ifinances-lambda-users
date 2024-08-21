import { EncryptPasswordInterface } from '../../adapter/encrypt-password/encrypt-password.interface'
import { JWTokenAdapter } from '../../adapter/jw-token/jw-token.adapter'
import { SchemaValidatorAdapter, schemaRegistry } from '../../adapter/schema-validator-adapter'
import { UsersRepositoryInterface } from '../../domain/repository/interface/usersRepository.interface'
import { BaseError } from '../../shared/utils'
import { userMock } from '../__mocks__/user'
import { LoginUseCases } from './../../domain/use-cases/login.use-cases'

function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('data received')
    }, 1000)
  })
}

const encryptPasswordFake: EncryptPasswordInterface = {
  desEncrypt: (inputPassword, pass) => {
    return inputPassword === pass
  },
  encrypt: () => {
    return {
      passwordEncrypted: 't2421',
      salt: '241241',
    }
  },
}

const userRepositoryFake: UsersRepositoryInterface = {
  createUser: async (user: any) => {
    console.log(user)
    await fetchData()
  },
  findById: async () => {
    await fetchData()
    return userMock
  },
  findByUsername: async () => {
    await fetchData()
    return userMock
  },
  findAll: async () => {
    await fetchData()
    return [userMock]
  },
  update: async () => {
    await fetchData()
    console.log('Sucesso')
  },
}
describe('Login Use-case', () => {
  describe('success', () => {
    it('Should return success', async () => {
      const loginUseCase = new LoginUseCases(
        userRepositoryFake,
        new JWTokenAdapter('secret'),
        encryptPasswordFake,
        new SchemaValidatorAdapter(schemaRegistry),
      )

      const result = await loginUseCase.execute('teste', '22142')
      expect(result).toEqual(
        expect.objectContaining({
          email: 'test@gmail.com',
          username: 'test',
        }),
      )
    })
  })

  describe('Error', () => {
    it("should return an error when it can't find the user", async () => {
      const userRepoFake = {
        ...userRepositoryFake,
        findByUsername: async () => {
          await fetchData()
          return null
        },
      }
      const loginUseCase = new LoginUseCases(
        userRepoFake,
        new JWTokenAdapter('secret'),
        encryptPasswordFake,
        new SchemaValidatorAdapter(schemaRegistry),
      )

      await expect(loginUseCase.execute('teste', '22142')).rejects.toThrow(BaseError)
    })
    it("should return an error when the user's password is incorrect", async () => {
      const loginUseCase = new LoginUseCases(
        userRepositoryFake,
        new JWTokenAdapter('secret'),
        encryptPasswordFake,
        new SchemaValidatorAdapter(schemaRegistry),
      )

      await expect(loginUseCase.execute('teste', 'errorPassword')).rejects.toThrow(BaseError)
    })
  })
})
