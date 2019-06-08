import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable()
export class ErrorsHandler implements ErrorHandler {

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
                  if(error.status == 500){
                    //Se debe redireccionar a pagina 500
                  }
                  console.warn(error);      
              }
            } else {
                // Handle Client Error (Angular Error, ReferenceError...)
                console.error('Client Error!');
                console.log(<any>error);
            }
            //return throwError('Error');
            return throwError(error.message);
          }      
    }
}