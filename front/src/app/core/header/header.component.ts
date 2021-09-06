import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar'

import { UserService } from '../services/user.service'
import { AuthService } from '../../auth/auth.service'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidenav = new EventEmitter<void>()
  @Output() toggleTheme = new EventEmitter<void>()

  urlServer = environment.urlServer + '/'
  errorMessage: string
  username: string
  avatar: string

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  openSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    })
  }

  onLogout(): void {
    this.authService.logout()
  }

  onActivate() {}

  ngOnInit(): void {
    this.userService.myUserSubject.subscribe((user) => {
      this.username = user.username

      this.avatar = user.avatar
        ? user.avatar
        : this.userService.avatarDefault(user.username)
    })
    // this.authService.refreshToken()
  }
}
