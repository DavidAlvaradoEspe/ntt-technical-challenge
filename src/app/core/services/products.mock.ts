import {Product} from '../models/product.model';
import {ProductState} from '../../store/products.model';

export const productListMock: Product[] = [
  {
    id: 'test-product-1',
    name: 'Tarjeta de Crédito Premium',
    description: 'Tarjeta de crédito con beneficios exclusivos y cashback',
    logo: 'assets-1.png',
    date_release: '2024-01-15',
    date_revision: '2025-01-15'
  },
  {
    id: 'test-product-2',
    name: 'Cuenta de Ahorros Digital',
    description: 'Cuenta de ahorros sin comisiones con app móvil',
    logo: 'assets-2.png',
    date_release: '2024-03-20',
    date_revision: '2025-03-20'
  },
  {
    id: 'test-product-3',
    name: 'Préstamo Personal',
    description: 'Préstamo personal con tasas preferenciales',
    logo: 'assets-3.png',
    date_release: '2024-06-10',
    date_revision: '2025-06-10'
  }
];

export const singleProductMock: Product = {
  id: 'test-product-1',
  name: 'Tarjeta de Crédito Premium',
  description: 'Tarjeta de crédito con beneficios exclusivos y cashback',
  logo: 'assets-1.png',
  date_release: '2024-01-15',
  date_revision: '2025-01-15'
};

export const productStateMock: ProductState = {
  products: productListMock,
  currentProduct: null,
  loading: false,
  error: null,
  successMessage: null
};

export const productStateWithCurrentMock: ProductState = {
  products: productListMock,
  currentProduct: singleProductMock,
  loading: false,
  error: null,
  successMessage: null
};

export const productStateLoadingMock: ProductState = {
  products: [],
  currentProduct: null,
  loading: true,
  error: null,
  successMessage: null
};

export const productStateErrorMock: ProductState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: { message: 'Error loading products' },
  successMessage: null
};

export const productStateSuccessMock: ProductState = {
  products: productListMock,
  currentProduct: null,
  loading: false,
  error: null,
  successMessage: 'Producto creado exitosamente'
};


