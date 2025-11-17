import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ContextMenu, ContextMenuItem } from '../../shared/components/context-menu/context-menu';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import {Store} from '@ngrx/store';
import {deleteProduct, loadProducts} from '../../store';
import {selectLoading, selectProducts} from '../../store';
import {combineLatest, debounceTime, distinctUntilChanged, map, Observable, startWith, Subject, take, takeUntil} from 'rxjs';
import type {Product} from '../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ContextMenu, ConfirmDialogComponent, CommonModule, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  products$ = this.store.select(selectProducts);
  loading$ = this.store.select(selectLoading);
  searchControl = new FormControl('', { nonNullable: true });
  pageSizeControl = new FormControl(5, { nonNullable: true });
  filteredProducts$!: Observable<Product[] | undefined>;
  paginatedProducts$!: Observable<Product[] | undefined>;
  totalFilteredProducts = 0;

  @ViewChild(ContextMenu) contextMenu!: ContextMenu;

  menuItems: ContextMenuItem[] = [
    { label: 'Editar', action: 'edit' },
    { label: 'Eliminar', action: 'delete' }
  ];

  containerClass = 'product-list__table-wrapper';
  selectedProductId: string | null = null;
  selectedProductName: string = '';
  showConfirmDialog = false;
  imageErrors = new Map<string, boolean>();

  ngOnInit() {
    this.store.dispatch(loadProducts());
    this.setupSearch();
  }

  private setupSearch(): void {
    const searchTerm$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    );

    // Filter products based on search term
    this.filteredProducts$ = combineLatest([
      this.products$,
      searchTerm$
    ]).pipe(
      map(([products, searchTerm]) => {
        if (!searchTerm || searchTerm.trim() === '') {
          return products;
        }

        const term = searchTerm.toLowerCase().trim();
        return products?.filter(product =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.id.toLowerCase().includes(term)
        );
      }),
      takeUntil(this.destroy$)
    );

    // Apply pagination based on page size
    const pageSize$ = this.pageSizeControl.valueChanges.pipe(
      startWith(this.pageSizeControl.value),
      takeUntil(this.destroy$)
    );

    this.paginatedProducts$ = combineLatest([
      this.filteredProducts$,
      pageSize$
    ]).pipe(
      map(([products, pageSize]) => {
        if (!products) {
          this.totalFilteredProducts = 0;
          return products;
        }

        this.totalFilteredProducts = products.length;
        return products.slice(0, pageSize);
      }),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAddProduct() {
    void this.router.navigate(['/create']);
  }

  onActionMenuClick(event: MouseEvent, productId: string) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedProductId = productId;
    this.contextMenu.show(event);
  }

  onMenuItemSelected(action: string) {
    switch (action) {
      case 'edit':
        this.editProduct(this.selectedProductId);
        break;
      case 'delete':
        this.openDeleteConfirmation(this.selectedProductId);
        break;
    }
  }

  private editProduct(productId: string | null) {
    if (productId) {
      void this.router.navigate(['/edit', productId]);
    }
  }

  private openDeleteConfirmation(productId: string | null) {
    if (productId) {
      this.products$.pipe(take(1)).subscribe(products => {
        const product = products?.find(p => p.id === productId);
        if (product) {
          this.selectedProductName = product.name;
          this.showConfirmDialog = true;
        }
      });
    }
  }

  onConfirmDelete() {
    if (this.selectedProductId) {
      this.store.dispatch(deleteProduct({ productId: this.selectedProductId }));
    }
    this.closeConfirmDialog();
  }

  onCancelDelete() {
    this.closeConfirmDialog();
  }

  private closeConfirmDialog() {
    this.showConfirmDialog = false;
    this.selectedProductId = null;
    this.selectedProductName = '';
  }

  onImageError(productId: string) {
    this.imageErrors.set(productId, true);
  }

  hasImageError(productId: string): boolean {
    return this.imageErrors.get(productId) ?? false;
  }
}
