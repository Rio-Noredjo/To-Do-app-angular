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
  form = {
    email: '',
    password: '',
  };
  isLogIn: boolean;
  constructor(
    private router: Router,
    public loginService: AuthService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('userRoles');
    this.retrieveUsers();
  }

  onSubmit(form: NgForm) {
    if (this.form.email !== "" && this.form.password !== "") {
      this.loginService.authenticate(this.form.email, this.form.password);
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

  retrieveUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (response) => {
        this.users = response;
      },
      error: (err) => {
        alert(`There is an error: ${err.error}`);
      },
    });
  }
}
