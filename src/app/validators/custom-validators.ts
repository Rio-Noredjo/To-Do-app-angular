import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static notOnlyWhitespace(control: FormControl): ValidationErrors {
    // check if string only contains whitespace
    if (control.value != null && control.value.trim().length === 0) {
      // invalid, return error object
      return { notOnlyWhitespace: true };
    } else {
      // valid, return null
      return null;
    }
  }

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: FormControl): { [key: string]: any } => {
      if (!control.value) {
        // if the control value is empty return no error.
        return null;
      }

      // test the value of the control against the regexp supplied.
      const valid = regex.test(control.value);

      // if true, return no error, otherwise return the error object passed in the second parameter.
      return valid ? null : error;
    };
  }

  static MatchValidator(control: FormControl) {
    const password: string = control.get('password').value; // get password from our password form control
    const confirmPassword: string = control.get('confirmPassword').value; // get password from our confirmPassword form control

    // if the confirmPassword value is null or empty, don't return an error.
    if (!confirmPassword?.length) {
      return null;
    }

    // if the confirmPassword length is < 8, set the minLength error.
    if (confirmPassword.length < 8) {
      control.get('confirmPassword').setErrors({ minLength: true });
    } else {
      // compare the passwords and see if they match.
      if (password !== confirmPassword) {
        control.get('confirmPassword').setErrors({ mismatch: true });
      } else {
        // if passwords match, don't return an error.
        return null;
      }
    }
  }
}
