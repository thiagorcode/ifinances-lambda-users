import * as z from 'zod'
import { usersSchema } from '../schemas'

export type UsersTypes = z.infer<typeof usersSchema>
export type CreateUsers = {
  id?: string
  dtCreated?: string
  dtUpdated?: string
  firstName: string
  lastName: string
  username: string
  email: string
  salt: string
  password: string
  isActive: boolean
  isPasswordChange: boolean
}

export type UnmarshallingUser = {
  id: string
  dtCreated: string
  dtUpdated: string
  firstName: string
  lastName: string
  username: string
  email: string
  salt: string
  password: string
  isActive: boolean
  isPasswordChange: boolean
}

export type PayloadUserAuth = {
  id: string
  email: string
  username: string
}
