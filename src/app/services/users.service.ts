import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../class/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private allUsers = environment.toDoApiUrl + '/users/all-users';
  private userUrl = environment.toDoApiUrl + '/users/user/';
  private userByEmailAndPasswordUrl =
    environment.toDoApiUrl + '/users/user/user-email-password';
  private deleteUserUrl = environment.toDoApiUrl + '/users/delete-user/';

  constructor(private httpClient: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.httpClient
      .get<User[]>(this.allUsers)
      .pipe(map((response) => response));
  }

  getUser(id: number): Observable<User> {
    return this.httpClient
      .get<User>(this.userUrl + id)
      .pipe(map((response) => response));
  }

  getUserByEmailAndPassword(email: String, password: String): Observable<User> {
    return this.httpClient
      .get<User>(this.userByEmailAndPasswordUrl + `/${email}/${password}`)
      .pipe(map((response) => response));
  }

  deleteUser(id: number): Observable<number> {
    return this.httpClient
      .delete<number>(this.deleteUserUrl + id)
      .pipe(map((response) => response));
  }
}
