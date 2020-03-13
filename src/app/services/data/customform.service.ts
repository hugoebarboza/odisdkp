import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// MODELS
import { Form } from 'src/app/models/types';

import { GLOBAL } from '../global';

// ERROR
import { ErrorsHandler } from 'src/app/providers/error/error-handler';


@Injectable({
  providedIn: 'root'
})
export class CustomformService {

  error: boolean;
  url: string;

  constructor(
    private _handleError: ErrorsHandler,
    public _http: HttpClient,
  ) {
    this.url = GLOBAL.url;
    this.error = false;
  }


  async getQuery(query: string, token: any) {
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
        .catch((error) => { console.log(error); }
        );
      }

    } catch (err) {
        throw new Error(`Error HTTP `);
        // console.log(err);
    }
  }


  getFormFieldNotification(token: any, id: number) {
    if (!token) {
      return;
    }

    return this.getQuery('servicetypeform/' + id + '/formfieldnotification', token);
  }


  getProjectForm(token: any, id: number) {
    if (!token) {
      return;
    }

    return this.getQuery('project/' + id + '/form', token);
  }


  getFormResource(token: any, id: number, formid: any) {
    if (!token) {
      return;
    }
    return this.getQuery('order/' + id + '/form/' + formid, token);
  }

  getFormNotification(token: any, id: number) {
    if (!token) {
      return;
    }

    return this.getQuery('servicetype/' + id + '/formnotification', token);
  }


  getProjectFormField(token: any, id: number, formid: number) {
    if (!token) {
      return;
    }

    return this.getQuery('project/' + id + '/form/' + formid, token);
  }

  getType(token: any) {
    if (!token) {
      return;
    }

    return this.getQuery('type', token);
  }

  getTipoServicio(id: number, token: any) {
    if (!token) {
      return;
    }
    return this.getQuery('service/' + id + '/servicetype', token);
  }

  showFormNotification(token: any, servicetype_id: number, form_id: number) {
    if (!token || !servicetype_id || !form_id) {
      return;
    }

    return this.getQuery('servicetype/' + servicetype_id + '/formnotification/' +  form_id, token);
  }





  async deleteAtributo(token: any, servicetype_id: number, atributo_id: number) {
    if (!token) {
     return;
    }

    try {
      const href = this.url + 'servicetype/' + servicetype_id + '/atributo/' + atributo_id;
      const requestUrl = href;

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return await this._http.delete(requestUrl, {headers: headers}).toPromise()
      .then()
      .catch((error) => { this._handleError.handleError (error); });

    } catch (err) {
      throw new Error(`Error HTTP `);
    }

  }
  async delete(token: any, id: number, formid: number) {
    if (!token) {
     return;
    }

    try {
      const href = this.url + 'project/' + id + '/form/' + formid;
      const requestUrl = href;

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return await this._http.delete(requestUrl, {headers: headers}).toPromise()
      .then()
      .catch((error) => { this._handleError.handleError (error); });

    } catch (err) {
      throw new Error(`Error HTTP `);
    }

  }

  async deleteFormField(token: any, id: number, formid: number, formfieldid: number) {
    if (!token) {
     return;
    }

    try {
      const href = this.url + 'project/' + id + '/form/' + formid + '/formfield/' + formfieldid;
      const requestUrl = href;


      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return await this._http.delete(requestUrl, {headers: headers}).toPromise()
      .then()
      .catch((error) => { this._handleError.handleError (error); });

    } catch (err) {
      throw new Error(`Error HTTP `);
    }

  }

  async deleteFormNotification(token: any, servicetype_id: number, form_id: number) {
    if (!token) {
     return;
    }

    try {
      const href = this.url + 'servicetype/' + servicetype_id + '/formnotification/' + form_id;
      const requestUrl = href;

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return await this._http.delete(requestUrl, {headers: headers}).toPromise()
      .then()
      .catch((error) => { this._handleError.handleError (error); });

    } catch (err) {
      throw new Error(`Error HTTP `);
    }

  }


  async update(token: any, data: Form, id: number, formid: number) {
    if (!token) {
     return;
    }

    try {
      const json = JSON.stringify(data);
      const params = 'json=' + json;
      const href = this.url + 'project/' + id + '/form/' + formid;
      const requestUrl = href;

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return await this._http.put(requestUrl, params, {headers: headers}).toPromise()
      .then()
      .catch((error) => { this._handleError.handleError (error); }
      );

    } catch (err) {
      throw new Error(`Error HTTP `);
    }

  }


  async updateAtributo(token: any, data: any, id: number) {
    if (!token) {
     return;
    }
    try {
      const json = JSON.stringify(data);
      const params = 'json=' + json;
      const href = this.url + 'servicetype/' + id + '/atributo/' + id;
      const requestUrl = href;
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return await this._http.put(requestUrl, params, {headers: headers}).toPromise()
      .then()
      .catch((error) => { this._handleError.handleError (error); }
      );
    } catch (err) {
      throw new Error(`Error HTTP `);
    }
  }


  async updateFormField(token: any, data: Form, id: number, formid: number) {
    if (!token) {
     return;
    }

    try {
      const json = JSON.stringify(data);
      const params = 'json=' + json;

      const href = this.url + 'project/' + id + '/form/' + formid + '/formfield';
      const requestUrl = href;

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return await this._http.put(requestUrl, params, {headers: headers}).toPromise()
      .then()
      .catch((error) => { this._handleError.handleError (error); }
      );

    } catch (err) {
      throw new Error(`Error HTTP `);
    }

  }

  async updateFormNotification(token: any, data: any, servicetype_id: number, form_id: number) {
    if (!token) {
     return;
    }
    try {
      const json = JSON.stringify(data);
      const params = 'json=' + json;
      const href = this.url + 'servicetype/' + servicetype_id + '/formnotification/' + form_id;
      const requestUrl = href;
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return await this._http.put(requestUrl, params, {headers: headers}).toPromise()
      .then()
      .catch((error) => { this._handleError.handleError (error); }
      );
    } catch (err) {
      throw new Error(`Error HTTP `);
    }
  }

  async updateFieldNotification(token: any, data: any, id: number) {
    if (!token) {
     return;
    }
    try {
      const json = JSON.stringify(data);
      const params = 'json=' + json;
      const href = this.url + 'servicetypeform/' + id + '/formfieldnotification/' + id;
      const requestUrl = href;
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return await this._http.put(requestUrl, params, {headers: headers}).toPromise()
      .then()
      .catch((error) => { this._handleError.handleError (error); }
      );
    } catch (err) {
      throw new Error(`Error HTTP `);
    }
  }



  async store(token: any, data: Form, id: number) {
    if (!token) {
     return;
    }

    try {
      const json = JSON.stringify(data);
      const params = 'json=' + json;
      const href = this.url + 'project/' + id + '/form';
      const requestUrl = href;

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return await this._http.post(requestUrl, params, {headers: headers}).toPromise()
      .then()
      .catch((error) => { this._handleError.handleError (error); }
      );

    } catch (err) {
      throw new Error(`Error HTTP `);
    }

  }

  async storeAtributo(token: any, data: any, id: number) {
    if (!token) {
     return;
    }

    try {
      const json = JSON.stringify(data);
      const params = 'json=' + json;
      const href = this.url + 'servicetype/' + id + '/atributo';
      const requestUrl = href;

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return await this._http.post(requestUrl, params, {headers: headers}).toPromise()
      .then()
      .catch((error) => { this._handleError.handleError (error); }
      );

    } catch (err) {
      throw new Error(`Error HTTP `);
    }

  }


  async storepostFormResource(token: any, data: any, id: number) {
    if (!token) {
     return;
    }

    try {
      const json = JSON.stringify(data);
      const params = 'json=' + json;
      const href = this.url + 'order/' + id + '/form';
      const requestUrl = href;

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return await this._http.post(requestUrl, params, {headers: headers}).toPromise()
      .then()
      .catch((error) => { this._handleError.handleError (error); }
      );

    } catch (err) {
      throw new Error(`Error HTTP `);
    }

  }

  async storeFormNotification(token: any, data: Form, id: number) {
    if (!token) {
     return;
    }

    try {
      const json = JSON.stringify(data);
      const params = 'json=' + json;
      const href = this.url + 'servicetype/' + id + '/formnotification';
      const requestUrl = href;

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return await this._http.post(requestUrl, params, {headers: headers}).toPromise()
      .then()
      .catch((error) => { this._handleError.handleError (error); }
      );

    } catch (err) {
      throw new Error(`Error HTTP `);
    }

  }

  async storepostFieldNotification(token: any, data: any, id: number) {
    if (!token) {
     return;
    }

    try {
      const json = JSON.stringify(data);
      const params = 'json=' + json;
      const href = this.url + 'servicetypeform/' + id + '/formfieldnotification';
      const requestUrl = href;

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return await this._http.post(requestUrl, params, {headers: headers}).toPromise()
      .then()
      .catch((error) => { this._handleError.handleError (error); }
      );

    } catch (err) {
      throw new Error(`Error HTTP `);
    }

  }

}
