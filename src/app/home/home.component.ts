import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RegistrationPayload } from '../model/auth.models';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterModule, CommonModule, FormsModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    name: string = '';
    email: string = '';
    password: string = '';
    confirmPassword = '';
    role: string = 'USER';

    passwordFieldType: string = 'password';
    confirmPasswordFieldType: string = 'password';

    private onRegister() {
        if (!this.name || !this.email || !this.password) {
            alert('Please fill in all fields');
            return;
        }

        const userData: RegistrationPayload = {
            id: 0,
            name: this.name,
            email: this.email,
            password: this.password,
            role: this.role,
        };

        this.authService.register(userData).subscribe({
            next: (response) => {
                console.log('Registration successful', response);
                alert(
                    `Registration successful for ${this.name}! Please log in.`
                );
                this.toggleForm();
            },
            error: (err) => {
                console.error('Registration failed', err);
                alert(
                    `Registration failed: ${
                        err.error?.message || 'Please try again.'
                    }`
                );
            },
        });
    }

    isLogin = true;
    showAuthForm = false;

    toggleForm() {
        this.isLogin = !this.isLogin;
        this.resetForm();
    }

    private onLogin() {
        if (!this.email || !this.password) {
            alert('Please provide email and password.');
            return;
        }
        this.authService
            .login({ email: this.email, password: this.password })
            .subscribe({
                next: (user) => {
                    console.log('Login successful', user);
                    this.router.navigate(['/extractdata']);
                },
                error: (err) => {
                    console.error('Login failed', err);
                    alert('Login failed. Please check your credentials.');
                },
            });
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
        this.resetForm();
    }

    private resetForm() {
        this.name = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
    }

    togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
        if (field === 'password') {
            this.passwordFieldType =
                this.passwordFieldType === 'password' ? 'text' : 'password';
        } else if (field === 'confirmPassword') {
            this.confirmPasswordFieldType =
                this.confirmPasswordFieldType === 'password'
                    ? 'text'
                    : 'password';
        }
    }

    onSubmit(event: Event): void {
        event.preventDefault();
        if (this.isLogin) {
            this.onLogin();
        } else {
            if (this.password !== this.confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            this.onRegister();
        }
    }
}
