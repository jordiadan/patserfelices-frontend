import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  Router
} from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private router: Router, public toastController: ToastController) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('token');

    if (token) {
      request = request.clone({
        setHeaders: {
          'Authorization': token
        }
      });
    }

    // if (request.method === 'POST' && request.url.includes('/files')) {
    //   return next.handle(request);
    // }

    if (request.method !== 'POST'/*  && !(request.url.includes('/files')) */) {
      if (!request.headers.has('Content-Type')) {
        request = request.clone({
          setHeaders: {
            'content-type': 'application/json'
          }
        });
      }
    }

    // request = request.clone({
    //   headers: request.headers.set('Accept', 'application/json')
    // });

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('event--->>>', event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        if (error.status === 401 && error.url !== `${environment.serverURL}/login`) {
          // console.log(error);
          // if (error.error.success === false) {
          //   this.presentToast('Login failed');
          // } else {
          this.router.navigate(['login']);
          // }
        }
        return throwError(error);
      }));
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}
