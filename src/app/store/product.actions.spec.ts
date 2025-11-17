import { productListMock, singleProductMock } from '../core/services/products.mock';
import * as fromProducts from './index';

describe('ProductsActions', () => {
  describe('LoadProducts', () => {
    it('should create an action to load products', () => {
      const expectedAction = {
        type: fromProducts.loadProducts.type
      };
      const action = fromProducts.loadProducts();
      expect(action).toEqual(expectedAction);
    });
  });

  describe('LoadProductsSuccess', () => {
    it('should create an action for load products success', () => {
      const expectedAction = {
        type: fromProducts.loadProductsSuccess.type,
        products: {data: productListMock}
      };
      const action = fromProducts.loadProductsSuccess({
        products: {data: productListMock}
      });
      expect(action).toEqual(expectedAction);
    });
  });

  describe('LoadProductsFailure', () => {
    it('should create an action for load products failure', () => {
      const error = { message: 'Error loading products' };
      const expectedAction = {
        type: fromProducts.loadProductsFailure.type,
        error
      };
      const action = fromProducts.loadProductsFailure({ error });
      expect(action).toEqual(expectedAction);
    });
  });

  describe('LoadSingleProduct', () => {
    it('should create an action to load single product', () => {
      const id = 'test-product-1';
      const expectedAction = {
        type: fromProducts.loadSingleProduct.type,
        id
      };
      const action = fromProducts.loadSingleProduct({ id });
      expect(action).toEqual(expectedAction);
    });
  });

  describe('LoadSingleProductSuccess', () => {
    it('should create an action for load single product success', () => {
      const expectedAction = {
        type: fromProducts.loadSingleProductSuccess.type,
        product: singleProductMock
      };
      const action = fromProducts.loadSingleProductSuccess({ product: singleProductMock });
      expect(action).toEqual(expectedAction);
    });
  });

  describe('ClearCurrentProduct', () => {
    it('should create an action to clear current product', () => {
      const expectedAction = {
        type: fromProducts.clearCurrentProduct.type
      };
      const action = fromProducts.clearCurrentProduct();
      expect(action).toEqual(expectedAction);
    });
  });

  describe('AddProduct', () => {
    it('should create an action to add product', () => {
      const expectedAction = {
        type: fromProducts.addProduct.type,
        product: singleProductMock
      };
      const action = fromProducts.addProduct({ product: singleProductMock });
      expect(action).toEqual(expectedAction);
    });
  });

  describe('AddProductSuccess', () => {
    it('should create an action for add product success', () => {
      const response = { data: singleProductMock, message: 'Producto creado' };
      const expectedAction = {
        type: fromProducts.addProductSuccess.type,
        response
      };
      const action = fromProducts.addProductSuccess({ response });
      expect(action).toEqual(expectedAction);
    });
  });

  describe('DeleteProduct', () => {
    it('should create an action to delete product', () => {
      const productId = 'test-product-1';
      const expectedAction = {
        type: fromProducts.deleteProduct.type,
        productId
      };
      const action = fromProducts.deleteProduct({ productId });
      expect(action).toEqual(expectedAction);
    });
  });

  describe('DeleteProductSuccess', () => {
    it('should create an action for delete product success', () => {
      const productId = 'test-product-1';
      const message = 'Producto eliminado exitosamente';
      const expectedAction = {
        type: fromProducts.deleteProductSuccess.type,
        productId,
        message
      };
      const action = fromProducts.deleteProductSuccess({ productId, message });
      expect(action).toEqual(expectedAction);
    });
  });
});
