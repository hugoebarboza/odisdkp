import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import 'rxjs/add/operator/do';

//NGRX REDUX
import { AppState } from '../../app.reducers';
import { Store } from '@ngrx/store';
import { ShowLoaderAction, HideLoaderAction } from '../../stores/loader/loader.actions';


@Injectable()
export class MyInterceptor implements HttpInterceptor {


    constructor(
      private store: Store<AppState>,
    ) {

    }    

intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //this.store.dispatch(new ShowLoaderAction({isloading: true}));
    Promise.resolve(null).then(() => this.store.dispatch(new ShowLoaderAction({isloading: true})));
    let token : string;
    const currentUser : any = JSON.parse(localStorage.getItem('token'));
    if (currentUser){
      token = currentUser.token;
    }else{
      token = ""
    }

    if (token){          
      //const headers = new HttpHeaders({'Authorization': token	});
      //req = req.clone({ headers });
      req = req.clone({ headers: req.headers.set('Authorization',token) });
    }

    const reqClone = req;


    return next.handle( reqClone ).pipe(
      finalize(() => this.store.dispatch(new HideLoaderAction())),
      retry(1),
      //catchError( this.handleError )
      catchError((error: HttpErrorResponse) => {        
          return throwError(error);
      })
      
    );

}

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
  }


}