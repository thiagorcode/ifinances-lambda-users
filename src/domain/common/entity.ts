import { UniqueEntityId } from './unique-entity-id'

export abstract class Entity<T> {
  private readonly _id: UniqueEntityId
  private readonly _dtCreated: string
  private _dtUpdated: string
  protected props: T

  protected constructor(props: T, id?: string, dtCreated?: string, dtUpdated?: string) {
    this._id = new UniqueEntityId(id)
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
    return this._id.toValue()
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

  private getISOString(): string {
    return new Date().toISOString()
  }
}
