import {ProductEffects} from './products.effects';
import {ProductService} from '../core/services/products.service';
import {productListMock, singleProductMock} from '../core/services/products.mock';
import * as fromProducts from './index';
import {of, ReplaySubject, take, throwError} from 'rxjs';
import {Action} from '@ngrx/store';
import {TestBed, waitForAsync} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {provideMockStore} from '@ngrx/store/testing';
import {initialProductState} from './products.reducer';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('ProductEffects', () => {
  let effect: ProductEffects;
  let action$: ReplaySubject<Action>;
  let productsService: ProductService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductEffects,
        provideMockActions(() => action$),
        provideMockStore({
          initialState: initialProductState
        }),
        {
          provide: ProductService,
          useValue: {
            getAll: jest.fn(() => of({data: productListMock})),
            getById: jest.fn(() => of(singleProductMock)),
            create: jest.fn(() => of({data: singleProductMock, message: 'Producto creado'})),
            update: jest.fn(() => of({data: singleProductMock, message: 'Producto actualizado'})),
            delete: jest.fn(() => of({message: 'Producto eliminado'}))
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    effect = TestBed.inject(ProductEffects);
    productsService = TestBed.inject(ProductService);
    action$ = new ReplaySubject(1);
  }));

  it('should be created', () => {
    expect(effect).toBeTruthy();
  });

  describe('loadProducts$', () => {
    it('should return loadProductsSuccess on success', async () => {
      const spy = jest.spyOn(productsService, 'getAll');

      action$.next(fromProducts.loadProducts());

      const result = await new Promise((resolve) =>
        effect.loadProducts$.pipe(take(1)).subscribe(resolve)
      );

      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(
        fromProducts.loadProductsSuccess({
          products: {data: productListMock}
        })
      );
    });

    it('should return loadProductsFailure on error', async () => {
      const error = new Error('Network error');
      jest.spyOn(productsService, 'getAll').mockReturnValue(throwError(() => error));

      action$.next(fromProducts.loadProducts());

      const result = await new Promise((resolve) =>
        effect.loadProducts$.pipe(take(1)).subscribe(resolve)
      );

      expect(result).toEqual(
        fromProducts.loadProductsFailure({ error })
      );
    });
  });

  describe('loadSingleProduct$', () => {
    it('should return loadSingleProductSuccess on success', async () => {
      const spy = jest.spyOn(productsService, 'getById');

      action$.next(fromProducts.loadSingleProduct({ id: 'test-product-1' }));

      const result = await new Promise((resolve) =>
        effect.loadSingleProduct$.pipe(take(1)).subscribe(resolve)
      );

      expect(spy).toHaveBeenCalledWith('test-product-1');
      expect(result).toEqual(
        fromProducts.loadSingleProductSuccess({ product: singleProductMock })
      );
    });

    it('should return loadSingleProductFailure on error', async () => {
      const error = new Error('Product not found');
      jest.spyOn(productsService, 'getById').mockReturnValue(throwError(() => error));

      action$.next(fromProducts.loadSingleProduct({ id: 'invalid-id' }));

      const result = await new Promise((resolve) =>
        effect.loadSingleProduct$.pipe(take(1)).subscribe(resolve)
      );

      expect(result).toEqual(
        fromProducts.loadSingleProductFailure({ error })
      );
    });
  });

  describe('addProduct$', () => {
    it('should return addProductSuccess on success', async () => {
      const spy = jest.spyOn(productsService, 'create');

      action$.next(fromProducts.addProduct({ product: singleProductMock }));

      const result = await new Promise((resolve) =>
        effect.addProduct$.pipe(take(1)).subscribe(resolve)
      );

      expect(spy).toHaveBeenCalledWith(singleProductMock);
      expect(result).toEqual(
        fromProducts.addProductSuccess({
          response: {data: singleProductMock, message: 'Producto creado'}
        })
      );
    });

    it('should return addProductFailure on error', async () => {
      const error = new Error('Error creating product');
      jest.spyOn(productsService, 'create').mockReturnValue(throwError(() => error));

      action$.next(fromProducts.addProduct({ product: singleProductMock }));

      const result = await new Promise((resolve) =>
        effect.addProduct$.pipe(take(1)).subscribe(resolve)
      );

      expect(result).toEqual(
        fromProducts.addProductFailure({ error })
      );
    });
  });

  describe('updateProduct$', () => {
    it('should return updateProductSuccess on success', async () => {
      const spy = jest.spyOn(productsService, 'update');
      const updateData = {
        name: 'Updated',
        description: 'Updated desc',
        logo: 'logo.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      };

      action$.next(fromProducts.updateProduct({ id: 'test-product-1', product: updateData }));

      const result = await new Promise((resolve) =>
        effect.updateProduct$.pipe(take(1)).subscribe(resolve)
      );

      expect(spy).toHaveBeenCalledWith('test-product-1', updateData);
      expect(result).toEqual(
        fromProducts.updateProductSuccess({
          response: {data: singleProductMock, message: 'Producto actualizado'}
        })
      );
    });

    it('should return updateProductFailure on error', async () => {
      const error = new Error('Error updating product');
      jest.spyOn(productsService, 'update').mockReturnValue(throwError(() => error));

      action$.next(fromProducts.updateProduct({
        id: 'test-product-1',
        product: { name: 'Test', description: 'Test', logo: 'test.png', date_release: '2024-01-01', date_revision: '2025-01-01' }
      }));

      const result = await new Promise((resolve) =>
        effect.updateProduct$.pipe(take(1)).subscribe(resolve)
      );

      expect(result).toEqual(
        fromProducts.updateProductFailure({ error })
      );
    });
  });

  describe('deleteProduct$', () => {
    it('should return deleteProductSuccess on success', async () => {
      const spy = jest.spyOn(productsService, 'delete');

      action$.next(fromProducts.deleteProduct({ productId: 'test-product-1' }));

      const result = await new Promise((resolve) =>
        effect.deleteProduct$.pipe(take(1)).subscribe(resolve)
      );

      expect(spy).toHaveBeenCalledWith('test-product-1');
      expect(result).toEqual(
        fromProducts.deleteProductSuccess({
          productId: 'test-product-1',
          message: 'Producto eliminado'
        })
      );
    });

    it('should return deleteProductFailure on error', async () => {
      const error = new Error('Error deleting product');
      jest.spyOn(productsService, 'delete').mockReturnValue(throwError(() => error));

      action$.next(fromProducts.deleteProduct({ productId: 'test-product-1' }));

      const result = await new Promise((resolve) =>
        effect.deleteProduct$.pipe(take(1)).subscribe(resolve)
      );

      expect(result).toEqual(
        fromProducts.deleteProductFailure({ error })
      );
    });
  });
});
