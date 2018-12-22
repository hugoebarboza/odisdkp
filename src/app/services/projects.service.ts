import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs/';
import { catchError, tap, map } from 'rxjs/operators';
import { GLOBAL } from './global';

//MODELS
import { Order } from '../models/order';
import { UserGeoreference } from '../models/usergeoreference';


@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  	public url:string;
  	error: boolean;  

  constructor(
	public _http: HttpClient,  	
  	) { 
	this.url = GLOBAL.url;
	this.error = false;

  }


  	getQuery( query:string, token ): Observable<any>{
	const url = this.url+query;
	const headers = new HttpHeaders({
		'Content-Type': 'application/json',
		'Authorization': token
	});
		return this._http.get(url, {headers: headers}).pipe(map((res: any) => {
      			return res;
		}));		
  	}

	getProjectOrder(token, id:number, termino, date, idstatus, serviceid, servicetypeid) {
		const paginate = `/${termino}/date/${date}/status/${idstatus}/service/${serviceid}/servicetype/${servicetypeid}`;			           
	    //console.log(paginate);
	    return this.getProjectOrderData('project/'+id+'/searchorder'+paginate, token);
	}

	getProjectUser(token, id:number, role:number) {
	    return this.getProjectOrderData('project/'+id+'/role/'+role, token);
	}


	getProjectUserGeoreference(token, id:number) {
	    return this.getProjectOrderData('project/'+id+'/usergeoreference', token);
	}

	gettUserGeoreference(token, id:number, columnDateDesdeValue:string, columnTimeFromValue:any, columnTimeUntilValue:any) {
	    const paginate = `?columnDateDesdeValue=${columnDateDesdeValue}&columnTimeFromValue=${columnTimeFromValue}&columnTimeUntilValue=${columnTimeUntilValue}`;		
	    return this.getProjectOrderData('user/'+id+'/georeference'+paginate, token);
	}

	gettUserOrdenesGeoreference(token, id:number, userid:number) {
	    return this.getProjectOrderData('project/'+id+'/user/'+userid+'/ordergeoreference', token);
	}


    getProjectOrderData(query:string, token) {
	    const url = this.url;
	    const href = url+query;
	    const requestUrl = href;
	    //console.log(requestUrl);
	    const headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': token});

	    return new Promise((resolve, reject) => {
	      if (token == '')
	          reject();
	      if (query == '')
	          reject();
	      resolve(this._http.get<Order>(requestUrl, {headers: headers}));
	      })
    }


	getUserProject(token, id, role): Observable<any> {								  
		return this.getQuery('project/'+id+'/role/'+role, token);
	}

}
