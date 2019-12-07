import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { GLOBAL } from '../global';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

// MODELS
import { Alimentador, ClaveLectura, Customer, Set, Sed } from 'src/app/models/types';

import Swal from 'sweetalert2';


@Injectable()
export class CustomerService {
    public url: string;
    dialogData: any;
    error: boolean;

  constructor(
    public _http: HttpClient,
    ) {
    this.url = GLOBAL.url;
    this.error = false;
  }



   getQuery( query: string, token: any ) {
    if (!token) {
       return;
    }
    const url = this.url + query;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', });
    return this._http.get(url, {headers: headers}).map((res: any) => {
           return res;
           });
   }



  getCustomerProject(filter: string, fieldValue: string, columnValue: string, fieldValueDate: string, columnDateDesdeValue: string, columnDateHastaValue: string, fieldValueRegion: string, columnValueRegion: string, sort: string, order: string, pageSize: number, page: number, id: number, token) {
    if (!fieldValue) {
      fieldValue = '';
    }

    if (!order) {
      order = 'desc';
    }
    if (!sort) {
      sort = 'create_at';
    }

    const paginate = `?filter=${filter}&fieldValue=${fieldValue}&columnValue=${columnValue}&fieldValueDate=${fieldValueDate}&columnDateDesdeValue=${columnDateDesdeValue}&columnDateHastaValue=${columnDateHastaValue}&fieldValueRegion=${fieldValueRegion}&columnValueRegion=${columnValueRegion}&sort=${sort}&order=${order}&limit=${pageSize}&page=${page + 1}`;
    return this.getCustomerData('project/' + id + '/customer' + paginate, token);
    }


   getCustomerShare(patio: string, sort: string, order: string, pageSize: number, idservice: number, token: any) {
    // console.log(sort);
    if (!order) {
      order = 'asc';
    }
    if (!sort) {
      sort = 'create_at';
    }

    const paginate = `?patio=${patio}&sort=${sort}&order=${order}&limit=${pageSize}`;
    // console.log('-----------------------------');
    // console.log(paginate);
    // const paginate = `?page=${page + 1}`;
    return this.getCustomerData('project/' + idservice + '/customershare/' + paginate, token);
  }


   getCustomerData(query: string, token: any) {
    if (!token) {
       return;
    }
    const url = this.url;
    const href = url + query;
    const requestUrl = href;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return new Promise((resolve, reject) => {
      if (token === '') { reject(); }
      if (query === '') { reject(); }
      resolve(this._http.get<Customer>(requestUrl, {headers: headers}));
      });
   }



   getProjectClaveLectura(token, id): Observable<any> {
       return this.getQuery('project/' + id + '/clavelectura', token);
   }


   getProjectCustomer(token, id: number): Observable<any> {
       return this.getQuery('project/' + id + '/customer', token);
   }


   getProjectCustomerDetail(token, id: number, customerid: number): Observable<any> {
       return this.getQuery('project/' + id + '/customer/' + customerid, token);
   }


   getProjectSet(token, id): Observable<any> {
       return this.getQuery('project/' + id + '/set', token);
   }

   getProjectSetAlimentadorSed(token, id): Observable<any> {
      return this.getQuery('project/' + id + '/setalimentadorsed', token);
   }


    getTarifa(token, id): Observable<any> {
       return this.getQuery('service/' + id + '/tarifa', token);
    }


    getClaveDeLectura(token, id): Observable<any> {
      return this.getQuery('project/' + id + '/clavelectura', token);
   }


    getConstante(token, id): Observable<any> {
       return this.getQuery('service/' + id + '/constante', token);
    }

    getGiro(token, id): Observable<any> {
       return this.getQuery('service/' + id + '/giro', token);
    }

    getSector(token, id): Observable<any> {
       return this.getQuery('service/' + id + '/sector', token);
    }

    getSetAlimentador(token, id): Observable<any> {
       return this.getQuery('set/' + id + '/alimentador', token);
    }

    getAlimentadorSed(token, id): Observable<any> {
       return this.getQuery('alimentador/' + id + '/sed', token);
    }

    getZona(token, id): Observable<any> {
       return this.getQuery('service/' + id + '/zona', token);
    }

    getMercado(token, id): Observable<any> {
       return this.getQuery('service/' + id + '/mercado', token);
    }


    getMarca(token): Observable<any> {
       return this.getQuery('marca', token);
    }

    getModelo(token, id): Observable<any> {
       return this.getQuery('marca/' + id + '/modelo', token);
    }


   getColor(token): Observable<any> {
       return this.getQuery('colors', token);
   }


   add(token, customer: Customer, id: number): void {
    if (!token) {
       return;
    }

    const json = JSON.stringify(customer);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    this._http.post(this.url + 'project/' + id + '/customer', params, {headers: headers}).subscribe(
        (data: any) => {
        this.dialogData = customer;
        // this.toasterService.success('Cliente almacenado.', 'Exito', {timeOut: 6000,});
        if (data.status === 'success') {
        if (data.lastInsertedId) {
           Swal.fire('Cliente almacenado con ID: ', data.lastInsertedId + ' exitosamente.', 'success' );
           } else {
           Swal.fire('Cliente almacenado exitosamente.', 'success' );
           }
        } else { Swal.fire('No fue posible procesar su solicitud', '', 'error'); }
        },
        (err: HttpErrorResponse) => {
         this.error = err.error.message;
         Swal.fire('No fue posible procesar su solicitud', err.error.message, 'error');
         // console.log(err.error.message);
         // this.toasterService.error('Error: '+this.error, 'Error', {timeOut: 6000,});
        });
   }


   addAlimentador(token: any, id: number, data: Alimentador): Observable<any> {
      if (!token) {
         return;
      }

      const json = JSON.stringify(data);
      const params = 'json=' + json;

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

      return this._http.post(this.url + 'set/' + id + '/alimentador', params, {headers: headers})
                       .map( (resp: any) => resp);
   }


   addClaveDeLectura(token: any, id: number, data: ClaveLectura): Observable<any> {
      if (!token) {
         return;
      }

      const json = JSON.stringify(data);
      const params = 'json=' + json;

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

      return this._http.post(this.url + 'project/' + id + '/clavelectura', params, {headers: headers})
                       .map( (resp: any) => resp);
   }



   addSed(token: any, id: number, data: Sed): Observable<any> {
      if (!token) {
         return;
      }

      const json = JSON.stringify(data);
      const params = 'json=' + json;

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

      return this._http.post(this.url + 'alimentador/' + id + '/sed', params, {headers: headers})
                       .map( (resp: any) => resp);
   }


   addSet(token: any, id: number, data: Set): Observable<any> {
      if (!token) {
         return;
      }

      const json = JSON.stringify(data);
      const params = 'json=' + json;

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

      return this._http.post(this.url + 'project/' + id + '/set', params, {headers: headers})
                       .map( (resp: any) => resp);
   }


   update(token: any, customer: Customer, id: number, customerid: number): void {

    if (!token) {
       return;
    }

    const json = JSON.stringify(customer);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    this._http.patch(this.url + 'project/' + id + '/customer/' + customerid, params, {headers: headers}).subscribe(
        _data => {
        this.dialogData = customer;
        Swal.fire('Cliente con ID: ', customerid + ' actualizado exitosamente.', 'success' );
        // this.toasterService.success('Cliente actualizado.', 'Exito', {timeOut: 6000,});
        },
        (err: HttpErrorResponse) => {
        this.error = err.error.message;
        Swal.fire('No fue posible procesar su solicitud', err.error.message, 'error');
        });
   }

   updateAlimentador(token: any, id: number, data: Alimentador, data_id: number): Observable<any> {
      if (!token) {
         return;
      }

      const json = JSON.stringify(data);
      const params = 'json=' + json;

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

      return this._http.put(this.url + 'set/' + id + '/alimentador/' + data_id, params, {headers: headers})
                       .map( (resp: any) => resp);
   }



   updateClaveDeLectura(token: any, id: number, data: ClaveLectura, data_id: number): Observable<any> {
      if (!token) {
         return;
      }

      const json = JSON.stringify(data);
      const params = 'json=' + json;

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

      return this._http.put(this.url + 'project/' + id + '/clavelectura/' + data_id, params, {headers: headers})
                       .map( (resp: any) => resp);
   }


   updateSet(token: any, id: number, data: Set, data_id: number): Observable<any> {
      if (!token) {
         return;
      }

      const json = JSON.stringify(data);
      const params = 'json=' + json;

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

      return this._http.put(this.url + 'project/' + id + '/set/' + data_id, params, {headers: headers})
                       .map( (resp: any) => resp);
   }


   updateSed(token: any, id: number, data: Sed, data_id: number): Observable<any> {
      if (!token) {
         return;
      }

      const json = JSON.stringify(data);
      const params = 'json=' + json;

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

      return this._http.put(this.url + 'alimentador/' + id + '/sed/' + data_id, params, {headers: headers})
                       .map( (resp: any) => resp);
   }



   delete(token: any, id: number, customerid: number): void {
    if (!token) {
       return;
    }
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    this._http.delete(this.url + 'project' + '/' + id + '/' + 'customer/' + customerid, {headers: headers}).subscribe(_data => {
            Swal.fire('Cliente con ID: ', customerid + ' eliminado exitosamente.', 'success' );
      },
      (err: HttpErrorResponse) => {
            this.error = err.error.message;
            Swal.fire('No fue posible procesar su solicitud', '', 'error');
      });
   }


   deleteAlimentador(token: any, id: number, data_id: number): Observable<any> {
      if (!token) {
          return;
      }

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this._http.delete(this.url + 'set/' + id + '/alimentador/' + data_id, {headers: headers})
                       .map( (resp: any) => resp);
   }

   deleteClaveDeLectura(token: any, id: number, data_id: number): Observable<any> {
      if (!token) {
          return;
      }

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this._http.delete(this.url + 'project/' + id + '/clavelectura/' + data_id, {headers: headers})
                       .map( (resp: any) => resp);
   }


   deleteSet(token: any, id: number, data_id: number): Observable<any> {
      if (!token) {
          return;
      }

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this._http.delete(this.url + 'project/' + id + '/set/' + data_id, {headers: headers})
                       .map( (resp: any) => resp);
   }


   deleteSed(token: any, id: number, data_id: number): Observable<any> {
      if (!token) {
          return;
      }

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this._http.delete(this.url + 'alimentador/' + id + '/sed/' + data_id, {headers: headers})
                       .map( (resp: any) => resp);
   }


}
