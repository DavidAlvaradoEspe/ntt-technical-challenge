import type {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function dateReleaseTodayOrLater(): ValidatorFn {
  return (c:AbstractControl): ValidationErrors | null => {
    const v = c.value ? new Date(c.value as string) : null;
    if(!v) {return null;}
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    v.setHours(0, 0, 0, 0);
    return v >= today ? null : {dateNotTodayOrLater: true}
  }
}
