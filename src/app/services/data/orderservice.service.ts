import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { of } from 'rxjs/observable/of';
import { throwError } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/shareReplay';
// import { Subject } from 'rxjs/Subject';

// CACHE
import { Cacheable } from 'ngx-cacheable';

// import Swal from 'sweetalert2';

// MODELS
import {  Order, ServiceEstatus } from 'src/app/models/types';

import { GLOBAL } from '../global';

// const cacheBuster$ = new Subject<void>();

@Injectable()
    export class OrderserviceService {

    url: string;
    dialogData: any;
    // dataChange: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);
    error: boolean;
    errorMessage = 'NETWORK ERROR, NOT INTERNET CONNECTION!!!!';
    errorMessage500 = '500 SERVER ERROR, CONTACT ADMINISTRATOR!!!!';
    responseCache = new Map();

    constructor(
        private _snackBar: MatSnackBar,
        public _http: HttpClient,
    ) {
        this.url = GLOBAL.url;
        this.error = false;
    }


  getDialogData() {
      return this.dialogData;
  }

  getQuery( query: string, token: string | string[] ): Observable<any> {
    if (!token) {
       return;
    }

        const url = this.url + query;
        const headers = new HttpHeaders({'Content-Type': 'application/json' });
        return this._http.get(url, {headers: headers})
        .map((res: any) => {
            return res;
        });
  }

  getOrderDetail(orderid: number, token: any) {
    if (!orderid || !token) {
      return;
    }

    return this.getOrderData('orderdetail/' + orderid, token);
  }


  async getServiceOrder(filter: string, fieldValue: string, columnValue: string, fieldValueDate: string, columnDateDesdeValue: string, columnDateHastaValue: string, fieldValueRegion: string, columnValueRegion: string, fieldValueUsuario: string, columnValueUsuario: string, sort: string, order: string, pageSize: number, page: number, id: number, token: any) {
    // console.log(sort);
    if (!fieldValue) {
      fieldValue = '';
    }

    if (!order) {
      order = 'desc';
    }
    if (!sort) {
      sort = 'create_at';
    }

    const url = this.url;
    const paginate = `?filter=${filter}&fieldValue=${fieldValue}&columnValue=${columnValue}&fieldValueDate=${fieldValueDate}&columnDateDesdeValue=${columnDateDesdeValue}&columnDateHastaValue=${columnDateHastaValue}&fieldValueRegion=${fieldValueRegion}&columnValueRegion=${columnValueRegion}&fieldValueUsuario=${fieldValueUsuario}&columnValueUsuario=${columnValueUsuario}&sort=${sort}&order=${order}&limit=${pageSize}&page=${page + 1}`;
    const query = 'service/' + id + '/order' + paginate;
    const href = url + query;
    const requestUrl = href;
    // const headers = new HttpHeaders().set('Content-Type', 'application/json');


    const httpOptions = {
      headers: new HttpHeaders({
        'Cache-Control': 'public, max-age=300, s-maxage=600',
        'Content-Type':  'application/json'
      })
    };


    if (!requestUrl || !token) {
        return;
    }

    try {
        return await this._http.get<any>(requestUrl, {headers: httpOptions.headers}).shareReplay().toPromise()
        .then()
        .catch((error) => { this.handleError (error); }
        );
   } catch (err) {
        console.log(err);
   }

    // console.log(paginate);
    // const paginate = `?page=${page + 1}`;
    // return this.getOrderData('service/' + id + '/order' + paginate, token);
  }



  getProjectShareOrder(filter: string, fieldValue: string, columnValue: string, fieldValueDate: string, columnDateDesdeValue: string, columnDateHastaValue: string, fieldValueRegion: string, columnValueRegion: string, fieldValueUsuario: string, columnValueUsuario: string, fieldValueEstatus: string, columnValueEstatus: string, columnTimeFromValue: any, columnTimeUntilValue: any, columnValueZona: number, idservicetype: number, sort: string, order: string, pageSize: number, page: number, id: number, idservice: number, token: any, event: number) {

    if (!fieldValue) {
      fieldValue = '';
    }

    if (!order) {
      order = 'desc';
    }
    if (!sort) {
      sort = 'create_at';
    }

    const paginate = `?filter=${filter}&fieldValue=${fieldValue}&columnValue=${columnValue}&fieldValueDate=${fieldValueDate}&columnDateDesdeValue=${columnDateDesdeValue}&columnDateHastaValue=${columnDateHastaValue}&fieldValueRegion=${fieldValueRegion}&columnValueRegion=${columnValueRegion}&fieldValueUsuario=${fieldValueUsuario}&columnValueUsuario=${columnValueUsuario}&fieldValueEstatus=${fieldValueEstatus}&columnValueEstatus=${columnValueEstatus}&columnTimeFromValue=${columnTimeFromValue}&columnTimeUntilValue=${columnTimeUntilValue}&columnValueZona=${columnValueZona}&idservicetype=${idservicetype}&event=${event}&sort=${sort}&order=${order}&limit=${pageSize}&page=${page + 1}`;
    // console.log('-----------------------------');
    // console.log(paginate);
    // console.log(id);
    // console.log(idservice);
    // const paginate = `?page=${page + 1}`;
    return this.getOrderData('projectservice/' + id + '/service/' + idservice + '/share' + paginate, token);
  }


    async getOrderData(query: string, token: any) {
        if (!token) {
          return;
        }

        try {
            const url = this.url;
            const href = url + query;
            const requestUrl = href;
            const headers = new HttpHeaders({'Content-Type': 'application/json'});

            if (!requestUrl) {
              return;
            }

            return await new Promise((resolve, reject) => {
            if (token === '') {
                reject('Sin Token');
            }

            if (query === '') {
                reject('Sin Query Consulta');
            }

            resolve(this._http.get<Order>(requestUrl, {headers: headers}));
            });

        } catch (err) {
          console.log(err);
       }
    }

    /*
    getOrderService(token: any, id: string): Observable<any> {
       return this.getQuery('service/' + id + '/order', token);
    }*/



    @Cacheable({
        maxCacheCount: 2,
        maxAge: 30000,
    })
    /*
    @Cacheable({
      cacheBusterObserver: cacheBuster$
    })*/
    getShowOrderService(token: any, id: number, orderid: number): Observable<any> {
      if (!token) {
        return;
      }

      /*
      const query = 'service/' + id + '/order/' + orderid;
      const url = this.url + query;
      const urlFromCache = this.responseCache.get(url);
      if (urlFromCache) {
        return of(urlFromCache);
      }
      const httpOptions = {
        headers: new HttpHeaders({
          'Cache-Control': 'public, max-age=300, s-maxage=600',
          'Content-Type':  'application/json'
        })
      };
      const response = this._http.get(url, {headers: httpOptions.headers}).map((res: any) => res);
      response.subscribe(res => this.responseCache.set(url, res));
      return response;*/

      const query = 'service/' + id + '/order/' + orderid;
      const url = this.url + query;
      const httpOptions = {
        headers: new HttpHeaders({
          'Cache-Control': 'public, max-age=300, s-maxage=600',
          'Content-Type':  'application/json'
        })
      };
      return this._http.get(url, {headers: httpOptions.headers}).map((res: any) => res);

      /*const headers = new HttpHeaders({'Content-Type': 'application/json' });
      return this.getQuery('service/' + id + '/order/' + orderid, token);*/
    }

    getFirmaImageOrder(token: any, id: string): Observable<any> {
        return this.getQuery('order/' + id + '/firmaimage', token);
    }

    getListAudioOrder(token: any, id: number): Observable<any> {
        return this.getQuery('order/' + id + '/audio', token);
    }


    getListImageOrder(token: any, id: number): Observable<any> {
        return this.getQuery('order/' + id + '/listimage', token);
    }

    getImageOrder(token: any, id: string): Observable<any> {
        return this.getQuery('order/' + id + '/getimage', token);
    }


    getShowImageOrder(token: any, id: string): Observable<any> {
        return this.getQuery('image/' + id, token);
    }


    getService(token: any, id: string | number): Observable <any> {
        return this.getQuery('service/' + id, token);
    }

    getAtributoServiceType (token: any, id: string): Observable<any> {
        return this.getQuery('servicetype/' + id + '/atributo', token);
    }


    getServiceType (token: any, id: string | number): Observable<any> {
        return this.getQuery('service/' + id + '/servicetype', token);
    }

    getServiceEstatus (token: any, id: string | number): Observable<any> {
        return this.getQuery('service/' + id + '/estatus', token);
    }

    getCustomer(token: any, termino: string, id: number): Observable<any> {
        return this.getQuery('search/' + termino + '/' + id, token);
    }

    gettUserOrdenes(token: any, id: number, sort: string, order: string, pageSize: number, page: number) {
        if (!token) {
           return;
        }

        if (!order) {
           order = 'desc';
        }

        if (!sort) {
           sort = 'create_at';
        }

        const paginate = `?sort=${sort}&order=${order}&limit=${pageSize}&page=${page + 1}`;
        return this.getProjectOrderData('user/' + id + '/order' + paginate, token);
    }




    async getProjectOrderData(query: string, token: any) {
    if (!token) {
       return;
    }
      const url = this.url;
      const href = url + query;
      const requestUrl = href;
      const headers = new HttpHeaders({'Content-Type': 'application/json'});

      return await new Promise((resolve, reject) => {
        if (token === '') {
          reject();
        }

        if (query === '') {
          reject();
        }

        resolve(this._http.get<Order>(requestUrl, {headers: headers}));
        });
    }


    add(token: any, order: Order, id: number): Observable<any> {
        if (!token) {
            return;
        }
        const json = JSON.stringify(order);
        const params = 'json=' + json;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'project' + '/' + id + '/' + 'order', params, {headers: headers}).map( (resp: any) => resp);
    }

    addEstatus(token: any, data: ServiceEstatus, id: number): Observable<any> {
    if (!token) {
       return;
    }

    const json = JSON.stringify(data);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.post(this.url + 'service/' + id + '/estatus/', params, {headers: headers}).map( (resp: any) => resp);
  }


  async update(token: any, orderid: number, order: Order, id: number) {
    if (!token) {
      return;
    }

    try {
      const json = JSON.stringify(order);
      const params = 'json=' + json;
      const href = this.url + 'project/' + id + '/order/' + orderid;
      const requestUrl = href;
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return await this._http.put(requestUrl, params, {headers: headers}).toPromise()
      .then()
      .catch((error) => { this.handleError (error); }
      );
    } catch (err) {
      throw new Error(`Error HTTP `);
    }

  }

  updateEstatus(token: any, data: ServiceEstatus, id: number): Observable<any> {
    if (!token) {
      return;
    }

    const json = JSON.stringify(data);
    const params = 'json=' + json;

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.post(this.url + 'estatus/' + id, params, {headers: headers}).map( (resp: any) => resp);
  }

  updateMass(token: any, data: any, id: number, paramset: string, paramvalue: number): Observable<any> {
    if (!token) {
      return;
    }

    const json = JSON.stringify(data);
    const params = 'json=' + json;

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const Url = this.url + 'service/' + id + '/orderupdatemass/' + paramset + '/value/' + paramvalue;


    return this._http.post(Url, params, {headers: headers}).map( (resp: any) => resp );
  }


  deleteMass(token: any, data: any, id: number): Observable<any> {
    if (!token) {
      return;
    }

    const json = JSON.stringify(data);
    const params = 'json=' + json;

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const Url = this.url + 'service/' + id + '/deletemass';


    return this._http.post(Url, params, {headers: headers}).map( (resp: any) => resp);
  }


  deleteEstatus(token: any, id: number): Observable<any> {

    if (!token) {
       return;
    }

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.delete(this.url + 'estatus/' + id, {headers: headers}).map( (resp: any) => resp);
  }


  delete(token: any, orderid: number, id: number): Observable<any> {
    if (!token) {
       return;
    }

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.delete(this.url + 'project' + '/' + id + '/' + 'order/' + orderid, {headers: headers}).map( (resp: any) => resp );
    /*
    subscribe(
    (data: any) => {
      if (data.status === 'success') {
        Swal.fire('Eliminada Orden de Trabajo con identificador: ', orderid + ' exitosamente.', 'success' );
        } else {
        Swal.fire('Orden de Trabajo con identificador: ', orderid + ' no eliminada.' , 'error');
        }
        // this.toasterService.success('Orden de Trabajo eliminada.', 'Exito', {timeOut: 6000,});
      },
      (err: HttpErrorResponse) => {
        this.error = err.error.message;
        Swal.fire('No fue posible procesar su solicitud', '', 'error');
        // this.toasterService.error('Error: '+this.error, 'Error', {timeOut: 6000,});
      });*/
  }

  deleteotedp(token: any, orderid: number, id: number): Observable<any> {
    if (!token) {
       return;
    }

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.delete(this.url + 'project' + '/' + id + '/' + 'order/' + orderid + '/deleteotedp', {headers: headers}).map( (resp: any) => resp );
    /*
    subscribe(
    (data: any) => {
      if (data.status === 'success') {
        Swal.fire('Eliminada Orden de Trabajo con identificador: ', orderid + ' exitosamente.', 'success' );
        } else {
        Swal.fire('Orden de Trabajo con identificador: ', orderid + ' no eliminada.' , 'error');
        }
        // this.toasterService.success('Orden de Trabajo eliminada.', 'Exito', {timeOut: 6000,});
      },
      (err: HttpErrorResponse) => {
        this.error = err.error.message;
        Swal.fire('No fue posible procesar su solicitud', '', 'error');
        // this.toasterService.error('Error: '+this.error, 'Error', {timeOut: 6000,});
      });*/
  }


  important(token: any, id: number, orderid: number, label: number): void {
    if (!token) {
      return;
    }
      const json = JSON.stringify(label);
      const params = 'json=' + json;
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      this._http.post(this.url + 'project' + '/' + id + '/' + 'order/' + orderid + '/importantorder/' + label, params, {headers: headers}).subscribe(
            _data => {
              },
              (err: HttpErrorResponse) => {
              this.error = err.error.message;
      });
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
