import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {ActivatedRoute, provideRouter, Router} from '@angular/router';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {initialProductState} from '../../store/products.reducer';
import {singleProductMock} from '../../core/services/products.mock';
import {addProduct, clearCurrentProduct, loadSingleProduct, updateProduct} from '../../store';
import {selectCurrentProduct, selectError, selectLoading, selectSuccessMessage} from '../../store';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([]),
        provideMockStore({
          initialState: {
            products: initialProductState
          }
        })
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    // Setup default selectors
    store.overrideSelector(selectCurrentProduct, null);
    store.overrideSelector(selectLoading, false);
    store.overrideSelector(selectError, null);
    store.overrideSelector(selectSuccessMessage, null);

    fixture.detectChanges();
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with empty values for create mode', () => {
      expect(component.form.get('id')?.value).toBe('');
      expect(component.form.get('name')?.value).toBe('');
      expect(component.form.get('description')?.value).toBe('');
      expect(component.form.get('logo')?.value).toBe('');
      expect(component.isEdit).toBe(false);
    });

    it('should have all form controls', () => {
      expect(component.form.get('id')).toBeTruthy();
      expect(component.form.get('name')).toBeTruthy();
      expect(component.form.get('description')).toBeTruthy();
      expect(component.form.get('logo')).toBeTruthy();
      expect(component.form.get('date_release')).toBeTruthy();
      expect(component.form.get('date_revision')).toBeTruthy();
    });

    it('should set isEdit to true when route has id parameter', () => {
      const activatedRoute = TestBed.inject(ActivatedRoute);
      jest.spyOn(activatedRoute.snapshot.paramMap, 'get').mockReturnValue('test-product-1');

      component.ngOnInit();

      expect(component.isEdit).toBe(true);
    });

    it('should dispatch loadSingleProduct when in edit mode', () => {
      const activatedRoute = TestBed.inject(ActivatedRoute);
      jest.spyOn(activatedRoute.snapshot.paramMap, 'get').mockReturnValue('test-product-1');
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.ngOnInit();

      expect(dispatchSpy).toHaveBeenCalledWith(loadSingleProduct({ id: 'test-product-1' }));
    });

    it('should patch form values when currentProduct is available', () => {
      store.overrideSelector(selectCurrentProduct, singleProductMock);
      store.refreshState();

      component.ngOnInit();

      expect(component.form.get('id')?.value).toBe(singleProductMock.id);
      expect(component.form.get('name')?.value).toBe(singleProductMock.name);
      expect(component.form.get('description')?.value).toBe(singleProductMock.description);
    });

    it('should disable id field when in edit mode', () => {
      store.overrideSelector(selectCurrentProduct, singleProductMock);
      store.refreshState();

      component.ngOnInit();

      expect(component.form.get('id')?.disabled).toBe(true);
    });
  });

  describe('Form Validations', () => {
    it('should mark id as required', () => {
      const idControl = component.form.get('id');
      idControl?.setValue('');
      idControl?.markAsTouched();

      expect(idControl?.hasError('required')).toBe(true);
    });

    it('should validate id minlength', () => {
      const idControl = component.form.get('id');
      idControl?.setValue('ab');

      expect(idControl?.hasError('minlength')).toBe(true);
    });

    it('should validate id maxlength', () => {
      const idControl = component.form.get('id');
      idControl?.setValue('12345678901');

      expect(idControl?.hasError('maxlength')).toBe(true);
    });

    it('should mark name as required', () => {
      const nameControl = component.form.get('name');
      nameControl?.setValue('');
      nameControl?.markAsTouched();

      expect(nameControl?.hasError('required')).toBe(true);
    });

    it('should validate name minlength', () => {
      const nameControl = component.form.get('name');
      nameControl?.setValue('Test');

      expect(nameControl?.hasError('minlength')).toBe(true);
    });

    it('should mark description as required', () => {
      const descControl = component.form.get('description');
      descControl?.setValue('');
      descControl?.markAsTouched();

      expect(descControl?.hasError('required')).toBe(true);
    });

    it('should validate description minlength', () => {
      const descControl = component.form.get('description');
      descControl?.setValue('Short');

      expect(descControl?.hasError('minlength')).toBe(true);
    });

    it('should mark logo as required', () => {
      const logoControl = component.form.get('logo');
      logoControl?.setValue('');
      logoControl?.markAsTouched();

      expect(logoControl?.hasError('required')).toBe(true);
    });

    it('should mark date_release as required', () => {
      const dateControl = component.form.get('date_release');
      dateControl?.setValue('');
      dateControl?.markAsTouched();

      expect(dateControl?.hasError('required')).toBe(true);
    });
  });

  describe('Date Auto-calculation', () => {
    it('should automatically set date_revision to one year after date_release', () => {
      const dateReleaseControl = component.form.get('date_release');
      const dateRevisionControl = component.form.get('date_revision');

      dateReleaseControl?.setValue('2024-01-15');

      expect(dateRevisionControl?.value).toBe('2025-01-15');
    });

    it('should update date_revision when date_release changes', () => {
      const dateReleaseControl = component.form.get('date_release');
      const dateRevisionControl = component.form.get('date_revision');

      dateReleaseControl?.setValue('2024-06-10');
      expect(dateRevisionControl?.value).toBe('2025-06-10');

      dateReleaseControl?.setValue('2024-12-25');
      expect(dateRevisionControl?.value).toBe('2025-12-25');
    });
  });

  describe('onSubmit', () => {
    it('should not submit if form is invalid', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.form.reset();

      component.onSubmit();

      expect(dispatchSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: '[Products] Add Product' })
      );
    });

    it('should mark all fields as touched when form is invalid', () => {
      component.form.reset();

      component.onSubmit();

      expect(component.form.get('id')?.touched).toBe(true);
      expect(component.form.get('name')?.touched).toBe(true);
      expect(component.form.get('description')?.touched).toBe(true);
    });

    it('should dispatch addProduct action in create mode', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.isEdit = false;

      component.form.patchValue({
        id: 'test-id',
        name: 'Test Product Name',
        description: 'Test product description that is long enough',
        logo: 'test-logo.png',
        date_release: '2024-01-15',
        date_revision: '2025-01-15'
      });

      component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        addProduct({
          product: expect.objectContaining({
            id: 'test-id',
            name: 'Test Product Name'
          })
        })
      );
    });

    it('should dispatch updateProduct action in edit mode', (done) => {
      const activatedRoute = TestBed.inject(ActivatedRoute);
      jest.spyOn(activatedRoute.snapshot.paramMap, 'get').mockReturnValue('test-product-1');

      // Create product with future date
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateStr = futureDate.toISOString().split('T')[0];

      const futureProduct = {
        ...singleProductMock,
        date_release: futureDateStr,
        date_revision: new Date(futureDate.setFullYear(futureDate.getFullYear() + 1)).toISOString().split('T')[0]
      };

      // Set mock product with future dates
      store.overrideSelector(selectCurrentProduct, futureProduct);
      store.refreshState();

      // Re-create component for clean state
      fixture = TestBed.createComponent(ProductFormComponent);
      component = fixture.componentInstance;

      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.ngOnInit();
      fixture.detectChanges();

      // Wait for async subscriptions
      setTimeout(() => {
        dispatchSpy.mockClear();

        // Verify form is populated
        expect(component.isEdit).toBe(true);
        expect(component.form.get('id')?.value).toBe('test-product-1');

        // Update values
        component.form.get('name')?.setValue('Updated Product Name');
        component.form.get('description')?.setValue('Updated product description that is long enough');

        component.onSubmit();

        expect(dispatchSpy).toHaveBeenCalledWith(
          updateProduct({
            id: 'test-product-1',
            product: expect.objectContaining({
              name: 'Updated Product Name'
            })
          })
        );

        done();
      }, 100);
    });
  });

  describe('onReset', () => {
    it('should reset form to empty values in create mode', () => {
      component.isEdit = false;
      component.form.patchValue({
        id: 'test-id',
        name: 'Test Name',
        description: 'Test Description'
      });

      component.onReset();

      expect(component.form.get('id')?.value).toBe('');
      expect(component.form.get('name')?.value).toBe('');
      expect(component.form.get('description')?.value).toBe('');
    });

    it('should reset form to current product values in edit mode', () => {
      component.isEdit = true;
      store.overrideSelector(selectCurrentProduct, singleProductMock);
      store.refreshState();

      component.form.patchValue({
        name: 'Changed Name'
      });

      component.onReset();

      // Wait for async subscription
      fixture.detectChanges();

      expect(component.form.get('name')?.value).toBe(singleProductMock.name);
    });
  });

  describe('Helper Methods', () => {
    it('hasError should return true when control has error and is touched', () => {
      const idControl = component.form.get('id');
      idControl?.setValue('');
      idControl?.markAsTouched();

      expect(component.hasError('id', 'required')).toBe(true);
    });

    it('hasError should return false when control has no error', () => {
      const idControl = component.form.get('id');
      idControl?.setValue('valid-id');
      idControl?.markAsTouched();

      expect(component.hasError('id', 'required')).toBe(false);
    });

    it('hasError should return false when control is not touched', () => {
      const idControl = component.form.get('id');
      idControl?.setValue('');

      expect(component.hasError('id', 'required')).toBe(false);
    });

    it('getError should return correct message for required error', () => {
      const idControl = component.form.get('id');
      idControl?.setValue('');
      idControl?.markAsTouched();

      expect(component.getError('id')).toBe('Este campo es requerido');
    });

    it('getError should return correct message for minlength error', () => {
      const idControl = component.form.get('id');
      idControl?.setValue('ab');

      expect(component.getError('id')).toBe('Mínimo 3 caracteres');
    });

    it('getError should return correct message for maxlength error', () => {
      const idControl = component.form.get('id');
      idControl?.setValue('12345678901');

      expect(component.getError('id')).toBe('Máximo 10 caracteres');
    });

    it('getError should return empty string when no errors', () => {
      const idControl = component.form.get('id');
      idControl?.setValue('valid-id');

      expect(component.getError('id')).toBe('');
    });
  });

  describe('Navigation', () => {
    it('should navigate to home when success message is received', (done) => {
      const navigateSpy = jest.spyOn(router, 'navigateByUrl');

      component.ngOnInit();

      store.overrideSelector(selectSuccessMessage, 'Producto creado exitosamente');
      store.refreshState();

      setTimeout(() => {
        expect(navigateSpy).toHaveBeenCalledWith('/');
        done();
      }, 100);
    });
  });

  describe('Cleanup', () => {
    it('should dispatch clearCurrentProduct on destroy', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.ngOnDestroy();

      expect(dispatchSpy).toHaveBeenCalledWith(clearCurrentProduct());
    });

    it('should complete destroy$ subject', () => {
      const destroySpy = jest.spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
    });
  });
});
