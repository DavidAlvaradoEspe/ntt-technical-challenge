import {HttpErrorResponse} from '@angular/common/http';
import type {ApiErrorPayload} from '../../models/api.envelope.model';
import {throwError} from 'rxjs';

export function mapHttpError(error: unknown, fallback:string){
  let message = fallback;
  if( error instanceof HttpErrorResponse){
    const payload = (error.error ?? {}) as ApiErrorPayload;
    if(payload.message){
      message = payload.message;
    }else if(error.message){
      message = error.message;
    }
  }else if( error instanceof Error ){
    message = error.message || fallback;
  }
  return throwError(()=> new Error(message));
}
