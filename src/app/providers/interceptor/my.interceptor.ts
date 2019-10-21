import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpResponse, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/Observable';
// import { of } from 'rxjs/observable/of';
import { retry, catchError } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import 'rxjs/add/operator/do';
import { tap } from 'rxjs/operators';

// NGRX REDUX
import { AppState } from '../../app.reducers';
import { Store } from '@ngrx/store';
import { ShowLoaderAction, HideLoaderAction } from '../../stores/loader/loader.actions';


// SERVICES
import { RequestCacheService } from '../../services/utility/request-cache.service';

@Injectable()
export class MyInterceptor implements HttpInterceptor {


    constructor(
      // private cache: RequestCacheService,
      private store: Store<AppState>,
    ) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


        Promise.resolve(null).then(() => this.store.dispatch(new ShowLoaderAction({isloading: true})));

        let token: string;
        const currentUser: any = JSON.parse(localStorage.getItem('token'));
        if (currentUser) {
          token = currentUser.token;
        } else {
          token = '';
        }

        if (token) {
          // const headers = new HttpHeaders({'Authorization': token	});
          // req = req.clone({ headers });
          req = req.clone({ headers: req.headers.set('Authorization', token) });
        }

        const reqClone = req;

        /* const cachedResponse = this.cache.get(req);
        return cachedResponse ? of(cachedResponse) : this.sendRequest(req, next, this.cache); */

        return next.handle( reqClone ).pipe(
          finalize(() => this.store.dispatch(new HideLoaderAction())),
          retry(1),
          // catchError( this.handleError )
          catchError((error: HttpErrorResponse) => {
              return throwError(error);
          })
        );

    }


    sendRequest(
      req: HttpRequest<any>,
      next: HttpHandler,
      cache: RequestCacheService): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
        finalize(() => this.store.dispatch(new HideLoaderAction())),
        retry(1),
        tap(event => {
          if (event instanceof HttpResponse) {
            // console.log(req.url.indexOf("/role/"));
            if (req.method === 'PUT' || req.method === 'POST' || req.method === 'DELETE') {
              return;
            }
            if (req.url.indexOf('/customer') > 0) {
              return;
            }
            if (req.url.indexOf('searchcustomer/') > 0) {
              return;
            }
            if (req.url.indexOf('/role/') > 0) {
              return;
            }
            if (req.url === 'https://odis.api.ocachile.cl/api/v1.0/logindkp') {
              return;
            }
            if (req.url === 'https://odis.api.ocachile.cl/api/v1.0/logindkptrue') {
              return;
            }
            cache.put(req, event);
          }
        })
      );
    }

  /*
  private handleError( error: HttpErrorResponse ) {
    //console.log('Sucedió un error');
    //console.log('Registrado en el log file');
    if (!navigator.onLine) {
      // Handle offline error
      console.error('Browser Offline!');
    } else {
      if (error instanceof HttpErrorResponse) {
        // Server or connection error happened
        if (!navigator.onLine) {
            console.error('Browser Offline!');
        } else {
            // Handle Http Error (4xx, 5xx, ect.)
            if(error.status == 500){
              //Se debe redireccionar a pagina 500
            }
            console.warn(error);
        }
      } else {
          // Handle Client Error (Angular Error, ReferenceError...)
          console.error('Client Error!');
      }
      //return throwError('Error');
      return throwError(error.error.message);
    }
  }*/
}
