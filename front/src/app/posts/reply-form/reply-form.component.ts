import { Component, Input, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { PostService } from '../services/post.service'

@Component({
  selector: 'app-reply-form',
  templateUrl: './reply-form.component.html',
  styleUrls: ['../posts.component.scss'],
})
export class ReplyFormComponent implements OnInit {
  @Input() postId: number
  public loading = false
  replyForm: FormGroup
  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.replyForm = new FormGroup({
      content: new FormControl(),
    })
  }

  onSubmit(): void {
    this.loading = true
    this.postService.createReply(this.replyForm.value, this.postId)
    this.postService.getPosts(this.postId)
  }
}
