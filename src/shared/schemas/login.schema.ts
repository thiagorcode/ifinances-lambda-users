import * as z from 'zod'

export const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})
