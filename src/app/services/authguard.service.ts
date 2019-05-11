import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/service.index';


@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

	token:any;
	url:string;

  constructor(
		private auth : UserService,
  	private _router: Router
  ) { 

	}

  canActivate(next:ActivatedRouteSnapshot, state:RouterStateSnapshot):Promise<boolean> | boolean  { 
			//console.log(next);
				if (this.auth.isTokenValidate()){
					console.log('paso authguard true token');
					return true;					
				}else{
					console.log('paso authguard isTokenValidate false');
					this.auth.logout();
					this._router.navigate(["/login"]);										
					return false;		
				}

				/*
				let token = this.auth.token.token;
				if(token){
					console.log('paso authguard true token');
										
					let payload = JSON.parse( atob( token.split('.')[1] ));								
					let expirado = this.expirado( payload.exp );				
					if ( expirado ) {
						this.auth.logout();
						this._router.navigate(["/login"]);					
						console.log('paso authguard false');
						return false;		
					}
				}else{
					this.auth.logout();
					this._router.navigate(["/login"]);					
					console.log('paso authguard false');
					return false;
				}
				console.log('paso authguard true');
				return true;
			}*/

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
