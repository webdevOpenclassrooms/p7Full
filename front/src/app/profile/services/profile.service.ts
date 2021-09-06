import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

import { IProfile } from '../models/IProfile'
import { environment } from 'src/environments/environment'
import { Router } from '@angular/router'
import { AuthService } from 'src/app/auth/auth.service'
@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private profileUrl = environment.urlServer + '/profile/'

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  getProfile(id: number): Observable<IProfile> {
    return this.http.get<any>(this.profileUrl + id)
  }

  updateUserWithFile(profileForm: any): any {
    return new Promise((resolve, reject) => {
      const { id: userId, avatar, username, service, bio, city } = profileForm
      const profileData = new FormData()

      if (typeof avatar === 'object' && avatar !== null) {
        profileData.append('avatar', avatar)
      }

      profileData.append('username', username)
      if (service !== null) {
        profileData.append('service', service)
      }
      if (city !== null) {
        profileData.append('city', city)
      }
      if (bio !== null) {
        profileData.append('bio', bio)
      }

      this.http.put(this.profileUrl, profileData).subscribe(
        (response: any) => {
          resolve(response)
          this.authService.refreshToken()

          this.router.navigate(['/profile/' + userId])
        },
        (error) => {
          reject(error)
        }
      )
    })
  }
}
