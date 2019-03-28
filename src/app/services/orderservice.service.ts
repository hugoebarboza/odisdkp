import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http';
import { catchError, tap, map , switchMap, debounceTime} from 'rxjs/operators';
import { Observable } from 'rxjs/';
import { GLOBAL } from './global';
import {BehaviorSubject} from 'rxjs';

//import { BehaviorSubject } from 'rxjs/';

//MODELS
import { Order } from '../models/order';
import { ServiceType } from '../models/ServiceType';

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
  	//console.log(query);
  	//const body = JSON.stringify({data});
	//const headers = new Headers({'Content-Type':'application/json'});
		const url = this.url+query;
		//console.log(url);
		const headers = new HttpHeaders({
		'Content-Type': 'application/json',
		'Authorization': token
	});
		//console.log(url);
		//console.log(headers);
		//return this._http.get(url, {headers:headers});  			
		return this._http.get(url, {headers: headers}).pipe(map((res: any) => {
      			//console.log('res', res);
      			return res;
		}));		
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



  getProjectShareOrder(filter: string, fieldValue:string, columnValue:string, fieldValueDate:string, columnDateDesdeValue:string, columnDateHastaValue:string, fieldValueRegion:string, columnValueRegion:string, fieldValueUsuario:string, columnValueUsuario:string, fieldValueEstatus:string, columnValueEstatus:string, columnTimeFromValue:any, columnTimeUntilValue:any, columnValueZona:number, idservicetype:number, sort: string, order: string, pageSize: number, page: number, id:number, idservice:number, token: any) {
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
    
    const paginate = `?filter=${filter}&fieldValue=${fieldValue}&columnValue=${columnValue}&fieldValueDate=${fieldValueDate}&columnDateDesdeValue=${columnDateDesdeValue}&columnDateHastaValue=${columnDateHastaValue}&fieldValueRegion=${fieldValueRegion}&columnValueRegion=${columnValueRegion}&fieldValueUsuario=${fieldValueUsuario}&columnValueUsuario=${columnValueUsuario}&fieldValueEstatus=${fieldValueEstatus}&columnValueEstatus=${columnValueEstatus}&columnTimeFromValue=${columnTimeFromValue}&columnTimeUntilValue=${columnTimeUntilValue}&columnValueZona=${columnValueZona}&idservicetype=${idservicetype}&sort=${sort}&order=${order}&limit=${pageSize}&page=${page + 1}`;
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
    const headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': token});

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
		let json = JSON.stringify(order);
		let params = 'json='+json;
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
									   .set('Authorization', token);	
		this._http.post(this.url+'project'+'/'+id+'/'+'order', params, {headers: headers}).subscribe(
    		data => { 
    			  this.dialogData = order;    		      
			      this.toasterService.success('Orden de Trabajo creada.', 'Exito', {timeOut: 6000,});
			      },
			      (err: HttpErrorResponse) => {	
			      this.error = err.error.message;			      
			      //console.log(err.error.message);
			      this.toasterService.error('Error: '+this.error, 'Error', {timeOut: 6000,});
			    });
	}


    update(token: any, orderid:number, order: Order, id:number): void {	
		let json = JSON.stringify(order);
		let params = 'json='+json;


		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
									   .set('Authorization', token);							  
		this._http.put(this.url+'project'+'/'+id+'/'+'order/'+orderid, params, {headers: headers}).subscribe(
    		data => { 
    			  //console.log(data);
    			  this.dialogData = order;    		      
			      this.toasterService.success('Orden de Trabajo actualizada.', 'Exito', {timeOut: 6000,});			      
			      },
			      (err: HttpErrorResponse) => {	
			      this.error = err.error.message;
			      //console.log(err.error.message);
			      this.toasterService.error('Error: '+this.error, 'Error', {timeOut: 6000,});
			    });
	}




 	delete(token: any, orderid:number, id: number): void { 	 	
	let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
								   .set('Authorization', token);							      
    
    this._http.delete(this.url+'project'+'/'+id+'/'+'order/'+orderid, {headers: headers}).subscribe(data => {         
      this.toasterService.success('Orden de Trabajo eliminada.', 'Exito', {timeOut: 6000,});
      },
      (err: HttpErrorResponse) => {
      	this.error = err.error.message;
        this.toasterService.error('Error: '+this.error, 'Error', {timeOut: 6000,});
      });
		}
		
    important(token: any, id:number, orderid:number, label:number): void {	
			let json = JSON.stringify(label);
			let params = 'json='+json;
			let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
											 .set('Authorization', token);							  
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
