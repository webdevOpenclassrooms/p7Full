export class AuthUser {
  constructor(
    public userId: string,
    public email: string,
    private _token: string,
    private _tokenExpirationDate: Date,
    public isAdmin: boolean
  ) {}

  get tokenGetter() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null
    }
    return this._token
  }
}
