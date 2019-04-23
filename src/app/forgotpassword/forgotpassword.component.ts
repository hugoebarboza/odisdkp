import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

//MODELS
import { User } from '../models/types';

//SERVICES
import { UserService } from '../services/service.index';

//UTYLITY
import swal from 'sweetalert';


@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
	title: string = 'Olvido Clave';
  
  forma: FormGroup;  
  resetForm:FormGroup;
  status: String;
  user : User;
  
  
  nuevopassword : string;
  username : string;    
  year: number;


  constructor(
	private _router: Router,
  private _userService: UserService


  	) 
  { 
    this.user = new User('','','','','','','',1,'','',1,'','',1,1,1);  
    this.year = new Date().getFullYear();

  }

  ngOnInit() {
		this.forma = new FormGroup({
			email: new FormControl(null, [Validators.required, Validators.email]),
			recaptchaReactive: new FormControl(null, Validators.required)
		});

    //console.log('forgot.component cargado correctamente');
  }


  forgotpassword(){

		if(this.forma.invalid){
			swal('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
			return;
		}

	this.user = new User('', '', '', '','', this.forma.value.email, '', 1, '', '', 1,'','',1,1,1);


   this._userService.forgotpassword(this.user).subscribe(
     response => {       
       if(response.status != 'error' ){
         this.status = 'success';
         this.user.email = "";
         swal('Se procesó exitosamente el reinicio de su clave con email:', this.user.email, 'success' );
         //console.log('forgotpassword exitoso');
       }else{
         this.status = 'error';
         swal('Ha ocurrido un error con el reinicio de su clave con email:', this.user.email, 'error');    
         console.log('forgotpassword nooo exitoso');
       }
     },
     error => {
      swal('Ha ocurrido un error. Email no registrado.', this.user.email, 'error');        
       this.status = 'error';
       console.log(<any>error);
     }

     );

  }


  oldforgot() : void {
    if(this.username == 'admin' && this.nuevopassword == 'admin'){
     this._router.navigate(["user"]);
    }else {
      alert("Invalid credentials");
    }
  }


}

