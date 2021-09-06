import { NgModule } from '@angular/core'
import { CoreModule } from '../core/core.module'
import { RouterModule } from '@angular/router'
import { ReactiveFormsModule } from '@angular/forms'

import { LoginComponent } from './login.component'

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CoreModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        children: [{ path: '', component: LoginComponent }],
      },
    ]),
  ],
})
export class LoginModule {}
