import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {ProductService} from '../core/services/products.service';
import {
  loadProducts, loadProductsFailure, loadProductsSuccess,
  loadSingleProduct, loadSingleProductSuccess, loadSingleProductFailure,
  addProduct, addProductSuccess, addProductFailure,
  updateProduct, updateProductSuccess, updateProductFailure,
  deleteProduct, deleteProductSuccess, deleteProductFailure
} from './products.actions';
import {catchError, concatMap, delay, map, of, switchMap} from 'rxjs';

@Injectable()
export class ProductEffects {

  actions$= inject(Actions);

  constructor(private productService: ProductService) {}

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProducts),
      switchMap(() =>
        this.productService.getAll().pipe(
          delay(1000), // simulate network delay
          map((products) => loadProductsSuccess({ products })),
          catchError((error) => of(loadProductsFailure({ error })))
        )
      )
    )
  );


  loadSingleProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSingleProduct),
      switchMap(({ id }) =>
        this.productService.getById(id).pipe(
          map((product) => loadSingleProductSuccess({ product })),
          catchError((error) => of(loadSingleProductFailure({ error })))
        )
      )
    )
  );


  addProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProduct),
      concatMap(({ product }) =>
        this.productService.create(product).pipe(
          map((response) => addProductSuccess({ response })),
          catchError((error) => of(addProductFailure({ error })))
        )
      )
    )
  );


  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateProduct),
      concatMap(({ id, product }) =>
        this.productService.update(id, product).pipe(
          map((response) => updateProductSuccess({ response })),
          catchError((error) => of(updateProductFailure({ error })))
        )
      )
    )
  );


  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteProduct),
      concatMap(({ productId }) =>
        this.productService.delete(productId).pipe(
          map(({ message }) => deleteProductSuccess({ productId, message })),
          catchError((error) => of(deleteProductFailure({ error })))
        )
      )
    )
  );
}
