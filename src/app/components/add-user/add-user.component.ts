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
      firstName: ['',
        [Validators.required, Validators.minLength(2)]],
      lastName: ['',
        [Validators.required, Validators.minLength(2)]],
      email: ['',
        [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]],
      password: ['',
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
      confirmPassword: [null, [
        Validators.required,
        Validators.minLength(8)
      ]],
      userRoles: this.fb.array([],
        [Validators.required]),
      address: this.fb.group({
        country: ['',
          [Validators.required, Validators.minLength(2)]],
        street: ['',
          [Validators.required, Validators.minLength(2)]],
        city: ['',
          [Validators.required, Validators.minLength(2)]],
        state: ['',
          [Validators.required, Validators.minLength(2)]],
        zip: ['',
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
    console.warn(this.addUserFormGroup.value);

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
