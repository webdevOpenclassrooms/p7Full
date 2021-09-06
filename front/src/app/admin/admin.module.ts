import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { RouterModule } from '@angular/router'

import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { MaterialModule } from 'src/app/core/shared/material.module'
import { AuthGuard } from '../auth/auth.guard'
import { AdminComponent } from './admin.component'
import { AdminUsersComponent } from './users/users.component'
import { AdminPostsComponent } from './posts/posts.component'
import { AdminPostDialogComponent } from './posts/dialog.component'
import { MatButtonModule } from '@angular/material/button'

@NgModule({
  declarations: [
    AdminComponent,
    AdminUsersComponent,
    AdminPostsComponent,
    AdminPostDialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: AdminComponent,
        canActivate: [AuthGuard],
      },
    ]),
  ],
  exports: [MatButtonModule],
})
export class AdminModule {}
