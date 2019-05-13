import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/service.index';

//NGRX REDUX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { ResetAction } from '../contador.actions';


@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

	identity:any;
	proyectos:any;
	token:any;
	url:string;

  constructor(		
		private _router: Router,
		private auth : UserService,
		private store: Store<AppState>,
  ) { 

	}

  canActivate(next:ActivatedRouteSnapshot, state:RouterStateSnapshot):Promise<boolean> | boolean  { 
			//console.log(next);
				if (this.auth.isTokenValidate()){
					console.log('paso authguard true token');

					this.store.select('objNgrx').subscribe( 
						objNgrx  => {
						if (objNgrx) {
							//console.log('connnn redux');
						}else{
							console.log('sinnnn redux');
							this.identity = this.auth.getIdentity();
							this.proyectos = this.auth.getProyectos();												
							if(this.proyectos && this.identity){
								console.log('redux store accionnn');
								this.auth.storeAction(this.proyectos, this.identity);
							}else{
								console.log('redux reset accionnn');
								this.auth.resetAction();							}							
						}
					});
							

					return true;					
				}else{
					console.log('paso authguard isTokenValidate false');
					this.auth.resetAction();
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
