import { marshall } from '@aws-sdk/util-dynamodb'
import { FilterExpression } from './types'

export class FilterBuilder {
  static build(filters?: FilterExpression[]) {
    let filterExpression = ''
    const expressionAttributeNames: Record<string, string> = {}
    const expressionAttributeValues: Record<string, any> = {}

    if (!filters) {
      return {
        expressionAttributeNames,
        expressionAttributeValues,
        filterExpression,
      }
    }
    filters.forEach((filter, index) => {
      const attributeValue = `:val${index}`
      const attributeName = `#attr${index}`
      expressionAttributeNames[attributeName] = filter.attributeName
      expressionAttributeValues[attributeValue] = marshall(filter.value)

      if (filterExpression) {
        filterExpression += ' AND '
      }

      switch (filter.operator) {
        case 'EQ':
          filterExpression += `${attributeName} = ${attributeValue}`
          break
        case 'GT':
          filterExpression += `${attributeName} > ${attributeValue}`
          break
        case 'LT':
          filterExpression += `${attributeName} < ${attributeValue}`
          break
        case 'BEGINS_WITH':
          filterExpression += `begins_with(${attributeName}, ${attributeValue})`
          break
      }
    })
    console.debug({
      expressionAttributeNames,
      expressionAttributeValues,
      filterExpression,
    })
    return {
      expressionAttributeNames,
      expressionAttributeValues,
      filterExpression,
    }
  }
}
