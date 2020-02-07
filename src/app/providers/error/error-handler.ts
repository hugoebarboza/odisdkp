import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorsHandler implements ErrorHandler {

    public errorMessage = 'NETWORK ERROR, NOT INTERNET CONNECTION!!!!';
    public errorMessage500 = '500 SERVER ERROR, CONTACT ADMINISTRATOR!!!!';
    public errorMessage400 = '400 SERVER ERROR, CONTACT ADMINISTRATOR!!!!';

    constructor(private _snackBar: MatSnackBar) { }

    handleError(error: Error | HttpErrorResponse) {
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
                    // Se debe redireccionar a pagina 500
                  }
                  if (error.status === 400) {
                    this._snackBar.open(this.errorMessage400, '', {duration: 3000, });
                    // Se debe redireccionar a pagina 500
                  }

                  console.warn(error);
              }
            } else {
                // Handle Client Error (Angular Error, ReferenceError...)
                console.error('Client Error!');
                console.log(<any>error);
            }
            // return throwError('Error');
            return throwError(error.message);
          }
    }
}
