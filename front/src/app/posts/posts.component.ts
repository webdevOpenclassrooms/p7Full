import { Component, OnInit } from '@angular/core'
import { PostService } from './services/post.service'
import { ActivatedRoute } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { ErrorComponent } from '../core/error/error.component'
import { UserService } from '../core/services/user.service'

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  isFetching = false
  posts: []
  replies: any
  postId: number = null
  logged: boolean

  constructor(
    private postService: PostService,
    private userService: UserService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isFetching = true

    this.logged = this.userService.user.userId ? true : false

    if (this.route.snapshot.paramMap.get('id') !== null) {
      this.postId = +this.route.snapshot.paramMap.get('id')
    }

    this.postService.getPosts(this.postId).subscribe({
      next: (posts) => {
        this.posts = posts
        posts.map((post) => {
          this.replies = post.threadReplies
        })
        this.isFetching = false
        return
      },
      error: (error) => {
        this.isFetching = false
        const dialogRef = this.dialog.open(ErrorComponent, {
          data: error,
        })
        dialogRef.afterClosed()
      },
    })
  }
}
