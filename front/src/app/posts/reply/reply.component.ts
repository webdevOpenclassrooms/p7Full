import { Component, Input, OnInit } from '@angular/core'
import { IReply } from '../models/IPost'
import { PostService } from '../services/post.service'
import { UserService } from 'src/app/core/services/user.service'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['../posts.component.scss'],
})
export class ReplyComponent implements OnInit {
  @Input() reply: IReply
  // sinceDisplay: [number, string]
  sinceDisplay: string
  urlServer = environment.urlServer + '/'
  since: any
  getReplies: any
  avatar: string
  constructor(
    private userService: UserService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.avatar = this.reply.user.avatar
      ? this.urlServer + this.reply.user.avatar
      : this.userService.avatarDefault(this.reply.user.username)

    this.sinceDisplay = this.postService.determineTime(this.reply.updated_at)
  }
}
