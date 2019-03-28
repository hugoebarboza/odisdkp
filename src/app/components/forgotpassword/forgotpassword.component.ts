import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
	public title: string;
	username : string;
  nuevopassword : string;
  
  public user : User; 
  public status: String; 
  public resetForm:FormGroup;
  year: number;


  constructor(
	private _route: ActivatedRoute,
	private _router: Router,
  private _userService: UserService


  	) 
  { 
  	this.title = 'Olvido Clave'; 
    this.user = new User('','','','',1,'','',1);  
    this.year = new Date().getFullYear();

  }

  ngOnInit() {
    //console.log('forgot.component cargado correctamente');
  }


  forgotpassword(resetForm){
   console.log(this.user.email);
   this._userService.forgotpassword(this.user).subscribe(
     response => {       
       if(response.status != 'error' ){
         this.status = 'success';
         this.user.email = "";
         //console.log('forgotpassword exitoso');
       }else{
         this.status = 'error';         
         //console.log('forgotpassword nooo exitoso');
       }
     },
     error => {
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

