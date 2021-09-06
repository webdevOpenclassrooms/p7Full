import { NgModule } from '@angular/core'

import { Routes, RouterModule } from '@angular/router'

import { LoginComponent } from './auth/login.component'

const routes: Routes = [
  { path: 'profile', redirectTo: 'profile' },
  { path: 'auth/login', component: LoginComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },

  { path: '', redirectTo: 'posts', pathMatch: 'full' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
