import { ZodError, ZodSchema } from 'zod'
import { SchemaEnum } from '../../shared/enum/schema'
import { SchemaValidatorInterface } from './schema-validator.interface'

export class SchemaValidatorAdapter implements SchemaValidatorInterface {
  private schemas: Record<SchemaEnum, ZodSchema<any>>

  constructor(schemas: Record<SchemaEnum, ZodSchema<any>>) {
    this.schemas = schemas
  }

  public validate(typeSchema: SchemaEnum, data: unknown): void {
    const schema = this.schemas[typeSchema]

    if (!schema) {
      throw new Error('Schema not exist')
    }

    try {
      schema.parse(data)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(`Erro de validação: ${error.errors.map((e) => e.message).join(', ')}`)
      }
      throw error
    }
  }
}
