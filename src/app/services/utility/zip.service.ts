import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GLOBAL } from '../global';

@Injectable({
  providedIn: 'root'
})

export class ZipService {

  public url: string;

  constructor (private _http: HttpClient) {
    this.url = GLOBAL.url;
  }



  getTipoServicio(id, token) {
    return this.getDataBD(this.url + 'service/' + id + '/servicetype' , token);
  }

  getZona(id, token) {
    return this.getDataBD(this.url + 'service/' + id + '/zona', token);
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

}
