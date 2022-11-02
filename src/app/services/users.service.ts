import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../class/user';
import {Country} from "../class/country";

@Injectable({
  providedIn: 'root',
})

export class UsersService {
  private allUsers = environment.toDoApiUrl + '/users/all-users';
  private userUrl = environment.toDoApiUrl + '/users/user/';
  private userByEmailAndPasswordUrl = environment.toDoApiUrl + '/users/user/user-email-password';
  private deleteUserUrl = environment.toDoApiUrl + '/users/delete-user/';
  private countriesUrl = environment.toDoApiUrl + '/countries';
  private addUserUrl = environment.toDoApiUrl + '/users/add';
  private updateUserUrl = environment.toDoApiUrl + '/users/update';
  private findUserByEmailUrl = environment.toDoApiUrl + '/users/find-by-email/';

  constructor(private httpClient: HttpClient) {}

  /** Retrieve all users.*/
  getUsers(): Observable<User[]> {
    return this.httpClient
      .get<User[]>(this.allUsers)
      .pipe(map((response) => response));
  }

  /** Retrieve user based on userId.*/
  getUser(userId: number): Observable<User> {
    return this.httpClient
      .get<User>(this.userUrl + userId)
      .pipe(map((response) => response));
  }

  /** Retrieve user based on email and password.*/
  getUserByEmailAndPassword(email: String, password: String): Observable<User> {
    return this.httpClient
      .get<User>(this.userByEmailAndPasswordUrl + `/${email}/${password}`)
      .pipe(map((response) => response));
  }

  /** Delete user based on userId.*/
  deleteUser(userId: number): Observable<number> {
    return this.httpClient
      .delete<number>(this.deleteUserUrl + userId)
      .pipe(map((response) => response));
  }

  /** Retrieve all countries from the countries table.*/
  getCountries(): Observable<Country[]> {
    return this.httpClient
      .get<GetResponseCountries>(this.countriesUrl)
      .pipe(map((response) => response._embedded.countries));
  }

  /** Add user.*/
  addUser(user: User): Observable<User> {
    return this.httpClient
      .post<User>(this.addUserUrl, user)
      .pipe(map((response) => response));
  }

  /** Update user.*/
  updateUser(user: User): Observable<User> {
    return this.httpClient
      .put<User>(this.updateUserUrl, user)
      .pipe(map((response) => response));
  }

  /** Retrieve user based on email address.*/
  findUserByEmail(email: String): Observable<User> {
    return this.httpClient
      .get<User>(this.findUserByEmailUrl + email)
      .pipe(map((response) => response));
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  };
}
