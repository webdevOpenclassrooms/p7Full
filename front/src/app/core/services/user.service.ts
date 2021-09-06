import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, Subject, throwError } from 'rxjs'
import { catchError, tap, map } from 'rxjs/operators'
import slugify from 'slugify'
import { IUser } from '../models/IUser'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user = {} as IUser
  myUserSubject = new Subject<any>()
  userSubject = new Subject<any>()

  private url = environment.urlServer + '/users/'

  constructor(private http: HttpClient) {}

  getUser(id: number): Observable<any> {
    return this.http.get<IUser[]>(this.url + id).pipe(
      map((user) => user[0]),
      tap((user) => this.userSubject.next(user)),
      catchError(this.handleError)
    )
  }

  avatarDefault(username: string): string {
    const slug = slugify(username, { lower: true })

    return (
      'https://source.boringavatars.com/beam/60/' +
      slug +
      '?colors=b31237,f03813,ff8826,ffb914,2c9fa3'
    )
  }

  private handleError(err: HttpErrorResponse): any {
    let errorMessage = ''
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`
    } else {
      errorMessage = `serve return code" ${err.status}, error message is: ${err.message}`
    }
    console.error(errorMessage)
    return throwError(errorMessage)
  }
}
