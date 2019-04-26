import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from '../global';

import 'rxjs/add/operator/map';



@Injectable({
  providedIn: 'root'
})
export class CountriesService {
	public url:string;

  constructor(
	public _http: HttpClient,
  ) 
  { 
	this.url = GLOBAL.url;
  }

  	getQuery( query:string, token ){  		
		const url = this.url+query;
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);							  							 

		return this._http.get(url, {headers: headers}).map((res: any) => {			
      			//console.log('res', res);
      			return res;
		});
 	}

	getRegion(token, id): Observable<any>{		
		return this.getQuery('country/'+id+'/region', token);							  		
	}

	getProvincia(token, id): Observable<any>{		
		return this.getQuery('region/'+id+'/provincia', token);
	}


	getComuna(token, id): Observable<any>{		
		return this.getQuery('provincia/'+id+'/comuna', token);
	}


}
