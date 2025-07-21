import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'extractdata',
        loadComponent: () => import('./extractdata/extractdata.component').then(m => m.ExtractdataComponent)
    }
];
