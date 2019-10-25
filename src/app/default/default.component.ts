import {Component, OnInit} from '@angular/core';

// SERVICES
import { UserService } from 'src/app/services/service.index';


@Component({
	selector:'default',
	templateUrl: './default.component.html',
	providers: [UserService]

})
export class DefaultComponent implements OnInit {
	public title: string;

	mostrar = true;
	
	cardfrases : any = {
		Titulo: 'Titulo',
		Subtitulo: 'SubTitulo',
		Mensaje: 'Some quick example text to build',
		Link: 'Link'
	};

	constructor(

	){
		this.title = 'Inicio';
	}
 
	ngOnInit(){
		//console.log('default.component cargado correctamente');
	}

	
}