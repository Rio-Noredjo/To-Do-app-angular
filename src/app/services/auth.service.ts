import { Injectable } from '@angular/core';
import {UsersService} from "./users.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private userService: UsersService,
  private router : Router) { }

  authenticate(username, password){
    this.userService.getUserByEmailAndPassword(username, password).subscribe({
      next: (response) => {
        if(response !== null){
          sessionStorage.setItem('userId', String(response.id))
          sessionStorage.setItem('email', response.email)
          sessionStorage.setItem('userRoles', response.userRoles)
        }
      },
      error: (err) => {
        alert(`There is an error: ${err.error}`);
      },
    });
  }

  isUserLoggedIn(): boolean {
    return sessionStorage.getItem('userId') !== null
  }

  isAccessUserRoles(userRoles : string[]): boolean {
    let isAccesByUserRole : boolean = false
    let userRolesFromDB = sessionStorage.getItem('userRoles')
    let userRolesArray : string[]
    if(userRolesFromDB !== null){
      userRolesArray = userRolesFromDB.replace(/\s/g, '').split(',');
      userRoles.forEach(function (valueFromAngular) {
        userRolesArray.forEach(function (valueFromDB) {
          if(valueFromAngular == valueFromDB) {
            isAccesByUserRole = true
          }

        })

      });
    }
    return isAccesByUserRole;
  }

  logOut() {
    sessionStorage.removeItem('userId')
    sessionStorage.removeItem('email')
    sessionStorage.removeItem('userRoles')
    this.router.navigate(['/login']);
  }
}
