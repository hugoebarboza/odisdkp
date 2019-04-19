import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SubscriptionLike as ISubscription } from "rxjs";
import { OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';

//MODELS
import { Proyecto, Service } from '../../models/types';

//SERVICES
import { DashboardService, UserService } from '../../services/service.index';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [UserService, DashboardService]
})
export class DashboardComponent implements OnInit, OnDestroy {

	public title: string;
	public identity;
	public token;
	departamentos: Array<any> = [];
	public proyectos: Array<Proyecto>;
	public servicios: Array<Service>;
	private subscription: ISubscription;
	options: FormGroup;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,		
		public _userService: UserService,		
		private _proyectoService: DashboardService,
		private _servicios: DashboardService,
		fb: FormBuilder
	){
		this.title = 'Proyectos';	  	
  		this.identity = this._userService.getIdentity();
  		this.token = this._userService.getToken();
  		this._userService.handleAuthentication(this.identity, this.token);
		this.options = fb.group({
		      bottom: 0,
		      fixed: false,
		      top: 0
		    });  		
	}
 
	ngOnInit(){	  	
		//this.loadData();
		if(this.identity && this.token){
			this.subscription = this._proyectoService.getProyectos(this.token.token, this.identity.dpto).subscribe(
				response => {
						if (response.status == 'success'){
							this.proyectos = response.datos;
							let key = 'proyectos';
							this._userService.saveStorage(key, this.proyectos);
							this.loadData(this.proyectos);
							//localStorage.setItem(key, JSON.stringify(this.proyectos));
							//console.log(this.proyectos.length);
						}
							//console.log(this._servicios);
					},
				error => {
					localStorage.removeItem('departamentos');
					localStorage.removeItem('expires_at');
					localStorage.removeItem('fotoprofile');
					localStorage.removeItem('identity');
					localStorage.removeItem('proyectos');
					localStorage.removeItem('token');		
					this._router.navigate(["/login"]);
				   },
				  () => console.log('Complete')
				);		
		}else{
			localStorage.removeItem('departamentos');
			localStorage.removeItem('expires_at');
			localStorage.removeItem('fotoprofile');
			localStorage.removeItem('identity');
			localStorage.removeItem('proyectos');
			localStorage.removeItem('token');
			this._router.navigate(["/login"]);
		}

		
	}

	ngOnDestroy(){
		if(this.subscription){
			this.subscription.unsubscribe();
		}
		//console.log("ngOnDestroy unsuscribe");
	}


  	ngDoCheck(){
    	this.identity = this._userService.getIdentity();
    	this.token = this._userService.getToken();    
  	}

  	public loadData(proyectos: any){
		if(proyectos){
			this.subscription = this._proyectoService.getDepartamentos(this.token.token).subscribe( 
				(response:any) => {
						if (response.status == 'success'){
							this.departamentos = response.datos;
							let key = 'departamentos';
							this._userService.saveStorage(key, this.departamentos);
						}
					});			
		}

	}

	refresh(event:number){
		if(event == 1){
			this.ngOnInit();
		}

	}



}





