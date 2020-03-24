import { Component, OnInit,  ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

// MODELS
import { User } from 'src/app/models/types';

// SERVICES
import { UserService } from 'src/app/services/service.index';

// UTYLITY
import Swal from 'sweetalert2';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
  title = 'Olvido Clave';

  forma: FormGroup;
  resetForm: FormGroup;
  status: String;
  user: User;
  nuevopassword: string;
  username: string;
  year: number;

  // CAPTCHA UTILITY
  captchaIsLoaded = false;
  captchaSuccess = false;
  captchaIsExpired = false;
  captchaResponse?: string;
  lang = 'es';
  siteKey = '6LdY_pwUAAAAANNCwxFDBNTGRDg2hrDvZSLTfxLl';
  theme: 'light' | 'dark' = 'light';
  size: 'compact' | 'normal' = 'normal';
  type: 'image' | 'audio' = 'image';


  constructor(
  private _router: Router,
  private _userService: UserService,
  private cdr: ChangeDetectorRef
  )  {
    this.user = new User('', '', '', '', '', '', '', 1, '', '', 1, '', '', 1, 1, 1);
    this.year = new Date().getFullYear();

  }

  ngOnInit() {
		this.forma = new FormGroup({
			email: new FormControl(null, [Validators.required, Validators.email]),
			recaptcha: new FormControl(null, Validators.required)
		});

    //console.log('forgot.component cargado correctamente');
  }


  forgotpassword(){

		if(this.forma.invalid){
			Swal.fire('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
			return;
		}

	this.user = new User('', '', '', '','', this.forma.value.email, '', 1, '', '', 1,'','',1,1,1);


   this._userService.forgotpassword(this.user).subscribe(
     response => {
       if (response.status !== 'error' ) {
         this.status = 'success';
         this.user.email = '';
         Swal.fire('Se procesó exitosamente el reinicio de su clave. Recibirá un email con las instrucciones para restablecerla:', this.user.email, 'success' );
       } else {
         this.status = 'error';
         Swal.fire('Ha ocurrido un error con el reinicio de su clave con email:', this.user.email, 'error');    
         console.log('forgotpassword nooo exitoso');
       }
     },
     error => {
       Swal.fire('Ha ocurrido un error. Email no registrado.', this.user.email, 'error');        
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

  handleReset(): void {
    this.captchaSuccess = false;
    this.captchaResponse = undefined;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }

  handleExpire(): void {
    this.captchaSuccess = false;
    this.captchaIsExpired = true;
    this.cdr.detectChanges();
  }

  handleLoad(): void {
    this.captchaIsLoaded = true;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }

  handleSuccess(captchaResponse: string): void {
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }


}

