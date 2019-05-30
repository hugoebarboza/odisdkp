import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";

//HELPERS
import { MustMatch } from '../../../helpers/must-match.validator';
import swal from 'sweetalert';

//MODEL
import { Proyecto, User } from '../../../models/types';


//SERVICES
import { SettingsService, UserService } from '../../../services/service.index';


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


  changepassword(formValue: any){

    if(!formValue){
      return;
     }
    
     this.isSave = true;
      
    this._userService.changepassword(this.token.token, formValue).subscribe(
     response => {
       if(response.status != 'error' ){
         swal('Cambio de clave exitoso.', this.identity.email, 'success' );
         this.changeForm.reset(this.changeForm);
       }else{
        swal('Importante', 'Verifique: 1) Su clave actual sea correcta, 2) La nueva clave no sea la misma que la actual.', 'error');
       }
       this.isSave = false;
     },
     error => {
      this.isSave = false;
      swal('Importante', error, 'error');
     });
  }

	refreshMenu(event:number){
		if(event == 1){
		}
	}


}

