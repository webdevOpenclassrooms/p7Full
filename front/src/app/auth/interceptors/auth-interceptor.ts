import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { UserService } from 'src/app/core/services/user.service'
import { AuthService } from '../auth.service'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  userToken: string

  async request() {
    this.userToken = await this.authService.readToken()
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (this.userToken) {
      const newRequest = req.clone({
        headers: req.headers.set(
          'Authorization',
          'Bearer ' + localStorage.getItem('userToken')
        ),
      })
      return next.handle(newRequest)
    } else {
      this.request()
      return next.handle(req)
    }
  }
}
