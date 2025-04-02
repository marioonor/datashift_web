import { Injectable } from "@angular/core";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root',
})

export class AuthenService {
    
    private isLoggedIn = false;

    constructor(private router: Router) {
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    }

    Login() {
        this.isLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
    }

    Logout() {
        this.isLoggedIn = false;
        localStorage.removeItem('isLoggedIn');
        this.router.navigate(['/login']);
    }

    isUserLoggedIn(): boolean {
        return this.isLoggedIn;
    }
}