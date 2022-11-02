import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { User } from '../../class/user';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  users: User[] = [];
  isInvalid: boolean = false;
  form = { email: '', password: 'Password01!', };
  isLogIn: boolean;

  constructor(private router: Router,
              public  authService: AuthService,
              private usersService: UsersService) {}

  ngOnInit() {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('userRoles');
    this.getUsers();
  }

  onSubmit(form: NgForm) {
    if (this.form.email !== '' && this.form.password !== '') {
      this.authService.authenticate(this.form.email, this.form.password);
      setTimeout(() => {
        this.isLogIn = sessionStorage.getItem('email') !== null;
        if (this.isLogIn) {
          this.router.navigate(['/home']);
        } else {
          this.isInvalid = true;
        }
      }, 100);
    } else {
      form.reset();
      this.isInvalid = true;
    }
  }

  /** Retrieve all users.*/
  private getUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (response) => {
        this.users = response;
      },
      error: (err) => {
        alert(`There is an error: ${err.error}`);
      }
    });
  }
}
