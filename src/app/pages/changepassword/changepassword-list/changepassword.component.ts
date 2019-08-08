import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";

//HELPERS
import { MustMatch } from '../../../helpers/must-match.validator';
import swal from 'sweetalert';

//MODEL
import { Proyecto, User } from '../../../models/types';


//SERVICES
import { SettingsService, UserService, AuthService } from '../../../services/service.index';
import { AngularFireAuth } from 'angularfire2/auth';
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
        if (response.status !== 'error' ) {
            user.reauthenticateWithCredential(credential).then(succes => {
              //console.log('reauthenticateWithCredential - SUCCESS');
              //console.log(succes);
              user.updatePassword(formValue.newpassword).then(respsucces => {
                //console.log('updatePassword - SUCCESS');
                //console.log(respsucces);
                swal('Cambio de clave exitoso.', this.identity.email, 'success' );
                this.changeForm.reset(this.changeForm);
              }).catch(error => {
                //console.log('updatePassword - ERROR');
                console.log(error);
                this.sendpasswordfirebase();
              });
            }).catch(error => {
              //console.log('reauthenticateWithCredential - ERROR');
              console.log(error);
              this.sendpasswordfirebase();
            });
        } else {
          swal('Importante', 'Verifique: 1) Su clave actual sea correcta, 2) La nueva clave no sea la misma que la actual.', 'error');
        }
        this.isSave = false;
      },
      error => {
        this.isSave = false;
        console.log(error);
        swal('Importante', error.error.message, 'error');
      }
    );

  }

  sendpasswordfirebase() {
    swal({
      title: 'Error en actulización credencial firebase',
      text: 'Favor actualizar contraseña de acceso, de lo contrario algunas funcionalidades se desactivaran.',
      icon: 'warning',
      buttons: {
        cancelar: {
          text: 'No validar',
          value: 'cancel',
          className: 'swal-button--danger'
          } ,
        confirmar: {
          text: 'Validar credencial',
          value: 'confirmar'
        }
        },
      }).then( item => {
        if (item === 'confirmar') {
          // tslint:disable-next-line:max-line-length
          swal({icon: 'success', title: 'Se envío correo a ' + this.identity.email + ' para su verificación!', text: 'Una vez verificado cerrar cuenta y abrir sesión'});
          this.authService.updateUser(this.identity)
          .then(res => {
          //return console.log(res);
          }, err => {
          return console.log(err);
          });
        }
      });
  }

	refreshMenu(event:number){
		if(event == 1){
		}
	}


}

