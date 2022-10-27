import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Country} from "../../class/country";
import {User} from "../../class/user";
import {ActivatedRoute, Router} from "@angular/router";
import {UsersService} from "../../services/users.service";
import {UserRole} from "../../enum/user-role";
import {CustomValidators} from "../../validators/custom-validators";
import {AddEditUserService} from "../../services/add-edit-user.service";

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css']
})
export class AddEditUserComponent implements OnInit {
  addUserFormGroup: FormGroup;

  countries: Country[] = [];
  userRoles: { id: string; value: string; isChecked: boolean }[] = [];
  selectedUserRoles: String[] = [];
  id: number;
  addressId: number;
  isAddMode: boolean;
  user: User;

  constructor(
    private fb: FormBuilder,
    private addEditUserService: AddEditUserService,
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id

    for (let i in UserRole) {
      this.userRoles.push({ id: i, value: <any>UserRole[i], isChecked: false });
    }

    this.addUserFormGroup = this.fb.group(
      {
        firstName: ['',
          [Validators.required,
            Validators.minLength(2),
            CustomValidators.notOnlyWhitespace,],],
        lastName: ['',
          [Validators.required,
            Validators.minLength(2),
            CustomValidators.notOnlyWhitespace,],],
        email: ['',
          [Validators.required,
            Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
            CustomValidators.notOnlyWhitespace,],],
        password: ['',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            CustomValidators.patternValidator(new RegExp('(?=.*[0-9])'), {
              requiresDigit: true, }),
            CustomValidators.patternValidator(new RegExp('(?=.*[A-Z])'), {
              requiresUppercase: true,}),
            CustomValidators.patternValidator(new RegExp('(?=.*[a-z])'), {
              requiresLowercase: true,}),
            CustomValidators.patternValidator(new RegExp('(?=.*[$@^!%*?&])'), {
              requiresSpecialChars: true,}),
          ]),
        ],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
        userRoles: this.fb.array([], [Validators.required]),
        address: this.fb.group({
          country: ['', [Validators.required, Validators.minLength(2)]],
          street: ['',
            [Validators.required,
              Validators.minLength(2),
              CustomValidators.notOnlyWhitespace,],],
          city: ['',
            [Validators.required,
              Validators.minLength(2),
              CustomValidators.notOnlyWhitespace,],],
          state: ['',
            [Validators.required,
              Validators.minLength(2),
              CustomValidators.notOnlyWhitespace,],],
          zipCode: ['',
            [Validators.required,
              Validators.minLength(2),
              CustomValidators.notOnlyWhitespace, ],],
        }),
      },
      { validators: CustomValidators.MatchValidator}
    );

    this.addEditUserService.getCountries().subscribe((response) => {
      this.countries = response;
    });

    if (!this.isAddMode) { this.retrieveUser(this.id); }
  }

  get getFirstName() { return this.addUserFormGroup.get('firstName'); }
  get getLastName() { return this.addUserFormGroup.get('lastName'); }
  get getEmail() { return this.addUserFormGroup.get('email'); }
  get getPassword() { return this.addUserFormGroup.get('password'); }
  get getConfirmPassword() { return this.addUserFormGroup.get('confirmPassword'); }
  get getAddress() { return this.addUserFormGroup.get('address'); }
  get getCountry() { return this.addUserFormGroup.get('address.country'); }
  get getState() { return this.addUserFormGroup.get('address.state'); }
  get getCity() { return this.addUserFormGroup.get('address.city'); }
  get getStreet() { return this.addUserFormGroup.get('address.street'); }
  get getZipCode() { return this.addUserFormGroup.get('address.zipCode'); }
  get getUserRoles() { return this.addUserFormGroup.get('userRoles'); }

  get passwordValid() { return this.getPassword.errors === null; }
  get requiredValid() { return !this.getPassword.hasError('required'); }
  get minLengthValid() { return !this.getPassword.hasError('minlength'); }
  get requiresDigitValid() { return !this.getPassword.hasError('requiresDigit'); }
  get requiresUppercaseValid() { return !this.getPassword.hasError('requiresUppercase'); }
  get requiresLowercaseValid() { return !this.getPassword.hasError('requiresLowercase'); }
  get requiresSpecialCharsValid() {
    return !this.getPassword.hasError('requiresSpecialChars');
  }

  onSubmit() {
    if (this.addUserFormGroup.invalid) {
      this.addUserFormGroup.markAllAsTouched();
      return;
    }

    let user = this.setUserOnSubmit();
    if(this.isAddMode){
      this.addEditUserService.addUser(user).subscribe({
        next: (response) => {
          window.location.reload();
          alert(`New client with ID: ${response.id}`);
        },
        error: (err) => {
          alert(`There is an error: ${err.error}`);
        },
      });
    } else {
      this.addEditUserService.updateUser(user).subscribe({
        next: (response) => {
          alert(`Client with id: ${response.id} updated`);
        },
        error: (err) => {
          alert(`There is an error: ${err.error}`);
        },
      });
    }

  }

  updateUserRoleArray(event, valueFromEdit) {
    let checked;
    let value;
    if (event !== null) {
      checked = event.target.checked;
      value = event.target.value;
    } else if (valueFromEdit !== null) {
      checked = true;
      value = valueFromEdit;
    }
    const checkArray: FormArray = this.addUserFormGroup.get(
      'userRoles'
    ) as FormArray;
    if (checked) {
      checkArray.push(new FormControl(value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  userAlreadyExist(event) {
    if (event.target.value !== null && event.target.value !== "") {
      this.addEditUserService.findUserByEmail(event.target.value)
        .subscribe({
          next: (response) => {
            if (response !== null && this.getEmail.errors === null) {
              this.getEmail.setErrors({ userAlreadyExist: true });
            }
          },
          error: (err) => {
            alert(`There is an error: ${err.error}`);
          },
        });
    }
  }

  retrieveUser(id: number): void {
    this.usersService.getUser(id)
      .subscribe({
        next: (response) => {
          this.user = response;
          this.isAddMode = false
          this.addressId = response.address.id;
          this.setUserValue(this.user);
        },
        error: (err) => {
          this.router.navigate(['/users/add'])
          alert(`There is an error: ${err.error}`);
        },
      });
  }

  setUserValue(user: User) {
    this.getFirstName.setValue(user.firstName);
    this.getLastName.setValue(user.lastName);
    this.getEmail.setValue(user.email);
    this.getEmail.disable();
    this.getPassword.setValue(user.password);
    this.getPassword.disable();
    this.getConfirmPassword.setValue(user.password);
    this.getConfirmPassword.disable();

    setTimeout (() => {
      this.getCountry.setValue(this.countries[user.address.country.id -1]);
    }, 50);

    this.getState.setValue(user.address.state);
    this.getCity.setValue(user.address.city);
    this.getStreet.setValue(user.address.street);
    this.getZipCode.setValue(user.address.zipCode);

    const userRolesValues = this.user.userRoles;
    this.selectedUserRoles = userRolesValues.replace(/\s/g, '').split(',');
    for (let x in this.selectedUserRoles) {
      for (let i in this.userRoles) {
        if (this.userRoles[i].id === this.selectedUserRoles[x]) {
          this.userRoles[i].isChecked = true;
          this.updateUserRoleArray(null, this.userRoles[i].id);
        }
      }
    }
  }

  setUserOnSubmit(): User {
    let user = new User();
    user.id = this.id
    user.address = this.getAddress.value
    user.address.id = this.addressId
    user.address.country = JSON.parse(JSON.stringify(this.getCountry.value));
    user.firstName = this.getFirstName.value
    user.lastName = this.getLastName.value
    user.email = this.getEmail.value
    user.password = this.getPassword.value
    user.userRoles = this.getUserRoles.value.toString()
    return user;
  }
}
