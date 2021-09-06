import { Component, OnInit, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { FormGroup, FormControl } from '@angular/forms'
import { Router } from '@angular/router'

import { UserService } from 'src/app/core/services/user.service'
import { environment } from 'src/environments/environment'
import { PostService } from '../services/post.service'

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',

  styleUrls: ['./post-form.component.scss'],
})
export class PostFormComponent implements OnInit {
  loading = false
  errorMessage: string
  imagePreview: string
  name: string
  edit: boolean
  imgBtnText = 'Ajouter image'
  threadId: number
  private url = environment.urlServer + '/'
  private pagePath: string

  threadForm: FormGroup

  title = new FormControl('')
  content = new FormControl()
  file = new FormControl()

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pagePath = this.route.snapshot.routeConfig.path

    switch (this.pagePath) {
      case 'edit/:id':
        this.threadForm = new FormGroup({
          title: new FormControl(''),
          content: new FormControl(),
          imagePath: new FormControl(),
        })
        this.edit = true
        this.name = 'Édition'

        this.postService.getPosts(+this.route.snapshot.params.id).subscribe({
          next: (threads) => {
            const thread = threads[0]

            // redirige si l'user n'est pas l'auteur du billet
            thread.user.id != this.userService.user.userId
              ? this.router.navigate([''])
              : ''

            const { title, content, imagePath } = thread
            const file = ''
            this.threadId = thread.id
            this.imagePreview = imagePath ? this.url + imagePath : null
            this.threadForm.setValue({
              title,
              content,
              imagePath,
            })
            return
          },
        })
        break
      case 'new':
        this.threadForm = new FormGroup({
          title: new FormControl(''),
          content: new FormControl(),
          imagePath: new FormControl(),
          file: new FormControl(),
        })
        this.name = 'Nouveau billet'
      default:
        break
    }
  }

  onSubmit(): void {
    this.loading = true

    switch (this.pagePath) {
      case 'edit/:id':
        this.postService.editPost(this.threadForm.value, this.threadId)
        break
      case 'new':
        this.postService.newPost(this.threadForm.value)
        break
      default:
        break
    }
  }

  onFileAdded(event: Event): any {
    this.imgBtnText = 'modifier'
    const file = (event.target as HTMLInputElement).files[0]

    this.threadForm.get('file').patchValue(file)
    this.threadForm.get('file').updateValueAndValidity()

    const reader = new FileReader()
    reader.onload = () => {
      if (this.threadForm.get('imagePath').valid) {
        this.imagePreview = reader.result as string
      } else {
        this.imagePreview = null
      }
    }
    reader.readAsDataURL(file)
  }

  onDelete() {
    this.postService.deleteThread(this.threadId)
  }
}
