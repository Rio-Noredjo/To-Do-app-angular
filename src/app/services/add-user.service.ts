import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Country } from '../class/country';
import { environment } from '../../environments/environment';
import { User } from '../class/user';

@Injectable({
  providedIn: 'root',
})
export class AddUserService {
  private countriesUrl = environment.toDoApiUrl + '/countries';
  private addUserUrl = environment.toDoApiUrl + '/add-user/add';
  private findUserByEmailUrl =
    environment.toDoApiUrl + '/add-user/find-user-by-email/';

  constructor(private httpClient: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.httpClient
      .get<GetResponseCountries>(this.countriesUrl)
      .pipe(map((response) => response._embedded.countries));
  }

  addUser(user: User): Observable<any> {
    return this.httpClient.post<User>(this.addUserUrl, user);
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
