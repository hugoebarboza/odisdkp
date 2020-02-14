import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from '../global';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import 'rxjs/add/operator/map';



@Injectable({
  providedIn: 'root'
})
export class CountriesService {

   error: boolean;
   errorMessage = 'NETWORK ERROR, NOT INTERNET CONNECTION!!!!';
   errorMessage500 = '500 SERVER ERROR, CONTACT ADMINISTRATOR!!!!';
   public url: string;


  constructor(
    public _http: HttpClient,
    private _snackBar: MatSnackBar,
  ) {
    this.url = GLOBAL.url;
  }

  getQuery( query: string, token: any ) {
      if (!token) {
       return;
      }
        const url = this.url + query;
        const headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.get(url, {headers: headers}).map((res: any) => res);
    }

    async getQueryPromise(query: string, token: any) {
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


    getCountries(token: any): Observable<any> {
        return this.getQuery('countries/', token);
    }

    getCountryCustomer(token: any, id: number): Observable<any> {
        return this.getQuery('country/' + id + '/customer', token);
    }


    getCountryDepartamentos(token: any, id: number): Observable<any> {
        return this.getQuery('country/' + id + '/departamento', token);
    }


    getRegion(token: any, id: number) {
        return this.getQueryPromise('country/' + id + '/region', token);
    }

    getProvincia(token: any, id: number): Observable<any> {
        return this.getQuery('region/' + id + '/provincia', token);
    }


    getComuna(token: any, id: number): Observable<any> {
        return this.getQuery('provincia/' + id + '/comuna', token);
    }


  private handleError( error: HttpErrorResponse ) {
    if (!navigator.onLine) {
      // Handle offline error
      // console.error('Browser Offline!');
    } else {
      if (error instanceof HttpErrorResponse) {
        // Server or connection error happened
        if (!navigator.onLine) {
            // console.error('Browser Offline!');
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
