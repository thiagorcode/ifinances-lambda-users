import * as z from 'zod'
import { usersSchema } from '../schemas'

export type UsersTypes = z.infer<typeof usersSchema>
