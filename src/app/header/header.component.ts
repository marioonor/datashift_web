import { Component } from '@angular/core';
import { AuthenService } from '../service/AuthenService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private authService: AuthenService) {}

  onLogout() {
    this.authService.Logout();
  }

}
