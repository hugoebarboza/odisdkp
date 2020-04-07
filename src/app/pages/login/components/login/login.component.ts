import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

// FIREBASE
import * as firebase from 'firebase/app';
import 'firebase/performance';

// MESSAGES
import Swal from 'sweetalert2';

// MODELS
import { Proyecto, User } from 'src/app/models/types';

// NGRX REDUX
import { AppState } from 'src/app/app.reducers';
import { Store } from '@ngrx/store';
import { LoginAction } from 'src/app/contador.actions';

// SERVICES
import { AuthService, CountriesService, DashboardService, SettingsService, UserService, WebsocketService } from 'src/app/services/service.index';

// SETTINGS
import { GLOBAL } from 'src/app/services/global';

// TOASTER MESSAGES
import { ToastrService } from 'ngx-toastr';

// UTILITY
import { MatProgressButtonOptions } from 'mat-progress-buttons';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {

  email: string;
  error: string;
  hide = true;
  identity: any;
  idaccount: any;
  proyectos: Array<Proyecto>;
  rememberMe = 0;
  success: string;
  status: string;
  subscription: Subscription;
  title: string;
  token: any;
  usuario: User;
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
    public _proyectoService: DashboardService,
    public _regionService: CountriesService,
    public _route: ActivatedRoute,
    public _router: Router,
    public _userService: UserService,
    public authService: AuthService,
    public label: SettingsService,
    private store: Store<AppState>,
    public toasterService: ToastrService,
    public wsService: WebsocketService,
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
    const trace = firebase.performance().trace('LoginPage Init');
    trace.start();
    trace.stop();

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
    if (this.subscription) {
      this.subscription.unsubscribe();
      }
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
      const proyectos = response.datos;
      const key = 'proyectos';
      this._userService.saveStorage(key, proyectos);
      const region: any = await this._regionService.getRegion(token.token, identity.country);
      if (region && region.status === 'success' && region.datos) {
        const keyr = 'region';
        this._userService.saveStorage(keyr, region);
        this.loginAction(proyectos, identity);
        this.loginFirebase(token, this.usuario, identity);
        this.loginWsocket(identity);
        this.spinnerButtonOptions.active = false;
        this.spinnerButtonOptions.text = 'Iniciar sesión';
        this.toasterService.success('Acceso: ' + this.success, 'Exito', {timeOut: 4000, closeButton: true, });
        this._router.navigate(['dashboard']);
      }
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

    // return await this._userService.getDptoProyectos(token.token, identity.dpto);
    return await this._userService.getUserProjectService(token.token, identity.sub);
  }


  async getPerfilUser(id: number, token: any) {
    if (!id || !token.token) {
      return;
    }

    return await this._userService.getPerfilUser(token.token, id);
  }

  loginWsocket(usuario: any) {
    if (!usuario || !usuario.email) {
      return;
    }

    // console.log(usuario);

    this.wsService.loginWS(usuario);

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
        this.wsService.logoutWS();
        // this._router.navigate(['/login']);
      }
    });
  }

}
