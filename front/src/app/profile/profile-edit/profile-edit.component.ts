import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'

import { environment } from 'src/environments/environment'
import { UserService } from 'src/app/core/services/user.service'
import { ProfileService } from '../services/profile.service'
import { IProfile } from '../models/IProfile'
import { AuthService } from 'src/app/auth/auth.service'
import { DialogComponent } from 'src/app/profile/profile-edit/dialog/dialog.component'

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit {
  public loading = false
  public errorMessage: string

  profileForm: FormGroup
  imagePreview: string
  user = {} as IProfile
  private urlApi = environment.urlServer + '/'
  avatarBtnText = 'Ajouter Avatar'

  constructor(
    public dialog: MatDialog,
    private profileService: ProfileService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      id: new FormControl(null, Validators.required),
      username: new FormControl(),
      service: new FormControl(),
      city: new FormControl(),
      bio: new FormControl(),
      avatar: new FormControl(),
    })

    this.profileService.getProfile(this.userService.user.userId).subscribe({
      next: (user: IProfile) => {
        this.user = user
        const {
          id,
          bio,
          city,
          service,
          user: { username, avatar },
        } = user

        this.profileForm.setValue({
          id,
          username,
          avatar,
          service,
          bio,
          city,
        })

        if (avatar) {
          this.imagePreview = this.urlApi + avatar
          this.avatarBtnText = 'Modifier Avatar'
        }
      },
    })
  }

  onSubmit(): void {
    this.loading = true
    this.profileService.updateUserWithFile(this.profileForm.value)
  }

  onFileAdded(event: Event): any {
    const file = (event.target as HTMLInputElement).files[0]
    this.avatarBtnText = 'Modifier Avatar'

    this.profileForm.get('avatar').patchValue(file)
    this.profileForm.get('avatar').updateValueAndValidity()

    const reader = new FileReader()
    reader.onload = () => {
      if (this.profileForm.get('avatar').valid) {
        this.imagePreview = reader.result as string
      } else {
        this.imagePreview = null
      }
    }
    reader.readAsDataURL(file)
  }

  deleteAccount() {
    return
  }

  confirmDelete() {
    const data = {
      title: 'confirmer',
      action: 'deleteAccount',
      userId: this.user.id,
    }

    const dialogRef = this.dialog.open(DialogComponent, {
      data,
    })
    dialogRef.afterClosed()
  }

  confirmPassword() {
    const data = {
      title: 'Modifier mot de passe',
      action: 'updatePassword',
      userId: this.user.id,
    }

    const dialogRef = this.dialog.open(DialogComponent, {
      // width: '620px',
      height: '300px',
      data,
    })
    dialogRef.afterClosed()
  }
}
