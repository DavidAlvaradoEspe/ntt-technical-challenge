import {createFeatureSelector, createSelector} from '@ngrx/store';
import {ProductState} from './products.model';

export const selectProductState = createFeatureSelector<ProductState>('products');

export const selectProducts = createSelector(
  selectProductState,
  state => state.products,
)

export const selectCurrentProduct = createSelector(
  selectProductState,
  state => state.currentProduct,
)

export const selectLoading = createSelector(
  selectProductState,
  state => state.loading,
)

export const selectError = createSelector(
  selectProductState,
  state => state.error,
)

export const selectSuccessMessage = createSelector(
  selectProductState,
  state => state.successMessage,
)

