import { NgModule } from '@angular/core'
import { CoreModule } from '../core/core.module'
import { RouterModule } from '@angular/router'

import { ProfileEditComponent } from './profile-edit/profile-edit.component'
import { ProfileComponent } from './profile.component'
import { ReactiveFormsModule } from '@angular/forms'
import { DialogComponent } from './profile-edit/dialog/dialog.component'

@NgModule({
  declarations: [ProfileComponent, ProfileEditComponent, DialogComponent],
  imports: [
    CoreModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: 'profile',
        children: [
          { path: 'edit', component: ProfileEditComponent },
          { path: ':id', component: ProfileComponent },
          { path: '', component: ProfileComponent },
        ],
      },
    ]),
  ],
})
export class ProfileModule {}
