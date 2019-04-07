import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/';
import 'rxjs/add/operator/map';

//MODELS
import { User } from '../../models/user';
import { Proyecto } from '../../models/proyecto';

//SETTINGS
import { GLOBAL } from '../global';

@Injectable()
export class UserService {
	public url:string;
	public idaccount;
	public identity;
	public token;	
	public proyectos: Array<Proyecto>;

	constructor(
		public _http: HttpClient,
		//private _route: ActivatedRoute,
		//private _router: Router

	){
		this.url = GLOBAL.url;
	}


  	getQuery( query:string, token ){  		
		const url = this.url+query;
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
									   .set('Authorization', token);							  							 

		return this._http.get(url, {headers: headers});  			
  	}


	register (user:any): Observable<any>{
		let json = JSON.stringify(user);
		let params = 'json='+json;

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this._http.post(this.url+'register', params, {headers: headers})
						 .map( (resp: any) => {
							   return resp;
						 });				
	}

	signup(user:any, getToken=null): Observable<any>{
		if(getToken != null){
			user.getToken = 'true';
		}
		let json = JSON.stringify(user);
		let params = 'json='+json;

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this._http.post(this.url+'logindkp', params, {headers: headers});
	}

	getIdaccount(){
		let idaccount = JSON.parse(localStorage.getItem('idaccount'));
		if (idaccount){
			this.idaccount = idaccount;
		}else{
			this.idaccount = null;
		}
		return this.idaccount;
	}

	public isIdaccount(): boolean {		
		const idaccount = JSON.parse(localStorage.getItem('idaccount'));		
		if (idaccount){
			return true;	
		}else{
			return false;
		}
	}


	getIdentity(){
		let identity = JSON.parse(localStorage.getItem('identity'));
		if (identity != "Undefined"){
			this.identity = identity;
		}else{
			this.identity = null;
		}
		return this.identity;
	}

	getToken(){
		let token = JSON.parse(localStorage.getItem('token'));
		if (token != "Undefined"){
			this.token = token;
		}else{
			this.token= null;
		}
		return this.token;
	}


	public handleAuthentication(identity, token):void {			
		if(identity && token){
			this.identity = identity;
			this.setSession(identity);
		}
	}


	private setSession(identity): void{
		const expiresAt = JSON.stringify((identity.exp) + new Date().getTime());		
		localStorage.setItem('expires_at', expiresAt);		
	}



	public isAuthenticated(): boolean {				
		const expiresAt = JSON.parse(localStorage.getItem('expires_at'));				
		return new Date().getTime() < expiresAt;
	}


	public isRole(role): boolean {		
		const roleuser = JSON.parse(localStorage.getItem('identity'));
		if (roleuser != "Undefined" && role > 0){
			if(role <= roleuser.role){
				return true;	
			}			
		}else{
			return false;
		}
	}



	getProyectos(){
		let proyectos = JSON.parse(localStorage.getItem('proyectos'));
		if (proyectos != "Undefined"){
			this.proyectos = proyectos;
		}else{
			this.proyectos= null;
		}
		return this.proyectos;

	}

	getUser(): Observable<User[]>{		
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		//return this._http.get<User[]>('https://jsonplaceholder.typicode.com/users', {headers: headers});		
		return this._http.get<User[]>(this.url+'users', {headers: headers});		
	}

	forgotpassword(user): Observable<any>{
		let json = JSON.stringify(user);
		let params = 'json='+json;

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this._http.post(this.url+'forgotpassword', params, {headers: headers});
	}


	changepassword(token, user): Observable<any> {

		let json = JSON.stringify(user);
		let params = 'json='+json;
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
									   .set('Authorization', token);							  
							  
		return this._http.post(this.url+'changepassword', params, {headers: headers});
	}



}

