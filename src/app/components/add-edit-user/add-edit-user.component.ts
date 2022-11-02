import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl,FormGroup,Validators,} from '@angular/forms';
import { Country } from '../../class/country';
import { User } from '../../class/user';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { UserRole } from '../../enum/user-role';
import { CustomValidators } from '../../validators/custom-validators';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css'],
})

export class AddEditUserComponent implements OnInit {
  addEditUserFormGroup: FormGroup;
  countries: Country[] = [];
  userRoles: { id: string; value: string; isChecked: boolean }[] = [];
  selectedUserRoles: String[] = [];
  userId: number;
  addressId: number;
  isAddMode: boolean;
  user: User;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private usersService: UsersService) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    this.isAddMode = !this.userId;
    this.addUserRoles();
    this.getCountries();
    this.getUserData(this.userId);

    this.addEditUserFormGroup = this.fb.group(
      {
        firstName: ['',
          [Validators.required,
            Validators.minLength(2),
            CustomValidators.notOnlyWhitespace]],
        lastName: ['',
          [Validators.required,
            Validators.minLength(2),
            CustomValidators.notOnlyWhitespace]],
        email: ['',
          [Validators.required,
            Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
            CustomValidators.notOnlyWhitespace]],
        password: ['',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            CustomValidators.patternValidator(new RegExp('(?=.*[0-9])'), {
              requiresDigit: true,
            }),
            CustomValidators.patternValidator(new RegExp('(?=.*[A-Z])'), {
              requiresUppercase: true,
            }),
            CustomValidators.patternValidator(new RegExp('(?=.*[a-z])'), {
              requiresLowercase: true,
            }),
            CustomValidators.patternValidator(new RegExp('(?=.*[$@^!%*?&])'), {
              requiresSpecialChars: true,
            }),
          ])
        ],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
        userRoles: this.fb.array([], [Validators.required]),
        address: this.fb.group({
          country: ['',
            [Validators.required, Validators.minLength(2)]],
          street: ['',
            [Validators.required,
              Validators.minLength(2),
              CustomValidators.notOnlyWhitespace]],
          city: ['',
            [Validators.required,
              Validators.minLength(2),
              CustomValidators.notOnlyWhitespace]],
          state: ['',
            [Validators.required,
              Validators.minLength(2),
              CustomValidators.notOnlyWhitespace]],
          zipCode: ['',
            [Validators.required,
              Validators.minLength(2),
              CustomValidators.notOnlyWhitespace]]
        }),
      }, { validators: CustomValidators.MatchValidator }
    );
  }

  onSubmit(): void {
    if (this.addEditUserFormGroup.invalid) {
      this.addEditUserFormGroup.markAllAsTouched();
      return;
    }

    let user = this.setUserOnSubmit();
    this.submitUser(user)
  }

  get getFirstName() { return this.addEditUserFormGroup.get('firstName'); }
  get getLastName() { return this.addEditUserFormGroup.get('lastName'); }
  get getEmail() { return this.addEditUserFormGroup.get('email'); }
  get getPassword() { return this.addEditUserFormGroup.get('password'); }
  get getConfirmPassword() { return this.addEditUserFormGroup.get('confirmPassword'); }
  get getAddress() { return this.addEditUserFormGroup.get('address'); }
  get getCountry() { return this.addEditUserFormGroup.get('address.country'); }
  get getState() { return this.addEditUserFormGroup.get('address.state'); }
  get getCity() { return this.addEditUserFormGroup.get('address.city'); }
  get getStreet() { return this.addEditUserFormGroup.get('address.street'); }
  get getZipCode() { return this.addEditUserFormGroup.get('address.zipCode'); }
  get getUserRoles() { return this.addEditUserFormGroup.get('userRoles'); }

  get passwordValid() { return this.getPassword.errors === null; }
  get requiredValid() { return !this.getPassword.hasError('required'); }
  get minLengthValid() { return !this.getPassword.hasError('minlength'); }
  get requiresDigitValid() { return !this.getPassword.hasError('requiresDigit'); }
  get requiresUppercaseValid() { return !this.getPassword.hasError('requiresUppercase'); }
  get requiresLowercaseValid() { return !this.getPassword.hasError('requiresLowercase'); }
  get requiresSpecialCharsValid() { return !this.getPassword.hasError('requiresSpecialChars');  }

  /** Update the userRoles array after a checkbox is (un)checked.*/
  updateUserRoleArray(event, valueEditMode): void {
    let checked;
    let value;

    if (event !== null) {
      checked = event.target.checked;
      value = event.target.value;
    } else if (valueEditMode !== null) {
      checked = true;
      value = valueEditMode;
    }

    const checkArray: FormArray = this.addEditUserFormGroup.get(
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

  /** Check if the user already exists based on email address.
   * If the user already exists an error message is shown and submit button is disabled.*/
  userAlreadyExist(event): void {
    if (event.target.value !== null && event.target.value !== '') {
      this.usersService.findUserByEmail(event.target.value).subscribe({
        next: (response) => {
          if (response !== null && this.getEmail.errors === null) {
            this.getEmail.setErrors({ userAlreadyExist: true });
          }
        },
        error: (err) => {
          alert(`There is an error: ${err.error}`);
        }
      });
    }
  }

  /** Retrieve the user if edit mode is active*/
  private getUserData(userId: number): void {
    if (!this.isAddMode) {
      this.usersService.getUser(userId).subscribe({
        next: (response) => {
          this.user = response;
          this.isAddMode = false;
          this.addressId = response.address.id;
          this.setUserValue(this.user);
        },
        error: () => {
          this.router.navigate(['/users/add']);
          alert(`No user found with id: ${userId}`);
        }
      });
    }
  }

  /** Set the user value to the User class*/
  private setUserValue(user: User): void {
    this.getFirstName.setValue(user.firstName);
    this.getLastName.setValue(user.lastName);
    this.getEmail.setValue(user.email);
    this.getEmail.disable();
    this.getPassword.setValue(user.password);
    this.getPassword.disable();
    this.getConfirmPassword.setValue(user.password);
    this.getConfirmPassword.disable();
    this.getState.setValue(user.address.state);
    this.getCity.setValue(user.address.city);
    this.getStreet.setValue(user.address.street);
    this.getZipCode.setValue(user.address.zipCode);
    setTimeout(() => {
      this.getCountry.setValue(this.countries[user.address.country.id - 1]);
    }, 50);

    let userRolesValues = this.user.userRoles;
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

  /** Push all UserRole Enum to the userRoles field.*/
  private addUserRoles(): void {
    for (let i in UserRole) {
      this.userRoles.push({ id: i, value: <any>UserRole[i], isChecked: false });
    }
  }

  /** Retrieve all countries and add it to the countries array field.*/
  private getCountries(): void {
    this.usersService.getCountries().subscribe((response) => {
      this.countries = response;
    });
  }

  /** Create user object with the values from the form before saving.*/
  private setUserOnSubmit(): User {
    let user = new User();
    user.id = this.userId;
    user.firstName = this.getFirstName.value;
    user.lastName = this.getLastName.value;
    user.email = this.getEmail.value;
    user.password = this.getPassword.value;
    user.userRoles = this.getUserRoles.value.toString();
    user.address = this.getAddress.value;
    user.address.id = this.addressId;
    user.address.country = JSON.parse(JSON.stringify(this.getCountry.value));
    return user;
  }

  /** Update or add user.*/
  private submitUser(user : User): void {
    if (this.isAddMode) {
      this.usersService.addUser(user).subscribe({
        next: (response) => {
          window.location.reload();
          alert(`New client with ID: ${response.id}`);
        },
        error: (err) => {
          alert(`There is an error: ${err.error}`);
        }
      });
    } else {
      this.usersService.updateUser(user).subscribe({
        next: (response) => {
          alert(`Client with id: ${response.id} updated`);
        },
        error: (err) => {
          alert(`There is an error: ${err.error}`);
        }
      });
    }
  }
}
