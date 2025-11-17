import {createAction, props} from '@ngrx/store';
import {Product, CreateProductDto, UpdateProductDto} from '../core/models/product.model';
import type {ApiData, ApiDataMessage} from '../core/models/api.envelope.model';

// Load Products
export const loadProducts = createAction('[Products] Load Product');
export const loadProductsSuccess = createAction(
  '[Products] Load Product Success',
  props<{products: ApiData<Product[]>}>()
);
export const loadProductsFailure = createAction(
  '[Products] Load Product Failure',
  props<{error: any}>()
);

// Load Single Product (for editing)
export const loadSingleProduct = createAction(
  '[Products] Load Single Product',
  props<{id: string}>()
);
export const loadSingleProductSuccess = createAction(
  '[Products] Load Single Product Success',
  props<{product: Product}>()
);
export const loadSingleProductFailure = createAction(
  '[Products] Load Single Product Failure',
  props<{error: any}>()
);

// Clear Current Product
export const clearCurrentProduct = createAction(
  '[Products] Clear Current Product'
);

// Add Product
export const addProduct = createAction(
  '[Products] Add Product',
  props<{product: CreateProductDto}>()
);
export const addProductSuccess = createAction(
  '[Products] Add Product Success',
  props<{response: ApiDataMessage<Product>}>()
);
export const addProductFailure = createAction(
  '[Products] Add Product Failure',
  props<{error: any}>()
);

// Update Product
export const updateProduct = createAction(
  '[Products] Update Product',
  props<{id: string; product: UpdateProductDto}>()
);
export const updateProductSuccess = createAction(
  '[Products] Update Product Success',
  props<{response: ApiDataMessage<Product>}>()
);
export const updateProductFailure = createAction(
  '[Products] Update Product Failure',
  props<{error: any}>()
);

// Delete Product
export const deleteProduct = createAction(
  '[Products] Delete Product',
  props<{productId: string}>()
);
export const deleteProductSuccess = createAction(
  '[Products] Delete Product Success',
  props<{productId: string; message: string}>()
);
export const deleteProductFailure = createAction(
  '[Products] Delete Product Failure',
  props<{error: any}>()
);
