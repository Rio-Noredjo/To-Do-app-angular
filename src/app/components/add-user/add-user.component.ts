import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserRole } from '../../enum/user-role';
import { Country } from '../../class/country';
import { AddUserService } from '../../services/add-user.service';
import { CustomValidators } from '../../validators/custom-validators';
import { User } from '../../class/user';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  addUserFormGroup: FormGroup;

  countries: Country[] = [];
  userRoles: { id: string; value: string }[] = [];

  showPassword = false;
  showPasswordConfirm = false;

  constructor(
    private fb: FormBuilder,
    private addUserService: AddUserService
  ) {}

  ngOnInit(): void {
    for (let i in UserRole) {
      // if (typeof UserRole[i] === 'string') {
      this.userRoles.push({ id: i, value: <any>UserRole[i] });
      // }
    }

    this.addUserFormGroup = this.fb.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            CustomValidators.notOnlyWhitespace,
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            CustomValidators.notOnlyWhitespace,
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
            CustomValidators.notOnlyWhitespace,
          ],
        ],
        password: [
          '',
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
          ]),
        ],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
        userRoles: this.fb.array([], [Validators.required]),
        address: this.fb.group({
          country: ['', [Validators.required, Validators.minLength(2)]],
          street: [
            '',
            [
              Validators.required,
              Validators.minLength(2),
              CustomValidators.notOnlyWhitespace,
            ],
          ],
          city: [
            '',
            [
              Validators.required,
              Validators.minLength(2),
              CustomValidators.notOnlyWhitespace,
            ],
          ],
          state: [
            '',
            [
              Validators.required,
              Validators.minLength(2),
              CustomValidators.notOnlyWhitespace,
            ],
          ],
          zipCode: [
            '',
            [
              Validators.required,
              Validators.minLength(2),
              CustomValidators.notOnlyWhitespace,
            ],
          ],
        }),
      },
      {
        validators: CustomValidators.MatchValidator,
      }
    );

    this.addUserService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  get getFirstName() {
    return this.addUserFormGroup.get('firstName');
  }
  get getLastName() {
    return this.addUserFormGroup.get('lastName');
  }
  get getEmail() {
    return this.addUserFormGroup.get('email');
  }
  get getPassword() {
    return this.addUserFormGroup.get('password');
  }
  get getConfirmPassword() {
    return this.addUserFormGroup.get('confirmPassword');
  }
  get getStreet() {
    return this.addUserFormGroup.get('address.street');
  }
  get getCity() {
    return this.addUserFormGroup.get('address.city');
  }
  get getState() {
    return this.addUserFormGroup.get('address.state');
  }
  get getZipCode() {
    return this.addUserFormGroup.get('address.zipCode');
  }

  get passwordValid() {
    return this.getPassword.errors === null;
  }

  get requiredValid() {
    return !this.getPassword.hasError('required');
  }

  get minLengthValid() {
    return !this.getPassword.hasError('minlength');
  }

  get requiresDigitValid() {
    return !this.getPassword.hasError('requiresDigit');
  }

  get requiresUppercaseValid() {
    return !this.getPassword.hasError('requiresUppercase');
  }

  get requiresLowercaseValid() {
    return !this.getPassword.hasError('requiresLowercase');
  }

  get requiresSpecialCharsValid() {
    return !this.getPassword.hasError('requiresSpecialChars');
  }

  onSubmit() {
    if (this.addUserFormGroup.invalid) {
      this.addUserFormGroup.markAllAsTouched();
      return;
    }

    let user = new User();
    user.address = this.addUserFormGroup.controls.address.value;
    user.address.country = JSON.parse(JSON.stringify(user.address.country));
    user.firstName = this.addUserFormGroup.controls.firstName.value;
    user.lastName = this.addUserFormGroup.controls.lastName.value;
    user.email = this.addUserFormGroup.controls.email.value;
    user.password = this.addUserFormGroup.controls.password.value;
    user.userRoles = this.addUserFormGroup.controls.userRoles.value.toString();

    this.addUserService.addUser(user).subscribe({
      next: (response) => {
        // reset the form
        this.addUserFormGroup.reset();
        alert(`New client with ID: ${response.id}`);
      },
      error: (err) => {
        alert(`There is an error: ${err.message}`);
      },
    });
  }

  onCheckboxChange(e) {
    const checkArray: FormArray = this.addUserFormGroup.get(
      'userRoles'
    ) as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  passwordToggle(password) {
    if (password) {
      this.showPassword = !this.showPassword;
    } else {
      this.showPasswordConfirm = !this.showPasswordConfirm;
    }
  }

  checkUserAlreadyExist(event) {
    if (event.target.value !== null) {
      this.addUserService
        .findUserByEmail(event.target.value)
        .subscribe((data) => {
          if (data !== null && this.getEmail.errors === null) {
            this.getEmail.setErrors({ userAlreadyExist: true });
          }
        });
    }
  }
}
