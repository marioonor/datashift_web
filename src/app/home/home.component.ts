import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isLogin = true;
  showAuthForm = false;

  toggleForm() {
    this.isLogin = !this.isLogin;
  }

  openLogin() {
    this.isLogin = true;
    this.showAuthForm = true;
  }

  openRegister() {
    this.isLogin = false;
    this.showAuthForm = true;
  }

  closeForm() {
    this.showAuthForm = false;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    console.log('Form submitted');
  }
}
