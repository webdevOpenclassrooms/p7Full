export class ThreadDto {
  readonly id: number
  readonly title: string
  readonly content: string
  imagePath: string
  readonly userId: number
  nbLike: number
  readonly user: {
    id: number
    username: string
    avatar: string
    isAdmin: boolean
  }
}

export class ReplyDto {
  readonly id: number
  readonly content: string
  readonly userId: number
  readonly threadId: number
}
