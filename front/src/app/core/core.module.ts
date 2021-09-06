import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { FooterComponent } from './footer/footer.component'
import { ErrorComponent } from './error/error.component'
import { MaterialModule } from './shared/material.module'
import { HeaderComponent } from './header/header.component'
import { RouterModule } from '@angular/router'
import { SidebarComponent } from './sidebar/sidebar.component'
import { CoreComponent } from './core.component'
import { MainComponent } from './main/main.component'

@NgModule({
  declarations: [
    MainComponent,
    FooterComponent,
    SidebarComponent,
    ErrorComponent,
    HeaderComponent,
    CoreComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule,
  ],
  exports: [
    CoreComponent,
    MaterialModule,
    BrowserAnimationsModule,
    CommonModule,
  ],
})
export class CoreModule {}
