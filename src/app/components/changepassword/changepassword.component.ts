import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common"
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
  public title: string;
  private identity;
  private token;
  public status: String;
  public changeForm: FormGroup;

  currentpassword : string;
  newpassword : string;
  password_confirmation : string;
  year: number;

  

  constructor(
	private _route: ActivatedRoute,
	private _router: Router, 
  private _userService: UserService,

  ) 
  { 
  	this.title = 'Cambiar Clave';
    this.year = new Date().getFullYear();
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    
   this.changeForm = new FormGroup({

      'currentpassword' : new FormControl(
        '',
        [
        Validators.required, 
        Validators.minLength(4)]
       ),
      
      'newpassword' : new FormControl(
        '',
        [Validators.required, Validators.minLength(6)]
       ),
      
      'password_confirmation' : new FormControl(
        '',
        [Validators.required, Validators.minLength(6)]
       ),    
    });

    this.changeForm.controls['password_confirmation'].setValidators(
      [Validators.required, this.noIgual.bind(this.changeForm)]
      )
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
        localStorage.removeItem('identity');
        localStorage.removeItem('token');
        localStorage.removeItem('proyectos');
        this._router.navigate(["/login"]);
      }
  }


  changepassword(formValue: any){
    
    this._userService.changepassword(this.token.token, formValue).subscribe(
     response => {       
       if(response.status != 'error' ){
         this.status = 'success';
         //console.log('changepassword exitoso');
         this.changeForm.reset(this.changeForm);
       }else{
         this.status = 'error';         
         //console.log('changepassword no exitoso');
       }
     },
     error => {
       this.status = 'error';
     });
  }

}

