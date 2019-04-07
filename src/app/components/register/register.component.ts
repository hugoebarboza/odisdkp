import {Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import swal from 'sweetalert';

//MODELS
import { User } from '../../models/user';

//SERVICES
import { UserService } from '../../services/service.index';


@Component({
	selector:'register',
	templateUrl: './register.component.html',
	providers: [UserService]
})
export class RegisterComponent implements OnInit {
	
	forma: FormGroup;
	public status: string
	public title: string;
	public user: User;
	

	constructor(
		private _userService: UserService
	){
		this.title = 'Registro';
		//this.user = new User('','','','',1,'','',1);
	}
 
	ngOnInit(){
		this.forma = new FormGroup({
			name: new FormControl(null, Validators.required),
			surname: new FormControl(null, Validators.required),
			email: new FormControl(null, [Validators.required, Validators.email]),
			email2: new FormControl(null, [Validators.required, Validators.email]),
			password: new FormControl(null, Validators.required),
			password2: new FormControl(null, Validators.required),
			telefono: new FormControl(null),
			telefono2: new FormControl(null),
			condiciones: new FormControl(false),
		}, {validators: this.verifyEqual('password','password2') });
		//console.log('register.component cargado correctamente');
	}


	verifyEqual( data:string, data2: string){

		return (group: FormGroup) => {

			let password1 = group.controls[data].value;
			let password2 = group.controls[data2].value;

			if(password1 === password2){
				return null;
			}

			return {
				equal: true
			};

		};

	}

	onSubmit(){
	
		if(this.forma.invalid){
			swal('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
			return;
		}

		if ( !this.forma.value.condiciones ) {
			swal('Importante', 'Debe de aceptar las condiciones', 'warning');
			return;
		}
		
		this.user = new User('', this.forma.value.name, this.forma.value.email, this.forma.value.password, 1, this.forma.value.surname, '', 1);

	 	this._userService.register(this.user).subscribe(
	 		response => {
				if(response.status == 'success'){
					swal('Usuario creado', this.user.email, 'success' );
					//this.status = response.status;	
					//this.user = new User('','','','',1,'','',1);
					this.forma.reset();
				}else{
					swal('Error', response.message, 'error');
					//this.status = 'error';
				}
	 		},
	 		error => {
				//console.log('error2222');
	 			console.log(<any>error);
	 		}
	 	);
	}
	
}