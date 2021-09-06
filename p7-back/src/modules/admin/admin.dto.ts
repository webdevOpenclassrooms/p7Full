export class PutAdminDto {
  readonly id: number
  readonly isAdmin: boolean
}

export class UserDto {
  readonly username: string
  readonly imageProfile: string
  readonly isAdmin?: boolean
}

export class UserProfile {
  readonly username: string
  readonly imageProfile: string
  readonly bio: string
  readonly city: string
  readonly service: string
}

export class AuthDto {
  readonly email: string
  readonly password: string
}
