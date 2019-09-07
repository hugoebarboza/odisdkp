import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { GLOBAL } from '../global';


@Injectable({
  providedIn: 'root'
})
export class KpiService {

  error: boolean;
  url:string;

  constructor(
    public _http: HttpClient,
  ) { 
    this.url = GLOBAL.url;
    this.error = false;
    }

    getQueryPromise(query:string, token:any) {
		if(!token){
			return;
		}
	    const url = this.url;
	    const href = url+query;
	    const requestUrl = href;
	    //console.log(requestUrl);
	    const headers = new HttpHeaders({'Content-Type': 'application/json'});

	    return new Promise((resolve, reject) => {
	      if (token == '')
	          reject();
	      if (query == '')
	          reject();
	      resolve(this._http.get<any>(requestUrl, {headers: headers}));
	      })
    }


    getProjectKpi(token:any, id:number, termino:string) {
      if(!token){
        return;
      }
      return this.getQueryPromise('project/'+id+'/kpi/'+termino, token);
    }

    getProjectKpiByDate(token:any, id:number, termino:string) {
      if(!token){
        return;
      }
      return this.getQueryPromise('projectbydate/'+id+'/kpi/'+termino, token);
    }


    getProjectKpiService(token:any, id:number, termino:string, status:number, service:number) {
      if(!token){
        return;
      }
      return this.getQueryPromise('project/'+id+'/kpi/'+termino+'/status/'+status+'/service/'+service, token);
    }

    getProjectKpiServiceByDate(token:any, id:number, termino:string, status:number, service:number) {
      if(!token){
        return;
      }                           
      return this.getQueryPromise('project/'+id+'/kpi/'+termino+'/status/'+status+'/servicebydate/'+service, token);
    }

    getProjectKpiServiceByUser(token:any, id:number, termino:string, status:number, service:number, userid:number) {
      if(!token){
        return;
      }
      return this.getQueryPromise('project/'+id+'/user/'+userid+'/kpi/'+termino+'/status/'+status+'/servicebyuser/'+service, token);
    }

    getProjectKpiServiceType(token:any, id:number, termino:string, status:number, service:number, servicetype:number) {
      if(!token){
        return;
      }
      return this.getQueryPromise('project/'+id+'/kpi/'+termino+'/status/'+status+'/service/'+service+'/servicetypebystatus/'+servicetype, token);
    }

    getProjectKpiServiceTypeByDate(token:any, id:number, termino:string, status:number, service:number, servicetype:number) {
      if(!token){
        return;
      }
      return this.getQueryPromise('project/'+id+'/kpi/'+termino+'/status/'+status+'/service/'+service+'/servicetypebydate/'+servicetype, token);
    }



}
