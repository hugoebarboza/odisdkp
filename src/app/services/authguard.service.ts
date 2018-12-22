import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  constructor(
  	private auth : UserService,
  	private _router: Router
  ) { }

  canActivate(next:ActivatedRouteSnapshot, state:RouterStateSnapshot)  { 
  	  //console.log(next);
  	if (this.auth.isAuthenticated()){
  		//console.log('paso authguard');
  		return true;	
  	}else{
  		//console.error('nooooo paso authguard');
		  localStorage.removeItem('identity');
		  localStorage.removeItem('token');
		  localStorage.removeItem('proyectos');
		  localStorage.removeItem('expires_at');
		  this._router.navigate(["/login"]);
  		return false;	
  	}
  	
  }
}
