import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService, UserService } from '../services/service.index';

// NGRX REDUX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { ResetAction } from '../contador.actions';
import { ResetUserAction } from '../stores/auth/auth.actions';


@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

    identity: any;
    proyectos: any;
    token: any;
    url: string;

  constructor(
    public authService: AuthService,
    private auth: UserService,
    public _router: Router,
    private store: Store<AppState>,
  ) {

    }

  canActivate(_next: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<boolean> | boolean  {
    if (this.auth.isTokenValidate()) {
        // console.log('Paso Authguard');
        this.store.select('objNgrx').subscribe(objNgrx  => {
        if (objNgrx) {
           this.identity = this.auth.getIdentity();
           this.proyectos = this.auth.getProyectos();
        } else {
            this.identity = this.auth.getIdentity();
            this.proyectos = this.auth.getProyectos();
            if (this.proyectos && this.identity) {
            this.auth.storeAction(this.proyectos, this.identity);
            }
        }
        });
    return true;
    } else {
        // console.log( 'Bloqueado por Authguard' );
        this.resetAction();
        this.authService.logout();
        return false;
    }
   }


  expirado( fechaExp: number ) {
    const ahora = new Date().getTime() / 1000;
    if ( fechaExp < ahora ) {
      return true;
    } else {
      return false;
    }
  }

  resetAction() {
   const accion = new ResetAction();
   const useraccion = new ResetUserAction();
   localStorage.removeItem('departamentos');
   localStorage.removeItem('expires_at');
   localStorage.removeItem('fotoprofile');
   localStorage.removeItem('identity');
   localStorage.removeItem('proyectos');
   localStorage.removeItem('token');
   localStorage.removeItem('uid');
   this.store.dispatch( accion );
   this.store.dispatch( useraccion );
   this._router.navigate(['/login']);
  }

}
