import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http';
import { GLOBAL } from '../global';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
//import { map } from 'rxjs/add/operator/map';

//MODELS
import { Customer } from '../../models/types';

//TOASTER MESSAGES
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert';


@Injectable()
export class CustomerService {
	public url:string;
	dialogData: any;
	error: boolean;  

  constructor(
	public _http: HttpClient,
	private toasterService: ToastrService,
  	) 
  { 
	this.url = GLOBAL.url;
	this.error = false;
  }

  private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
 
    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead
 
    // TODO: better job of transforming error for user consumption
    console.log(`${operation} failed: ${error.message}`);
 
    // Let the app keep running by returning an empty result.
    return;
  };
}


  	getQuery( query:string, token ){  		
		const url = this.url+query;
		//console.log(url);
		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': token
			});
		return this._http.get(url, {headers: headers}).pipe(map((res: any) => {
	      			return res;
		}));		

 	}



  getCustomerProject(filter: string, fieldValue:string, columnValue:string, fieldValueDate:string, columnDateDesdeValue:string, columnDateHastaValue:string, fieldValueRegion:string, columnValueRegion:string, sort: string, order: string, pageSize: number, page: number, id:number, token) {
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
    
    const paginate = `?filter=${filter}&fieldValue=${fieldValue}&columnValue=${columnValue}&fieldValueDate=${fieldValueDate}&columnDateDesdeValue=${columnDateDesdeValue}&columnDateHastaValue=${columnDateHastaValue}&fieldValueRegion=${fieldValueRegion}&columnValueRegion=${columnValueRegion}&sort=${sort}&order=${order}&limit=${pageSize}&page=${page + 1}`;
    //console.log(paginate);
    //const paginate = `?page=${page + 1}`;
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


   getCustomerData(query:string, token) {
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
    	
		let json = JSON.stringify(customer);
		let params = 'json='+json;
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
									   .set('Authorization', token);							  
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
						swal('No fue posible procesar su solicitud', '', 'error');
			      //console.log(err.error.message);
			      //this.toasterService.error('Error: '+this.error, 'Error', {timeOut: 6000,});
			    });			   
	}

    update(token, customer: Customer, id:number, customerid:number): void {	
    	
		let json = JSON.stringify(customer);
		let params = 'json='+json;
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
									   .set('Authorization', token);							  
		this._http.patch(this.url+'project/'+id+'/customer/'+customerid, params, {headers: headers}).subscribe(
    		data => { 
    			  //console.log(data);
						this.dialogData = customer;   
						swal('Cliente con ID: ', customerid +' actualizado exitosamente.', 'success' ); 		      
			      //this.toasterService.success('Cliente actualizado.', 'Exito', {timeOut: 6000,});
			      },
			      (err: HttpErrorResponse) => {	
						this.error = err.error.message;
						swal('No fue posible procesar su solicitud', '', 'error');
			      //console.log(err.error.message);
			      //this.toasterService.error('Error: '+this.error, 'Error', {timeOut: 6000,});
			    });			   
	}


 	delete(token, id: number, customerid:number): void { 	 
 	//console.log(customerid);
	let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
								   .set('Authorization', token);							      
    
    this._http.delete(this.url+'project'+'/'+id+'/'+'customer/'+customerid, {headers: headers}).subscribe(data => {         
			//this.toasterService.success('Cliente Eliminado.', 'Exito', {timeOut: 6000,});
				swal('Cliente con ID: ', customerid +' eliminado exitosamente.', 'success' ); 		      
      },
      (err: HttpErrorResponse) => {
				this.error = err.error.message;
				swal('No fue posible procesar su solicitud', '', 'error');
        //this.toasterService.error('Error: '+this.error, 'Error', {timeOut: 6000,});
      });
  	}





}
