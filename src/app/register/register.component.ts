import {Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import swal from 'sweetalert';

//HELPERS
import { MustMatch } from '../helpers/must-match.validator';

//MODELS
import { User } from '../models/types';

//SERVICES
import { SettingsService, UserService } from '../services/service.index';


@Component({
	selector:'register',
	templateUrl: './register.component.html',
	providers: [UserService]
})
export class RegisterComponent implements OnInit {
	
	public forma: FormGroup;
	public status: string
	public title: string;
	public user: User;
	public captchaResponse: boolean = true;
	

	constructor(
		private _userService: UserService,
		public label: SettingsService,

	){
		this.label.getDataRoute().subscribe(data => {
			this.title = data.subtitle;
		  });	  
	}
 
	ngOnInit(){
		
		this.forma = new FormGroup({
			name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
			surname: new FormControl(null, [Validators.required, Validators.minLength(2)]),
			email: new FormControl(null, [Validators.required, Validators.email]),
			email2: new FormControl(null, [Validators.required, Validators.email]),
			password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
			password2: new FormControl(null, [Validators.required, Validators.minLength(6)]),
			telefono: new FormControl(null),
			telefono2: new FormControl(null),
			condiciones: new FormControl(false),
			recaptchaReactive: new FormControl(null, Validators.required)
		}, {
			validators: [this.verifyEqual('password','password2'), MustMatch('email','email2')]
		   }
		);
		//console.log('register.component cargado correctamente');
	}

    // convenience getter for easy access to form fields
    get f() { return this.forma.controls; }

	verifyEqual( data:string, data2: string){
		return (group: FormGroup) => {

			let password1 = group.controls[data].value;
			let password2 = group.controls[data2].value;

			if(password1 === password2){
				return null;
			}

			return {
				mismatch: true
			};
		};
	}

	verifyEqualEmail( data:string, data2: string){
		return (group: FormGroup) => {

			let value1 = group.controls[data].value;
			let value2 = group.controls[data2].value;

			if(value1 === value2){
				return null;
			}

			return {
				equal: true
			};

		};

	}


	public resolved(captchaResponse: string) {
		if(captchaResponse){
			//console.log(`Resolved captcha with response ${captchaResponse}:`);
			this.captchaResponse = true;
		}
		
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
		
		this.user = new User('','','','',this.forma.value.name, this.forma.value.email, this.forma.value.password, 1, this.forma.value.surname, '', 1, this.forma.value.telefono, this.forma.value.telefono2, 1, 1, 1);

	 	this._userService.register(this.user).subscribe(
	 		response => {
				if(response.status == 'success'){
					swal('Usuario creado', this.user.email, 'success' );
					//this.status = response.status;	
					//this.user = new User('','','','',1,'','',1);
					this.forma.reset();
				}else{
					swal('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
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