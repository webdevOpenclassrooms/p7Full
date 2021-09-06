import { Component, OnInit, ViewChild } from '@angular/core'
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout'
import { MatSidenav } from '@angular/material/sidenav'
import { Router } from '@angular/router'
import { DomSanitizer } from '@angular/platform-browser'
import { MatIconRegistry } from '@angular/material/icon'
import { UserService } from '../services/user.service'

const SMALL_WIDTH_BREAKPOINT = 720

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @ViewChild(MatSidenav) sidenav: MatSidenav
  public isScreenSmall: boolean
  isDarkTheme = false
  userId: number
  isAdmin: boolean

  constructor(
    private userService: UserService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'logoIcon',
      sanitizer.bypassSecurityTrustResourceUrl('./assets/img/logotype.svg')
    )
    this.userService.myUserSubject.subscribe((user) => {
      this.userId = user.userId
      this.isAdmin = user.isAdmin
    })
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`])
      .subscribe((state: BreakpointState) => {
        this.isScreenSmall = state.matches
      })

    this.router.events.subscribe(() => {
      if (this.isScreenSmall) {
        this.sidenav.close()
      }
    })
  }
}
