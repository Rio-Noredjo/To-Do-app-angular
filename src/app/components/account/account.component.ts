import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Customer} from "../../class/customer";
import {UserRole} from "../../enum/user-role";
import {IDropdownSettings} from "ng-multiselect-dropdown";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  StringIsNumber = value => isNaN(Number(value)) === false;

  customerForm : FormGroup;
  userRolesArray = this.toArray(UserRole)
  dropdownSettings : IDropdownSettings={};

  constructor() { }

  ngOnInit(): void {
    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
    };

    this.customerForm =
      new FormGroup({
        'firstName': new FormControl('', [Validators.required]),
        'lastName': new FormControl('', [Validators.required]),
        'email': new FormControl('', [Validators.required, Validators.email]),
        'password': new FormControl('', [Validators.required]),
        'userRoles': new FormControl('', ),
        'address': new FormControl('', ),
      });}


  handleSubmit() {
    let customer = new Customer();

    customer.firstName = this.customerForm.value.firstName
    customer.lastName = this.customerForm.value.lastName
    customer.email = this.customerForm.value.email
    customer.password = this.customerForm.value.password

    console.log('Rio handleSubmit form value: ' + this.customerForm.value);
    console.log('Rio handleSubmit customer value: ' + customer);

  }
/*

  get firstName() { return this.customerForm.get('firstName'); }
  get lastName() { return this.customerForm.get('lastName'); }
  get email() { return this.customerForm.get('email'); }
  get password() { return this.customerForm.get('password'); }
  get userRoles() { return this.customerForm.get('userRoles'); }
*/

  toArray(enumme) {
    return Object.keys(enumme)
      .filter(this.StringIsNumber)
      .map(key => enumme[key]);
  }

}

