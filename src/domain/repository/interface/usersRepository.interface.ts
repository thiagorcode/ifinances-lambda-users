import { User } from '../../../domain/entity/user.entity'
import { UsersTypes } from '../../../shared/types'

export interface UsersRepositoryInterface {
  findById(id: string): Promise<UsersTypes | undefined>
  findByUsername(username: string): Promise<UsersTypes | undefined>
  findAll(): Promise<UsersTypes[] | null>
  createUser(user: User): Promise<void>
}
