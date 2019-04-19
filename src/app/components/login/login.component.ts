import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

//MODELS
import { Proyecto, User } from '../../models/types';


//SERVICES
import { UserService } from '../../services/service.index';

//SETTINGS
import { GLOBAL } from '../../services/global';


//UTILITY
import { MatProgressButtonOptions } from 'mat-progress-buttons'


//TOASTER MESSAGES
import { ToastrService } from 'ngx-toastr';



@Component({
  selector:'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {
  public email: string;
  public title: string;
  public fotoperfil: string = '';
  public user: User;
  public token;
  public identity;
  public idaccount;
  public status: string;
  public proyectos: Array<Proyecto>;
  public useraccount: string;
  public show:boolean = false;
  
  loading: boolean = false;  
  year: number;
  hide = true;
  rememberMe:number = 0;  
  selected: string;
  success:string;
  error:string;
  version:string;


  spinnerButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Iniciar sesión',
    spinnerSize: 18,
    raised: true,
    stroked: false,
    buttonColor: 'primary',
    spinnerColor: 'warn',
    fullWidth: true,
    disabled: false,
    mode: 'indeterminate'
  }

 barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Iniciar sesión',
    buttonColor: 'primary',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }


    formControl = new FormControl('', [Validators.required, Validators.email]);

    getErrorMessage() {
    return this.formControl.hasError('required') ? 'Dato Valido Requerido' : 
        this.formControl.hasError('email') ? 'Email no valido' : 
       //this.email.hasError('email') ? 'Email no valido' : 
       '';
    }

  //private _toasterService: ToasterService;

  subscription: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    public _userService: UserService,
    private toasterService: ToastrService,    
  ){
    this.title = 'Acceso';
    this.user = new User('','','','','','','', 1,'','',1,'','',1,1,1);
    this.year = new Date().getFullYear();
    this.identity = this._userService.getIdentity();
    this.idaccount = this._userService.getIdaccount();
    this.token = this._userService.getToken();      
    this._userService.handleAuthentication(this.identity, this.token);  
    this.success = 'Exitoso.';
    this.error = 'Credenciales no validas.'; 
    this.version = GLOBAL.version;
  }

  ngOnInit(){
    if (this._userService.isAuthenticated()) {
      this._router.navigate(['dashboard']);
    }    
    this.logout();
    if (this.idaccount) {
      this.rememberMe = 1;
      this.email = this.idaccount;
    } else {
      this.rememberMe = 0;
    }

  }


	ngOnDestroy(){
		if(this.subscription){
			this.subscription.unsubscribe();
		}
		//console.log("ngOnDestroy unsuscribe");
	}

    onChange(value) {
        if (value.checked == true) {
          this.rememberMe = 1;
        } else {
          this.rememberMe = 0;
        }
    }



  onSubmit(form:NgForm){
    //console.log('paso');
   this.spinnerButtonOptions.active = true;
   this.spinnerButtonOptions.text = 'Espere...';
   //this.barButtonOptions.active = true;
   //this.barButtonOptions.text = 'Espere...';
   if(!form.valid){
    return;
   }

   let usuario = new User('', '', '', '', '', form.value.email, form.value.password, 1, '', this.version, 1, '','',1, 1, 1);

   this._userService.signup(usuario).subscribe(
     response => {       
       if(response.status != 'error' ){
         this.status = 'success';         
         this.token = response;
         this.toasterService.success('Acceso: '+this.success, 'Exito', {timeOut: 4000,});
         let key = 'token';
         //localStorage.setItem(key, JSON.stringify(this.token));
         this._userService.saveStorage(key, this.token);
         this._userService.signup(usuario, true).subscribe(
           response => { 
             //console.log(response);
            this.identity = response;                      
            let key = 'identity';
            //localStorage.setItem(key, JSON.stringify(this.identity));  
            this._userService.saveStorage(key, this.identity);
            if(this.identity){
              this.getPerfilUser(this.identity.sub);
            }        
            this._userService.handleAuthentication(this.identity, this.token);
            if (this.rememberMe == 1){
              let key = 'idaccount';
              this.useraccount = usuario.email;
              //localStorage.setItem(idaccount, JSON.stringify(this.useraccount));
              this._userService.saveStorage(key, this.useraccount);
            }else{
              if (localStorage['idaccount'] !== undefined) {
                  localStorage.removeItem('idaccount');
              }
              
            }          
            //Redirect
            this._router.navigate(['dashboard']);
             
           },
           error => {
             this.spinnerButtonOptions.active = false;      
             //this.barButtonOptions.active = false;      
             this.status = 'error';
           }
           );
       }else{
         this.spinnerButtonOptions.active = false;               
         //this.barButtonOptions.active = false;      
         this.status = 'error';
       }
     },
     error => {     
      this.spinnerButtonOptions.active = false;                      
      this.spinnerButtonOptions.text = 'Iniciar sesión'         
      //this.barButtonOptions.active = false;      
      //this.barButtonOptions.text = 'Iniciar sesión'         
      this.status = 'error';   
      this.toasterService.warning('Error: '+this.error, 'Error', {enableHtml: true,closeButton: true, timeOut: 6000 });
     }
     );

  }

  getPerfilUser(id: any){
    if(id && this.token.token){
      this._userService.getPerfilUser(this.token.token, id).subscribe(
        response => {        
          if(!response){
            return false;        
          }
            if(response.status == 'success'){ 
              this.fotoperfil = response.datos[0]['archivo'];
              if(this.fotoperfil.length > 0){
                let key = 'fotoprofile';
                this._userService.saveStorage(key, this.fotoperfil);  
              }
            }
        },
            error => {
            console.log(<any>error);
            }   
        );      
    }

  }


  logout(){        
    this._route.params.subscribe(params => {
      let logout = +params['sure'];
      if(logout == 1){ 
        
        localStorage.removeItem('departamentos');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('fotoprofile');
        localStorage.removeItem('identity');
        localStorage.removeItem('proyectos');
        localStorage.removeItem('token');      
        this.identity = null;
        this.token = null;
        this.proyectos = null;        
        //this._router.navigate(['']);
        this._router.navigate(['/login']);
      }

    })
  }



  
}