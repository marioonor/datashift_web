import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { ManualuploadComponent } from '../manualupload/manualupload.component';

@Component({
  selector: 'app-home',
  template: `
    <app-header class="header"></app-header>
    <div class="content-container">
      <div class="content">
        <router-outlet></router-outlet>
      </div>
      <div class="uploads">
        <app-sidebar></app-sidebar>
        <app-manualupload></app-manualupload>
      </div>
    </div>
  `,
  styles: `
    .container {
      display: flex;
    }

    .home {
      display: flex;
      justify-content: flex-start;
      background-color: #f0f0f0;
    }

    .uploads {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      width: 100%;
      background-color:rgb(175, 32, 32);
    }
  `,
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    RouterOutlet,
    ManualuploadComponent,
  ],
})
export class HomeComponent {}
