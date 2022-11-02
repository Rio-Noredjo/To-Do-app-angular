import { Injectable } from '@angular/core';
import { UsersService } from './users.service';
import { Router } from '@angular/router';
import {User} from "../class/user";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private userService: UsersService,
              private router: Router) {}

  /** Retrieve user from the database based on username and password.
   * If no user is found notting is saved in the sessionStorage.*/
  authenticate(username, password): void {
    this.userService.getUserByEmailAndPassword(username, password).subscribe({
      next: (response) => {
        if (response !== null) {
          this.storeUser(response)
        }
      },
      error: (err) => {
        alert(`There is an error: ${err.error}`);
      }
    });
  }

  /** Show navigation items based on logged in.*/
  isUserLoggedIn(): boolean {
    return sessionStorage.getItem('userId') !== null;
  }

  /** Show navigation items based on user role.*/
  isAccessUserRoles(userRoles: string[]): boolean {
    let isAccesByUserRole: boolean;
    let userRolesFromDB = sessionStorage.getItem('userRoles');
    let userRolesArray: string[];
    if (userRolesFromDB !== null) {
      userRolesArray = userRolesFromDB.replace(/\s/g, '').split(',');
      userRoles.forEach(function (valueFromAngular) {
        userRolesArray.forEach(function (valueFromDB) {
          if (valueFromAngular == valueFromDB) {
            isAccesByUserRole = true;
          }
        });
      });
    }
    return isAccesByUserRole;
  }

  /** Call removeUser method and navigate to the login page.*/
  logOut(): void {
    this.removeUser();
    this.router.navigate(['/login']);
  }

  /** Store user values in the sessionStorage.*/
  private storeUser(user : User): void {
    sessionStorage.setItem('userId', String(user.id));
    sessionStorage.setItem('email', user.email);
    sessionStorage.setItem('userRoles', user.userRoles);
  }

  /** Remove user values from the sessionStorage.*/
  private removeUser(): void {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('userRoles');
  }

}
