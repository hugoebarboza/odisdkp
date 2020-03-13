import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { GLOBAL } from '../global';

// ERROR
import { ErrorsHandler } from 'src/app/providers/error/error-handler';


@Injectable({
  providedIn: 'root'
})
export class KpiService {

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
          .catch((error) => { this._handleError.handleError (error); }
          );
        }
      } catch (err) {
          console.log(err);
      }
    }

    async getQueryPromise(query: string, token: any) {
      if (!token || !query) {
        return;
      }

      try {
        const url = this.url;
        const href = url + query;
        const requestUrl = href;
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        /*
        if(!requestUrl){
          throw new Error(`Error HTTP ${requestUrl}`);
        }else {
          return this._http.get<any>(requestUrl, {headers: headers}).toPromise()
          .then((data)=>{ return data; })
          .catch((error)=>{
            return error; }
            //throw new Error(`Error HTTP ${requestUrl}, ${error}`);
        );
        }*/


        return await new Promise((resolve, reject) => {
          if (token === '') { reject(); }
          if (query === '') { reject(); }
          resolve(this._http.get<any>(requestUrl, {headers: headers}));
          })
          .catch((err) => {console.log(err); });

      } catch (err) {
          console.log(err);
      }


    }


    getProjectKpi(token: any, id: number, termino: string) {
      if (!token) {
        return;
      }
      return this.getQueryPromise('project/' + id + '/kpi/' + termino, token);
    }

    getProjectKpiByDate(token: any, id: number, termino: string) {
      if (!token) {
        return;
      }
      return this.getQueryPromise('projectbydate/' + id + '/kpi/' + termino, token);
    }


    getProjectKpiGroupedByLocation(token: any, id: number, termino: string, service: number) {
      if (!token) {
        return;
      }
      return this.getQueryPromise('projectbygroupedlocation/' + id + '/kpi/' + termino + '/service/' + service, token);
    }

    getProjectKpiGroupedByST(token: any, id: number, termino: string, service: number) {
      if (!token) {
        return;
      }
      return this.getQueryPromise('projectbygroupedservicetype/' + id + '/kpi/' + termino + '/service/' + service, token);
    }

    getProjectKpiGroupedByStatus(token: any, id: number, termino: string, service: number) {
      if (!token) {
        return;
      }
      return this.getQueryPromise('projectbygroupedstatus/' + id + '/kpi/' + termino + '/service/' + service, token);
    }


    getProjectKpiGroupedByUser(token: any, id: number, termino: string, service: number) {
      if (!token) {
        return;
      }
      return this.getQueryPromise('projectbygroupeduser/' + id + '/kpi/' + termino + '/service/' + service, token);
    }


    getProjectKpiService(token: any, id: number, termino: string, status: number, service: number) {
      if (!token) {
        return;
      }
      return this.getQueryPromise('project/' + id + '/kpi/' + termino + '/status/' + status + '/service/' + service, token);
    }

    getProjectKpiServiceByDate(token: any, id: number, termino: string, status: number, service: number) {
      if (!token) {
        return;
      }
      return this.getQueryPromise('project/' + id + '/kpi/' + termino + '/status/' + status + '/servicebydate/' + service, token);
    }

    getProjectKpiServiceByDateTime(token: any, id: number, termino: string, service: number, fromdate: any, todate: any) {
      if (!token) {
        return;
      }

      let paginate = null;

      if (fromdate !== 'Undefined' && fromdate !== null && todate !== 'Undefined' && todate !== null) {
        paginate = `?fromdate=${fromdate}&todate=${todate}`;
      }
      if (paginate === null) {
        return this.getQuery('project/' + id + '/kpi/' + termino + '/servicebydatetime/' + service, token);
      }

      if (paginate !== null) {
        return this.getQuery('project/' + id + '/kpi/' + termino + '/servicebydatetime/' + service + paginate, token);
      }
    }

    getProjectKpiServiceByGroupedYear(token: any, id: number, service: number) {
      if (!token) {
        return;
      }
      return this.getQueryPromise('projectbygroupedyear/' + id + '/kpi/1/service/' + service, token);
    }


    getProjectKpiServiceByGroupedYearAssigned(token: any, id: number, service: number) {
      if (!token) {
        return;
      }
      return this.getQueryPromise('projectbygroupedyearassigned/' + id + '/kpi/1/service/' + service, token);
    }


    getProjectKpiServiceByOrderCreated(token: any, id: number, termino: string, service: number) {
      if (!token) {
        return;
      }
      return this.getQueryPromise('projectbyordercreated/' + id + '/kpi/' + termino + '/service/' + service, token);

    }

    getProjectKpiServiceByStatusAndDate(token: any, id: number, termino: string, year: any, status: number, service: number) {
      if (!token) {
        return;
      }
      return this.getQueryPromise('project/' + id + '/kpi/' + termino + '/year/' + year + '/status/' + status + '/servicebystatusanddate/' + service, token);
    }

    getProjectKpiServiceByUser(token: any, id: number, termino: string, status: number, service: number, userid: number) {
      if (!token) {
        return;
      }
      return this.getQueryPromise('project/' + id + '/user/' + userid + '/kpi/' + termino + '/status/' + status + '/servicebyuser/' + service, token);
    }


    getProjectKpiServiceByLocation(token: any, id: number, country: number, termino: string, status: number, service: number) {
      if (!token) {
        return;
      }
      return this.getQueryPromise('project/' + id + '/kpi/' + termino + '/status/' + status + '/service/' + service + '/location/' + country, token);
    }



    getProjectKpiServiceByUsers(token: any, id: number, termino: string, status: number, service: number) {
      if (!token) {
        return;
      }
      return this.getQueryPromise('projectbyuser/' + id + '/kpi/' + termino + '/status/' + status + '/service/' + service, token);
    }


    getProjectKpiServiceByTimeAvg(token: any, id: number, termino: string, service: number) {
      if (!token) {
        return;
      }
      return this.getQueryPromise('projectbytimeavg/' + id + '/kpi/' + termino + '/service/' + service, token);
    }


    getProjectKpiServiceType(token: any, id: number, termino: string, status: number, service: number, servicetype: number) {
      if (!token) {
        return;
      }
      return this.getQueryPromise('project/' + id + '/kpi/' + termino + '/status/' + status + '/service/' + service + '/servicetypebystatus/' + servicetype, token);
    }

    getProjectKpiServiceTypeByDate(token: any, id: number, termino: string, status: number, service: number, servicetype: number) {
      if (!token) {
        return;
      }
      return this.getQueryPromise('project/' + id + '/kpi/' + termino + '/status/' + status + '/service/' + service + '/servicetypebydate/' + servicetype, token);
    }

    getUserOrdenesKpi(token: any, id: number, termino: string) {
      if (!token) {
        return;
      }

      const paginate = `?termino=${termino}`;
        return this.getQueryPromise('user/' + id + '/orderkpi' + paginate, token);
    }




}
