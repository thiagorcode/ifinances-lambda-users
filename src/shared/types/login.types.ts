import * as z from 'zod'
import { LoginSchema } from '../schemas'

export type LoginTypes = z.infer<typeof LoginSchema>
