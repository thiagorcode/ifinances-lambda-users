import { LoginSchema, usersSchema } from '../../shared/schemas'
import { SchemaEnum } from '../../shared/enum/schema'
import { ZodSchema } from 'zod'

export const schemaRegistry: Record<SchemaEnum, ZodSchema<any>> = {
  [SchemaEnum.CREATE_USER]: usersSchema,
  [SchemaEnum.LOGIN]: LoginSchema,
  // Adicione outros schemas aqui conforme necessário
}
