import { SchemaValidatorAdapter } from './../../adapter/schema-validator-adapter/schema-validator.adapter'
import { z } from 'zod'

// Mock para o SchemaEnum
enum MockSchemaEnum {
  'CREATE_USER' = 'CREATE_USER',
  'LOGIN' = 'LOGIN',
}

describe('SchemaValidatorAdapter', () => {
  let schemaValidatorAdapter: SchemaValidatorAdapter

  beforeEach(() => {
    const schemas = {
      [MockSchemaEnum.LOGIN]: z.object({
        username: z.string(),
        password: z.string(),
      }),
      [MockSchemaEnum.CREATE_USER]: z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
    }

    schemaValidatorAdapter = new SchemaValidatorAdapter(schemas)
  })

  it('should validate successfully when schema and data are valid', () => {
    expect(() => {
      schemaValidatorAdapter.validate(MockSchemaEnum.LOGIN as any, { username: 'test', password: 'test123' })
    }).not.toThrow()
  })

  it('should throw an error when schema does not exist', () => {
    expect(() => {
      schemaValidatorAdapter.validate('NonExistentSchema' as any, { username: 'test', password: 'test123' })
    }).toThrow('Schema not exist')
  })

  it('should throw a validation error for invalid data', () => {
    expect(() => {
      schemaValidatorAdapter.validate(MockSchemaEnum.CREATE_USER as any, { email: 'invalid-email', password: '123' })
    }).toThrow('Erro de validação: Invalid email, String must contain at least 6 character(s)')
  })
})
