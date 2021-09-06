import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { Observable, Observer } from 'rxjs'

export interface adminTab {
  label: string
  content: string
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  asyncTabs: Observable<adminTab[]>

  constructor(private http: HttpClient) {
    this.asyncTabs = new Observable((observer: Observer<adminTab[]>) => {
      setTimeout(() => {
        observer.next([
          { label: 'Posts', content: '' },
          { label: 'User', content: '' },
        ])
      }, 1000)
    })
  }

  ngOnInit(): any {}
}
