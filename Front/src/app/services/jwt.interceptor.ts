import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpInterceptor, HttpResponse, HTTP_INTERCEPTORS, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import Swal from 'sweetalert2';
import { StorageService } from './storage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {


  constructor(
    private storageService: StorageService
  ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const localUser = this.storageService.getLocalUser();

        if (localUser) {
            const authReq = req.clone({
                headers: req.headers.set('x-access-token', localUser.token).append('cod_usuario', localUser.user)
            });
            return next.handle(authReq);
        } else {
            return next.handle(req);
        }
    }
}

export const JwtInterceptorService = {
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true
};
