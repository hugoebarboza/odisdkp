import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GLOBAL } from '../global';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  error: boolean;
  url: string;

  constructor(
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
        return this._http.get<any>(requestUrl, {headers: headers}).toPromise();
      }

    } catch (err) {
        console.log(err);
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




}
