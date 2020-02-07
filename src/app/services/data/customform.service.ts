import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

// MODELS
import { Form } from 'src/app/models/types';

import { GLOBAL } from '../global';

@Injectable({
  providedIn: 'root'
})
export class CustomformService {

  error: boolean;
  url: string;
  errorMessage = 'NETWORK ERROR, NOT INTERNET CONNECTION!!!!';
  errorMessage500 = '500 SERVER ERROR, CONTACT ADMINISTRATOR!!!!';

  constructor(
    private _snackBar: MatSnackBar,
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
        return await this._http.get<any>(requestUrl, {headers: headers}).toPromise()
        .then()
        .catch((error) => { this.handleError (error); }
        );
      }

    } catch (err) {
        throw new Error(`Error HTTP `);
        // console.log(err);
    }
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
      .catch((error) => { this.handleError (error); }
      );

    } catch (err) {
      throw new Error(`Error HTTP `);
    }

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
      .catch((error) => { this.handleError (error); });

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
      .catch((error) => { this.handleError (error); });

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
      .catch((error) => { this.handleError (error); }
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
      .catch((error) => { this.handleError (error); }
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
      .catch((error) => { this.handleError (error); }
      );

    } catch (err) {
      throw new Error(`Error HTTP `);
    }

  }




  private handleError( error: HttpErrorResponse ) {
    if (!navigator.onLine) {
      // Handle offline error
      // console.error('Browser Offline!');
    } else {
      if (error instanceof HttpErrorResponse) {
        // Server or connection error happened
        if (!navigator.onLine) {
            // console.error('Browser Offline!');
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
