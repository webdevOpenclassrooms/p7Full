import { Component, OnInit } from '@angular/core'
import { AuthService } from './auth.service'

import { FormGroup, Validators, FormControl } from '@angular/forms'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  hide = true
  signup = false

  email = new FormControl('', [Validators.required, Validators.email])
  password = new FormControl('', Validators.required)
  username = new FormControl('', Validators.required)
  confirmPassword = new FormControl('')

  loginForm = new FormGroup({
    email: this.email,
    password: this.password,
  })

  id: number
  error: string
  constructor(private authService: AuthService) {}

  onLogin(): void {
    if (!this.loginForm.valid) {
      return
    }
    const { email, password } = this.loginForm.value

    return this.authService.login(email, password)
  }

  newSignup(): void {
    this.signup = true
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
      username: this.username,
      confirmPassword: this.confirmPassword,
    })
  }

  onSignUp(): void {
    const { email, password } = this.loginForm.value
    const { username, confirmPassword } = this.loginForm.value
    if (password !== confirmPassword) {
      this.error = 'les mots de passe sont different'
      return
    }
    // send data to backend, if ok, login new user
    return this.authService.singup(email, username, password).subscribe(
      () => {
        return this.onLogin()
      },
      () => {
        this.error = 'email utilisé'
      }
    )
  }

  getErrorMessage() {
    return this.email.hasError('email') ? 'email invalide' : ''
  }
  onCancel(): void {
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
    })
    this.signup = !this.signup
  }
}
