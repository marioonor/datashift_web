import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './content/content.component';
import { LoginComponent } from './login/login.component'; // Assuming you have a LoginComponent
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [ // Export the routes array
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route
  { path: 'home', component: HomeComponent },
  { path: 'main', component: MainComponent },
  { path: 'content', component: ContentComponent }, // Correct route for ContentComponent
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, // Route for LoginComponent
  { path: '**', redirectTo: '/login' }, // Wildcard route (should be last)
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Use the routes array here
  exports: [RouterModule],
})
export class AppRoutingModule {}
