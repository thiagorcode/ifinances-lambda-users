import { schemaRegistry } from '../../adapter/schema-validator-adapter'
import { SchemaEnum } from '../../shared/enum/schema'
import { SchemaValidatorAdapter } from './../../adapter/schema-validator-adapter/schema-validator.adapter'

describe('Schema validator Adapter', () => {
  const schemaValidatorAdapter = new SchemaValidatorAdapter(schemaRegistry)

  it('Should validator schema with success', () => {
    const user = schemaValidatorAdapter.validate(SchemaEnum.LOGIN, { password: `test`, username: `test` })

    expect(user).toBeUndefined()
  })

  // it('Should throw a error ', () => {
  //   const user = schemaValidatorAdapter.validate(SchemaEnum.LOGIN, { password: `test`, username: `test` })

  //   expect(user).toBeUndefined()
  // })
})
