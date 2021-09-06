import { NgModule } from '@angular/core'

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module'
import { CoreModule } from './core/core.module'
import { PostsModule } from './posts/posts.module'
import { ProfileModule } from './profile/profile.module'
import { AdminModule } from './admin/admin.module'
import { LoginModule } from './auth/login.module'
import { AppComponent } from './app.component'
import { ErrorComponent } from './core/error/error.component'
import { UserService } from './core/services/user.service'

import { AuthInterceptor } from './auth/interceptors/auth-interceptor'

@NgModule({
  declarations: [AppComponent],
  imports: [
    CoreModule,
    HttpClientModule,
    AppRoutingModule,
    PostsModule,
    ProfileModule,
    AdminModule,
    LoginModule,
  ],
  providers: [
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],

  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent],
})
export class AppModule {}
