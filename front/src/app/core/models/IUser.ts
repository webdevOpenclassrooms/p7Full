export interface IUser {
  id: number
  userId: number
  username: string
  avatar?: string
  isAdmin?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface IToken {
  userId: number
  username: string
  isAdmin: boolean
  avatar: string
  exp: any
  iat: any
}
