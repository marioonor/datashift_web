import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenService } from '../service/AuthenService';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class HeaderComponent implements OnInit, OnDestroy {
    private logoutSubscription: Subscription | undefined;
    private routerSubscription: Subscription | undefined;

    constructor(public authService: AuthenService, private router: Router) { }

    ngOnInit(): void {
        this.logoutSubscription = this.authService.logoutEvent.subscribe(() => {
            console.log('User logged out');
        });
        this.routerSubscription = this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                if (!this.authService.isUserLoggedIn()) {
                    this.router.navigate(['/login']);
                }
            });
        if (!this.authService.isUserLoggedIn()) {
            this.router.navigate(['/login']);
        }
    }

    ngOnDestroy(): void {
        if (this.logoutSubscription) {
            this.logoutSubscription.unsubscribe();
        }
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
    }

    onLogout() {
        this.authService.Logout();
    }
}
