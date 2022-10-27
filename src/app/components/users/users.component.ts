import { Component, OnInit } from '@angular/core';
import {User} from "../../class/user";
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users : User[] = [];

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.retrieveUsers()
  }

  retrieveUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (response) => {
        this.users = response
      },
      error: (err) => {
        alert(`There is an error: ${err.error}`);
      }
    });
  }

  deleteUser(id: number): void {
    this.usersService.deleteUser(id).subscribe({
      next: (response) => {
        this.ngOnInit();
        alert(`User with id: ${response} successfully deleted`);
      },
      error: (err) => {
        alert(`There is an error: ${err.message}`);
      }
    });
  }
}
