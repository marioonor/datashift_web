import { Injectable, isDevMode } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root',
})
export class AuthenService {
    private isLoggedIn = false;

    constructor(private router: Router) {
        if (typeof window !== 'undefined' && window.localStorage) {
            // Check if 'isLoggedIn' is in localStorage and update isLoggedIn accordingly
            const storedLoginStatus = localStorage.getItem('isLoggedIn');
            this.isLoggedIn = storedLoginStatus === 'true';
        } else {
            if (isDevMode()) {
                console.warn('Local Storage is not available');
            }
        }
    }

    Login() {
        this.isLoggedIn = true;
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('isLoggedIn', 'true');
        } else {
            if (isDevMode()) {
                console.warn('Local Storage is not available');
            }
        }
    }

    Logout() {
        this.isLoggedIn = false;
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('isLoggedIn');
        } else {
            if (isDevMode()) {
                console.warn('Local Storage is not available');
            }
        }
        this.router.navigate(['/login']);
    }

    isUserLoggedIn(): boolean {
        return this.isLoggedIn;
    }
}
