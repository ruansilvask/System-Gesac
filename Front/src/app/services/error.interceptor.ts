import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { StorageService } from './storage.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
        .catch((error, caught) => {
            return Observable.throw(error);
        });
    }
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true
};
