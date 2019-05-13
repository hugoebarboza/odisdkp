import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


//NGRX REDUX
import { AppState } from '../../app.reducers';
import { Store } from '@ngrx/store';
import { LoginAction, ResetAction } from '../../contador.actions';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  undefined,
    'Authorization': undefined
	})
};

//MODELS
import { 
	Departamento,
	Proyecto,
	User

} from '../../models/types';
	

//SETTINGS
import { GLOBAL } from '../global';

@Injectable()
export class UserService  {
	public url:string;
	public departamentos: Array<Departamento>;
	public idaccount;
	public identity;
	public token;	
	public proyectos: Array<Proyecto>;
	public usuario: any;
	public headers: HttpHeaders = undefined;
	

	constructor(
		public _http: HttpClient,
		private store: Store<AppState>,
		//private _route: ActivatedRoute,
		//private _router: Router

	){
		this.url = GLOBAL.url;
		this.headers = undefined;
		this.cargarStorage();
	}

	cargarStorage() {
    if ( localStorage.getItem('token')) {
			this.token = JSON.parse( localStorage.getItem('token') );
			this.identity = JSON.parse( localStorage.getItem('identity') );
			this.proyectos = JSON.parse( localStorage.getItem('proyectos'));
    } else {
      this.token = '';
			this.identity = null;
			this.proyectos = [];
			
    }
  }

  storeAction(p: any, i: any) {
    const obj: any = {project: p, identificacion: i};
    const accion = new LoginAction(obj);
    this.store.dispatch( accion );
  }


  isLogin() {
		if(this.token){
			return ( this.token.token.length > 5 ) ? true : false;
		}
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

	registeruseremployee (token: any, user:User): Observable<any>{
		let json = JSON.stringify(user);
		let params = 'json='+json;

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
		.set('Authorization', token);
		return this._http.post(this.url+'registeruseremployee', params, {headers: headers})
						 .map( (resp: any) => {
							   return resp;
						 });				
	}


	delete(token: any, id:number): Observable<any>{

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
		.set('Authorization', token);


		return this._http.delete(this.url+'user/'+id, {headers: headers})
						 .map( (resp: any) => {
							 return resp;
						 });				
	}

	adduser(token: any, userid:number, id:number): Observable<any>{

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
		.set('Authorization', token);

		
		return this._http.post(this.url+'adduser/'+userid+'/project/'+id, {headers: headers})
						 .map( (resp: any) => {
							 return resp;
						 });
	}


	remover(token: any, userid:number, id:number): Observable<any>{

		/*
		const expandedHeaders = this.prepareHeader(headers, token);
		console.log(expandedHeaders);*/

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
		.set('Authorization', token);

		//console.log(headers);
		return this._http.post(this.url+'removeruser/'+userid+'/project/'+id, {headers: headers})
						 .map( (resp: any) => {
							 return resp;
						 });				
	}


	update(token: any, user:User, id:number): Observable<any>{
		let json = JSON.stringify(user);
		let params = 'json='+json;

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
		.set('Authorization', token);
		//console.log(headers);

		return this._http.post(this.url+'updateuser/'+id, params, {headers: headers})
						 .map( (resp: any) => {
							if(resp.status == 'success'){
								if (user.id === this.identity.sub) {
									let usuarioDB: User = resp.usuario;
									let key = 'identity';
									this.saveStorageUser(key, usuarioDB);
								}	
							}

							 return resp;
						 });				
	}

	updateProfile(token: any, user:User, id:number): Observable<any>{
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

	updateFotoProfileUser(token: any, archivo: any, id:number ): Observable<any> {
		let params = new FormData(); 
		params.append('image', archivo); 
		let headers = new HttpHeaders().set('Authorization', token);

		return this._http.post(this.url+'uploadfileperfiluser/'+id, params, {headers: headers})
							.map( (resp: any) => {
								return resp;
						});				
	}

	verifyStatusUser(token: any, userid:number, status:number): Observable<any>{

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
		.set('Authorization', token);
		//console.log(headers);

		return this._http.post(this.url+'user/'+userid+'/verify/'+status, {headers: headers})
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
		//console.log(headers);
		//console.log(params);
		
		return this._http.post(this.url+'logindkp', params, {headers: headers})
			.map( (resp: any) => {
				this.token = resp;
				let key = 'token';
				this.saveStorage(key, resp);			
				return resp;
			}).catch( err => {
				//return err.error;
				//return err.error.message;
				return Observable.throw( err );
			});		
	}

	signuptrue(user:any, getToken=null): Observable<any>{
		if(getToken != null){
			user.getToken = 'true';
		}
		let json = JSON.stringify(user);
		let params = 'json='+json;

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this._http.post(this.url+'logindkp', params, {headers: headers})
			.map( (resp: any) => {
				this.identity = resp;
				let key = 'identity';
				this.saveStorage(key, resp);
				return resp;
		}).catch( err => {
			return Observable.throw( err );
		});
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

	getRoleUser(token: any): Observable<any> {								  
		return this.getQuery('usersroles', token);
	}

	getFirmaUser(token: any, id: string): Observable<any> {								  
		return this.getQuery('user/'+id+'/firma', token);
	}

	
	getUserPaginate(token: string, id: number, page: number = 0): Observable<User[]>{		

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
										 .set('Authorization', token);
		
		let paginate = `?page=${page}`;

		let Url = this.url+'userspaginate/'+id+'/page'+paginate;


		return this._http.get<User[]>(Url, {headers: headers});		
	}


	getNotUserPaginate(token: string, id: number, page: number = 0, customerid:number): Observable<User[]>{
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
										 .set('Authorization', token);
		
		let paginate = `?page=${page}&customerid=${customerid}`;

		let Url = this.url+'nouserspaginate/'+id+'/page'+paginate;
		//console.log(Url);
		
		return this._http.get<User[]>(Url, {headers: headers});		
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
			this.usuario.role = data.role_id;
			localStorage.setItem(key, JSON.stringify(this.usuario));
			localStorage.setItem(account, JSON.stringify(this.usuario.email));	
		}else{
			return;
		}

	}

	searchUser(token:string, id: number, page: number = 0, termino: string){

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
										 .set('Authorization', token);
		
		let paginate = `?page=${page}`;

		let Url = this.url+'searchuser/'+id+'/termino/'+termino+paginate;
		
		return this._http.get<User[]>(Url, {headers: headers});		

	}

	searchaddUser(token:string, id: number, page: number = 0, termino: string, customerid:number){

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
										 .set('Authorization', token);
		
		let paginate = `?page=${page}&customerid=${customerid}`;

		let Url = this.url+'searchadduser/'+id+'/termino/'+termino+paginate;

		
		return this._http.get<User[]>(Url, {headers: headers});		

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

	

	public isTokenValidate(): boolean {				
		if(!JSON.parse(localStorage.getItem('token'))){
			return false;
		}
		const expiresAtToken = JSON.parse(localStorage.getItem('token'));		
		const payload = JSON.parse( atob( expiresAtToken.token.split('.')[1] ));
		const ahora = new Date().getTime() / 1000;
		console.log(payload.exp);
		console.log('----------');
		console.log(ahora);
		if ( ahora < payload.exp) {
      return true;
    }else{
			return false;
		}
		//return new Date().getTime() < expiresAt;
	}


	public isRole(role): boolean {		
		if(!role){
			return;
		}
		const roleuser = JSON.parse(localStorage.getItem('identity'));
		if (roleuser != "Undefined" && roleuser != null && role > 0){
			if(role <= roleuser.role){
				return true;	
			}			
		}else{
			return false;
		}
	}

	getDepartamentos(){
		let departamentos = JSON.parse(localStorage.getItem('departamentos'));
		if (departamentos != "Undefined"){
			this.departamentos = departamentos;
		}else{
			this.departamentos= null;
		}
		return this.departamentos;

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

	changepasswordprofile(token:any, id:number, user:any): Observable<any> {

		let json = JSON.stringify(user);
		let params = 'json='+json;
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
									   .set('Authorization', token);							  
							  
		return this._http.post(this.url+'changepasswordprofile/'+id, params, {headers: headers});
	}


  logout() {
		localStorage.removeItem('departamentos');
		localStorage.removeItem('expires_at');
		localStorage.removeItem('fotoprofile');
		localStorage.removeItem('identity');
		localStorage.removeItem('proyectos');
		localStorage.removeItem('token');
	}

  resetAction() {
    const accion = new ResetAction();
    this.store.dispatch( accion );
  }


	private prepareHeader(headers: HttpHeaders | null, token:any): HttpHeaders  {
    headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
		headers = headers.append('Accept', 'application/json');
		headers = headers.append('Authorization', token);		
		return headers;
	}	



}

