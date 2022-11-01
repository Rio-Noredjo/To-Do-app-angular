import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Country } from '../class/country';
import { User } from '../class/user';

@Injectable({
  providedIn: 'root',
})
export class AddEditUserService {
  private countriesUrl = environment.toDoApiUrl + '/countries';
  private addUserUrl = environment.toDoApiUrl + '/users/add';
  private updateUserUrl = environment.toDoApiUrl + '/users/update';
  private findUserByEmailUrl = environment.toDoApiUrl + '/users/find-by-email/';

  constructor(private httpClient: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.httpClient
      .get<GetResponseCountries>(this.countriesUrl)
      .pipe(map((response) => response._embedded.countries));
  }

  addUser(user: User): Observable<User> {
    return this.httpClient.post<User>(this.addUserUrl, user);
  }

  updateUser(user: User): Observable<User> {
    return this.httpClient.put<User>(this.updateUserUrl, user);
  }

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
