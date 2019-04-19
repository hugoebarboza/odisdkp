import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/';
import { map } from 'rxjs/operators';
import { GLOBAL } from '../global';

@Injectable()
export class DashboardService {
	public url:string;

	constructor(
		public _http: HttpClient
	){
		this.url = GLOBAL.url;
	}



  	getQuery( query:string, token ): Observable<any>{
  	//const body = JSON.stringify({data});
	//const headers = new Headers({'Content-Type':'application/json'});
	const url = this.url+query;
	const headers = new HttpHeaders({
		'Content-Type': 'application/json',
		'Authorization': token
	});
		//console.log(headers);
		//return this._http.get(url, {headers:headers});  			
		return this._http.get(url, {headers: headers}).pipe(map((res: any) => {
      			//console.log('res', res);
      			return res;
		}));		
  	}

/*
  	getQuery( query:string, token ){  		
		const url = this.url+query;
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
									   .set('Authorization', token);							  							 

		return this._http.get(url, {headers: headers});  			
  	}
*/
	getDepartamentos(token): Observable<any> {
		/*
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
									.set('Authorization', token);							  
							
		return this._http.get(this.url+'departamento/'+id+'/proyecto',{headers: headers});
		*/
		return this.getQuery('departamento', token);

	}


	getProyectos(token, id): Observable<any> {
		/*
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
									   .set('Authorization', token);							  
							  
		return this._http.get(this.url+'departamento/'+id+'/proyecto',{headers: headers});
		*/
		return this.getQuery('departamento/'+id+'/proyecto', token);

	}

	getServicios(token, id): Observable<any> {
		/*
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
									   .set('Authorization', token);							  
							  
		return this._http.get(this.url+'departamento/'+id+'/proyecto',{headers: headers});
		*/
		return this.getQuery('project/'+id+'/service', token);

	}


}