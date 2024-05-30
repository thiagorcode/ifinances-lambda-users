import { EncryptPasswordInterface } from '../../adapter/encrypt-password/encrypt-password.interface'
import { GenerateTokenAdapter } from '../../adapter/generate-token/generate-token.adapter'
import { SchemaValidatorAdapter, schemaRegistry } from '../../adapter/schema-validator-adapter'
import { UsersRepositoryInterface } from '../../domain/repository/interface/usersRepository.interface'
import { userMock } from '../__mocks__/user'
import { LoginUseCases } from './../../domain/use-cases/login.use-cases'

function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('data received')
    }, 1000)
  })
}

const encryptPasswordFake: EncryptPasswordInterface = {
  desEncrypt: (inputPassword, pass, salt) => {
    return inputPassword === pass
  },
  encrypt: (encrypt) => {
    return {
      passwordEncrypted: 't2421',
      salt: '241241',
    }
  },
}

const userRepositoryFake: UsersRepositoryInterface = {
  createUser: async (user) => {
    console.log(user)
    await fetchData()
  },
  findById: async (id) => {
    await fetchData()
    return userMock
  },
  findByUsername: async (username) => {
    await fetchData()
    return userMock
  },
  findAll: async () => {
    await fetchData()
    return [userMock]
  },
}
describe('Login Use-case', () => {
  describe('success', () => {
    it('Should return success', async () => {
      const loginUseCase = new LoginUseCases(
        userRepositoryFake,
        new GenerateTokenAdapter(),
        encryptPasswordFake,
        new SchemaValidatorAdapter(schemaRegistry),
      )

      const result = await loginUseCase.execute('teste', '22142')
      expect(result).toEqual(
        expect.objectContaining({
          id: 'bc0a2694-b626-4e95-a7f6-f8d65563becc',
          email: 'test@gmail.com',
          username: 'test',
        }),
      )
    })
  })
})
