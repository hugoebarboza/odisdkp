import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from '../global';

import 'rxjs/add/operator/map';



@Injectable({
  providedIn: 'root'
})
export class CountriesService {
   public url: string;

  constructor(
    public _http: HttpClient,
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

    getCountries(token: any): Observable<any> {
        return this.getQuery('countries/', token);
    }

    getCountryCustomer(token: any, id: number): Observable<any> {
        return this.getQuery('country/' + id + '/customer', token);
    }


    getCountryDepartamentos(token: any, id: number): Observable<any> {
        return this.getQuery('country/' + id + '/departamento', token);
    }


    getRegion(token: any, id: number): Observable<any> {
        return this.getQuery('country/' + id + '/region', token);
    }

    getProvincia(token: any, id: number): Observable<any> {
        return this.getQuery('region/' + id + '/provincia', token);
    }


    getComuna(token: any, id: number): Observable<any> {
        return this.getQuery('provincia/' + id + '/comuna', token);
    }


}
