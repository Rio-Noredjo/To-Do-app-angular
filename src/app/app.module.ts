import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { UsersComponent } from './components/users/users.component';
import { AddEditUserComponent } from './components/add-edit-user/add-edit-user.component';
import { AddEditItemComponent } from './components/add-edit-item/add-edit-item.component';
import { ItemsComponent } from './components/items/items.component';
import { AuthGuardService } from './services/auth-guard.service';
import { UsersService } from './services/users.service';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    HomeComponent,
    AddEditUserComponent,
    UsersComponent,
    AddEditItemComponent,
    ItemsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgSelectModule,
    FontAwesomeModule
  ],
  providers: [AuthGuardService, UsersService],
  bootstrap: [AppComponent],
})
export class AppModule {}
