import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from '../global';
import {BehaviorSubject} from 'rxjs';
import 'rxjs/add/operator/map';

import swal from 'sweetalert';

//MODELS
import {  Order, ServiceType, ServiceEstatus } from 'src/app/models/types';


//TOASTER MESSAGES
import { ToastrService } from 'ngx-toastr';

  
@Injectable()
	export class OrderserviceService {	

		public url:string;
		private order: Order[] = [];
		private servicetype: ServiceType[];
		//dataChange: BehaviorSubject<Order[]>;		
		dialogData: any;
		error: boolean;  
		
		dataChange: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);		

		constructor(
			public _http: HttpClient,
			private toasterService: ToastrService,
			)
		{
			this.url = GLOBAL.url;
			this.error = false;
		}

	
 	getDialogData() {
    	return this.dialogData;
  	}


  getQuery( query:string, token: string | string[] ): Observable<any>{
		const url = this.url+query;
		const headers = new HttpHeaders({
		'Content-Type': 'application/json'
		});
		return this._http.get(url, {headers: headers}).map((res: any) => {
      			return res;
		});		
  }

  getOrderDetail(orderid: number, token: any){
    if(!orderid || !token){
      return;
    }
    
    return this.getOrderData('orderdetail/'+orderid, token);
  }



  getServiceOrder(filter: string, fieldValue:string, columnValue:string, fieldValueDate:string, columnDateDesdeValue:string, columnDateHastaValue:string, fieldValueRegion:string, columnValueRegion:string, fieldValueUsuario:string, columnValueUsuario:string, sort: string, order: string, pageSize: number, page: number, id:number, token: any){
    //console.log(sort);
    if(!fieldValue){
      fieldValue = '';
    }

    if(!order){
      order = 'desc';
    }
    if(!sort){
      sort = 'create_at';
    }
    
    const paginate = `?filter=${filter}&fieldValue=${fieldValue}&columnValue=${columnValue}&fieldValueDate=${fieldValueDate}&columnDateDesdeValue=${columnDateDesdeValue}&columnDateHastaValue=${columnDateHastaValue}&fieldValueRegion=${fieldValueRegion}&columnValueRegion=${columnValueRegion}&fieldValueUsuario=${fieldValueUsuario}&columnValueUsuario=${columnValueUsuario}&sort=${sort}&order=${order}&limit=${pageSize}&page=${page + 1}`;
    //console.log(paginate);
    //const paginate = `?page=${page + 1}`;
    return this.getOrderData('service/'+id+'/order'+paginate, token);
  }



  getProjectShareOrder(filter: string, fieldValue:string, columnValue:string, fieldValueDate:string, columnDateDesdeValue:string, columnDateHastaValue:string, fieldValueRegion:string, columnValueRegion:string, fieldValueUsuario:string, columnValueUsuario:string, fieldValueEstatus:string, columnValueEstatus:string, columnTimeFromValue:any, columnTimeUntilValue:any, columnValueZona:number, idservicetype:number, sort: string, order: string, pageSize: number, page: number, id:number, idservice:number, token: any, event: number) {
    //console.log(sort);
    if(!fieldValue){
      fieldValue = '';
    }

    if(!order){
      order = 'desc';
    }
    if(!sort){
      sort = 'create_at';
    }
    
    const paginate = `?filter=${filter}&fieldValue=${fieldValue}&columnValue=${columnValue}&fieldValueDate=${fieldValueDate}&columnDateDesdeValue=${columnDateDesdeValue}&columnDateHastaValue=${columnDateHastaValue}&fieldValueRegion=${fieldValueRegion}&columnValueRegion=${columnValueRegion}&fieldValueUsuario=${fieldValueUsuario}&columnValueUsuario=${columnValueUsuario}&fieldValueEstatus=${fieldValueEstatus}&columnValueEstatus=${columnValueEstatus}&columnTimeFromValue=${columnTimeFromValue}&columnTimeUntilValue=${columnTimeUntilValue}&columnValueZona=${columnValueZona}&idservicetype=${idservicetype}&event=${event}&sort=${sort}&order=${order}&limit=${pageSize}&page=${page + 1}`;
    //console.log('-----------------------------');
    //console.log(paginate);
    //const paginate = `?page=${page + 1}`;
    return this.getOrderData('projectservice/'+id+'/service/'+idservice+'/share'+paginate, token);
  }


   getOrderData(query:string, token: any): Promise<any> {
    const url = this.url;
    const href = url+query;
    const requestUrl = href;
    //console.log(requestUrl);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    //console.log(headers);
    return new Promise((resolve, reject) => {
      if (token == '')
          reject('Sin Token');
      if (query == '')
          reject('Sin Query Consulta');
      
      resolve(this._http.get<Order>(requestUrl, {headers: headers}));
    
    });


    }

	getOrderService(token: any, id: string): Observable<any> {								  
		return this.getQuery('service/'+id+'/order', token);
	}

	getShowOrderService(token: any, id: string, orderid: string): Observable<any> {								  
		return this.getQuery('service/'+id+'/order/'+orderid, token);
	}

	getFirmaImageOrder(token: any, id: string): Observable<any> {								  
		return this.getQuery('order/'+id+'/firmaimage', token);
	}

	
	getListImageOrder(token: any, id: string): Observable<any> {								  
		return this.getQuery('order/'+id+'/listimage', token);
	}

	getShowImageOrder(token: any, id: string): Observable<any> {								  
		return this.getQuery('image/'+id, token);
	}


	getService(token: any, id: string | number): Observable <any> {	
		return this.getQuery('service/'+id, token);		
	}

	getAtributoServiceType (token: any, id: string): Observable<any> {
		return this.getQuery('servicetype/'+id+'/atributo', token);
	}


	getServiceType (token: any, id: string | number): Observable<any> {
		return this.getQuery('service/'+id+'/servicetype', token);
	}

	getServiceEstatus (token: any, id: string | number): Observable<any> {
		return this.getQuery('service/'+id+'/estatus', token);
	}

	getCustomer(token: any, termino:string, id:number): Observable<any> {
		return this.getQuery('search/'+termino+'/'+id, token);		
	}


  add(token: any, order: Order, id:number): void {
		if (!token){
			return;
		}

		let json = JSON.stringify(order);
		let params = 'json='+json;
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');	
		this._http.post(this.url+'project'+'/'+id+'/'+'order', params, {headers: headers}).subscribe(
    		(data: any) => { 
    			  this.dialogData = order;    		      
						//this.toasterService.success('Orden de Trabajo creada.', 'Exito', {timeOut: 6000,});
						if(data.status === 'success'){
							swal('Creada Orden de Trabajo: ', this.dialogData.order_number +' exitosamente.', 'success' );
						}else{
							swal('N. Orden de Trabajo: ', this.dialogData.order_number +' no fue posible crearla.' , 'error');
						}
					
			      },
			      (err: HttpErrorResponse) => {	
						this.error = err.error.message;
						//console.log('viene');
						//console.log(<any>err);
						swal('No fue posible procesar su solicitud', err.error.message, 'error');
			      //console.log(err.error.message);
			      //this.toasterService.error('Error: '+this.error, 'Error', {timeOut: 6000,});
			    });
	}


	addEstatus(token: any, data: ServiceEstatus, id:number): Observable<any> {
		if (!token){
			return;
		}

		let json = JSON.stringify(data);
		let params = 'json='+json;
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');	
										 
		return this._http.post(this.url+'service/'+id+'/estatus/', params, {headers: headers})
		.map( (resp: any) => {
			return resp;
		});				
	}

  update(token: any, orderid:number, order: Order, id:number): void {	
		if (!token){
			return;
		}

		let json = JSON.stringify(order);
		let params = 'json='+json;


		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');							  
		this._http.put(this.url+'project'+'/'+id+'/'+'order/'+orderid, params, {headers: headers}).subscribe(
    		(data: any) => { 
							//console.log(data.status);
							//this.toasterService.success('Orden de Trabajo actualizada.', 'Exito', {timeOut: 6000,});
    			    this.dialogData = order;   		      						
							if(data.status === 'success'){
								swal('Actualizada Orden de Trabajo: ', this.dialogData.order_number +' exitosamente.', 'success' );
							}else{
								swal('N. Orden de Trabajo: ', this.dialogData.order_number +' no actualizada.' , 'error');
							}
			      },
			      (err: HttpErrorResponse) => {
						//this.error = err.error.message;							
						//this.toasterService.error('Error: '+this.error, 'Error', {timeOut: 6000,});
						swal('No fue posible procesar su solicitud', err.error.message, 'error');
					})
					;
	}


	updateEstatus(token: any, data:ServiceEstatus, id:number): Observable<any>{
		if (!token){
			return;
		}

		let json = JSON.stringify(data);
		let params = 'json='+json;

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

		return this._http.post(this.url+'estatus/'+id, params, {headers: headers})
						 .map( (resp: any) => {
							 return resp;
						 });				
	}

	updateMass(token: any, data:any, id:number, paramset: string, paramvalue: number): Observable<any>{
		if (!token){
			return;
		}

		let json = JSON.stringify(data);
		let params = 'json='+json;

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		let Url = this.url+'service/'+id+'/orderupdatemass/'+paramset+'/value/'+paramvalue;
	

		return this._http.post(Url, params, {headers: headers})
						 .map( (resp: any) => {
							 return resp;
						 });				
	}



	deleteEstatus(token: any, id:number): Observable<any>{

		if (!token){
			return;
		}

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this._http.delete(this.url+'estatus/'+id, {headers: headers})
						 .map( (resp: any) => {
							 return resp;
						 });				
	}


 	delete(token: any, orderid:number, id: number): void { 	 	
		if (!token){
			return;
		}

	let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');							      
    
		this._http.delete(this.url+'project'+'/'+id+'/'+'order/'+orderid, {headers: headers}).subscribe(
			(data: any) => {
				if(data.status === 'success'){
					swal('Eliminada Orden de Trabajo con identificador: ', orderid +' exitosamente.', 'success' );
				}else{
					swal('Orden de Trabajo con identificador: ', orderid +' no eliminada.' , 'error');
				}
      	//this.toasterService.success('Orden de Trabajo eliminada.', 'Exito', {timeOut: 6000,});
      },
      (err: HttpErrorResponse) => {
				this.error = err.error.message;
				swal('No fue posible procesar su solicitud', '', 'error');
        //this.toasterService.error('Error: '+this.error, 'Error', {timeOut: 6000,});
      });
	}

		
  important(token: any, id:number, orderid:number, label:number): void {	
			let json = JSON.stringify(label);
			let params = 'json='+json;
			let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');							  
			this._http.post(this.url+'project'+'/'+id+'/'+'order/'+orderid+'/importantorder/'+label, params, {headers: headers}).subscribe(
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
