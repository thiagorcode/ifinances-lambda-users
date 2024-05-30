import { SchemaEnum } from '../../shared/enum/schema'

export interface SchemaValidatorInterface {
  validate(typeSchema: SchemaEnum, data: unknown): void
}
