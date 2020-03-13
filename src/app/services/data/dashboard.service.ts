import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from '../global';
import { catchError, share } from 'rxjs/operators';

// ERROR
import { ErrorsHandler } from 'src/app/providers/error/error-handler';


@Injectable()
export class DashboardService {

    public url: string;

    constructor(
       private _handleError: ErrorsHandler,
       public _http: HttpClient
    ) {
       this.url = GLOBAL.url;
    }



    getQuery( query: string, token: any ): Observable<any> {
    if (!token || !query) {
       return;
    }

    const url = this.url + query;
    const headers = new HttpHeaders({'Content-Type': 'application/json', });
        return this._http.get(url, {headers: headers})
                         .pipe(
                             share(),
                             catchError(this._handleError.handleError)
                         );
    }

    getDepartamentos(token: any): Observable<any> {
        if (!token) {
           return;
        }

        return this.getQuery('departamento', token);
    }


    getProyectos(token: any, id: number): Observable<any> {
        if (!token) {
           return;
        }

        return this.getQuery('departamento/' + id + '/proyecto', token);
    }

    getServicios(token: any, id: number): Observable<any> {
        if (!token) {
          return;
        }

        return this.getQuery('project/' + id + '/service', token);
    }


}
