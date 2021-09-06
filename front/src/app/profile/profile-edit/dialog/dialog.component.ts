import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { AuthService } from 'src/app/auth/auth.service'
import { FormGroup, Validators, FormControl } from '@angular/forms'

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  hide = true
  error: string
  password = new FormControl('', Validators.required)
  confirmPassword = new FormControl('Validators.required')

  passwordForm = new FormGroup({
    password: this.password,
    confirm: this.confirmPassword,
  })

  onClick(): void {
    switch (this.data.action) {
      case 'deleteAccount':
        this.deleteAccount()

      case 'updatePassword':
        this.updatePassword()
    }
  }

  updatePassword() {
    const { password, confirm } = this.passwordForm.value

    if (password !== confirm) {
      this.error = 'les mots de passe sont different'
      return
    }
    this.authService.updatePassword(this.data.userId, password)
  }

  deleteAccount(): void {
    this.authService.deleteAccount(this.data.userId)
  }

  cancel(): void {
    this.dialogRef.close()
  }
}
