import {Product} from '../core/models/product.model';

export interface ProductState {
  products: Product[],
  currentProduct: Product | null,
  loading: boolean,
  error: any | null,
  successMessage: string | null,
}
