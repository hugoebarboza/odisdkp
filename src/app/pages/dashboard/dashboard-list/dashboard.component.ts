import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';

//MODELS
import { Proyecto, Service } from '../../../models/types';

//SERVICES
import { ProjectsService, SettingsService, UserService } from '../../../services/service.index';


@Component({	
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [UserService]
})
export class DashboardComponent implements OnInit, OnDestroy {

	title: string;
	departamentos: Array<any> = [];
	event: number = 0;
	identity;
	proyectos: Array<Proyecto>;
	servicios: Array<Service>;
	subscription: Subscription;
	options: FormGroup;
	token:any;	
	

	constructor(
		private _proyectoService: ProjectsService,
		private _router: Router,
		public _userService: UserService,
		public label: SettingsService,
		fb: FormBuilder
	){
		this.identity = this._userService.getIdentity();
		this.proyectos = this._userService.getProyectos();
  		this.token = this._userService.getToken();
		this._userService.handleAuthentication(this.identity, this.token);
		  
		this.options = fb.group({
		      bottom: 0,
		      fixed: false,
		      top: 0
			});
		this.label.getDataRoute().subscribe(data => {
			this.title = data.subtitle;
		});
		  
			
	}
 
	ngOnInit(){	  	
		if(this.identity && this.token){
			this.subscription = this._proyectoService.getDepartamentos(this.token.token).subscribe( 
				(response:any) => {
						if (response.status == 'success'){
							this.departamentos = response.datos;
							let key = 'departamentos';
							this._userService.saveStorage(key, this.departamentos);
						}
					},
				(error: any) => {
					this._userService.logout();
					   },
				() => console.log('Complete Dashboard')
					);
		}		
	}

	ngOnDestroy(){
		if(this.subscription){
			this.subscription.unsubscribe();
			//console.log("ngOnDestroy unsuscribe");
		}
	}

	/*
  	ngDoCheck(){
    	//this.identity = this._userService.getIdentity();
    	//this.token = this._userService.getToken();    
  	}*/


	  refreshMenu(event:number){
		if(event == 1){
		}
	}
}





