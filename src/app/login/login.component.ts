import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// MODELS
import { Proyecto, User } from 'src/app/models/types';


// SERVICES
import { AuthService, DashboardService, SettingsService, UserService } from 'src/app/services/service.index';

// SETTINGS
import { GLOBAL } from '../services/global';

import Swal from 'sweetalert2';


// UTILITY
import { MatProgressButtonOptions } from 'mat-progress-buttons';


// TOASTER MESSAGES
import { ToastrService } from 'ngx-toastr';

// NGRX REDUX
import { AppState } from 'src/app/app.reducers';
import { Store } from '@ngrx/store';
import { LoginAction } from 'src/app/contador.actions';


// FIREBASE
import { AngularFirePerformance } from '@angular/fire/performance';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {

  departamentos: Array<any> = [];
  email: string;
  error: string;
  hide = true;
  loading = false;
  identity: any;
  idaccount;
  proyectos: Array<Proyecto>;
  rememberMe = 0;
  selected: string;
  success: string;
  show = false;
  status: string;
  title: string;
  token: any;
  trace: any;
  usuario: User;
  userFirebase;
  useraccount: string;
  year: number;
  version: string;

  spinnerButtonOptionsDisabled: MatProgressButtonOptions = {
    active: false,
    text: 'Iniciar sesión',
    spinnerSize: 18,
    raised: true,
    stroked: false,
    buttonColor: 'primary',
    spinnerColor: 'warn',
    fullWidth: true,
    disabled: true,
    mode: 'indeterminate',
  };

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
    mode: 'indeterminate',
  };

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
  };


    formControl = new FormControl('', [Validators.required, Validators.email]);

    getErrorMessage() {
    return this.formControl.hasError('required') ? 'Dato Valido Requerido' :
        this.formControl.hasError('email') ? 'Email no valido' :
       '';
    }



  constructor(
    private afp: AngularFirePerformance,
    public _proyectoService: DashboardService,
    public _route: ActivatedRoute,
    public _router: Router,
    public _userService: UserService,
    public authService: AuthService,
    public label: SettingsService,
    private store: Store<AppState>,
    public toasterService: ToastrService,
  ) {
    // this.user = new User('','','','','','','', 1,'','',1,'','',1,1,1);
    this.year = new Date().getFullYear();
    this.identity = this._userService.getIdentity();
    this.idaccount = this._userService.getIdaccount();
    this.token = this._userService.getToken();
    this._userService.handleAuthentication(this.identity, this.token);
    this.success = 'Exitoso.';
    this.error = 'Credenciales no validas.';
    this.version = GLOBAL.version;
    this.label.getDataRoute().subscribe(data => {
      this.title = data.subtitle;
    });
  }

  ngOnInit() {
    this.trace = this.afp.trace$('LoginPage Init').subscribe();
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


  loginAction(p: any, i: any) {
    const obj: any = {project: p, identificacion: i};
    const accion = new LoginAction(obj);
    this.store.dispatch( accion );
  }


  ngOnDestroy() {
    this.trace.unsubscribe();
  }

  onChange(value) {
    if (value.checked === true) {
      this.rememberMe = 1;
    } else {
          this.rememberMe = 0;
     }
  }



  async onSubmit(form: NgForm) {
   this.spinnerButtonOptions.active = true;
   this.spinnerButtonOptions.text = 'Espere...';
   if (!form.valid) {
    return;
   }

   this.usuario = new User('', '', '', '', '', form.value.email, form.value.password, 1, '', this.version, 1, '', '', 1, 1, 1);

   if (this.rememberMe === 1) {
    const key = 'idaccount';
    this.useraccount = this.usuario.email;
    this._userService.saveStorage(key, this.useraccount);
   } else {
    if (localStorage['idaccount'] && localStorage['idaccount'] !== undefined && localStorage['idaccount'] !== null) {
        localStorage.removeItem('idaccount');
    }
   }

   const user: any = await this.getUser();
   if (user && user.token) {
    this.status = 'success';
    const token = user;
    this._userService.signuptrue(this.usuario, true)
    .then(async (resp) => {
      const identity: any = resp;
      if (identity && identity.sub) {
        const profile: any = await this.getPerfilUser(identity.sub, token);
        if (profile && profile.datos && profile.datos[0]['archivo']) {
          const fotoperfil: string = profile.datos[0]['archivo'];
          if (fotoperfil.length > 0) {
            const key = 'fotoprofile';
            this._userService.saveStorage(key, fotoperfil);
          }
        }
        this._userService.handleAuthentication(identity, token);
        this.afterSignIn(identity, token);
      }
    })
    .catch((error) => {
      this.spinnerButtonOptions.active = false;
      this.spinnerButtonOptions.text = 'Iniciar sesión';
      this.status = 'error';
      this.toasterService.warning('Error: No puede iniciar sesión' + error, 'Error', {enableHtml: true, closeButton: true, timeOut: 6000 });
      this._userService.logout();
    });
   } else {
    this.spinnerButtonOptions.active = false;
    this.spinnerButtonOptions.text = 'Iniciar sesión';
    this.status = 'error';
    this.toasterService.warning('Error: No puede iniciar sesión. Verifique sus datos de acceso.', 'Error', {enableHtml: true, closeButton: true, timeOut: 6000 });
    this._userService.logout();
   }
  }



  async getUser() {
    return this._userService.signup(this.usuario);
  }


  async afterSignIn(identity: any, token: any) {
    if (!identity || !token) {
      return;
    }


    const response: any = await this.getProyectos(identity, token);
    if (response && response.datos) {
      console.log(response);
      const proyectos = response.datos;
      const key = 'proyectos';
      this._userService.saveStorage(key, proyectos);
      this.spinnerButtonOptions.active = false;
      this.spinnerButtonOptions.text = 'Iniciar sesión';
      this.toasterService.success('Acceso: ' + this.success, 'Exito', {timeOut: 4000, closeButton: true, });
      this._router.navigate(['dashboard']);
      this.loginAction(proyectos, identity);
      this.loginFirebase(token, this.usuario, identity);
    } else {
      this.spinnerButtonOptions.active = false;
      this.spinnerButtonOptions.text = 'Iniciar sesión';
      this.status = 'error';
      this.toasterService.warning('Error: No puede iniciar sesión. Verifique sus datos.', 'Error', {enableHtml: true, closeButton: true, timeOut: 6000 });
      this._userService.logout();
    }
  }


  async getProyectos(identity: any, token: any) {

    if (!identity || !token) {
      return;
    }

    return await this._userService.getDptoProyectos(token.token, identity.dpto);
  }


  async getPerfilUser(id: number, token: any) {
    if (!id || !token.token) {
      return;
    }

    return await this._userService.getPerfilUser(token.token, id);
  }


  loginFirebase(token: any, value: User, identity: any) {
    if (!token || !value) {
      return;
    }
    this.authService.login(token.token, value.email, value.password)
    .then(_res => {
      this.tryUpdate(value, identity);
    }, err => {
      switch (err.code) {
        case 'auth/user-not-found': {
            this.tryRegister(value, identity);
            return console.log('usuario registrado en Firebase');
        }
        case 'auth/wrong-password': {
          Swal.fire({
            title: 'Error en credencial firebase',
            text: 'Favor actualizar contraseña de acceso, de lo contrario algunas funcionalidades se desactivaran.',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
          }).then( item => {
            if (item.value) {
              if (item === 'confirmar') {
                // Swal.fire({icon: 'success', title: 'Se envio correo para su verificación!', text: 'Una vez verificado cerrar y abrir sesión'});
                Swal.fire('Se envio correo para su verificación!', 'Una vez verificado cerrar y abrir sesión', 'success' );
                this.authService.updateUser(value)
                .then(res => {
                return console.log(res);
                },
                (_err: any ) => {
                return console.log(err);
                });
              }
            } else if (item.dismiss === Swal.DismissReason.cancel) {
              Swal.fire(
                'Cancelado',
              );
            }
            });

          return console.log('update password');

            /*
            this.authService.updateUser(value)
            .then(res => {
              //console.log(res);
            }, err => {
              //console.log(err);
            })
            return console.log('update password');*/
        }
        default: {
            return console.log('Login Firebase error try again later.');
        }
      }

    });
  }


  tryRegister(value: User, identity: any) {
    if (!value) {
      return;
    }
    this.authService.doRegister(value, identity)
    .then(_res => {
    }, err => {
      console.log(err);
    });
  }

  tryUpdate(value: User, identity: any) {
    if (!value) {
      return;
    }

    this.authService.doUpdate(identity)
    .then(_res => {
    }, err => {
      console.log(err);
    });
  }


  logout() {
    this._route.params.subscribe(params => {
      const logout = +params['sure'];
      if (logout === 1) {
        this.identity = null;
        this.token = null;
        this.proyectos = null;
        this._userService.logout();
        this.authService.logout();
        // this._router.navigate(['/login']);
      }
    });
  }

}
