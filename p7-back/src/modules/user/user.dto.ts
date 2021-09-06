export class UserDto {
  readonly username: string
  readonly avatar: string
  readonly isAdmin?: boolean
}

export class ProfileDto {
  readonly bio?: string
  readonly city?: string
  readonly service?: string
}

export class UserProfile {
  readonly username: string
  readonly bio: string
  readonly city: string
  readonly service: string
  readonly imageCover: string
  avatar: string
}
