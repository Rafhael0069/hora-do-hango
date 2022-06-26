/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/naming-convention */
import { AbstractControl } from '@angular/forms';

export function ValidateConfirmPassword(control: AbstractControl) {
  if (!control.root.value) {
    return null;
  }
  if (control.value === control.root.value.password) {
    return null;
  } else {
    return { validConfirmPassword: true };
  }
}
