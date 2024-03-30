export class Address {
  private _street: string
  private _city: string
  private _state: string
  private _zipCode: string
  private _latitude: number
  private _longitude: number

  constructor(
    street: string,
    city: string,
    state: string,
    zipCode: string,
    latitude: number,
    longitude: number,
  ) {
    this._street = street
    this._city = city
    this._state = state
    this._zipCode = zipCode
    this._latitude = latitude
    this._longitude = longitude
  }

  get street() {
    return this._street
  }

  get city() {
    return this._city
  }

  get state() {
    return this._state
  }

  get zipCode() {
    return this._zipCode
  }

  get latitude() {
    return this._latitude
  }

  get longitude() {
    return this._longitude
  }
}
