import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GLOBAL } from '../global';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  error: boolean;
  url: string;
  errorMessage = 'NETWORK ERROR, NOT INTERNET CONNECTION!!!!';
  errorMessage500 = '500 SERVER ERROR, CONTACT ADMINISTRATOR!!!!';

  constructor(
    private _snackBar: MatSnackBar,
    public _http: HttpClient,
  ) {
    this.url = GLOBAL.url;
    this.error = false;
  }

  async getQuery(query: string, token: any) {
    if (!token) {
      return;
    }

    try {

      const url = this.url;
      const href = url + query;
      const requestUrl = href;
      const headers = new HttpHeaders({'Content-Type': 'application/json'});

      if (!requestUrl) {
        throw new Error(`Error HTTP ${requestUrl}`);
      } else {
        return await this._http.get<any>(requestUrl, {headers: headers}).toPromise()
        .then()
        .catch((error) => { this.handleError (error); }
        );
      }

    } catch (err) {
        throw new Error(`Error HTTP `);
        // console.log(err);
    }
  }


  getProjectPayment(token: any, id: number, termino: string, fromdate: any, todate: any) {
    if (!token) {
      return;
    }

    let paginate = null;

    if (fromdate !== 'Undefined' && fromdate !== null && todate !== 'Undefined' && todate !== null) {
      paginate = `?fromdate=${fromdate}&todate=${todate}`;
    }

    if (paginate === null) {
      return this.getQuery('project/' + id + '/payment/' + termino, token);
    }

    if (paginate !== null) {
      return this.getQuery('project/' + id + '/payment/' + termino + paginate, token);
    }

  }

  getProjectServicePayment(token: any, project_id: number, id: number, termino: string, fromdate: any, todate: any) {
    if (!token) {
      return;
    }

    let paginate = null;

    if (fromdate !== 'Undefined' && fromdate !== null && todate !== 'Undefined' && todate !== null) {
      paginate = `?fromdate=${fromdate}&todate=${todate}`;
    }

    if (paginate === null) {
      return this.getQuery('project/' + project_id + '/service/' + id + '/payment/' + termino, token);
    }

    if (paginate !== null) {
      return this.getQuery('project/' + project_id + '/service/' + id + '/payment/' + termino + paginate, token);
    }

  }



  getProjectServicePaymentDate(token: any, project_id: number, id: number, termino: string, year: string) {
    if (!token) {
      return;
    }

    return this.getQuery('project/' + project_id + '/servicebystatusanddate/' + id + '/payment/' + termino + '/year/' + year, token);
  }

  getProjectPaymentDate(token: any, id: number, termino: string, year: string) {
    if (!token) {
      return;
    }

    return this.getQuery('project/' + id + '/payment/' + termino + '/year/' + year, token);
  }

  private handleError( error: HttpErrorResponse ) {
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
            if (error.status === 500) {
              this._snackBar.open(this.errorMessage500, '', {duration: 7000, });
            }

            if (error.status === 0) {
              this._snackBar.open(this.errorMessage, '', {duration: 7000, });
            }
        }
      } else {
          // Handle Client Error (Angular Error, ReferenceError...)
          console.error('Client Error!');
      }
      return throwError(error.error);
    }
  }


}
