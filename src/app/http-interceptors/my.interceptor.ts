import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/operator/do';



@Injectable()
export class MyInterceptor implements HttpInterceptor {


    constructor(
    ) {
    }    

intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

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
      catchError( this.handleError )
    );


    /*
    if (!req.headers.has('Content-Type')) {
      //req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
    }*/

    //const duplicate = req.clone({ params: req.params.set('filter', 'completed') });
    /*
    return next.handle(req).do(evt => {
      if (evt instanceof HttpResponse) {
        console.log('---> statusss:', evt.status);
        console.log('---> filterrrr:', req.params.get('filter'));
      }
    });*/
}

private handleError( error: HttpErrorResponse ) {
  console.log('Sucedió un error');
  console.log('Registrado en el log file');
  console.warn(error);
  //return throwError('Error');
  return throwError(error.error.message);
}

private Error<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
 
    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead
 
    // TODO: better job of transforming error for user consumption
    console.warn(`${operation} failed: ${error.message}`);
 
    // Let the app keep running by returning an empty result.
    return;
  };
}



}