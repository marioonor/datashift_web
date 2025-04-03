import { Injectable, isDevMode, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root',
})
export class AuthenService {
    private isLoggedIn = false;
    public logoutEvent: EventEmitter<void> = new EventEmitter<void>();
    redirectUrl: string | null = null;

    constructor(private router: Router) {
        if (typeof window !== 'undefined' && window.localStorage) {
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
            // Clear other user-related data from local storage if needed
        } else {
            if (isDevMode()) {
                console.warn('Local Storage is not available');
            }
        }
        this.logoutEvent.emit(); 
        this.router.navigate(['/login']).then(() => {
            // Clear cache more aggressively
            window.location.replace('/login');
        });
    }

    isUserLoggedIn(): boolean {
        return this.isLoggedIn;
    }
}
