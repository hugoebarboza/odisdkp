import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SubscriptionLike as ISubscription } from "rxjs";
import { OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';

//MODELS
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Proyecto } from '../../models/proyecto';

//SERVICES
import { Service } from '../../models/service';
import { DashboardService } from '../../services/dashboard.service';



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
	public proyectos: Array<Proyecto>;
	public servicios: Array<Service>;
	private subscription: ISubscription;
	options: FormGroup;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,		
		private _userService: UserService,		
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
		this.subscription = this._proyectoService.getProyectos(this.token.token, this.identity.dpto).subscribe(
		response => {
				if (response.status == 'success'){
					this.proyectos = response.datos;
					let key = 'proyectos';
					localStorage.setItem(key, JSON.stringify(this.proyectos));
					//console.log(this.proyectos.length);
				}
					//console.log(this._servicios);
			},
		error => {
				localStorage.removeItem('identity');
				localStorage.removeItem('token');
				localStorage.removeItem('proyectos');
				localStorage.removeItem('expires_at');
				this._router.navigate(["/login"]);
		   },
		  () => console.log('complete dashboard')
		);
		
	}

	ngOnDestroy(){
 		this.subscription.unsubscribe();
		//console.log("ngOnDestroy unsuscribe");
	}


  	ngDoCheck(){
    	this.identity = this._userService.getIdentity();
    	this.token = this._userService.getToken();    
  	}

  	public loadData(){
	}



}





