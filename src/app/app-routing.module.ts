import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  declarations: [
    LoginComponent, HomeComponent
  ],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule, LoginComponent, HomeComponent]
})
export class AppRoutingModule { }
