import { randomUUID } from 'crypto'

export class UniqueEntityId {
  private readonly value: string

  toValue() {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }
}
