import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { PostService } from '../posts/services/post.service'

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  posts: any
  isFetching = false
  private urlApi = environment.urlServer + '/admin/'
  constructor(
    private http: HttpClient,
    private router: Router,
    private postService: PostService
  ) {}

  editPost(id: number, threadForm) {
    return this.http.put(this.urlApi + 'thread/' + id, threadForm).subscribe()
  }

  getThread(): any {
    return this.postService.getPosts(null)
  }
}
