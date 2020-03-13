import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, share } from 'rxjs/operators';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


// NGRX REDUX
import { AppState } from 'src/app/app.reducers';
import { Store } from '@ngrx/store';
import { LoginAction, ResetAction } from 'src/app/contador.actions';
import { ResetUserAction } from 'src/app/stores/auth/auth.actions';

// MODELS
import { Departamento, Proyecto, User } from 'src/app/models/types';

// GLOBAL
import { GLOBAL } from '../global';

// FIREBASE
import { AngularFirePerformance } from '@angular/fire/performance';

// ERROR
import { ErrorsHandler } from 'src/app/providers/error/error-handler';



@Injectable()
export class UserService  {

    public url: string;
    formularios: [];
    public departamentos: Array<Departamento>;
    public idaccount: any;
    public identity: any;
    public token: any;
    public proyectos: Array<Proyecto>;
    public region: any;
    public usuario: any;
    public headers: HttpHeaders = undefined;


    constructor(
    private _handleError: ErrorsHandler,
    public _http: HttpClient,
    public _router: Router,
    private afp: AngularFirePerformance,
    private store: Store<AppState>,
    ) {
    this.url = GLOBAL.url;
    this.headers = undefined;
    this.cargarStorage();
    }

    cargarStorage() {
    if ( localStorage.getItem('token')) {
      this.identity = JSON.parse( localStorage.getItem('identity') );
      this.proyectos = JSON.parse( localStorage.getItem('proyectos'));
      this.region = JSON.parse( localStorage.getItem('region') );
      this.token = JSON.parse( localStorage.getItem('token') );
    } else {
      this.identity = null;
      this.proyectos = [];
      this.region = '';
      this.token = '';
    }
  }

  storeAction(p: any, i: any) {
    const obj: any = {project: p, identificacion: i};
    const accion = new LoginAction(obj);
    this.store.dispatch( accion );
  }


  isLogin() {
    if (this.token) {
       return ( this.token.token.length > 5 ) ? true : false;
    }
  }

  getQuery( query: string, token: any ) {

    if (!token || !query) {
       return;
    }

    const url = this.url + query;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(url, {headers: headers})
                     .pipe(
                       share(),
                       catchError(this._handleError.handleError)
                     );
  }


    register (user: User): Observable<any> {
    const json = JSON.stringify(user);
    const params = 'json=' + json;

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post(this.url + 'register', params, {headers: headers})
                     .map( (resp: any) => resp);
    }

    registeruseremployee (token: any, user: User): Observable<any> {
    if (!token) {
      return;
    }

        const json = JSON.stringify(user);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'registeruseremployee', params, {headers: headers})
                         .map( (resp: any) => resp);
    }


    delete(token: any, id: number): Observable<any> {
    if (!token) {
     return;
    }

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.delete(this.url + 'user/' + id, {headers: headers}).map( (resp: any) => resp);
    }

    adduser(token: any, userid: number, id: number): Observable<any> {
    if (!token) {
     return;
    }

       const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

       return this._http.post(this.url + 'adduser/' + userid + '/project/' + id, {headers: headers}).map( (resp: any) => resp);
    }


    remover(token: any, userid: number, id: number): Observable<any> {
    if (!token) {
     return;
    }


        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'removeruser/' + userid + '/project/' + id, {headers: headers}).map( (resp: any) => resp);
    }


    update(token: any, user: User, id: number): Observable<any> {
    if (!token) {
     return;
    }

        const json = JSON.stringify(user);
        const params = 'json=' + json;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'updateuser/' + id, params, {headers: headers})
                        .map( (resp: any) => {
                        if (resp.status === 'success') {
                            if (user.id === this.identity.sub) {
                                const usuarioDB: User = resp.usuario;
                                const key = 'identity';
                                this.saveStorageUser(key, usuarioDB);
                            }
                        }
                        return resp;
                        });
    }

    updateProfile(token: any, user: User, id: number): Observable<any> {
    if (!token) {
     return;
    }

        const json = JSON.stringify(user);
        const params = 'json=' + json;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'updateuser/' + id, params, {headers: headers})
                         .map( (resp: any) => {
                         if (resp.status === 'success') {
                                const usuarioDB: User = resp.usuario;
                                const key = 'identity';
                                this.saveStorageUser(key, usuarioDB);
                          }
                         return resp;
                        });
    }


    updateFotoProfile(token: any, archivo: any ): Observable<any> {
    if (!token) {
     return;
    }
        const params = new FormData();
        params.append('image', archivo);
        const headers = new HttpHeaders();

        return this._http.post(this.url + 'uploadfileperfil', params, {headers: headers})
                         .map( (resp: any) => resp);
    }

    updateFotoProfileUser(token: any, archivo: any, id: number ): Observable<any> {
    if (!token) {
     return;
    }

        const params = new FormData();
        params.append('image', archivo);
        const headers = new HttpHeaders();

        return this._http.post(this.url + 'uploadfileperfiluser/' + id, params, {headers: headers}).map( (resp: any) => resp);
    }

    verifyStatusUser(token: any, userid: number, status: number): Observable<any> {
    if (!token) {
     return;
    }

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.post(this.url + 'user/' + userid + '/verify/' + status, {headers: headers}).map( (resp: any) => resp);
    }



    async signup(user: any, getToken= null) {

        if (getToken != null) {
            user.getToken = 'true';
        }

        const json = JSON.stringify(user);
        const params = 'json=' + json;
        const href = this.url + 'logindkp';
        const requestUrl = href;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        if (!requestUrl) {
           return;
        }

        const trace = this.afp.trace$('LoginDkp').subscribe();

        try {

            return await this._http.post<any>(requestUrl, params, {headers: headers}).toPromise()
                .then((resp) => {
                if (resp && resp.token) {
                    this.token = resp;
                    const key = 'token';
                    this.saveStorage(key, resp);
                    trace.unsubscribe();
                    return resp;
                }
            })
            .catch((_error) => {
                    trace.unsubscribe();
            });

        } catch (err) {
            console.log(err);
        }


    }

    async signuptrue(user: any, getToken= null) {
        if (getToken != null) {
            user.getToken = 'true';
        }
        const json = JSON.stringify(user);
        const params = 'json=' + json;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return await this._http.post(this.url + 'logindkptrue', params, {headers: headers}).toPromise()
            .then((resp) => {
                if (resp) {
                this.identity = resp;
                const key = 'identity';
                this.saveStorage(key, resp);
                return resp;
            }
        })
        .catch((error) => { console.log(error); });

    }



    async getDptoProyectos(token: any, id: number) {
        if (!token) {
         return;
        }

        const href = this.url + 'departamento/' + id + '/proyecto';
        const requestUrl = href;
        const headers = new HttpHeaders({'Content-Type': 'application/json', });

        if (!requestUrl) {
           return;
        }

        return await this._http.get<any>(requestUrl, {headers: headers}).toPromise()
        .then((resp) => {
            if (resp) {
                return resp;
            }
        })
        .catch((error) => { throw new Error('User does not have any Projects!' + error); });
    }


    async getUserProjectService(token: any, id: number) {
      if (!token) {
       return;
      }

      const href = this.url + 'user/' + id + '/projectservice';
      const requestUrl = href;
      const headers = new HttpHeaders({'Content-Type': 'application/json', });

      if (!requestUrl) {
         return;
      }

      return await this._http.get<any>(requestUrl, {headers: headers}).toPromise()
      .then((resp) => {
          if (resp) {
              return resp;
          }
      })
      .catch((error) => { throw new Error('User does not have any Projects!' + error); });
  }

    getIdaccount() {
        const idaccount = JSON.parse(localStorage.getItem('idaccount'));
        if (idaccount) {
            this.idaccount = idaccount;
        } else {
            this.idaccount = null;
        }
        return this.idaccount;
    }

    public isIdaccount(): boolean {
        const idaccount = JSON.parse(localStorage.getItem('idaccount'));
        if (idaccount) {
          return true;
        } else {
        return false;
        }
    }


    getIdentity() {
        const identity = JSON.parse(localStorage.getItem('identity'));
        if (identity !== 'Undefined' && identity !== null) {
          this.identity = identity;
        } else {
          this.logout();
          this.identity = null;
        }
          return this.identity;
    }


    getUid() {
        const uid = JSON.parse(localStorage.getItem('uid'));
        if (uid !== 'Undefined' && uid !== null) {
        } else {
        // this.logout();
        }
        return uid;
    }


    getFotoProfile() {
        const identity = JSON.parse(localStorage.getItem('fotoprofile'));
        if (identity !== 'Undefined' && identity !== null) {
        this.identity = identity;
        } else {
        this.identity = null;
        }
        return this.identity;
    }

    async getFilterService(data: any, id: number) {

      if (data && data.length > 0 && id && id > 0) {
        for (let x = 0; x < data.length; x += 1) {
          const project = data[x];
          if (project && project.service && project.service.length > 0) {
            const service = project.service;
            for (let i = 0; i < service.length; i += 1) {
              if (service[i].id === id) {
                // return true;
                return service[i];
              }
            }
          }
        }
        return false;
      }
    }


    getToken() {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token !== 'Undefined' && token !== null) {
          this.token = token;
        } else {
          this.logout();
          this.token = null;
        }
        return this.token;
    }

    async getPerfilUser(token: any, id: number) {
        if (!token) {
           return;
        }

        const href = this.url + 'user/' + id + '/perfil';
        const requestUrl = href;
        const headers = new HttpHeaders({'Content-Type': 'application/json', });

        if (!requestUrl) {
           return;
        }

        return await this._http.get<any>(requestUrl, {headers: headers}).toPromise()
        .then((resp) => {
            if (resp) {
               return resp;
            }
        })
        .catch((error) => { throw new Error('User does not have any Profile!' + error); });
    }

    getRegion() {
      const region = JSON.parse(localStorage.getItem('region'));
      if (region !== 'Undefined' && region !== null) {
        this.region = region;
      } else {
        this.logout();
        this.region = null;
      }
        return this.region;
    }



    getRoleUser(token: any, role: number): Observable<any> {
       return this.getQuery('usersroles/' + role, token);
    }

    getFirmaUser(token: any, id: string): Observable<any> {
       return this.getQuery('user/' + id + '/firma', token);
    }

    getTeamPaginate(token: string, id: number, page: number = 0): Observable<User[]> {
        if (!token) {
           return;
        }

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        const paginate = `?page=${page}`;

        const Url = this.url + 'teampaginate/' + id + '/page' + paginate;

        return this._http.get<User[]>(Url, {headers: headers});
    }

    getUserPaginate(token: string, id: number, page: number = 0): Observable<User[]> {
        if (!token) {
           return;
        }

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        const paginate = `?page=${page}`;

        const Url = this.url + 'userspaginate/' + id + '/page' + paginate;

        return this._http.get<User[]>(Url, {headers: headers});
    }


    getNotUserPaginate(token: string, id: number, page: number = 0, customerid: number): Observable<User[]> {

      if (!token) {
       return;
      }
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

      const paginate = `?page=${page}&customerid=${customerid}`;

      const Url = this.url + 'nouserspaginate/' + id + '/page' + paginate;

      return this._http.get<User[]>(Url, {headers: headers});
    }



    saveStorage( key: any, data: any ) {
        if (key && data) {
           const value = JSON.stringify(data);
           localStorage.setItem(key, value);
        } else {
          return;
        }
    }


    saveStorageUser(key: any, data: any) {
        const identity = JSON.parse(localStorage.getItem(key));
        if (identity) {
            const account = 'idaccount';
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
        } else {
          return;
        }
    }

    searchUser(token: string, id: number, page: number = 0, termino: string) {
    if (!token) {
       return;
    }

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const paginate = `?page=${page}`;
    const Url = this.url + 'searchuser/' + id + '/termino/' + termino + paginate;

     return this._http.get<User[]>(Url, {headers: headers});
    }


    searchaddUser(token: string, id: number, page: number = 0, termino: string, customerid: number) {
    if (!token) {
       return;
    }
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const paginate = `?page=${page}&customerid=${customerid}`;
    const Url = this.url + 'searchadduser/' + id + '/termino/' + termino + paginate;

    return this._http.get<User[]>(Url, {headers: headers});
    }


    searchInviteUser(token: string, id: number, termino: string) {
    if (!token) {
      return;
    }
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const Url = this.url + 'searchinviteuser/' + id + '/termino/' + termino;

    return this._http.get<User[]>(Url, {headers: headers});
    }


    public handleAuthentication(identity: any, token: any): void {
     if (identity && token) {
      this.identity = identity;
      this.setSession(identity);
     }
    }


    private setSession(identity): void {
    if (!identity && !identity.exp) {
     return;
    }
    const expiresAt = JSON.stringify((identity.exp) + new Date().getTime());
    localStorage.setItem('expires_at', expiresAt);
    }


    public isTokenValidate(): boolean {
    if (!JSON.parse(localStorage.getItem('token'))) {
       return false;
    }
       const expiresAtToken = JSON.parse(localStorage.getItem('token'));
       if (expiresAtToken.token) {
           const payload = JSON.parse( atob( expiresAtToken.token.split('.')[1] ));
           const ahora = new Date().getTime() / 1000;
        if ( ahora < payload.exp) {
           return true;
        } else {
           return false;
        }
        } else {
          this.logout();
        }
    }

    public isAuthenticated(): boolean {
        const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }



    public isRole(role: number): boolean {
        if (!role) {
           return;
        }
        const roleuser = JSON.parse(localStorage.getItem('identity'));
        if (roleuser !== 'Undefined' && roleuser != null && role > 0) {
            if (role <= roleuser.role) {
               return true;
            }
        } else {
          return false;
     }
    }

    /*
    public isRoleService(role: string, id: number): boolean {

      if (!role || id === 0) {
         return;
      }

      const proyectos = JSON.parse(localStorage.getItem('proyectos'));

      if (proyectos !== 'Undefined' && proyectos != null && role && id && id > 0) {

          for (let x = 0; x < proyectos.length; x += 1) {
            const project = proyectos[x];

            if (project && project.service && project.service.length > 0) {
              const service = project.service;

              for (let i = 0; i < service.length; i += 1) {
                if (service[i].id === id) {
                  const userrol: UserRolService = service[i];
                  // console.log(userrol);
                  // console.log(userrol[role]);
                  if (userrol && userrol[role] === 1) {
                    console.log('true');
                    return true;
                  } else {
                    console.log('false');
                    return false;
                  }
                }
              }
            }
          }
          return false;
      } else {
        return false;
   }
  }*/


    getDepartamentos() {
        const departamentos = JSON.parse(localStorage.getItem('departamentos'));
        if (departamentos !== 'Undefined' && departamentos != null) {
        this.departamentos = departamentos;
        } else {
        this.logout();
        this.departamentos = null;
      }
      return this.departamentos;
   }

    getFormularios() {
        const formularios = JSON.parse(localStorage.getItem('formularios'));
        if (formularios !== 'Undefined' && formularios != null) {
          this.formularios = formularios;
        } else {
            this.formularios = null;
        }
        return this.formularios;

    }



    getProyectos() {
        const proyectos = JSON.parse(localStorage.getItem('proyectos'));
        if (proyectos !== 'Undefined' && proyectos != null) {
          this.proyectos = proyectos;
        } else {
          this.logout();
          this.proyectos = null;
        }
    return this.proyectos;
    }

    getUser(): Observable<User[]> {
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        // return this._http.get<User[]>('https://jsonplaceholder.typicode.com/users', {headers: headers});
        return this._http.get<User[]>(this.url + 'users', {headers: headers});
    }

    getUserInfo(token: any, id: number): Observable<any> {
        if (!token) {
         return;
        }
        return this.getQuery('usersinfo/' + id, token);
    }


    getUserShowInfo(token: any, id: number): Observable<any> {
        if (!token) {
          return;
        }
        return this.getQuery('usersshowinfo/' + id, token);
    }


    forgotpassword(user): Observable<any> {
        const json = JSON.stringify(user);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'forgotpassword', params, {headers: headers});
    }


    changepassword(token, user): Observable<any> {

    if (!token) {
       return;
    }

        const json = JSON.stringify(user);
        const params = 'json=' + json;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'changepassword', params, {headers: headers});
    }

    changepasswordprofile(token: any, id: number, user: any): Observable<any> {

    if (!token) {
     return;
    }

        const json = JSON.stringify(user);
        const params = 'json=' + json;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'changepasswordprofile/' + id, params, {headers: headers});
    }


  logout() {
    localStorage.removeItem('departamentos');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('fotoprofile');
    localStorage.removeItem('formularios');
    localStorage.removeItem('identity');
    localStorage.removeItem('proyectos');
    localStorage.removeItem('region');
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


  async updateUserProjectService(token: any, data: any, id: number, projectid: number) {

    if (!token) {
     return;
    }

    const json = JSON.stringify(data);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');


    if (!this.url ) {
       return;
    }

    return await this._http.put<any>(this.url + 'user' + '/' + id + '/' + 'projectservice' + '/' + projectid, params, {headers: headers}).toPromise().then((resp) => resp)
    .catch((error) => { throw new Error('User does not have any Profile!' + error); });
  }


  /*
	private prepareHeader(headers: HttpHeaders | null, token:any): HttpHeaders  {
    headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
		headers = headers.append('Accept', 'application/json');
		return headers;
	}	*/



}

