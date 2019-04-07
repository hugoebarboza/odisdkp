import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

//MODELS
import { User } from '../../models/user';

//SERVICES
import { UserService } from '../../services/service.index';


@Component({
	selector:'default',
	templateUrl: './default.component.html',
	providers: [UserService]

})
export class DefaultComponent implements OnInit {
	public title: string;
	public identity;
	public token;

	mostrar = true;
	
	cardfrases : any = {
		Titulo: 'Titulo',
		Subtitulo: 'SubTitulo',
		Mensaje: 'Some quick example text to build',
		Link: 'Link'
	};

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,		
		private _userService: UserService,

	){
		this.title = 'Inicio';
		this.token = this._userService.getToken();
	}
 
	ngOnInit(){
		//console.log('default.component cargado correctamente');
	}

	
}