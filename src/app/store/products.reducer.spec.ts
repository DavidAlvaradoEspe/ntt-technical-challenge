import {ProductState} from './products.model';
import {initialProductState, productsReducer} from './products.reducer';
import * as fromProducts from './index';
import {
  productListMock,
  singleProductMock,
  productStateMock,
  productStateLoadingMock,
  productStateErrorMock,
  productStateSuccessMock,
  productStateWithCurrentMock
} from '../core/services/products.mock';

describe('ProductsReducers', () => {
  let initialState: ProductState;

  beforeEach(() => {
    initialState = { ...initialProductState };
  });

  describe('Load Products', () => {
    it('should set loading to true when loadProducts', () => {
      const result = productsReducer(initialState, fromProducts.loadProducts());

      expect(result).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('should set products when loadProductsSuccess', () => {
      const result = productsReducer(
        initialState,
        fromProducts.loadProductsSuccess({
          products: {data: productListMock}
        })
      );

      expect(result).toEqual({
        currentProduct: null,
        error: null,
        successMessage: null,
        loading: false,
        products: productListMock
      });
    });

    it('should set error when loadProductsFailure', () => {
      const error = { message: 'Error loading products' };
      const result = productsReducer(
        initialState,
        fromProducts.loadProductsFailure({ error })
      );

      expect(result).toEqual({
        ...initialState,
        loading: false,
        error
      });
    });
  });

  describe('Load Single Product', () => {
    it('should set loading to true when loadSingleProduct', () => {
      const result = productsReducer(
        initialState,
        fromProducts.loadSingleProduct({ id: 'test-product-1' })
      );

      expect(result).toEqual({
        ...initialState,
        loading: true,
        currentProduct: null,
        error: null
      });
    });

    it('should set currentProduct when loadSingleProductSuccess', () => {
      const result = productsReducer(
        initialState,
        fromProducts.loadSingleProductSuccess({ product: singleProductMock })
      );

      expect(result).toEqual({
        ...initialState,
        currentProduct: singleProductMock,
        loading: false,
        error: null
      });
    });

    it('should set error when loadSingleProductFailure', () => {
      const error = { message: 'Product not found' };
      const result = productsReducer(
        productStateWithCurrentMock,
        fromProducts.loadSingleProductFailure({ error })
      );

      expect(result).toEqual({
        ...productStateWithCurrentMock,
        loading: false,
        error,
        currentProduct: null
      });
    });
  });

  describe('Clear Current Product', () => {
    it('should clear currentProduct', () => {
      const result = productsReducer(
        productStateWithCurrentMock,
        fromProducts.clearCurrentProduct()
      );

      expect(result).toEqual({
        ...productStateWithCurrentMock,
        currentProduct: null,
        error: null,
        successMessage: null
      });
    });
  });

  describe('Add Product', () => {
    it('should set loading to true when addProduct', () => {
      const result = productsReducer(
        initialState,
        fromProducts.addProduct({ product: singleProductMock })
      );

      expect(result).toEqual({
        ...initialState,
        loading: true,
        error: null,
        successMessage: null
      });
    });

    it('should add product to list when addProductSuccess', () => {
      const response = { data: singleProductMock, message: 'Producto creado' };
      const stateWithProducts = { ...initialState, products: productListMock };

      const result = productsReducer(
        stateWithProducts,
        fromProducts.addProductSuccess({ response })
      );

      expect(result.products.length).toBe(productListMock.length + 1);
      expect(result.products).toContainEqual(singleProductMock);
      expect(result.successMessage).toBe('Producto creado');
      expect(result.loading).toBe(false);
    });

    it('should set error when addProductFailure', () => {
      const error = { message: 'Error creating product' };
      const result = productsReducer(
        productStateLoadingMock,
        fromProducts.addProductFailure({ error })
      );

      expect(result).toEqual({
        ...productStateLoadingMock,
        loading: false,
        error,
        successMessage: null
      });
    });
  });

  describe('Update Product', () => {
    it('should set loading to true when updateProduct', () => {
      const result = productsReducer(
        productStateMock,
        fromProducts.updateProduct({
          id: 'test-product-1',
          product: { name: 'Updated Product', description: 'Updated', logo: 'logo.png', date_release: '2024-01-01', date_revision: '2025-01-01' }
        })
      );

      expect(result).toEqual({
        ...productStateMock,
        loading: true,
        error: null,
        successMessage: null
      });
    });

    it('should update product in list when updateProductSuccess', () => {
      const updatedProduct = { ...singleProductMock, name: 'Updated Product' };
      const response = { data: updatedProduct, message: 'Producto actualizado' };
      const stateWithProducts = { ...initialState, products: productListMock };

      const result = productsReducer(
        stateWithProducts,
        fromProducts.updateProductSuccess({ response })
      );

      expect(result.products.find(p => p.id === updatedProduct.id)).toEqual(updatedProduct);
      expect(result.currentProduct).toEqual(updatedProduct);
      expect(result.successMessage).toBe('Producto actualizado');
      expect(result.loading).toBe(false);
    });

    it('should set error when updateProductFailure', () => {
      const error = { message: 'Error updating product' };
      const result = productsReducer(
        productStateLoadingMock,
        fromProducts.updateProductFailure({ error })
      );

      expect(result).toEqual({
        ...productStateLoadingMock,
        loading: false,
        error,
        successMessage: null
      });
    });
  });

  describe('Delete Product', () => {
    it('should set loading to true when deleteProduct', () => {
      const result = productsReducer(
        productStateMock,
        fromProducts.deleteProduct({ productId: 'test-product-1' })
      );

      expect(result).toEqual({
        ...productStateMock,
        loading: true,
        error: null,
        successMessage: null
      });
    });

    it('should remove product from list when deleteProductSuccess', () => {
      const stateWithProducts = { ...initialState, products: productListMock };
      const initialLength = productListMock.length;

      const result = productsReducer(
        stateWithProducts,
        fromProducts.deleteProductSuccess({
          productId: 'test-product-1',
          message: 'Producto eliminado'
        })
      );

      expect(result.products.length).toBe(initialLength - 1);
      expect(result.products.find(p => p.id === 'test-product-1')).toBeUndefined();
      expect(result.successMessage).toBe('Producto eliminado');
      expect(result.loading).toBe(false);
    });

    it('should set error when deleteProductFailure', () => {
      const error = { message: 'Error deleting product' };
      const result = productsReducer(
        productStateLoadingMock,
        fromProducts.deleteProductFailure({ error })
      );

      expect(result).toEqual({
        ...productStateLoadingMock,
        loading: false,
        error,
        successMessage: null
      });
    });
  });

  describe('State Mocks Usage', () => {
    it('should use productStateMock correctly', () => {
      expect(productStateMock.products.length).toBe(3);
      expect(productStateMock.loading).toBe(false);
      expect(productStateMock.error).toBeNull();
    });

    it('should use productStateLoadingMock correctly', () => {
      expect(productStateLoadingMock.loading).toBe(true);
      expect(productStateLoadingMock.products.length).toBe(0);
    });

    it('should use productStateErrorMock correctly', () => {
      expect(productStateErrorMock.error).toBeTruthy();
      expect(productStateErrorMock.error.message).toBe('Error loading products');
    });

    it('should use productStateSuccessMock correctly', () => {
      expect(productStateSuccessMock.successMessage).toBe('Producto creado exitosamente');
      expect(productStateSuccessMock.products.length).toBe(3);
    });

    it('should use productStateWithCurrentMock correctly', () => {
      expect(productStateWithCurrentMock.currentProduct).toEqual(singleProductMock);
      expect(productStateWithCurrentMock.products.length).toBe(3);
    });
  });
});
