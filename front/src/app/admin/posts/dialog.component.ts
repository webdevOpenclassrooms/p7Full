import { Component, OnInit, Inject } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { environment } from 'src/environments/environment'
import { AdminService } from '../admin.service'

export interface DialogData {
  postId: number
  title: string
  content: string
  imagePath: string
}

@Component({
  selector: 'app-admin-post-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class AdminPostDialogComponent implements OnInit {
  urlServer = environment.urlServer + '/'
  threadForm = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
  })
  constructor(
    public dialogRef: MatDialogRef<AdminPostDialogComponent>,
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    this.threadForm.setValue({
      title: this.data.title,
      content: this.data.content,
    })
    return
  }
  onNoClick(): void {
    this.dialogRef.close()
  }
  onSave() {
    this.adminService.editPost(this.data.postId, this.threadForm.value)
    window.location.reload()
  }
}
