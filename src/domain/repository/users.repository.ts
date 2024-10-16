import { DynamoDBAdapterInterface } from '../../adapter/dynamodb/dynamodb-adapter.interface'
import { UsersTypes } from '../../shared/types'
import { UsersRepositoryInterface } from './interface/usersRepository.interface'
import { User } from '../../domain/entity/user.entity'

export class UsersRepository implements UsersRepositoryInterface {
  constructor(private readonly databaseAdapter: DynamoDBAdapterInterface) {}

  async createUser(data: User) {
    await this.databaseAdapter.add<UsersTypes>(data.toCreateDto())
  }

  async findById(id: string) {
    return await this.databaseAdapter.get<UsersTypes>(id)
  }

  async findByUsername(username: string) {
    const response = await this.databaseAdapter.scan<UsersTypes[]>([
      {
        attributeName: 'username',
        operator: 'EQ',
        value: username,
      },
    ])
    if (!response) return null

    return response[0]
  }

  async findAll() {
    return await this.databaseAdapter.scan<UsersTypes[]>()
  }

  async update(data: User) {
    return await this.databaseAdapter.update(data)
  }
}
