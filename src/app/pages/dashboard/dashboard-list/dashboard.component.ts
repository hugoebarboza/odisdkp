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
				
		//let key = `key=AAAAkZ2TwWU:APA91bF2QumX_EAF8t_n5nNMWLRxSaOyCmcW0sKKPEF7tk2KAwQ35_Bv8IBCn2SIl_wHbq8sf8uUNutSxaFbAXnMjplb6nCqtW41eSnqYJgfHtQszi5K2k0VzWoN6R_gQ3Cs1SalV_i5`
		//let url = `https://us-central1-odisdkp.cloudfunctions.net/fcmSend`
		//let headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': key });
		/*
		return this.http.post(url, data, {headers: headers})
						.toPromise()
						.then( res => {
						  console.log(res)
						})
						.catch(err => {
						  console.log(err)
						})
		*/

		this.created =  new FormControl(moment().format('YYYY[-]MM[-]DD HH:MM'));
		
		let data = {
			userId: 'otsLY91D66WnFul0UvMLxlL1dhF3',
			title: 'Titulo de Mensaje',
			message: 'Cuerpo de Mensaje',
			create_at: this.created.value
		};

		this._cdf.fcmsend(this.token.token, data).subscribe(
			response => {        
			  if(!response){
				return false;        
			  }
				if(response.status == 200){ 
					this._cdf.addNotification(this.token.token, data)
					.then(res => {
					  //console.log(res);
					}, err => {
					  console.log(err);
					});
				}
			},
				error => {
				console.log(<any>error);
				}   
			);			
	  }	

}





