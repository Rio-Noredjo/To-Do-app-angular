import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserRole } from '../../enum/user-role';
import {Country} from "../../class/country";
import {AddUserService} from "../../services/add-user.service";
import {CustomValidators} from "../../validators/custom-validators";
import {User} from "../../class/user";
import {Address} from "../../class/address";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  addUserFormGroup: FormGroup;

  countries: Country[] = [];
  userRoles: { id: string; value: string }[] = [];

  showPassword = false
  showPasswordConfirm = false

  constructor(private fb: FormBuilder,
              private addUserService: AddUserService) {}

  ngOnInit(): void {
    for (let i in UserRole) {
      // if (typeof UserRole[i] === 'string') {
      this.userRoles.push({ id: i, value: <any>UserRole[i] });
      // }
    }

    this.addUserFormGroup = this.fb.group({
      firstName: ['Rio',
        [Validators.required, Validators.minLength(2)]],
      lastName: ['Noredjo',
        [Validators.required, Validators.minLength(2)]],
      email: ['rio@noredjo.com',
        [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]],
      password: ['Javaan18!',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          CustomValidators.patternValidator(new RegExp("(?=.*[0-9])"), {
            requiresDigit: true
          }),
          CustomValidators.patternValidator(new RegExp("(?=.*[A-Z])"), {
            requiresUppercase: true
          }),
          CustomValidators.patternValidator(new RegExp("(?=.*[a-z])"), {
            requiresLowercase: true
          }),
          CustomValidators.patternValidator(new RegExp("(?=.*[$@^!%*?&])"), {
            requiresSpecialChars: true
          })
        ])],
      confirmPassword: ['Javaan18!', [
        Validators.required,
        Validators.minLength(8)
      ]],
      userRoles: this.fb.array([],
        [Validators.required]),
      address: this.fb.group({
        country: ['',
          [Validators.required, Validators.minLength(2)]],
        street: ['Koegelwieck 1',
          [Validators.required, Validators.minLength(2)]],
        city: ['Hoofddorp',
          [Validators.required, Validators.minLength(2)]],
        state: ['Noord Holland',
          [Validators.required, Validators.minLength(2)]],
        zip: ['2134 XX',
          [Validators.required, Validators.minLength(2)]],
      }),
    },
      {
        validators: CustomValidators.MatchValidator
      });

    // populate countries
    this.addUserService.getCountries().subscribe(
      data => {
        this.countries = data;
        console.log('Retrieved countries: ' + JSON.stringify(data));
      }
    );
  }

  get addUserForm() {
    return this.addUserFormGroup.controls;
  }

  get password() { return this.addUserFormGroup.controls["password"]; }


  get passwordValid() {
    return this.password.errors === null;
  }

  get requiredValid() {
    return !this.password.hasError("required");
  }

  get minLengthValid() {
    return !this.password.hasError("minlength");
  }

  get requiresDigitValid() {
    return !this.password.hasError("requiresDigit");
  }

  get requiresUppercaseValid() {
    return !this.password.hasError("requiresUppercase");
  }

  get requiresLowercaseValid() {
    return !this.password.hasError("requiresLowercase");
  }

  get requiresSpecialCharsValid() {
    return !this.password.hasError("requiresSpecialChars");
  }

  onSubmit() {
    let user = new User();
    user.address = this.addUserFormGroup.controls.address.value
    const country: Country = JSON.parse(JSON.stringify(user.address .country))
    user.address.country = country
    user.firstName = this.addUserFormGroup.controls.firstName.value
    user.lastName = this.addUserFormGroup.controls.lastName.value
    user.email = this.addUserFormGroup.controls.email.value
    user.password = this.addUserFormGroup.controls.password.value
    user.userRoles = this.addUserFormGroup.controls.userRoles.value

    console.log(user)

    this.addUserService.addUser(user).subscribe({
      next: response => {
        alert(`gelukt`);
      },
      error: err => {
        alert(`There is an error: ${err.message}`)
      }
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

// click event function toggle
  passwordToggle(password) {
    if(password){
      this.showPassword = !this.showPassword;
    } else {
      this.showPasswordConfirm = !this.showPasswordConfirm;
    }
  }
}
