interface UpdateParams<T> {
  partitionKeyName: string
  sortKeyName?: string
  item: T
}
export class UpdateBuilder {
  private static updateExpression<T extends Object>(itemContent: T): string {
    const keys = Object.keys(itemContent)

    const queryWithExtraComma = keys.reduce((acc, key) => {
      const sharpedKey = `#${key}`
      const dottedKey = `:${key}`

      return `${acc} ${sharpedKey} = ${dottedKey},`
    }, 'set')

    const query = queryWithExtraComma.slice(0, -1)
    return query
  }

  private static expressionAttributeNames<T extends Object>(itemContent: T): any {
    const keys = Object.keys(itemContent)

    const result = keys.reduce((obj, key) => {
      const sharpedKey = `#${key}`

      return { ...obj, [sharpedKey]: key }
    }, {})

    return result
  }

  private static expressionAttributeValues<T extends Object>(itemContent: T): any {
    const entries = Object.entries(itemContent)

    const attributeValues = entries.reduce((obj, [key, value]) => {
      const dottedKey = `:${key}`

      return { ...obj, [dottedKey]: value }
    }, {})

    return attributeValues
  }

  private static removeKeys<T extends Object>(item: T, removeCondition: (key: string) => boolean): Object {
    const entries = Object.entries(item)

    const removedKeys = entries
      .map(([key, value]) => {
        const shouldRemove = removeCondition(key)
        return shouldRemove ? null : [key, value]
      })
      .filter(Boolean) as Array<[string, any]>

    const assambleObj = Object.fromEntries(removedKeys)

    return assambleObj
  }
  static builder<T extends object>(params: UpdateParams<T>) {
    const keys = [params.partitionKeyName, params.sortKeyName ?? '']

    const keysContent = this.removeKeys(params.item, (key) => !keys.includes(key))
    const itemContent = this.removeKeys(params.item, (key) => keys.includes(key))

    const updateExpression = this.updateExpression(itemContent)
    const expressionAttributeNames = this.expressionAttributeNames(itemContent)
    const expressionAttributeValues = this.expressionAttributeValues(itemContent)

    return {
      expressionAttributeNames,
      expressionAttributeValues,
      updateExpression,
      keysContent,
    }
  }
}
