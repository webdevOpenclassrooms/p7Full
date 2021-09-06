import { Component, Input, OnInit } from '@angular/core'
import { IPost } from '../models/IPost'
import { PostService } from '../services/post.service'
import { UserService } from 'src/app/core/services/user.service'
import { Subject } from 'rxjs'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['../posts.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() post = {} as IPost
  nbLike: any
  since: number
  sinceDisplay: string
  userId: number
  badgeHidden = true
  like = new Subject<any>()
  urlServer = environment.urlServer + '/'
  avatar: string
  logged: boolean
  constructor(
    private userService: UserService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.logged = this.userService.user.userId ? true : false
    this.userId = this.userService.user.userId

    this.avatar = this.post.user.avatar
      ? this.urlServer + this.post.user.avatar
      : this.userService.avatarDefault(this.post.user.username)

    this.sinceDisplay = this.postService.determineTime(this.post.updated_at)

    this.hideBadge()
  }

  hideBadge() {
    this.badgeHidden = this.post.nbLike === 0 ? true : false
  }

  sendPost(post: IPost) {
    this.postService.postToEdit = post
  }

  likeBtn(id: number) {
    this.postService.likePost(id).subscribe((response: any) => {
      this.postService.getPosts(id).subscribe({
        next: (post) => {
          this.post.nbLike = post[0].nbLike
          this.hideBadge()
        },
      })
    })
  }
}
