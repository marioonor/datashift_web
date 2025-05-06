import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './extracteddata/extracteddata.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ResultComponent } from './result/result.component';
import { RegisterComponent } from './register/register.component';
import { ViewPdfComponent } from './viewpdf/viewpdf.component';
import { PdfComponent } from './pdf/pdf.component';
import { ViewalldataComponent } from './viewalldata/viewalldata.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'result', component: ResultComponent },
  { path: 'extracted-data', component: ContentComponent },
  {path: 'viewdata', component: ViewalldataComponent},
  {
    path: 'view-pdf',
    component: ViewPdfComponent,
    children: [{ path: 'pdf', component: PdfComponent }],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
