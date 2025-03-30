import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContentComponent } from './content/content.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'content', pathMatch: 'full' },
      { path: 'home', component: ContentComponent },
      { path: 'content', component: ContentComponent },
      { path: '**', redirectTo: 'content' },
    ],
  },
];
