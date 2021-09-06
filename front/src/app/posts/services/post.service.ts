import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { IPost, INewPost } from '../models/IPost'

@Injectable({
  providedIn: 'root',
})
export class PostService {
  postToEdit = {} as IPost
  private urlApi = environment.urlServer + '/thread/'

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(id?: number): Observable<any> {
    return this.http
      .get<IPost>(this.urlApi + (id === null ? '' : id), {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError))
  }

  newPost(postForm: INewPost) {
    return new Promise((resolve, reject) => {
      const threadData = new FormData()

      if (typeof postForm.file !== 'string') {
        threadData.append('file', postForm.file)
      }
      if (postForm.content === null) {
        postForm.content = ''
      }
      threadData.append('title', postForm.title)
      threadData.append('content', postForm.content)

      this.http.post(this.urlApi, threadData).subscribe(
        (response: any) => {
          resolve(response)
          this.router.navigate([''])
        },
        (error) => {
          reject(error)
        }
      )
    })
  }

  editPost(threadForm: INewPost, id: number) {
    return this.http
      .put<IPost>(this.urlApi + id, threadForm)
      .pipe(catchError(this.handleError))
      .subscribe((response: any) => {
        this.router.navigate(['posts/' + id])
      })
  }

  createReply(replyForm: any, threadId: number) {
    return this.http
      .post(this.urlApi + threadId, replyForm)
      .subscribe(() => window.location.reload())
  }

  deleteThread(threadId: number) {
    return this.http
      .delete(this.urlApi + threadId)
      .subscribe((response: { message: string }) => {
        this.router.navigate([''])
      })
  }

  getReplies(id: number) {
    return this.http.get(this.urlApi + id + 'replies')
  }

  likePost(id: number) {
    return this.http
      .post(this.urlApi + 'like/' + id, '')
      .pipe(catchError(this.handleError))
  }
  determineTime(sinceArg: any): string {
    const since = Date.parse(sinceArg)
    const utc2: number = 2 * 60 * 60 * 1000

    let sinceDisplay: [number, string]
    const interval = Date.now() - (since + utc2)
    const year = Math.floor(interval / 1000 / 60 / 60 / 24 / 365)
    const day = Math.floor(interval / 1000 / 60 / 60 / 24)
    const hour = Math.floor(interval / 1000 / 60 / 60)
    const minute = Math.floor(interval / 1000 / 60)
    const seconde = Math.floor(interval / 1000)
    if (year > 0) {
      sinceDisplay = [year, ' an']
    } else if (day > 0) {
      sinceDisplay = [day, ' jour']
    } else if (hour > 0) {
      sinceDisplay = [hour, ' heure']
    } else if (minute > 0) {
      sinceDisplay = [minute, ' minute']
    } else {
      sinceDisplay = [seconde, ' seconde']
    }
    if (sinceDisplay[0] > 1) {
      sinceDisplay[1] = sinceDisplay[1] + 's'
    }

    return sinceDisplay[0] + sinceDisplay[1]
  }

  private handleError(err: HttpErrorResponse): any {
    return throwError(err.statusText)
  }
}
