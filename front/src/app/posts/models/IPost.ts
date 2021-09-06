export interface IPost {
  id: number
  title: string
  content: string
  imagePath: string
  updated_at: any
  nbLike: number
  user: {
    id: number
    username: string
    avatar: string
  }
}

export interface INewPost {
  title: string
  content?: string

  file?: File
}

export interface IPosts {
  posts: IPost[]
}

export interface IReply {
  content: string
  updated_at: string
  user: {
    id: number
    username: string
    avatar: string
  }
}
