import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from '../global';

import 'rxjs/add/operator/map';

@Injectable()
export class DashboardService {
	public url:string;

	constructor(
		public _http: HttpClient
	){
		this.url = GLOBAL.url;
	}



  	getQuery( query:string, token ): Observable<any>{
	const url = this.url+query;
	const headers = new HttpHeaders({
		'Content-Type': 'application/json',
	});
		return this._http.get(url, {headers: headers}).map((res: any) => {
      			return res;
		});		
  	}

	getDepartamentos(token): Observable<any> {
		return this.getQuery('departamento', token);
	}


	getProyectos(token, id): Observable<any> {
		return this.getQuery('departamento/'+id+'/proyecto', token);

	}

	getServicios(token, id): Observable<any> {
		return this.getQuery('project/'+id+'/service', token);
	}


}