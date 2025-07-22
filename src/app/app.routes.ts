import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { loginGuard } from './login.guard';

export const routes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'extractdata',
        canActivate: [loginGuard],
        loadComponent: () => import('./extractdata/extractdata.component').then(m => m.ExtractdataComponent)
    }
];
