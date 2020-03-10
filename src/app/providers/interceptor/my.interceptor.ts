import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpResponse, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { retry, catchError } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import 'rxjs/add/operator/do';
import { tap } from 'rxjs/operators';

// NGRX REDUX
import { AppState } from 'src/app/app.reducers';
import { Store } from '@ngrx/store';
import { ShowLoaderAction, HideLoaderAction } from 'src/app/stores/loader/loader.actions';


// SERVICES
import { RequestCacheService } from 'src/app/services/utility/request-cache.service';
// import { ErrorsHandler } from '../error/error-handler';

@Injectable()
export class MyInterceptor implements HttpInterceptor {


    constructor(
      // private cache: RequestCacheService,
      // private handleError: ErrorsHandler,
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
        } else {
        }

        const reqClone = req;

        /* const cachedResponse = this.cache.get(req);
        return cachedResponse ? of(cachedResponse) : this.sendRequest(req, next, this.cache); */

        return next.handle( reqClone ).pipe(
          finalize(() => this.store.dispatch(new HideLoaderAction())),
          retry(0),
          /* catchError( return this.handleError.handleError(error) )*/
          catchError((error: HttpErrorResponse) => {
              // return this.handleError.handleError(error);
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

}
