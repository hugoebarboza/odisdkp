import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorsHandler implements ErrorHandler {

    errorMessage = 'NETWORK ERROR, NOT INTERNET CONNECTION!!!!';
    errorMessage500 = '500 SERVER ERROR, CONTACT ADMINISTRATOR!!!!';
    errorMessage400 = '400 SERVER ERROR, CONTACT ADMINISTRATOR!!!!';

    constructor(private _snackBar: MatSnackBar) { }

    handleError(error: Error | HttpErrorResponse) {
        /*
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }*/

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
                  if (error.status === 0) {
                    this._snackBar.open(this.errorMessage, '', {duration: 3000, });
                    // Se debe redireccionar a pagina 500
                  }
                  if (error.status === 500) {
                    this._snackBar.open(this.errorMessage500, '', {duration: 3000, });
                    return throwError(error);
                    // this._snackBar.open(this.errorMessage500, '', {duration: 3000, });
                    // Se debe redireccionar a pagina 500
                  }
                  if (error.status === 400) {
                    return throwError(error);
                    // this._snackBar.open(this.errorMessage400, '', {duration: 3000, });
                    // Se debe redireccionar a pagina 500
                  }
                  return throwError(error);
                  /*
                  console.error(
                    `Backend returned code ${error.status}, ` +
                    `body was: ${error.error}`);
                  // console.warn('An error occurred:', error.error.message);
                  // console.warn(error);*/
              }
            } else {
                // Handle Client Error (Angular Error, ReferenceError...)
                console.error('Client Error!');
                console.log(<any>error);
            }
            return throwError('Something bad happened; please try again later.');
            // return throwError(error);
          }
    }
}
