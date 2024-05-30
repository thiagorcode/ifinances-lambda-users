import crypto from 'crypto'

export abstract class Entity<T> {
  private readonly _id: string
  private readonly _dtCreated: string
  private _dtUpdated: string
  protected props: T

  constructor(props: T, id?: string, dtCreated?: string, dtUpdated?: string) {
    this._id = id ?? crypto.randomUUID()
    this._dtCreated = dtCreated ?? this.getISOString()
    this._dtUpdated = dtUpdated ?? this.getISOString()
    this.props = {
      ...props,
      id: this.id,
      dtCreated: this.created,
      dtUpdated: this.updated,
    }
  }

  public get id(): string {
    return this._id
  }

  public get created(): string {
    return this._dtCreated
  }

  public get updated(): string {
    return this._dtUpdated
  }

  public setUpdatedDate() {
    this._dtUpdated = this.getISOString()
  }

  // protected validate(schema: SchemaEnum, payload?: any): void {
  //   SchemaValidatorAdapter.validate(schema, payload ?? this.props)
  // }

  private getISOString(): string {
    return new Date().toISOString()
  }
}
