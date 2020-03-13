import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, share } from 'rxjs/operators';

// GLOBAL
import { GLOBAL } from '../global';

// ERROR
import { ErrorsHandler } from 'src/app/providers/error/error-handler';


@Injectable({
  providedIn: 'root'
})
export class CountriesService {

   error: boolean;
   public url: string;


  constructor(
    private _handleError: ErrorsHandler,
    public _http: HttpClient,
  ) {
    this.url = GLOBAL.url;
  }

  getQuery( query: string, token: any ) {
      if (!token || !query) {
       return;
      }
        const url = this.url + query;
        const headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.get(url, {headers: headers})
                         .pipe(
                           share(),
                           catchError(this._handleError.handleError)
                         );
    }

    async getQueryPromise(query: string, token: any) {
        if (!token || !query) {
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
              .catch((error) => { this._handleError.handleError (error); }
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



}
