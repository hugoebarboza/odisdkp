import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {  HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


// NGRX REDUX
import { AppState } from '../../app.reducers';
import { Store } from '@ngrx/store';
import { LoginAction, ResetAction } from '../../contador.actions';
import { ResetUserAction } from 'src/app/stores/auth/auth.actions';


// MODELS
import { Departamento, Proyecto, User } from '../../models/types';


// SETTINGS
import { GLOBAL } from '../global';

// FIREBASE
import { AngularFirePerformance } from '@angular/fire/performance';


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
		private afp: AngularFirePerformance,
		public _http: HttpClient,
		private store: Store<AppState>,
		public _router: Router,

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

  getQuery( query:string, token:any ){

		if(!token){
			return;
		}

		const url = this.url+query;
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');							  							 

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
    if(!token){
      return;
    }

		let json = JSON.stringify(user);
		let params = 'json='+json;

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this._http.post(this.url+'registeruseremployee', params, {headers: headers})
						 .map( (resp: any) => {
							   return resp;
						 });				
	}


	delete(token: any, id:number): Observable<any>{
    if(!token){
     return;
    }
	   
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');


		return this._http.delete(this.url+'user/'+id, {headers: headers})
						 .map( (resp: any) => {
							 return resp;
						 });				
	}

	adduser(token: any, userid:number, id:number): Observable<any>{
    if(!token){
     return;
    }

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

		return this._http.post(this.url+'adduser/'+userid+'/project/'+id, {headers: headers})
						 .map( (resp: any) => {
							 return resp;
						 });
	}


	remover(token: any, userid:number, id:number): Observable<any>{
    if(!token){
     return;
    }
	   

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

		return this._http.post(this.url+'removeruser/'+userid+'/project/'+id, {headers: headers})
						 .map( (resp: any) => {
							 return resp;
						 });				
	}


	update(token: any, user:User, id:number): Observable<any>{
    if(!token){
     return;
    }
	   
		let json = JSON.stringify(user);
		let params = 'json='+json;

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

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
    if(!token){
     return;
    }
	   
		let json = JSON.stringify(user);
		let params = 'json='+json;

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

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
    if(!token){
     return;
    }
	    let params = new FormData(); 
		params.append('image', archivo); 
		let headers = new HttpHeaders();

		return this._http.post(this.url+'uploadfileperfil', params, {headers: headers})
						 .map( (resp: any) => {
								return resp;
						});				
    }

	updateFotoProfileUser(token: any, archivo: any, id:number ): Observable<any> {
    if(!token){
     return;
    }
	   
		let params = new FormData(); 
		params.append('image', archivo); 
		let headers = new HttpHeaders();

		return this._http.post(this.url+'uploadfileperfiluser/'+id, params, {headers: headers})
							.map( (resp: any) => {
								return resp;
						});				
	}

	verifyStatusUser(token: any, userid:number, status:number): Observable<any>{
    if(!token){
     return;
    }

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    // console.log(headers);

		return this._http.post(this.url+'user/'+userid+'/verify/'+status, {headers: headers})
						 .map( (resp: any) => {
							 return resp;
						 });				
	}

	

	async signup(user:any, getToken=null) {
	
		if(getToken != null){
			user.getToken = 'true';
		}

		let json = JSON.stringify(user);
		let params = 'json='+json;
		const href = this.url+'logindkp'
		const requestUrl = href;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

		if(!requestUrl){
			return;
		}

		const trace = this.afp.trace$('LoginDkp').subscribe();

		try {

			 return await this._http.post<any>(requestUrl, params, {headers: headers}).toPromise()
			.then((resp)=>{ 
				if(resp && resp.token){
					this.token = resp;
					let key = 'token';
					this.saveStorage(key, resp);
					trace.unsubscribe();
					return resp;
				}			
			})
			.catch((_error)=>{
				trace.unsubscribe();
				// console.log(error);
				// return error;
			});

		} catch (err) {
			console.log(err);
			// trace.putAttribute('errorCode', err.code);
			// trace.stop();
		}
		


		/*
		return this._http.post(this.url+'logindkp', params, {headers: headers})
			.map( (resp: any) => {
				this.token = resp;
				let key = 'token';
				this.saveStorage(key, resp);			
				return resp;
			}).catch( err => {
				return Observable.throw( err );
			});*/

	}

	async signuptrue(user:any, getToken=null) {
		if(getToken != null){
			user.getToken = 'true';
		}
		let json = JSON.stringify(user);
		let params = 'json='+json;
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

		return await this._http.post(this.url+'logindkptrue', params, {headers: headers}).toPromise()
		.then((resp) => { 
			if(resp){
				this.identity = resp;
				let key = 'identity';
				this.saveStorage(key, resp);
				return resp;
			}
		}
		)
		.catch((error)=>{ console.log(error)});

		/*
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this._http.post(this.url+'logindkptrue', params, {headers: headers})
			.map( (resp: any) => {
				this.identity = resp;
				let key = 'identity';
				this.saveStorage(key, resp);
				return resp;
		}).catch( err => {
			return Observable.throw( err );
		});*/
	}



	async getDptoProyectos(token:any, id:number) {

		if(!token){
			return;
		}
	
		const href = this.url+'departamento/'+id+'/proyecto';
		const requestUrl = href;
		const headers = new HttpHeaders({'Content-Type': 'application/json',});

		if(!requestUrl){
			return;
		}

        return await this._http.get<any>(requestUrl, {headers: headers}).toPromise()
        .then((resp)=>{ 
			if(resp){
				return resp;
			}			
		})
        .catch((error)=>{ throw new Error('User does not have any Projects!'+error)});

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
		if (identity != "Undefined" && identity !== null){
			this.identity = identity;
		}else{
			this.logout();
			this.identity = null;
		}
		return this.identity;
	}


	getUid(){
		let uid = JSON.parse(localStorage.getItem('uid'));
		if (uid != "Undefined" && uid !== null){
		}else{
			//console.log('bloqueado por getuid')
			//this.logout();
		}
		return uid;
	}


	getFotoProfile(){
		let identity = JSON.parse(localStorage.getItem('fotoprofile'));
		if (identity != "Undefined" && identity !== null){
			this.identity = identity;
		}else{
			this.identity = null;
		}
		return this.identity;
	}


	getToken(){
		let token = JSON.parse(localStorage.getItem('token'));
		if (token != "Undefined" && token !== null){
			this.token = token;
		}else{
			this.logout();
			this.token= null;
		}
		return this.token;
	}

	async getPerfilUser(token: any, id: number) {
		//return this.getQuery('user/'+id+'/perfil', token);
		if(!token){
			return;
		}
	
		const href = this.url+'user/'+id+'/perfil';
		const requestUrl = href;
		const headers = new HttpHeaders({'Content-Type': 'application/json',});

		if(!requestUrl){
			return;
		}

        return await this._http.get<any>(requestUrl, {headers: headers}).toPromise()
        .then((resp)=>{ 
			if(resp){
				return resp;
			}			
		})
        .catch((error)=>{ throw new Error('User does not have any Profile!'+error)});


	}

	getRoleUser(token: any, role:number): Observable<any> {								  
		return this.getQuery('usersroles/'+role, token);
	}

	getFirmaUser(token: any, id: string): Observable<any> {								  
		return this.getQuery('user/'+id+'/firma', token);
	}

	
	getUserPaginate(token: string, id: number, page: number = 0): Observable<User[]>{
    if(!token){
     return;
    }
		   

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		
		let paginate = `?page=${page}`;

		let Url = this.url+'userspaginate/'+id+'/page'+paginate;


		return this._http.get<User[]>(Url, {headers: headers});		
	}


	getNotUserPaginate(token: string, id: number, page: number = 0, customerid:number): Observable<User[]>{

    if(!token){
     return;
    }
	   
		
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		
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
		if(!token){
			return;
		}

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		
		let paginate = `?page=${page}`;

		let Url = this.url+'searchuser/'+id+'/termino/'+termino+paginate;
		
		return this._http.get<User[]>(Url, {headers: headers});
	}

	searchaddUser(token:string, id: number, page: number = 0, termino: string, customerid:number){
		if(!token){
			return;
		}

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		
		let paginate = `?page=${page}&customerid=${customerid}`;

		let Url = this.url+'searchadduser/'+id+'/termino/'+termino+paginate;
		
		return this._http.get<User[]>(Url, {headers: headers});		
	}

	searchInviteUser(token:string, id: number, termino: string){
		if(!token){
			return;
		}

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		
		let Url = this.url+'searchinviteuser/'+id+'/termino/'+termino;
		
		return this._http.get<User[]>(Url, {headers: headers});
	}
	
	public handleAuthentication(identity:any, token:any):void {		
		if(identity && token){
			this.identity = identity;
			this.setSession(identity);
		}
	}

	private setSession(identity): void{
		if(!identity && !identity.exp){
			return;
		}
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
		if (expiresAtToken.token){
			const payload = JSON.parse( atob( expiresAtToken.token.split('.')[1] ));
			const ahora = new Date().getTime() / 1000;
			//console.log(payload.exp);
			//console.log('----------');
			//console.log(ahora);
			if ( ahora < payload.exp) {
				return true;
			}else{
				return false;
			}	
		}else{
			this.logout();
		}
		//return new Date().getTime() < expiresAt;
	}


	public isRole(role:number): boolean {		
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
		if (departamentos != "Undefined" && departamentos != null){
			this.departamentos = departamentos;
		}else{
			this.logout();
			this.departamentos= null;
		}
		return this.departamentos;

	}



	getProyectos(){
		let proyectos = JSON.parse(localStorage.getItem('proyectos'));
		if (proyectos != "Undefined" && proyectos != null){
			this.proyectos = proyectos;
		}else{
			this.logout();
			this.proyectos= null;
		}
		return this.proyectos;

	}

	getUser(): Observable<User[]>{		
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		//return this._http.get<User[]>('https://jsonplaceholder.typicode.com/users', {headers: headers});		
		return this._http.get<User[]>(this.url+'users', {headers: headers});		
	}

	getUserInfo(token:any, id:number): Observable<any>{
		if(!token){
			return;
		}
		return this.getQuery('usersinfo/'+id, token);		
	}


	getUserShowInfo(token:any, id:number): Observable<any>{
		if(!token){
			return;
		}
		return this.getQuery('usersshowinfo/'+id, token);		
	}


	forgotpassword(user): Observable<any>{
		let json = JSON.stringify(user);
		let params = 'json='+json;

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this._http.post(this.url+'forgotpassword', params, {headers: headers});
	}


	changepassword(token, user): Observable<any> {

    if(!token){
       return;
    }

		let json = JSON.stringify(user);
		let params = 'json='+json;
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');							  

		return this._http.post(this.url+'changepassword', params, {headers: headers});
	}

	changepasswordprofile(token:any, id:number, user:any): Observable<any> {

    if(!token){
     return;
    }
	 
		let json = JSON.stringify(user);
		let params = 'json='+json;
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');							  

		return this._http.post(this.url+'changepasswordprofile/'+id, params, {headers: headers});
	}


  logout() {		
		localStorage.removeItem('departamentos');
		localStorage.removeItem('expires_at');
		localStorage.removeItem('fotoprofile');
		localStorage.removeItem('identity');
		localStorage.removeItem('proyectos');
		localStorage.removeItem('token');
		localStorage.removeItem('uid');
		this.resetAction();
		this._router.navigate(['/login']);
	}

  resetAction() {
		const accion = new ResetAction();
		const useraccion = new ResetUserAction();
		this.store.dispatch( useraccion );
    this.store.dispatch( accion );
  }

  /*
	private prepareHeader(headers: HttpHeaders | null, token:any): HttpHeaders  {
    headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
		headers = headers.append('Accept', 'application/json');
		return headers;
	}	*/



}

