import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AccountComponent } from './components/account/account.component';
import {UsersComponent} from "./components/users/users.component";
import {AddEditUserComponent} from "./components/add-edit-user/add-edit-user.component";
import {AddEditToDoItemComponent} from "./components/add-edit-to-do-item/add-edit-to-do-item.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'account', component: AccountComponent },
  { path: 'users', component: UsersComponent },
  { path: 'users/add', component: AddEditUserComponent },
  { path: 'users/edit/:id', component: AddEditUserComponent },
  { path: 'items/add', component: AddEditToDoItemComponent },
  { path: 'items/edit/:id', component: AddEditToDoItemComponent },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
