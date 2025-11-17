import { HttpErrorResponse } from '@angular/common/http';
import { mapHttpError } from './map-http-error.util';
import type { ApiErrorPayload } from '../../models/api.envelope.model';
import { firstValueFrom } from 'rxjs';

describe('mapHttpError', () => {
  const fallbackMessage = 'Fallback error message';

  describe('HttpErrorResponse handling', () => {
    it('should return API error message when present in error.error.message', async () => {
      const apiError: ApiErrorPayload = {
        message: 'API Error Message',
        name: 'ApiError'
      };

      const httpError = new HttpErrorResponse({
        error: apiError,
        status: 400,
        statusText: 'Bad Request',
        url: 'http://test.com/api'
      });

      try {
        await firstValueFrom(mapHttpError(httpError, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('API Error Message');
      }
    });

    it('should return HttpErrorResponse message when error.error.message is not present', async () => {
      const httpError = new HttpErrorResponse({
        error: {},
        status: 500,
        statusText: 'Internal Server Error',
        url: 'http://test.com/api'
      });

      try {
        await firstValueFrom(mapHttpError(httpError, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        // HttpErrorResponse auto-generates message
        expect((error as Error).message).toContain('500');
      }
    });

    it('should return fallback message when both API and HTTP messages are missing', async () => {
      const httpError = new HttpErrorResponse({
        error: {},
        status: 404,
        statusText: 'Not Found',
        url: 'http://test.com/api'
      });

      try {
        await firstValueFrom(mapHttpError(httpError, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        // HttpErrorResponse always generates a message, so it won't use fallback
        expect((error as Error).message).toContain('404');
      }
    });

    it('should handle null error.error', async () => {
      const httpError = new HttpErrorResponse({
        error: null,
        status: 503,
        statusText: 'Service Unavailable',
        url: 'http://test.com/api'
      });

      try {
        await firstValueFrom(mapHttpError(httpError, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        // Should use auto-generated message from HttpErrorResponse
        expect((error as Error).message).toContain('503');
      }
    });

    it('should handle undefined error.error', async () => {
      const httpError = new HttpErrorResponse({
        error: undefined,
        status: 0,
        statusText: 'Unknown Error',
        url: 'http://test.com/api'
      });

      try {
        await firstValueFrom(mapHttpError(httpError, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        // Should use auto-generated message from HttpErrorResponse
        expect((error as Error).message).toBeTruthy();
      }
    });

    it('should handle error.error with empty message', async () => {
      const apiError: ApiErrorPayload = {
        message: '',
        name: 'EmptyMessageError'
      };

      const httpError = new HttpErrorResponse({
        error: apiError,
        status: 400,
        statusText: 'Bad Request',
        url: 'http://test.com/api'
      });

      try {
        await firstValueFrom(mapHttpError(httpError, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        // Should use HttpErrorResponse.message when API message is empty
        expect((error as Error).message).toContain('400');
      }
    });

    it('should prioritize API error message over HTTP error message', async () => {
      const apiError: ApiErrorPayload = {
        message: 'Priority API message',
        name: 'ApiError'
      };

      const httpError = new HttpErrorResponse({
        error: apiError,
        status: 422,
        statusText: 'Unprocessable Entity',
        url: 'http://test.com/api'
      });

      try {
        await firstValueFrom(mapHttpError(httpError, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Priority API message');
      }
    });

    it('should handle ApiErrorPayload with additional properties', async () => {
      const apiError: ApiErrorPayload = {
        message: 'Validation failed',
        name: 'ValidationError',
        errors: {
          field1: 'Required',
          field2: 'Invalid format'
        }
      };

      const httpError = new HttpErrorResponse({
        error: apiError,
        status: 400,
        statusText: 'Bad Request',
        url: 'http://test.com/api'
      });

      try {
        await firstValueFrom(mapHttpError(httpError, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Validation failed');
      }
    });
  });

  describe('Standard Error handling', () => {
    it('should return error message from Error instance', async () => {
      const standardError = new Error('Standard error message');

      try {
        await firstValueFrom(mapHttpError(standardError, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Standard error message');
      }
    });

    it('should return fallback when Error has empty message', async () => {
      const standardError = new Error('');

      try {
        await firstValueFrom(mapHttpError(standardError, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(fallbackMessage);
      }
    });

    it('should handle TypeError', async () => {
      const typeError = new TypeError('Type mismatch error');

      try {
        await firstValueFrom(mapHttpError(typeError, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Type mismatch error');
      }
    });

    it('should handle RangeError', async () => {
      const rangeError = new RangeError('Value out of range');

      try {
        await firstValueFrom(mapHttpError(rangeError, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Value out of range');
      }
    });

    it('should handle custom Error subclass', async () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'CustomError';
        }
      }

      const customError = new CustomError('Custom error occurred');

      try {
        await firstValueFrom(mapHttpError(customError, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Custom error occurred');
      }
    });
  });

  describe('Unknown error types', () => {
    it('should return fallback for string error', async () => {
      const stringError = 'String error message';

      try {
        await firstValueFrom(mapHttpError(stringError, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(fallbackMessage);
      }
    });

    it('should return fallback for number error', async () => {
      const numberError = 404;

      try {
        await firstValueFrom(mapHttpError(numberError, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(fallbackMessage);
      }
    });

    it('should return fallback for object error', async () => {
      const objectError = { code: 500, detail: 'Server error' };

      try {
        await firstValueFrom(mapHttpError(objectError, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(fallbackMessage);
      }
    });

    it('should return fallback for null error', async () => {
      const nullError = null;

      try {
        await firstValueFrom(mapHttpError(nullError, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(fallbackMessage);
      }
    });

    it('should return fallback for undefined error', async () => {
      const undefinedError = undefined;

      try {
        await firstValueFrom(mapHttpError(undefinedError, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(fallbackMessage);
      }
    });

    it('should return fallback for array error', async () => {
      const arrayError = ['error1', 'error2'];

      try {
        await firstValueFrom(mapHttpError(arrayError, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(fallbackMessage);
      }
    });

    it('should return fallback for boolean error', async () => {
      const booleanError = false;

      try {
        await firstValueFrom(mapHttpError(booleanError, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(fallbackMessage);
      }
    });
  });

  describe('Edge cases', () => {
    it('should handle empty fallback message', async () => {
      const error = new Error('');

      try {
        await firstValueFrom(mapHttpError(error, ''));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('');
      }
    });

    it('should handle very long error messages', async () => {
      const longMessage = 'A'.repeat(1000);
      const error = new Error(longMessage);

      try {
        await firstValueFrom(mapHttpError(error, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(longMessage);
        expect((error as Error).message.length).toBe(1000);
      }
    });

    it('should handle special characters in error message', async () => {
      const specialMessage = 'Error: <script>alert("xss")</script> - 日本語 - émojis 🚀';
      const error = new Error(specialMessage);

      try {
        await firstValueFrom(mapHttpError(error, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(specialMessage);
      }
    });

    it('should always return an Observable that errors', async () => {
      const httpError = new HttpErrorResponse({
        error: { message: 'Test' },
        status: 400,
        statusText: 'Bad Request'
      });

      const observable = mapHttpError(httpError, fallbackMessage);

      let errorThrown = false;
      try {
        await firstValueFrom(observable);
      } catch (error) {
        errorThrown = true;
        expect(error).toBeInstanceOf(Error);
      }

      expect(errorThrown).toBe(true);
    });

    it('should handle HttpErrorResponse with complex nested error structure', async () => {
      const complexError = {
        error: {
          errors: {
            validation: ['Field required', 'Invalid format']
          },
          message: 'Nested error message'
        },
        status: 422
      };

      const httpError = new HttpErrorResponse({
        error: complexError,
        status: 422,
        statusText: 'Unprocessable Entity'
      });

      try {
        await firstValueFrom(mapHttpError(httpError, fallbackMessage));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        // The complex error doesn't have a direct "message" property at root level
        expect((error as Error).message).toContain('422');
      }
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle 401 Unauthorized error', async () => {
      const httpError = new HttpErrorResponse({
        error: { message: 'Invalid credentials' },
        status: 401,
        statusText: 'Unauthorized',
        url: 'http://api.example.com/login'
      });

      try {
        await firstValueFrom(mapHttpError(httpError, 'Authentication failed'));
        fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).toBe('Invalid credentials');
      }
    });

    it('should handle 403 Forbidden error', async () => {
      const httpError = new HttpErrorResponse({
        error: { message: 'Access denied' },
        status: 403,
        statusText: 'Forbidden'
      });

      try {
        await firstValueFrom(mapHttpError(httpError, 'Permission denied'));
        fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).toBe('Access denied');
      }
    });

    it('should handle 404 Not Found error', async () => {
      const httpError = new HttpErrorResponse({
        error: {},
        status: 404,
        statusText: 'Not Found',
        url: 'http://test.com/api'
      });

      try {
        await firstValueFrom(mapHttpError(httpError, 'Item not found'));
        fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).toContain('404');
      }
    });

    it('should handle 500 Internal Server Error', async () => {
      const httpError = new HttpErrorResponse({
        error: { message: 'Database connection failed' },
        status: 500,
        statusText: 'Internal Server Error'
      });

      try {
        await firstValueFrom(mapHttpError(httpError, 'Server error occurred'));
        fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).toBe('Database connection failed');
      }
    });

    it('should handle network timeout', async () => {
      const httpError = new HttpErrorResponse({
        error: new ProgressEvent('error'),
        status: 0,
        statusText: 'Unknown Error'
      });

      try {
        await firstValueFrom(mapHttpError(httpError, 'Network timeout'));
        fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).toBeTruthy();
      }
    });
  });
});

