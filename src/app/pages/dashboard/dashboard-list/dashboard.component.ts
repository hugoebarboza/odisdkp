import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs/Subscription";
import { OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';


//MODELS
import { Proyecto, Service } from '../../../models/types';

//SERVICES
import { CdfService, MessagingService, ProjectsService, SettingsService, UserService } from '../../../services/service.index';
import { AngularFireDatabase } from 'angularfire2/database';

//MOMENT
import * as _moment from 'moment';
const moment = _moment;


@Component({	
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [UserService]
})
export class DashboardComponent implements OnInit, OnDestroy {

	title: string;
	created: FormControl;
	departamentos: Array<any> = [];
	event: number = 0;
	identity;
	message;
	proyectos: Array<Proyecto>;
	servicios: Array<Service>;
	subscription: Subscription;
	options: FormGroup;
	token:any;	
	

	constructor(
		private _cdf: CdfService,
		private _proyectoService: ProjectsService,
		public _userService: UserService,
		public label: SettingsService,
		private msgService: MessagingService,
		private db: AngularFireDatabase,
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
		//this.message = this.db.object('messages/').valueChanges();
		this.msgService.getPermission()
		this.msgService.receiveMessage()
		this.message = this.msgService.currentMessage


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
	

	sendMsj() {
				

		this.created =  new FormControl(moment().format('YYYY[-]MM[-]DD HH:MM'));
		
		let data = {
			userId: 'ghsMwBtcYLXKxd2boAuQc8encSk1',
			userIdTo: 'otsLY91D66WnFul0UvMLxlL1dhF3',			
			title: 'Titulo de Mensaje',
			message: 'Test Cuerpo de Mensaje',
			create_at: this.created.value,
			status: '1'
		};

		this._cdf.fcmsend(this.token.token, data).subscribe(
			response => {        
			  if(!response){
				return false;        
			  }
				if(response.status == 200){ 
					console.log(response);
				}
			},
				error => {
				console.log(<any>error);
				}   
			);			
	  }	

}





