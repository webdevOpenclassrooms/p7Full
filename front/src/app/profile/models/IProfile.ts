/* eslint-disable @typescript-eslint/naming-convention */

export interface IProfile {
  id: number
  imageCover: string
  bio: string
  city: string
  service: string
  nbFriends?: number
  nbFollowers?: number
  nbPosts?: number

  user: {
    username: string
    avatar: string
    isAdmin: boolean
  }
}
