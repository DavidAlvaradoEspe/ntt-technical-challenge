import {inject} from '@angular/core';
import {ProductService} from '../../services/products.service';
import type {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {catchError, map, of, switchMap, timer} from 'rxjs';

export function uniqueIdValidator(debounceMs = 400): AsyncValidatorFn {
  const productService = inject(ProductService);

  return (control: AbstractControl) => {
    const id = control.value ? (control.value as string).trim() : '';

    if (!id) {
      return of<ValidationErrors | null>(null);
    }

    return timer(debounceMs).pipe(
      switchMap(() => productService.verifyId(id)),
      map(exists => exists ? {idNotUnique: true} : null),
      catchError(() => of<ValidationErrors | null>(null))
    );
  };
}
