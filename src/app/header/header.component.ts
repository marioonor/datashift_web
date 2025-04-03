import { Component } from '@angular/core';
import { AuthenService } from '../service/AuthenService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private authService: AuthenService, private router: Router) {}

  onLogout() {
    this.authService.Logout();
  }

  navigateToMain() {
    this.router.navigate(['/main']);
  }

}
