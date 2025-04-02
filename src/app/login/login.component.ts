import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthenService } from '../service/AuthenService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  public data = new FormGroup({
    userId: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private httpClient: HttpClient, private router: Router, private authService: AuthenService) {}

  public onSubmit() {
    const data = this.data.value;
    console.log(data);
    this.httpClient
      .post<boolean>('http://localhost:8085/loginUser', data)
      .subscribe((response: boolean) => {
        console.log(response);
        if (response) {
          this.authService.Login();
          this.router.navigate(['/home']);
        } else { 
          alert("Wrong credential!");
        }
      });
  }

  public onRegister() {
    this.router.navigate(['/register']);
  }
}
