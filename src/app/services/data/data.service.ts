import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from '../global';




@Injectable({
  providedIn: 'root'
})

export class DataService {
  public url:string;

  constructor (private _http: HttpClient) {
    this.url = GLOBAL.url;

  }

  // tslint:disable-next-line:max-line-length
  //token =  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjMsInJvbGUiOjcsImVtcGx5IjozLCJkcHRvIjozLCJjb3VudHJ5IjoxLCJjb3VudHJ5X25hbWUiOiJDaGlsZSIsImxhdGl0dWQiOiItMzMuNDI2Mjc2IiwibG9uZ2l0dWQiOiItNzAuNjExNjM3IiwidGltZXpvbmUiOiJBbWVyaWNhXC9Hb2R0aGFiIiwicHJvamVjdF9uYW1lIjoiQkVUQSIsInByb2plY3RfaWQiOjYsImVtYWlsIjoiZXJpY2suY2FjZXJlcy5hQGdtYWlsLmNvbSIsIm5hbWUiOiJFcmljayIsInN1cm5hbWUiOiJDXHUwMGUxY2VyZXMiLCJncHN0aW1lIjowLCJ0aW1lX2VuZCI6IiIsImlhdCI6MTU0NTIyNTM3MywibmJmIjoxNTQ1MjI1MzczLCJleHAiOjE1NDUyNTc3NzN9.43xiWFnkLeyZT_7Li_Ea2dO-38ZY3YMQ8b6zH7ULnt0';
  //idpais = 1;
  //url = 'https://odis.api.ocachile.cl/api/v1.0/';
  //idproject = 4;

  putDataBD(link: string, json: object, projectid:number, token) {

    const sjson = JSON.stringify(json);
    const params = 'json=' + sjson;
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return new Promise((resolve, reject) => {
      if (token === '') {
        reject();
      }
    resolve(this._http.put(this.url + 'project/' + projectid + link, params, {headers: headers}));
    });
  }

  postDataBD(json: object, projectid:number, token) {

    const sjson = JSON.stringify(json);
    const params = 'json=' + sjson;
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return new Promise((resolve, reject) => {
      if (token === '') {
        reject();
      }
    resolve(this._http.post(this.url + 'project/' + projectid + '/customer', params, {headers: headers}));
    });
  }

  deleteCustomer(cc_id: string, projectid:number, token) {
    console.log('dataservice customer');
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return new Promise((resolve, reject) => {
      if (token === '') {
          reject();
      }
      resolve(this._http.delete(this.url + 'project/' + projectid + '/customer/' + cc_id, {headers: headers}));
      });
  }

  deleteOrdenBD(order_id: string, projectid:number, token) {
    console.log('dataservice orden');
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return new Promise((resolve, reject) => {
      if (token === '') {
        reject();
      }
      resolve(this._http.delete(this.url + 'project/' + projectid + '/order/' + order_id, {headers: headers}));
      });
  }

  getTarifa(id, token) {
    return this.getDataBD(this.url + 'service/' + id + '/tarifa', token);
  }

  getConstante(id, token) {
    return this.getDataBD(this.url + 'service/' + id + '/constante', token);
  }

  getGiro(id, token) {
    return this.getDataBD(this.url + 'service/' + id + '/giro', token);
  }

  getSector(id, token) {
    return this.getDataBD(this.url + 'service/' + id + '/sector', token);
  }

  getZona(id, token) {
    return this.getDataBD(this.url + 'service/' + id + '/zona', token);
  }

  getMercado(id, token) {
    return this.getDataBD(this.url + 'service/' + id + '/mercado', token);
  }

  getSearchcustomer(link, token) {
    return this.getDataBD(this.url + link, token);
  }

  getStatus(id, token) {
    return this.getDataBD(this.url + 'service/' + id + '/estatus' , token);
  }

  /*
  getValidateExisteCLiente(id_service, cc_number, medidor, zona, b_medidor, b_zona, token) {
    if (b_medidor && b_zona) {
      // tslint:disable-next-line:max-line-length
      return this.getDataBD(this.url + 'searchcustomer/project/service/' + id_service + '/search/' + cc_number + '?medidor=' + medidor + '&zona=' + zona, token);
    }
    if (b_medidor && !b_zona) {
      // tslint:disable-next-line:max-line-length
      return this.getDataBD(this.url + 'searchcustomer/project/service/' + id_service + '/search/' + cc_number + '?medidor=' + medidor , token);
    }
    if (!b_medidor && b_zona) {
      // tslint:disable-next-line:max-line-length
      return this.getDataBD(this.url + 'searchcustomer/project/service/' + id_service + '/search/' + cc_number + '?zona=' + zona , token);
    }
    if (!b_medidor && !b_zona) {
      // tslint:disable-next-line:max-line-length
      return this.getDataBD(this.url + 'searchcustomer/project/service/' + id_service + '/search/' + cc_number, token);
    }  
  }*/

  getValidateExisteCLiente(id_service, cc_number, token, json) {
    if (json) {
      // tslint:disable-next-line:max-line-length
      return this.getDataBD(this.url + 'searchcustomer/project/service/' + id_service + '/search/' + cc_number + '?json=' + JSON.stringify(json) , token);
    } else {
      // tslint:disable-next-line:max-line-length
      return this.getDataBD(this.url + 'searchcustomer/project/service/' + id_service + '/search/' + cc_number, token);
    }
  }

  getValidarCliente(id_service, cc_number, token) {
      return this.getDataBD(this.url + 'searchcustomer/project/service/' + id_service + '/search/' + cc_number, token);
  }


  getDataBD(href: string, token) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return new Promise((resolve, reject) => {
      if (token === '') {
          reject();
      }
      resolve(this._http.get(href, {headers: headers}));
      });
  }

  getTipoServicio(id, token) {
    return this.getDataBD(this.url + 'service/' + id + '/servicetype' , token);
  }

  getInspectores(projectid:number, token) {
    return this.getDataBD(this.url + 'project/' + projectid + '/role/5' , token);
  }

  getMarca(token) {
    return this.getDataBD(this.url + 'marca' , token);
  }

  getColor(token) {
    return this.getDataBD(this.url + 'colors' , token);
  }

  postOrder(json: object, projectid:number, token) {

    const sjson = JSON.stringify(json);
    const params = 'json=' + sjson;
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return new Promise((resolve, reject) => {
      if (token === '') {
          reject();
      }
      resolve(this._http.post(this.url + 'project/' + projectid + '/order', params, {headers: headers}));
      });
  }



}
