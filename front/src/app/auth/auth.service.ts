import { HttpClient } from '@angular/common/http'
import { JwtHelperService } from '@auth0/angular-jwt'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { timer } from 'rxjs'
import { tap } from 'rxjs/operators'
import { environment } from '../../environments/environment'
import { UserService } from '../core/services/user.service'
import { IToken, IUser } from '../core/models/IUser'

export interface AuthResponseData {
  userId: string
  isAdmin: boolean
  token: string
  expiresIn: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  token: string
  tokenDecoded: {
    userId: number
    username: string
    isAdmin: boolean
    avatar: string
    exp: any
    iat: any
  }

  private timer: boolean
  private url = environment.urlServer

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {}

  async logout(): Promise<void> {
    this.userService.myUserSubject.next({
      userId: '',
      username: '',
      isAdmin: '',
      avatar: '',
    })
    this.userService.user = {} as IUser
    this._deleteTokens()
    await this.router.navigate([''])
    window.location.reload()
  }

  async readToken() {
    if (await this.isTokenExpired()) {
      console.log('expired or loggedOut')
      return
    }

    this._setUserService()
    return this._rawToken()
  }

  async isTokenExpired(): Promise<boolean> {
    const jwtHelper = new JwtHelperService()
    return jwtHelper.isTokenExpired(this._rawToken())
  }

  expirationTimer() {
    if (this.timer) {
      console.log('timer deja en place')
      // quitte si un timer est en cours
      return
    }

    console.log('setup timer')

    const decodedToken: IToken = this._decodedToken()
    const expirationTime = decodedToken.exp - decodedToken.iat
    // refresh 30 seconde avant expiration
    const delay = 3 * 1000

    this.timer = true
    const source = timer(expirationTime * 1000 - delay)

    source.subscribe((val) => {
      this.timer = false
      this.refreshToken()
    })
  }

  refreshToken() {
    const accessToken = localStorage.getItem('userToken')
    const refreshToken = localStorage.getItem('refreshToken')

    if (refreshToken === null || accessToken === null) {
      this._deleteTokens()
      return
    }

    return this.http
      .post<any>(
        this.url + '/auth/refreshtoken',
        {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
        {
          withCredentials: true,
        }
      )
      .subscribe((authData: any) => {
        this._saveToken(authData)
      })
  }

  login(username: string, password: string): any {
    return this.http
      .post<AuthResponseData>(
        this.url + '/auth/login',
        { username, password },
        {
          withCredentials: true,
        }
      )
      .subscribe((authData: any) => {
        this._saveToken(authData)
        this._setUserService()
        this.router.navigate([''])
      })
  }

  singup(email: string, username: string, password: string): any {
    return this.http
      .post<AuthResponseData>(this.url + '/auth/signup', {
        email,
        username,
        password,
      })
      .pipe(
        tap((resData) => {
          this.login(email, password)
        })
      )
  }
  async updatePassword(id: number, password: string) {
    return this.http
      .put(this.url + '/auth/updatePassword', { id, password })
      .subscribe(() => window.location.reload())
  }

  async deleteAccount(id: number): Promise<void> {
    this.http.delete(environment.urlServer + '/auth/' + id).subscribe()
    return this.logout()
  }

  private _rawToken(): string {
    return localStorage.getItem('userToken')
  }

  private _decodedToken() {
    const jwtHelper = new JwtHelperService()
    return jwtHelper.decodeToken(this._rawToken())
  }

  private _saveToken(authData: any) {
    localStorage.setItem('userToken', authData.accessToken)
    localStorage.setItem('refreshToken', authData.refreshToken)
    this.expirationTimer()
  }

  private _deleteTokens() {
    localStorage.removeItem('userToken')
    localStorage.removeItem('refreshToken')
    return
  }

  private _setUserService() {
    const decodedToken = this._decodedToken()
    const { userId, username, isAdmin }: IToken = decodedToken
    const avatar = decodedToken.avatar
      ? this.url + '/' + decodedToken.avatar
      : null

    this.userService.user = decodedToken
    this.userService.myUserSubject.next({
      userId,
      username,
      isAdmin,
      avatar,
    })
  }
}
