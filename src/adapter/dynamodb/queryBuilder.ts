import { marshall } from '@aws-sdk/util-dynamodb'
import { FilterExpression } from './types'

interface QueryParams {
  partitionKeyName: string
  partitionKeyValue: string
  sortKeyName?: string
  sortKeyConditions?: FilterExpression[]
  filters?: FilterExpression[]
  limit?: number
}
export class QueryBuilder {
  static builder(params: QueryParams) {
    const { partitionKeyName, partitionKeyValue, sortKeyName, sortKeyConditions, filters } = params
    let keyConditionExpression = `#pk = :pk`
    const expressionAttributeNames: Record<string, string> = {
      '#pk': partitionKeyName,
    }
    const expressionAttributeValues: Record<string, any> = {
      ':pk': partitionKeyValue,
    }

    if (sortKeyName && sortKeyConditions) {
      expressionAttributeNames['#sk'] = sortKeyName

      sortKeyConditions.forEach((condition, index) => {
        const attributeValue = `:sk${index}`
        expressionAttributeValues[attributeValue] = marshall({ value: condition.value })

        switch (condition.operator) {
          case 'EQ':
            keyConditionExpression += ` AND #sk = ${attributeValue}`
            break
          case 'GT':
            keyConditionExpression += ` AND #sk > ${attributeValue}`
            break
          case 'LT':
            keyConditionExpression += ` AND #sk < ${attributeValue}`
            break
          case 'BEGINS_WITH':
            keyConditionExpression += ` AND begins_with(#sk, ${attributeValue})`
            break
          case 'BETWEEN':
            const secondValue = `:sk_between_${index}`
            expressionAttributeValues[secondValue] = marshall({ value: condition.value })
            keyConditionExpression += ` AND #sk BETWEEN ${attributeValue} AND ${secondValue}`
            break
        }
      })
    }

    // Expressão de Filtro para Condições Adicionais
    let filterExpression = ''
    if (filters) {
      filters.forEach((filter, index) => {
        const attributeName = `#attr${index}`
        const attributeValue = `:val${index}`

        expressionAttributeNames[attributeName] = filter.attributeName
        expressionAttributeValues[attributeValue] = marshall({ value: filter.value })

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
    }

    return {
      expressionAttributeNames,
      expressionAttributeValues,
      keyConditionExpression,
      filterExpression,
    }
  }
}
