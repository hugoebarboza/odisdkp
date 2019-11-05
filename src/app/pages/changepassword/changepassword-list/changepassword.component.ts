import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

// HELPERS
import { MustMatch } from '../../../helpers/must-match.validator';
import Swal from 'sweetalert2';

// MODEL
import { Proyecto } from 'src/app/models/types';


// SERVICES
import { SettingsService, UserService, AuthService } from 'src/app/services/service.index';


import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';


@Component({    
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit, OnDestroy
{
  
  changeForm: FormGroup; 
  currentpassword : string;
  identity: any;
  isSave: boolean = false;
  newpassword : string;
  proyectos: Array<Proyecto>;
  password_confirmation : string;
  status: string;
  subscription: Subscription;
  title: string;
  token: any;
  year: number;


  constructor(
  public _userService: UserService,
  public label: SettingsService,
  private firebaseAuth: AngularFireAuth,
  public authService: AuthService,
  ) 
  { 
    this.year = new Date().getFullYear();
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();
    
   this.changeForm = new FormGroup({
      'currentpassword' : new FormControl('',[Validators.required,Validators.minLength(4)]),      
      'newpassword' : new FormControl('',[Validators.required, Validators.minLength(6)]),      
      'password_confirmation' : new FormControl('',[Validators.required, Validators.minLength(6)]),    
    },
    { validators: MustMatch('newpassword','password_confirmation') } 
    );

   this.label.getDataRoute().subscribe(data => {
      this.title = data.subtitle;
   });


  }



  noIgual( control:FormControl ) :  { [s:string]: boolean }  {
    var changeForm:any = this; 

    if(control.value !== changeForm.controls['newpassword'].value){
      return{
        noiguales:true
      }

    }
    return null;
  }

  ngOnInit(){
  this.isSave = false;
  }

	ngOnDestroy(){
		if(this.subscription){
			this.subscription.unsubscribe();
			//console.log("ngOnDestroy unsuscribe");
		}
	}


  changepassword(formValue: any) {

    if (!formValue) {
      return;
    }

    this.isSave = true;

    const user = this.firebaseAuth.auth.currentUser;

    const credential = firebase.auth.EmailAuthProvider.credential(
      this.identity.email,
      formValue.currentpassword
    );

    this._userService.changepassword(this.token.token, formValue).subscribe(
      response => {
        if (response.status !== 'error' && user) {
            user.reauthenticateWithCredential(credential)
            .then(_succes => {
              user.updatePassword(formValue.newpassword)
              .then(_respsucces => {
                Swal.fire('Cambio de clave exitoso.', this.identity.email, 'success' );
                this.changeForm.reset(this.changeForm);
              }).catch(error => {
                console.log(error);
                this.sendpasswordfirebase();
              });
            }).catch(error => {
              console.log(error);
              this.sendpasswordfirebase();
            });
        } else {
          Swal.fire('Importante', 'Verifique: 1) Su clave actual sea correcta, 2) La nueva clave no sea la misma que la actual.', 'error');
        }
        this.isSave = false;
      },
      error => {
        this.isSave = false;
        console.log(error);
        Swal.fire('Importante', error.error.message, 'error');
      }
    );

  }

  sendpasswordfirebase() {
    Swal.fire({
      title: 'Error en actulización credencial firebase',
      text: 'Favor actualizar contraseña de acceso, de lo contrario algunas funcionalidades se desactivaran.',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
      }).then( item => {
        if (item.value) {
          if (item === 'confirmar') {
            // Swal({icon: 'success', title: 'Se envío correo a ' + this.identity.email + ' para su verificación!', text: 'Una vez verificado cerrar cuenta y abrir sesión'});
            Swal.fire('Se envío correo a ' + this.identity.email + ' para su verificación!', 'Una vez verificado cerrar cuenta y abrir sesión', 'success' );
            this.authService.updateUser(this.identity)
            .then(_res => {
            }, err => {
            return console.log(err);
            });
          }
        } else if (item.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelado',
          );
        }
      });
  }

  refreshMenu(event: number) {
    if (event === 1) {
    }
  }


}

