import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { UserService } from '../services/service.index';


@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  constructor(
  	private auth : UserService,
  	private _router: Router
  ) { }

  canActivate(next:ActivatedRouteSnapshot, state:RouterStateSnapshot):Promise<boolean> | boolean  { 
  	  //console.log(next);
  	if (this.auth.isAuthenticated()){

			let token = this.auth.token.token;
			if(token){
				//console.log('paso authguard true token');
				let payload = JSON.parse( atob( token.split('.')[1] ));
				let expirado = this.expirado( payload.exp );
		
				if ( expirado ) {
					localStorage.removeItem('departamentos');
					localStorage.removeItem('fotoprofile');
					localStorage.removeItem('identity');
					localStorage.removeItem('token');
					localStorage.removeItem('proyectos');
					localStorage.removeItem('expires_at');
					this._router.navigate(["/login"]);
					//console.log('paso authguard false');
					return false;		
				}	
			}
  		//console.log('paso authguard true');
  		return true;	
  	}  	
	}
	

  expirado( fechaExp: number ) {
		let ahora = new Date().getTime() / 1000;
    if ( fechaExp < ahora ) {
      return true;
    }else {
      return false;
    }
  }

}
