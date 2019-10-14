import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { GLOBAL } from '../global';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

// MODELS
import { Customer } from '../../models/types';

// TOASTER MESSAGES
//import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert';


@Injectable()
export class CustomerService {
	public url:string;
	dialogData: any;
	error: boolean;  

  constructor(
	public _http: HttpClient,
	//private toasterService: ToastrService,
  	) 
  { 
	this.url = GLOBAL.url;
	this.error = false;
  }



  	getQuery( query:string, token: any ) {
    if (!token) {
       return;
    }
		const url = this.url+query;
		//console.log(url);
		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			});
		return this._http.get(url, {headers: headers}).map((res: any) => {
	      			return res;
		});		

 	}



  getCustomerProject(filter: string, fieldValue:string, columnValue:string, fieldValueDate:string, columnDateDesdeValue:string, columnDateHastaValue:string, fieldValueRegion:string, columnValueRegion:string, sort: string, order: string, pageSize: number, page: number, id:number, token) {
    if(!fieldValue){
      fieldValue = '';
    }

    if(!order){
      order = 'desc';
    }
    if(!sort){
      sort = 'create_at';
    }
    
    const paginate = `?filter=${filter}&fieldValue=${fieldValue}&columnValue=${columnValue}&fieldValueDate=${fieldValueDate}&columnDateDesdeValue=${columnDateDesdeValue}&columnDateHastaValue=${columnDateHastaValue}&fieldValueRegion=${fieldValueRegion}&columnValueRegion=${columnValueRegion}&sort=${sort}&order=${order}&limit=${pageSize}&page=${page + 1}`;
    return this.getCustomerData('project/'+id+'/customer'+paginate, token);
	}
	

	getCustomerShare(patio: string, sort: string, order: string, pageSize: number, idservice:number, token: any) {
    //console.log(sort);
    if(!order){
      order = 'asc';
    }
    if(!sort){
      sort = 'create_at';
    }
    
    const paginate = `?patio=${patio}&sort=${sort}&order=${order}&limit=${pageSize}`;
    //console.log('-----------------------------');
    //console.log(paginate);
    //const paginate = `?page=${page + 1}`;
    return this.getCustomerData('project/'+idservice+'/customershare/'+paginate, token);
  }


   getCustomerData(query: string, token: any) {
    if (!token) {
		return;
	 } 
    const url = this.url;
    const href = url + query;
    const requestUrl = href;
    //console.log(requestUrl);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return new Promise((resolve, reject) => {
      if (token == '')
          reject();
      if (query == '')
          reject();
      resolve(this._http.get<Customer>(requestUrl, {headers: headers}));
      })
    }


	getProjectCustomer(token, id:number): Observable<any> {	
	    //const paginate = `?page=${page + 1}`;
    	return this.getQuery('project/'+id+'/customer', token);
		//return this.getQuery('project/'+id+'/customer', token);
	}


	getProjectCustomerDetail(token, id:number, customerid:number): Observable<any> {
		return this.getQuery('project/'+id+'/customer/'+customerid, token);
	}

	getTarifa(token, id): Observable<any>{
		return this.getQuery('service/'+id+'/tarifa', token);
	}

	getConstante(token, id): Observable<any>{
		return this.getQuery('service/'+id+'/constante', token);							  		
	}

	getGiro(token, id): Observable<any>{
		return this.getQuery('service/'+id+'/giro', token);						  		
	}

	getSector(token, id): Observable<any>{	
		return this.getQuery('service/'+id+'/sector', token);				
	}

	getZona(token, id): Observable<any>{
		return this.getQuery('service/'+id+'/zona', token);
	}

	getMercado(token, id): Observable<any>{		
		return this.getQuery('service/'+id+'/mercado', token);						  		
	}


	getMarca(token): Observable<any>{		
		return this.getQuery('marca', token);						  		
	}

	getModelo(token, id): Observable<any>{		
		return this.getQuery('marca/'+id+'/modelo', token);						  		
	}


	getColor(token): Observable<any>{
		return this.getQuery('colors', token);
	}


    add(token, customer: Customer, id:number): void {	
			if(!token){
				return;
			}
    	
		let json = JSON.stringify(customer);
		let params = 'json='+json;
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');							  
		this._http.post(this.url+'project/'+id+'/customer', params, {headers: headers}).subscribe(
    		(data: any) => { 
    			  //console.log(data);
    			  this.dialogData = customer;    		      
						//this.toasterService.success('Cliente almacenado.', 'Exito', {timeOut: 6000,});
						if(data.status === 'success'){
							if(data.lastInsertedId){
								swal('Cliente almacenado con ID: ', data.lastInsertedId +' exitosamente.', 'success' );
							}else{
								swal('Cliente almacenado exitosamente.', 'success' );
							}
							
						}else{
							swal('No fue posible procesar su solicitud', '', 'error');
						}
						
			      },
			      (err: HttpErrorResponse) => {	
						this.error = err.error.message;
						swal('No fue posible procesar su solicitud', err.error.message, 'error');
			      //console.log(err.error.message);
			      //this.toasterService.error('Error: '+this.error, 'Error', {timeOut: 6000,});
			    });			   
	}

    update(token: any, customer: Customer, id: number, customerid: number): void {	

			if(!token){
				return;
			}
    	
		const json = JSON.stringify(customer);
		const params = 'json='+json;
		const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');							  
		this._http.patch(this.url+'project/'+id+'/customer/'+customerid, params, {headers: headers}).subscribe(
    		_data => { 
    			  //console.log(data);
						this.dialogData = customer;   
						swal('Cliente con ID: ', customerid +' actualizado exitosamente.', 'success' ); 		      
			      //this.toasterService.success('Cliente actualizado.', 'Exito', {timeOut: 6000,});
			      },
			      (err: HttpErrorResponse) => {	
						this.error = err.error.message;
						//console.log(<any>err);
						swal('No fue posible procesar su solicitud', err.error.message, 'error');
			      //console.log(err.error.message);
			      //this.toasterService.error('Error: '+this.error, 'Error', {timeOut: 6000,});
			    });			   
	}


 	delete(token: any, id: number, customerid:number): void {
    if (!token) {
       return;
    }
 	//console.log(customerid);
	const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    
    this._http.delete(this.url+'project'+'/'+id+'/'+'customer/'+customerid, {headers: headers}).subscribe(_data => {
				swal('Cliente con ID: ', customerid +' eliminado exitosamente.', 'success' ); 		      
      },
      (err: HttpErrorResponse) => {
				this.error = err.error.message;
				swal('No fue posible procesar su solicitud', '', 'error');
      });
  	}





}
