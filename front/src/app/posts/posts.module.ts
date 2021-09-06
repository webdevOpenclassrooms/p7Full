import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CoreModule } from 'src/app/core/core.module'

import { PostComponent } from './post/post.component'

import { ReplyComponent } from './reply/reply.component'
import { PostsComponent } from './posts.component'

import { ReactiveFormsModule } from '@angular/forms'
import { PostFormComponent } from './post-form/post-form.component'
import { ReplyFormComponent } from './reply-form/reply-form.component'
@NgModule({
  declarations: [
    PostsComponent,
    PostComponent,
    ReplyComponent,
    PostFormComponent,
    ReplyFormComponent,
  ],
  imports: [
    CoreModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: 'posts',
        children: [
          { path: 'new', component: PostFormComponent },
          { path: 'edit/:id', component: PostFormComponent },
          { path: ':id', component: PostsComponent },
          { path: '', component: PostsComponent },
        ],
      },
    ]),
  ],
  exports: [PostsComponent],
})
export class PostsModule {}
