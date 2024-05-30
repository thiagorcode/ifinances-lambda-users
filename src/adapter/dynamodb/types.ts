export interface FilterExpression {
  attributeName: string
  operator: 'EQ' | 'GT' | 'LT' | 'BEGINS_WITH' | 'BETWEEN'
  value: any
}
