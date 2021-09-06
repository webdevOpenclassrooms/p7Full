import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { environment } from '../../../environments/environment'
import { UserService } from '../../core/services/user.service'

export interface User {
  id: number
  username: string
  isAdmin: boolean
}

export interface AddAdmin {
  username: string
  isAdmin: boolean
}
@Component({
  selector: 'app-admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class AdminUsersComponent implements OnInit {
  name = true
  checked: boolean
  dataSource: any
  userData: User[]
  avatar: string
  resetPassword: { id: number; password: string }
  displayedColumns: string[] = ['id', 'avatar', 'username', 'reset', 'isAdmin']

  url = environment.urlServer + '/admin'
  avatarUrl = environment.urlServer + '/'
  constructor(private http: HttpClient, private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers()
  }

  avatarDefault(name: string, avatar: string) {
    if (!avatar) {
      return this.userService.avatarDefault(name)
    }
    return this.avatarUrl + avatar
  }

  setAdmin(user: User) {
    const { id } = user
    let { isAdmin } = user
    isAdmin = !isAdmin
    const body = { id, isAdmin }

    this.http.put<AddAdmin>(this.url, body).subscribe()
    this.getUsers()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  getUsers(): any {
    return this.http.get(this.url + '/user').subscribe({
      next: (users: User[]) =>
        (this.dataSource = new MatTableDataSource(users)),
    })
  }

  putResetPassword(userId: number): any {
    return this.http.put(this.url + '/reset/' + userId, '').subscribe(
      (data: any) =>
        (this.resetPassword = {
          id: userId,
          password: data.newPassword,
        })
    )
  }
}
