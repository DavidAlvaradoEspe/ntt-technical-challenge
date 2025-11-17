import {createReducer, on} from '@ngrx/store';
import {
  loadProducts, loadProductsSuccess, loadProductsFailure,
  loadSingleProduct, loadSingleProductSuccess, loadSingleProductFailure,
  clearCurrentProduct,
  addProduct, addProductSuccess, addProductFailure,
  updateProduct, updateProductSuccess, updateProductFailure,
  deleteProduct, deleteProductSuccess, deleteProductFailure
} from './products.actions';
import {ProductState} from './products.model';

export const initialProductState: ProductState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  successMessage: null,
};

export const productsReducer = createReducer(
  initialProductState,

  // Load Products
  on(loadProducts, state => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadProductsSuccess, (state, { products }) => ({
    ...state,
    products: products.data,
    loading: false,
    error: null,
  })),
  on(loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Single Product
  on(loadSingleProduct, state => ({
    ...state,
    loading: true,
    error: null,
    currentProduct: null,
  })),
  on(loadSingleProductSuccess, (state, { product }) => ({
    ...state,
    currentProduct: product,
    loading: false,
    error: null,
  })),
  on(loadSingleProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    currentProduct: null,
  })),

  // Clear Current Product
  on(clearCurrentProduct, state => ({
    ...state,
    currentProduct: null,
    error: null,
    successMessage: null,
  })),

  // Add Product
  on(addProduct, state => ({
    ...state,
    loading: true,
    error: null,
    successMessage: null,
  })),
  on(addProductSuccess, (state, { response }) => ({
    ...state,
    products: [...state.products, response.data],
    loading: false,
    error: null,
    successMessage: response.message,
  })),
  on(addProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    successMessage: null,
  })),

  // Update Product
  on(updateProduct, state => ({
    ...state,
    loading: true,
    error: null,
    successMessage: null,
  })),
  on(updateProductSuccess, (state, { response }) => ({
    ...state,
    products: state.products.map(p =>
      p.id === response.data.id ? response.data : p
    ),
    currentProduct: response.data,
    loading: false,
    error: null,
    successMessage: response.message,
  })),
  on(updateProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    successMessage: null,
  })),

  // Delete Product
  on(deleteProduct, state => ({
    ...state,
    loading: true,
    error: null,
    successMessage: null,
  })),
  on(deleteProductSuccess, (state, { productId, message }) => ({
    ...state,
    products: state.products.filter(p => p.id !== productId),
    loading: false,
    error: null,
    successMessage: message,
  })),
  on(deleteProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    successMessage: null,
  })),
)

