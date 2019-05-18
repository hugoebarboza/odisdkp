import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { Router } from '@angular/router';

//HELPERS
import { MustMatch } from '../../../helpers/must-match.validator';
import swal from 'sweetalert';

//MODEL
import { Proyecto, User } from '../../../models/types';


//SERVICES
import { ProjectsService, SettingsService, UserService } from '../../../services/service.index';


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
  newpassword : string;
  proyectos: Array<Proyecto>;
  password_confirmation : string;
  status: string;
  subscription: Subscription;
  title: string;
  token: any;
  year: number;

  

  constructor(
  private _router: Router,
  private _proyectoService: ProjectsService,
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
      if (this.identity == null ){
        this._userService.logout();
      }
  }

	ngOnDestroy(){
		if(this.subscription){
			this.subscription.unsubscribe();
			//console.log("ngOnDestroy unsuscribe");
		}
	}


  changepassword(formValue: any){
    
    this._userService.changepassword(this.token.token, formValue).subscribe(
     response => {
       if(response.status != 'error' ){
         //this.status = 'success';
         //console.log('changepassword exitoso');
         swal('Cambio de clave exitoso.', this.identity.email, 'success' );
         this.changeForm.reset(this.changeForm);
       }else{
        swal('Importante', 'Verifique: 1) Su clave actual sea correcta, 2) La nueva clave no sea la misma que la actual.', 'error');
         //this.status = 'error';
         //console.log('changepassword no exitoso');
       }
     },
     error => {
      swal('Importante', error.error.message, 'error');
       //this.status = 'error';
     });
  }

	refreshMenu(event:number){
		if(event == 1){
		}
	}


}

