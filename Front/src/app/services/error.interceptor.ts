import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { StorageService } from './storage.service';
import Swal from 'sweetalert2';
import { AuthenticationService } from '.';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private authenticationService: AuthenticationService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
        .catch((error, caught) => {
            switch (error.status) {
                case 401:
                    this.authenticationService.logout();
                    Swal('Erro', `Ocorreu um erro na autenticação do seu usuário. Por favor faça seu login novamente.
                    Se o erro persistir favor entrar em contato com a COSIS - 2027-6040.`, 'error');
                    break;
            }
            return Observable.throw(error);
        });
    }
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true
};
