import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Order } from '../../models/types';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { ErrorsHandler } from 'src/app/providers/error/error-handler';
import { GLOBAL } from 'src/app/services/global';
import { Cacheable } from 'ngx-cacheable';
import { Subject } from 'rxjs/Subject';

const cacheBuster$ = new Subject<void>();

@Injectable({
    providedIn: 'root'
})
export class MonitorBackendService {

    private url: string;

    constructor(
        private http: HttpClient,
        private _handleError: ErrorsHandler,
        ) {
        this.url = GLOBAL.url;
    }

    getAllMonitor() {
        const url = this.url;
        const query = 'project/' + 4 + '/order';
        const href = url + query;
        const requestUrl = href;

        const httpOptions = {
            headers: new HttpHeaders({
              'Cache-Control': 'public, max-age=300, s-maxage=600',
              'Content-Type':  'application/json'
            })
          };


        return this.http.get<Order[]>(requestUrl, {headers: httpOptions.headers})
                        .pipe(
                            map(res => res),
                            shareReplay(),
                            catchError(this._handleError.handleError)
                        );
    }

    @Cacheable({
      cacheBusterObserver: cacheBuster$
    })
    getDetailMonitor(id: number, token: any) {

      if (!token || !id) {
        return;
      }

        const url = this.url;
        const query = 'project/' + id + '/order';
        const href = url + query;
        const requestUrl = href;

        const httpOptions = {
            headers: new HttpHeaders({
              'Cache-Control': 'public, max-age=300, s-maxage=600',
              'Content-Type':  'application/json'
            })
          };


        return this.http.get<any>(requestUrl, {headers: httpOptions.headers})
                        .pipe(
                            map(res => res),
                            shareReplay(),
                            catchError(this._handleError.handleError)
                        );

    }

}
