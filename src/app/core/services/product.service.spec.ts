import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import {ProductService} from './products.service';
import {environment} from '../../../environments/environment';
import {productListMock, singleProductMock} from './products.mock';

describe('ProductService', () => {
  let service: ProductService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ProductService
      ]
    });

    service = TestBed.inject(ProductService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should send GET request to correct URL', () => {
      const mockResponse = { data: productListMock };

      service.getAll().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.data.length).toBe(3);
      });

      const req = httpTestingController.expectOne(`${environment.apiBase}/bp/products`);

      expect(req.request.method).toBe('GET');

      req.flush(mockResponse);
    });
  });

  describe('getById', () => {
    it('should send GET request to correct URL with product ID', () => {
      const productId = 'test-product-1';
      const mockProduct = singleProductMock;

      service.getById(productId).subscribe(response => {
        expect(response).toEqual(mockProduct);
      });

      const req = httpTestingController.expectOne(`${environment.apiBase}/bp/products/${productId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });
  });

  describe('verifyId', () => {
    it('should send GET request to verification endpoint', () => {
      const productId = 'test-product-1';

      service.verifyId(productId).subscribe(response => {
        expect(response).toBe(true);
      });

      const req = httpTestingController.expectOne(`${environment.apiBase}/bp/products/verification/${productId}`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });
  });

  describe('create', () => {
    it('should send POST request with product data', () => {
      const newProduct = singleProductMock;
      const mockResponse = {
        data: newProduct,
        message: 'Producto creado exitosamente'
      };

      service.create(newProduct).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(`${environment.apiBase}/bp/products`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProduct);
      req.flush(mockResponse);
    });
  });

  describe('update', () => {
    it('should send PUT request with product data', () => {
      const productId = 'test-product-1';
      const updatedProduct = {
        name: 'Updated Product',
        description: 'Updated description',
        logo: 'updated-logo.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      };
      const mockResponse = {
        data: { id: productId, ...updatedProduct },
        message: 'Producto actualizado exitosamente'
      };

      service.update(productId, updatedProduct).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(`${environment.apiBase}/bp/products/${productId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedProduct);
      req.flush(mockResponse);
    });
  });

  describe('delete', () => {
    it('should send DELETE request to correct URL', () => {
      const productId = 'test-product-1';
      const mockResponse = { message: 'Producto eliminado exitosamente' };

      service.delete(productId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(`${environment.apiBase}/bp/products/${productId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });
});
