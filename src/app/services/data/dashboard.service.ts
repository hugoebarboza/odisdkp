import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from '../global';

import 'rxjs/add/operator/map';

@Injectable()
export class DashboardService {

    public url: string;

    constructor(
       public _http: HttpClient
    ) {
       this.url = GLOBAL.url;
    }



    getQuery( query: string, token: any ): Observable<any> {
    if (!token) {
       return;
    }

    const url = this.url + query;
    const headers = new HttpHeaders({'Content-Type': 'application/json', });
        return this._http.get(url, {headers: headers}).map((res: any) => res);
    }

    getDepartamentos(token): Observable<any> {
        if (!token) {
           return;
        }

        return this.getQuery('departamento', token);
    }


    getProyectos(token, id): Observable<any> {
        if (!token) {
           return;
        }

        return this.getQuery('departamento/' + id + '/proyecto', token);
    }

    getServicios(token, id): Observable<any> {
        if (!token) {
          return;
        }

        return this.getQuery('project/' + id + '/service', token);
    }


}
