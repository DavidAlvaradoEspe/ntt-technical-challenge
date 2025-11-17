import * as fromProducts from './index';
import {
  productStateMock,
  productStateLoadingMock,
  productStateErrorMock,
  productStateSuccessMock,
  productStateWithCurrentMock,
  productListMock,
  singleProductMock
} from '../core/services/products.mock';

describe('ProductsSelectors', () => {
  describe('selectProductState', () => {
    it('should select product state', () => {
      expect(fromProducts.selectProductState.projector(productStateMock)).toEqual(productStateMock);
    });

    it('should select loading state', () => {
      expect(fromProducts.selectProductState.projector(productStateLoadingMock)).toEqual(productStateLoadingMock);
    });

    it('should select error state', () => {
      expect(fromProducts.selectProductState.projector(productStateErrorMock)).toEqual(productStateErrorMock);
    });

    it('should select success state', () => {
      expect(fromProducts.selectProductState.projector(productStateSuccessMock)).toEqual(productStateSuccessMock);
    });

    it('should select state with current product', () => {
      expect(fromProducts.selectProductState.projector(productStateWithCurrentMock)).toEqual(productStateWithCurrentMock);
    });
  });

  describe('selectProducts', () => {
    it('should select product list from state', () => {
      expect(fromProducts.selectProducts.projector(productStateMock)).toEqual(productStateMock.products);
    });

    it('should select empty product list from loading state', () => {
      expect(fromProducts.selectProducts.projector(productStateLoadingMock)).toEqual([]);
    });

    it('should select product list from success state', () => {
      expect(fromProducts.selectProducts.projector(productStateSuccessMock)).toEqual(productListMock);
    });
  });

  describe('selectCurrentProduct', () => {
    it('should select null when no current product', () => {
      expect(fromProducts.selectCurrentProduct.projector(productStateMock)).toBeNull();
    });

    it('should select current product when available', () => {
      expect(fromProducts.selectCurrentProduct.projector(productStateWithCurrentMock)).toEqual(singleProductMock);
    });
  });

  describe('selectLoading', () => {
    it('should select loading false from normal state', () => {
      expect(fromProducts.selectLoading.projector(productStateMock)).toBe(false);
    });

    it('should select loading true from loading state', () => {
      expect(fromProducts.selectLoading.projector(productStateLoadingMock)).toBe(true);
    });
  });

  describe('selectError', () => {
    it('should select null error from normal state', () => {
      expect(fromProducts.selectError.projector(productStateMock)).toBeNull();
    });

    it('should select error from error state', () => {
      expect(fromProducts.selectError.projector(productStateErrorMock)).toEqual({ message: 'Error loading products' });
    });
  });

  describe('selectSuccessMessage', () => {
    it('should select null message from normal state', () => {
      expect(fromProducts.selectSuccessMessage.projector(productStateMock)).toBeNull();
    });

    it('should select success message from success state', () => {
      expect(fromProducts.selectSuccessMessage.projector(productStateSuccessMock)).toBe('Producto creado exitosamente');
    });
  });
});
