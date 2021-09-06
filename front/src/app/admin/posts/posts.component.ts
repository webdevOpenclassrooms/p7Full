import { HttpClient } from '@angular/common/http'
import { Component, OnInit, Inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'

import { PostService } from '../../posts/services/post.service'
import { AdminPostDialogComponent } from './dialog.component'
import { environment } from 'src/environments/environment'
import { AdminService } from '../admin.service'

export interface DialogData {
  postId: number
  title: string
  content: string
  imagePath: string
}

@Component({
  selector: 'app-admin-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class AdminPostsComponent implements OnInit {
  panelOpenState = false
  isFetching = false
  posts: any
  post: any

  urlServer = environment.urlServer + '/'

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    this.adminService.getThread().subscribe({
      next: (posts) => {
        this.posts = posts
        this.isFetching = false
      },
      error: (error) => {
        this.isFetching = false
      },
    })
  }

  editThread(
    postId: number,
    title: string,
    content: string,
    imagePath: string
  ) {
    const dialogRef = this.dialog.open(AdminPostDialogComponent, {
      width: '620px',
      height: '750px',
      data: { postId, title, content, imagePath },
    })

    dialogRef.afterClosed().subscribe()
  }

  deleteThread(id: number) {
    this.http.delete(this.urlServer + 'admin/thread/' + id).subscribe()
    this.isFetching = true
    window.location.reload()
  }
}
