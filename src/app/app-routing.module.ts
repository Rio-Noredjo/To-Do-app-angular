import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { UsersComponent } from './components/users/users.component';
import { AddEditUserComponent } from './components/add-edit-user/add-edit-user.component';
import { AddEditToDoItemComponent } from './components/add-edit-to-do-item/add-edit-to-do-item.component';
import { ItemsComponent } from './components/items/items.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },

  { path: 'users', component: UsersComponent, canActivate: [AuthGuardService] },
  {
    path: 'users/add',
    component: AddEditUserComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'users/edit/:id',
    component: AddEditUserComponent,
    canActivate: [AuthGuardService],
  },
  { path: 'items', component: ItemsComponent, canActivate: [AuthGuardService] },
  {
    path: 'items/user/:userId',
    component: ItemsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'items/add',
    component: AddEditToDoItemComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'items/edit/:id',
    component: AddEditToDoItemComponent,
    canActivate: [AuthGuardService],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
