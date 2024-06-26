import { User } from '../../../domain/entity/user.entity'
import { UsersTypes } from '../../../shared/types'

export interface UsersRepositoryInterface {
  findById(id: string): Promise<UsersTypes | undefined>
  findByUsername(username: string): Promise<UsersTypes | null>
  findAll(): Promise<UsersTypes[] | null>
  createUser(user: User): Promise<void>
  update(user: Partial<UsersTypes>): Promise<void>
}
