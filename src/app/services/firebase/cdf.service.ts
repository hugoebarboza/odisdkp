import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';



@Injectable()
export class CdfService  {

    public headers: Headers = undefined;
    public key: string;
    public url:string;
	

	constructor(		
		private _http: Http,
		private afs: AngularFirestore,
	){
        this.url = environment.global.urlcdf;
        this.key = environment.global.cdfkey;
        this.headers = undefined;
	}


	addNotification(token=null, params:any){
	if(!token){
		return;
	}
	return new Promise<any>((resolve, reject) => {
		this.afs.collection('fcmnotification').add({
			body: params.message,
			title: params.title,
			create_at: params.create_at,
			create_by: params.userId
		})
		.then(function(docRef) {
			console.log('Document written with ID: ', docRef.id);
			resolve(docRef);
		}, err => reject(err))
    	});
	}


	fcmsend(token=null, params:any): Observable<any>{
		if(!token){
            return;
		}

        let headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });
		
		return this._http.post(this.url+'fcmSend', params, {headers: headers})
			.map( (resp: any) => {
				return resp;
			}).catch( err => {
				return Observable.throw( err );
			});		
	}


	httpEmail(token=null, params:any): Observable<any>{
		if(!token){
            return;
		}

		let headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });

		const endpoint = 'https://us-central1-odisdkp.cloudfunctions.net/httpEmail';

		return this._http.post(endpoint, params, {headers: headers})
			.map( (resp: any) => {
				return resp;
			}).catch( err => {
				return err ;
			});		
	}


}

