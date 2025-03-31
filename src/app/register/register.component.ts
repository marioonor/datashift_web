import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  register = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });
  constructor(private httpClient: HttpClient, private router: Router) {}

  public onLogin() {
    this.router.navigate(['/login']);
  }
  public onSubmit() {
    const data = this.register.value;
    console.log(data);
    this.httpClient
      .post<boolean>('http://localhost:8085/addUser', data)
      .subscribe((response: boolean) => {
        alert("Registration Successful!");
        this.router.navigate(['/login']);
      }, (error) => {
        console.log(error);
        alert('Registration Failed!');
      });
  }
}
