import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subject, takeUntil, filter} from 'rxjs';
import {dateReleaseTodayOrLater} from '../../core/helpers/validators/product.validator';
import {addProduct, updateProduct, loadSingleProduct, clearCurrentProduct} from '../../store';
import {selectError, selectLoading, selectSuccessMessage, selectCurrentProduct} from '../../store';
import {uniqueIdValidator} from '../../core/helpers/validators/unique-id.validator';
import {CreateProductDto, UpdateProductDto} from '../../core/models/product.model';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  // Store selectors
  currentProduct$ = this.store.select(selectCurrentProduct);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  successMessage$ = this.store.select(selectSuccessMessage);

  isEdit = false;

  form = this.fb.group({
    id: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
        asyncValidators: [uniqueIdValidator()],
        updateOn: 'blur'
      }
    ],
    name: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100)
    ]],
    description: ['', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(200)
    ]],
    logo: ['', [Validators.required]],
    date_release: ['', [
      Validators.required,
      dateReleaseTodayOrLater()
    ]],
    date_revision: ['', [Validators.required]],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      // Load product from store
      this.store.dispatch(loadSingleProduct({ id }));
    } else {
      this.isEdit = false;
    }

    // Listen to currentProduct changes from store
    this.currentProduct$
      .pipe(
        takeUntil(this.destroy$),
        filter(product => !!product)
      )
      .subscribe(product => {
        if (product) {
          this.form.patchValue(product);
          // Disable ID field and remove async validator when editing
          const idControl = this.form.get('id');
          idControl?.disable();
          idControl?.clearAsyncValidators();
          idControl?.updateValueAndValidity();
        }
      });

    // Auto-update date_revision when date_release changes
    this.form.get('date_release')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(v => {
        if (!v) return;
        const d = new Date(v);
        d.setFullYear(d.getFullYear() + 1);
        const iso = d.toISOString().slice(0, 10);
        this.form.get('date_revision')?.setValue(iso, {emitEvent: false});
        // Re-validate the form to update the revision validator
        this.form.updateValueAndValidity();
      });

    // Listen for success message and navigate
    this.successMessage$
      .pipe(
        takeUntil(this.destroy$),
        filter(message => !!message)
      )
      .subscribe(() => {
        void this.router.navigateByUrl('/');
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    // Clear current product from store when leaving
    this.store.dispatch(clearCurrentProduct());
  }

  onReset() {
    if (this.isEdit) {
      // Reset to current product values
      this.currentProduct$
        .pipe(takeUntil(this.destroy$))
        .subscribe(product => {
          if (product) {
            this.form.patchValue(product);
          }
        });
    } else {
      // Reset to empty form
      this.form.reset();
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    if (this.isEdit) {
      const {id, ...dto} = raw;
      if (id) {
        this.store.dispatch(updateProduct({id, product: dto as UpdateProductDto}));
      }
    } else {
      this.store.dispatch(addProduct({product: raw as CreateProductDto}));
    }
  }

  // Helper methods for template
  hasError(controlName: string, errorName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control?.hasError(errorName) && (control?.touched || control?.dirty));
  }

  getError(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors) return '';

    const errors = control.errors;

    if (errors['required']) return 'Este campo es requerido';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['idNotUnique']) return 'Este ID ya existe';
    if (errors['dateNotTodayOrLater']) return 'La fecha debe ser hoy o posterior';
    if (errors['revisionNotOneYearAfter']) return 'La fecha de revisión debe ser un año después de la fecha de liberación';

    return 'Error de validación';
  }
}

