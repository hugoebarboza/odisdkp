import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/';
import 'rxjs/add/operator/map';

import swal from 'sweetalert';

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
	public usuario: User;

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


	register (user:User): Observable<any>{
		let json = JSON.stringify(user);
		let params = 'json='+json;

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this._http.post(this.url+'register', params, {headers: headers})
						 .map( (resp: any) => {
							   return resp;
						 });				
	}



	update(token: any, user:User, id:number): Observable<any>{
		let json = JSON.stringify(user);
		let params = 'json='+json;

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
		.set('Authorization', token);


		return this._http.post(this.url+'updateuser/'+id, params, {headers: headers})
						 .map( (resp: any) => {
							 if(resp.status == 'success'){
								let usuarioDB: User = resp.usuario;
								let key = 'identity';
								this.saveStorageUser(key, usuarioDB);
							 }
							 return resp;
						 });				
	}

	updateFotoProfile(token: any, archivo: any ): Observable<any> {
		let params = new FormData(); 
		params.append('image', archivo); 
		let headers = new HttpHeaders().set('Authorization', token);

		return this._http.post(this.url+'uploadfileperfil', params, {headers: headers})
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


	getFotoProfile(){
		let identity = JSON.parse(localStorage.getItem('fotoprofile'));
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

	getPerfilUser(token: any, id: string): Observable<any> {								  
		return this.getQuery('user/'+id+'/perfil', token);
	}

	getFirmaUser(token: any, id: string): Observable<any> {								  
		return this.getQuery('user/'+id+'/firma', token);
	}

	saveStorage( key:any, data: any ) {
		if (key && data){
			let value = JSON.stringify(data);
			localStorage.setItem(key, value);
		}else{
			return;
		}
	  }
	

	saveStorageUser(key:any, data: any){
		let identity = JSON.parse(localStorage.getItem(key));
		if(identity){
			let account = 'idaccount';
			this.usuario = identity;
			this.usuario.name = data.name;
			this.usuario.surname = data.surname;
			this.usuario.email = data.email;
			this.usuario.dni = data.dni;
			this.usuario.dv = data.dv;
			this.usuario.telefono1 = data.telefono1;
			this.usuario.telefono2 = data.telefono2;
			localStorage.setItem(key, JSON.stringify(this.usuario));
			localStorage.setItem(account, JSON.stringify(this.usuario.email));	
		}else{
			return;
		}

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

