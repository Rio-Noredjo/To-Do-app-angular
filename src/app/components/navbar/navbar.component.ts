import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../enum/user-role';
import { Router } from '@angular/router';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  email: string;
  userInfo: string[] = [];
  faLinkedin = faLinkedin;
  faGithub = faGithub;

  constructor(public  authService: AuthService, private router: Router) {}

  public get UserRoleResult(): typeof UserRole {
    return UserRole;
  }

  ngOnInit(): void {
    this.email = sessionStorage.getItem('email');
  }

  /** Logout user when button Logout is clicked.*/
  logout() {
    this.authService.logOut();
  }

  /** Go to the items page.*/
  userItems() {
    let userId = sessionStorage.getItem('userId');
    this.router.navigate([`/items/user/${userId}`]);
  }

}
