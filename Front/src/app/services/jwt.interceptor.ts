import { Injectable } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { HttpRequest, HttpEvent, HttpInterceptor, HttpResponse, HTTP_INTERCEPTORS, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { StorageService } from './storage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {


  constructor(
    private storageService: StorageService
  ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const localUser = this.storageService.getLocalUser();

        if (localUser) {
            req = req.clone({
                setHeaders: {
                    'x-access-token' : localUser.token.toString(),
                    'cod_usuario': localUser.coduser.toString()
                  }
            });
        }
        return next.handle(req);
    }
}

export const JwtInterceptorService = {
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true
};
