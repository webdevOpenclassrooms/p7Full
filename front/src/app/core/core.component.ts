import { Component, OnInit, isDevMode } from '@angular/core'
import { AuthService } from '../auth/auth.service'

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss'],
})
export class CoreComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.refreshToken()
    if (isDevMode()) {
      console.log('👋 Development!')
    } else {
      console.log('💪 Production!')
    }
  }
}
