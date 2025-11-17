import { Routes } from '@angular/router';
import {ProductList} from './components/product-list/product-list';

export const routes: Routes = [
  {
    path: '',
    component: ProductList
  },
  {
    path: 'create',
    loadComponent: () => import('./components/product-form/product-form.component')
      .then(m => m.ProductFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/product-form/product-form.component')
      .then(m => m.ProductFormComponent)
  },
];
