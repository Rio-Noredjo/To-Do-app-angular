import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/environments/environment';
import {Customer} from "../class/customer";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private addCustomerUrl = environment.ToDoApiUrl + '/customer/add';

  constructor(private httpClient: HttpClient) { }

  addCustomer(customer: Customer): Observable<any> {
    console.log('Rio addCustomer: '+ customer)
    return this.httpClient.post<Customer>(this.addCustomerUrl, customer);
  }

}
