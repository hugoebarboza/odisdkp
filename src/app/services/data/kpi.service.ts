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

    async getQueryPromise(query:string, token:any) {
      if(!token){
        return;
      }

      try {
        const url = this.url;
        const href = url+query;
        const requestUrl = href;
        const headers = new HttpHeaders({'Content-Type': 'application/json'});        
        //return await this._http.get<any>(requestUrl, {headers: headers});

        if(!requestUrl){
          return;
        }  
        
        return await new Promise((resolve, reject) => {
          if (token == '') reject();
          if (query == '') reject();
          resolve(this._http.get<any>(requestUrl, {headers: headers}));
          })
          .catch((err) => {console.log(err);})
  
      } catch (err) {
          console.log(err)
      }


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


    getProjectKpiGroupedByLocation(token:any, id:number, termino:string, service:number){
      if(!token){
        return;
      }
      return this.getQueryPromise('projectbygroupedlocation/'+id+'/kpi/'+termino+'/service/'+service, token);
    }

    getProjectKpiGroupedByUser(token:any, id:number, termino:string, service:number){
      if(!token){
        return;
      }
      return this.getQueryPromise('projectbygroupeduser/'+id+'/kpi/'+termino+'/service/'+service, token);
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


    getProjectKpiServiceByGroupedYear(token:any, id:number, service:number){
      if(!token){
        return;
      }
      return this.getQueryPromise('projectbygroupedyear/'+id+'/kpi/1/service/'+service, token);
    }


    getProjectKpiServiceByGroupedYearAssigned(token:any, id:number, service:number){
      if(!token){
        return;
      }
      return this.getQueryPromise('projectbygroupedyearassigned/'+id+'/kpi/1/service/'+service, token);
    }


    getProjectKpiServiceByOrderCreated(token:any, id:number, termino:string, service:number){
      if(!token){
        return;
      }
      return this.getQueryPromise('projectbyordercreated/'+id+'/kpi/'+termino+'/service/'+service, token);

    }

    getProjectKpiServiceByStatusAndDate(token:any, id:number, termino:string, year:any, status:number, service:number) {
      if(!token){
        return;
      }
      return this.getQueryPromise('project/'+id+'/kpi/'+termino+'/year/'+year+'/status/'+status+'/servicebystatusanddate/'+service, token);
    }

    getProjectKpiServiceByUser(token:any, id:number, termino:string, status:number, service:number, userid:number) {
      if(!token){
        return;
      }
      return this.getQueryPromise('project/'+id+'/user/'+userid+'/kpi/'+termino+'/status/'+status+'/servicebyuser/'+service, token);
    }


    getProjectKpiServiceByLocation(token:any, id:number, country:number, termino:string, status:number, service:number) {
      if(!token){
        return;
      }
      return this.getQueryPromise('project/'+id+'/kpi/'+termino+'/status/'+status+'/service/'+service+'/location/'+country, token);
    }

  

    getProjectKpiServiceByUsers(token:any, id:number, termino:string, status:number, service:number) {
      if(!token){
        return;
      }
      return this.getQueryPromise('projectbyuser/'+id+'/kpi/'+termino+'/status/'+status+'/service/'+service, token);
    }


    getProjectKpiServiceByTimeAvg(token:any, id:number, termino:string, service:number) {
      if(!token){
        return;
      }
      return this.getQueryPromise('projectbytimeavg/'+id+'/kpi/'+termino+'/service/'+service, token);
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

    getUserOrdenesKpi(token:any, id:number, termino: string) {
      if(!token){
        return;
      }
        
      const paginate = `?termino=${termino}`;
        return this.getQueryPromise('user/'+id+'/orderkpi'+paginate, token);
    }

}
