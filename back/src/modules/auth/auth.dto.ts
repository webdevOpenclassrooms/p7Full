export class LoginDto {
  readonly username: string
  readonly password: string
}

export class SignupDto {
  readonly id: string
  readonly email: string
  readonly password: string
  readonly username?: string
}

export class AuthDto {
  readonly id: number
  readonly email: string
  readonly password: string
}

export class AuthOrToken {
  readonly id: number
  readonly userId: number
}

export class checkMyTokenDto {
  readonly message: {
    readonly userId: number
    readonly username: string
    readonly isAdmin: boolean
    readonly avatar?: string
    readonly iat: Date
    readonly exp: Date
  }
}
