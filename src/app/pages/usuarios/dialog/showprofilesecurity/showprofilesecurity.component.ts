import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// HELPERS
import { MustMatch } from '../../../../helpers/must-match.validator';


// UTYLITY
import Swal from 'sweetalert2';

// MODELS
import { User } from 'src/app/models/types';

// SERVICES
import { UserService } from 'src/app/services/service.index';


@Component({
  selector: 'app-showprofilesecurity',
  templateUrl: './showprofilesecurity.component.html',
  styleUrls: ['./showprofilesecurity.component.css']
})
export class ShowProfileSecurityComponent implements OnInit {

  changeForm: FormGroup;
  hide = true;
  identity: any;
  showEmail = false;
  showReset = false;
  title = 'Perfil del Usuario - Seguridad';
  token: any;
  usuario: any;
  username: string;
  user: User;

  constructor(
    public _userService: UserService,
    public dialogRef: MatDialogRef<ShowProfileSecurityComponent>,
    @Inject(MAT_DIALOG_DATA) public data

  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this._userService.handleAuthentication(this.identity, this.token);
    this.usuario = this.data.usuario;
    this.username = this.data.usuario.name + ' ' + this.data.usuario.surname;
    this.changeForm = new FormGroup({
      'newpassword' : new FormControl('', [Validators.required, Validators.minLength(6)]),
      'password_confirmation' : new FormControl('', [Validators.required, Validators.minLength(6)]),
    },
    { validators: MustMatch('newpassword', 'password_confirmation') }
    );

  }

  ngOnInit() {
    // console.log(this.usuario);
  }



  noIgual( control: FormControl ):  { [s: string]: boolean }  {
    const changeForm: any = this;

    if (control.value !== changeForm.controls['newpassword'].value) {
      return {
        noiguales: true
      };

    }
    return null;
  }


  forgotpassword(data: any) {

    this.dialogRef.close();

    if (!data) {
      Swal.fire('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
      return;
    }

  this.user = new User('', '', '', '', '', data.email, '', 1, '', '', 1, '', '', 1, 1, 1);


   this._userService.forgotpassword(this.user).subscribe(
     response => {
       if (response.status !== 'error' ) {
         Swal.fire('Se procesó exitosamente el reinicio de clave con email:', this.user.email, 'success' );
       } else {
         Swal.fire('Ha ocurrido un error con el reinicio de clave con email:', this.user.email, 'error');
       }
     },
     error => {
      Swal.fire('Ha ocurrido un error. Email no registrado.', this.user.email, 'error');
       console.log(<any>error);
     }
     );

  }


  changepassword(formValue: any){

    this.dialogRef.close();

    if (!formValue) {
      return;
    }


    this._userService.changepasswordprofile(this.token.token, this.usuario.id, formValue).subscribe(
     response => {
       if (response.status !== 'error' ) {
        Swal.fire('Se procesó exitosamente el reinicio de clave con email:', this.usuario.email, 'success' );
       } else {
        Swal.fire('Ha ocurrido un error con el reinicio de clave con email:', this.usuario.email, 'error');
       }
     },
     error => {
      Swal.fire('Ha ocurrido un error con el reinicio de clave con email:', this.usuario.email, 'error');
      console.log(<any>error);
     });

  }


  onChangeEmail(_event: any) {
    if (this.showReset === true) {
      this.showReset = false;
    }
  }

  onChangeReset(_event: any) {
    if (this.showEmail === true) {
      this.showEmail = false;
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


}
