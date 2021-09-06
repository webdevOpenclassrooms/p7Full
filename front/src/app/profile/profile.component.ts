import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute } from '@angular/router'

import { ProfileService } from './services/profile.service'
import { ErrorComponent } from '../core/error/error.component'

import { IProfile } from './models/IProfile'
import { UserService } from '../core/services/user.service'
import { environment } from 'src/environments/environment'
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  isFetching = true
  user = {} as IProfile
  myProfile: boolean
  cover: string
  avatar: string

  urlServer = environment.urlServer + '/'

  coverDefault = 'http://localhost:3000/api/data/pictures/cover/default.jpg'

  constructor(
    private profileService: ProfileService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.myProfile = false
    this.isFetching = true

    this.route.params.subscribe((params) => {
      this.profileService.getProfile(params.id).subscribe({
        next: (profile: IProfile) => {
          this.user = profile

          this.cover = profile.imageCover
            ? this.urlServer + profile.imageCover
            : this.coverDefault

          this.avatar = this.user.user.avatar
            ? this.urlServer + this.user.user.avatar
            : this.userService.avatarDefault(this.user.user.username)

          this.isFetching = false
          this.user.id === this.userService.user.userId
            ? (this.myProfile = true)
            : (this.myProfile = false)
        },

        error: (error) => {
          this.isFetching = false
          const dialogRef = this.dialog.open(ErrorComponent, {
            data: error,
          })
        },
      })
    })
  }
}
