import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceService } from './service.service'; 

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: ServiceService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   // console.log('AuthInterceptor: Intercepting request');

    const token = this.authService.getToken();

    if (token) {
  //    console.log('AuthInterceptor: Adding token to request');
      const authReq = req.clone({
        setHeaders: {
          Authorization: `bearer ${token}`
        }
      });
      return next.handle(authReq);
    } else {
   //   console.log('AuthInterceptor: No token found');
      return next.handle(req);
    }
  }
}

