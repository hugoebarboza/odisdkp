import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpResponse, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
// import { throwError } from 'rxjs';
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
// import { LoggingService } from 'src/app/services/utility/logging.service';
import { RequestCacheService } from 'src/app/services/utility/request-cache.service';

// ERROR
import { ErrorsHandler } from '../error/error-handler';


@Injectable()
export class MyInterceptor implements HttpInterceptor {

    url: string;

    constructor(
      // private cache: RequestCacheService,
      private _handleError: ErrorsHandler,
      // private _logging: LoggingService,
      private store: Store<AppState>,
    ) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // const started = Date.now();
        // let ok: string;

        Promise.resolve(null).then(() => this.store.dispatch(new ShowLoaderAction({isloading: true})));

        let token: string;
        let authReq: any;

        // If you are calling an outside domain then do not add the token.
        if (!req.url.match(/odissoftware.api.ocachile.cl\//)) {
          console.log('************************************');
          console.log(req.url);
          return;
        }

        if (!req.headers.has('Content-Type')) {
          req = req.clone({
            headers: req.headers.set('Content-Type', 'application/json')
          });
        }

        const currentUser: any = JSON.parse(localStorage.getItem('token'));
        if (currentUser) {
          token = currentUser.token;
        } else {
          token = '';
        }

        if (token) {
          authReq = req.clone({
            url: req.url.replace('http://', 'https://'),
            headers: req.headers.set('Authorization', token)
          });
        } else {
          authReq = req;
        }

        // const reqClone = req;
        /* const cachedResponse = this.cache.get(req);
        return cachedResponse ? of(cachedResponse) : this.sendRequest(req, next, this.cache); */

        return next.handle( authReq )
                   .pipe(
                    retry(0),
                    tap(
                      // Succeeds when there is a response; ignore other events
                      // event => ok = event instanceof HttpResponse ? 'succeeded' : '',
                      // Operation failed; error is an HttpErrorResponse
                      // error => ok = error + 'failed'
                    ),
                    finalize(() => {
                        this.store.dispatch(new HideLoaderAction());
                        // const elapsed = Date.now() - started;
                        // const msg = `${req.method} "${req.urlWithParams}"${ok} in ${elapsed} ms.`;
                        // this._logging.add(msg);
                      }
                    ),
                    catchError((error: HttpErrorResponse) => {
                          return this._handleError.handleError(error);
                          // return throwError(error);
                      }
                    ));

    }


    sendRequest(
      req: HttpRequest<any>,
      next: HttpHandler,
      cache: RequestCacheService): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
        finalize(() => this.store.dispatch(new HideLoaderAction())),
        retry(0),
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
