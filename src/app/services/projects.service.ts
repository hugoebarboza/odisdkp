import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/';
import { map } from 'rxjs/operators';
import { GLOBAL } from './global';

//MODELS
import { Order } from '../models/order';
import { Service } from '../models/Service';

//TOASTER MESSAGES
import { ToastrService } from 'ngx-toastr';

import swal from 'sweetalert';


@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  	public url:string;
  	error: boolean;  

  constructor(
	public _http: HttpClient,
	private toasterService: ToastrService, 	
  	) { 
	this.url = GLOBAL.url;
	this.error = false;

  }

	addService(token: any, service: Service, id:number): void {	
		let json = JSON.stringify(service);
		let params = 'json='+json;
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
									.set('Authorization', token);	

		this._http.post(this.url+'project'+'/'+id+'/'+'service', params, {headers: headers}).subscribe(
			(data:any) => { 

				if(data.status === 'success'){
					swal('Proyecto creado exitosamente con ID: ', data.lastInsertedId +'.', 'success' );
				}else{
					swal('No fue posible procesar su solicitud', '', 'error');
				}

				//this.toasterService.success('Proyecto creado.', 'Exito', {timeOut: 6000,});
				},
				(err: HttpErrorResponse) => {	
				this.error = err.error.message;			      
				//console.log(err.error.message);
				//this.toasterService.error('Error: '+this.error, 'Error', {timeOut: 6000,});
				swal('No fue posible procesar su solicitud', '', 'error');
				});
	}

    updateService(token: any, service: Service, id:number, service_id:number): void {	
		let json = JSON.stringify(service);
		let params = 'json='+json;
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
									   .set('Authorization', token);

		this._http.put(this.url+'project'+'/'+id+'/'+'service'+'/'+service_id, params, {headers: headers}).subscribe(
    		(data:any) => { 
				  //this.toasterService.success('Proyecto actualizado.', 'Exito', {timeOut: 6000,});
					if(data.status === 'success'){
						swal('Proyecto actualizado exitosamente con ID: ', id +'.', 'success' );
					}else{
						swal('No fue posible procesar su solicitud', '', 'error');
					}				  
			      },
			      (err: HttpErrorResponse) => {	
			      this.error = err.error.message;
			      //console.log(err.error.message);
				  //this.toasterService.error('Error: '+this.error, 'Error', {timeOut: 6000,});
				  swal('No fue posible procesar su solicitud', '', 'error');
			    });
	}
	
    deleteService(token: any, id:number, service_id:number): void {	
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
									   .set('Authorization', token);									   									   
		this._http.delete(this.url+'project'+'/'+id+'/'+'service'+'/'+service_id, {headers: headers}).subscribe(
    		(data: any) => { 
				  //this.toasterService.success('Proyecto eliminado.', 'Exito', {timeOut: 6000,});
					if(data.status === 'success'){
						swal('Proyecto eliminado exitosamente con ID: ', id +'.', 'success' );
					}else{
						swal('No fue posible procesar su solicitud', '', 'error');
					}				  
			      },
			      (err: HttpErrorResponse) => {	
			      this.error = err.error.message;
			      //console.log(err.error.message);
				  //this.toasterService.error('Error: '+this.error, 'Error', {timeOut: 6000,});
				  swal('No fue posible procesar su solicitud', '', 'error');
			    });
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


	getProject(token:any, id:number){
	    return this.getProjectOrderData('project/'+id, token);
	}


	getProjectOrder(token, id:number, termino, date, idstatus, serviceid, servicetypeid) {
		const paginate = `/${termino}/date/${date}/status/${idstatus}/service/${serviceid}/servicetype/${servicetypeid}?limit=All`;			           
	    //console.log(paginate);
	    return this.getProjectOrderData('project/'+id+'/searchorder'+paginate, token);
	}

	getProjectService(token:any, id:number){
	    return this.getQuery('project/'+id+'/service', token);
	}


	getProjectServiceCategorie(token:any, id:number){
	    return this.getQuery('project/'+id+'/servicecategorie', token);
	}

	getProjectServiceDetail(token:any, id:number){
	    return this.getQuery('project/'+id+'/servicedetail', token);
	}


	getProjectServiceType(token:any, id:number){
	    return this.getQuery('project/'+id+'/servicetype', token);
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

    status(token: any, id:number, serviceid:number, servicedetailid:number, label:number): void {	
		let json = JSON.stringify(label);
		let params = 'json='+json;
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
										 .set('Authorization', token);		
		this._http.post(this.url+'project'+'/'+id+'/'+'service/'+serviceid+'/'+'servicedetail/'+servicedetailid+'/status/'+label, params, {headers: headers}).subscribe(
				data => { 
						//console.log(data);
						//this.dialogData = order;    		      
						//this.toasterService.success('Orden de Trabajo actualizada.', 'Exito', {timeOut: 6000,});			      
						},
						(err: HttpErrorResponse) => {	
						this.error = err.error.message;
						//console.log(err.error.message);
						//this.toasterService.error('Error: '+this.error, 'Error', {timeOut: 6000,});
					});
	}


}
