import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {UserRole} from "../../enum/user-role";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  email: string
  userInfo: string[] = []

  constructor(public loginService:AuthService,
  private router : Router) { }

  public get UserRoleResult(): typeof UserRole {
    return UserRole;
  }

  ngOnInit(): void {
    this.email = sessionStorage.getItem('email');
  }

  logout() {
    this.loginService.logOut();
  }

  userItems() {
    let userId = sessionStorage.getItem('userId')
    this.router.navigate([`/items/user/${userId}`])

  }

  login() {
    this.router.navigate([`/login`])
  }
}
