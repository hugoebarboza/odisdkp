import { Component, Inject, OnInit,  ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

// UTYLITY
import Swal from 'sweetalert2';

// MODELS
import { User, UserRolService } from 'src/app/models/types';

// SERVICES
import { ProjectsService, UserService } from 'src/app/services/service.index';

// TOASTER MESSAGES
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-setting-user',
  templateUrl: './setting-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./setting-user.component.css']
})
export class SettingUserComponent implements OnInit {

  buttonactive = false;
  form: FormGroup;
  identity: any;
  isLoading = false;
  subscription: Subscription;
  status = '';
  // service: Service[] = [];
  // userservice: any[] = [];
  userservicerol: any[] = [];
  // header = ['status', 'destroy', 'show', 'store', 'update'];
  // label = ['service_name', 'show', 'store', 'update', 'delete'];
  columns: Array<any> = [
    { name: 'status', posicion: 1 },
    { name: 'show', posicion: 2 },
    { name: 'store', posicion: 3 },
    { name: 'update', posicion: 4 },
    { name: 'destroy', posicion: 5 },
    { name: 'grant', posicion: 6 },
  ];

  posicion = 0;
  title = 'Perfil de Acceso del Usuario - Seguridad';
  token: any;
  usuario: any;
  username: string;
  user: User;


  constructor(
    private _proyectoService: ProjectsService,
    public _userService: UserService,
    private cd: ChangeDetectorRef,
    public dialogRef: MatDialogRef<SettingUserComponent>,
    private fb: FormBuilder,
    public toasterService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this._userService.handleAuthentication(this.identity, this.token);
    this.usuario = this.data.usuario;
    this.username = this.data.usuario.name + ' ' + this.data.usuario.surname;
    this.isLoading = true;

    this.form = this.fb.group({
      roles: this.fb.array([])
    });

    /*
    this.form = this.fb.group({
      roles: new FormArray([])
    });*/

    this.cd.markForCheck();
  }

  async ngOnInit() {

    if (!this.data || !this.usuario || !this.data.id) {
      this.cd.markForCheck();
      this.isLoading = false;
      return;
    }

    if (this.usuario && this.usuario.id && this.data.id && this.data.id > 0) {
      this.cd.markForCheck();
      const data: any = await this.getServices(this.data.id);
      if (data && data.datos && data.status === 'success') {
        const userdata: any = await this.getUserProjectService(this.usuario.id, this.data.id);
        if (userdata && userdata.datos && userdata.status === 'success') {
          const servicerol = await this.getUserServiceRol(data.datos, userdata.datos);
          if (servicerol) {
            this.makeForm(servicerol);
          } else {
            this.getError();
            return;
          }
        } else {
          // this.getError();
          // return;
          const servicerol = await this.getUserServiceRol(data.datos, []);
          if (servicerol) {
            this.makeForm(servicerol);
          } else {
            this.getError();
            return;
          }
        }
      } else {
        this.getError();
        return;
      }
    }
  }

  makeForm(data: any) {
    // console.log(data);
    this.userservicerol = data;

    // console.log(this.userservicerol);
    /*
    this.userservicerol.forEach((i) => {
      const control = new FormControl(i); // if first item set to true, else false
      (this.form.controls.roles as FormArray).push(control);
    });
    */

   if (data && data.length > 0) {
    const toppingsFGs = data.map(topping => this.fb.group(topping));
    const topppingFormArray = this.fb.array(toppingsFGs);
    this.form.setControl('roles', topppingFormArray);
  }

    // console.log(this.form);

    this.isLoading = false;
    this.status = 'success';
    this.cd.markForCheck();
  }


  get getItems(): FormArray {
    return this.form.get('roles') as FormArray;
  }



  leerkey(data: any) {
    /*
    let bandera = false;
    for (let i = 0; i <= this.header.length; i++) {
      if (data.key === this.header[i]) {
        bandera = true;
        break;
      }
    }
    return bandera;*/

    let bandera = false;
    for (let i = 0; i < this.columns.length; i++) {
      const result = this.columns[i];
      if (data.key === result.name) {
        bandera = true;
        this.posicion = result.posicion;
        break;
      } else {
        this.posicion = 0;
      }
    }
    return bandera;
  }

  /*
  leerkeytr (data: any) {
    // console.log(data);
    // let bandera = false;
    // tslint:disable-next-line:forin
    for (const k in data) {
      let bandera = false;
      const result = k;
      this.label.filter((item) => {
        if (item === result) {
        bandera = true;
        }
        });
        if (bandera) {
          console.log(result);
          break;
        }
    }
    // return bandera;
  }*/

  checkValue(event: any, index: number, key: any) {
    const status = event.target.checked;
    // console.log(key);
    // console.log(this.form.value);
    // this.form.get('roles').valueChanges.subscribe(value => console.log(value));


    if (!status) {
      const element = <HTMLInputElement> document.getElementById('myCheck' + index + 'show' + key.value.id);
      element.disabled = true;
      const element2 = <HTMLInputElement> document.getElementById('myCheck' + index + 'store' + key.value.id);
      element2.disabled = true;
      const element3 = <HTMLInputElement> document.getElementById('myCheck' + index + 'update' + key.value.id);
      element3.disabled = true;
      const element4 = <HTMLInputElement> document.getElementById('myCheck' + index + 'destroy' + key.value.id);
      element4.disabled = true;
      const element5 = <HTMLInputElement> document.getElementById('myCheck' + index + 'grant' + key.value.id);
      element5.disabled = true;

    }
    if (status) {
      const element = <HTMLInputElement> document.getElementById('myCheck' + index + 'show' + key.value.id);
      element.disabled = false;
      const element2 = <HTMLInputElement> document.getElementById('myCheck' + index + 'store' + key.value.id);
      element2.disabled = false;
      const element3 = <HTMLInputElement> document.getElementById('myCheck' + index + 'update' + key.value.id);
      element3.disabled = false;
      const element4 = <HTMLInputElement> document.getElementById('myCheck' + index + 'destroy' + key.value.id);
      element4.disabled = false;
      const element5 = <HTMLInputElement> document.getElementById('myCheck' + index + 'grant' + key.value.id);
      element5.disabled = false;
    }

    // console.log(index);
  }



  async submit(data: FormGroup) {
    if (!data) {
      return;
    }

    this.buttonactive = true;

    const pila = {pila: []};

    for (let i = 0; i < data.value.roles.length; i += 1) {
      const result = data.value.roles[i];
      if (result.status || result.id > 0) {
        pila.pila.push(result);
      }
    }

    // console.log(data);


    if (data && data.value && this.usuario && this.usuario.id > 0 && this.data && this.data.id && this.data.id > 0 && pila.pila.length > 0) {
      const update = await this._userService.updateUserProjectService(this.token.token, pila, this.usuario.id, this.data.id);
      if (update && update.status === 'success') {
        // this.snackBar.open('Solicitud procesada satisfactoriamente!!!', '', {duration: 3000});
        this.dialogRef.close();
        Swal.fire('Se procesó exitosamente el perfil del usuario:', this.usuario.name + ' ' + this.usuario.surname, 'success' );
      } else {
        Swal.fire('Ha ocurrido un error con el perfil del usuario:', this.usuario.name + ' ' + this.usuario.surname, 'error');
        this.buttonactive = false;
        // this.snackBar.open('Error procesando solicitud!!!', '', {duration: 3000});
      }

      /*
      subscribe( (resp: any) => {
        console.log(resp);
        if (!resp) {
          this.snackBar.open('Error procesando solicitud!!!', '', {duration: 3000});
          return;
        }
        if (resp.status === 'success') {
          this.snackBar.open('Solicitud procesada satisfactoriamente!!!', '', {duration: 3000});
        } else {
          this.snackBar.open('Error procesando solicitud!!!', '', {duration: 3000});
        }
      },
        error => {
          this.snackBar.open('Error procesando solicitud!!!', error.message, {duration: 3000});
          console.log(<any>error);
        }
      );*/

    }
  }


  async getServices(id: number) {

    const data: any = await this._proyectoService.getProjectServicePromise(this.token, id);

    if (data) {
      return data;

    } else {
      this.toasterService.warning('Error: No existen servicios', 'Error', {enableHtml: true, closeButton: true, timeOut: 6000 });
      return;
    }
  }

  async getUserProjectService(userid: number, projectid: number) {

    const data: any = await this._proyectoService.getUserProjectServiceDetailPromise(this.token, userid, projectid);

    if (data) {
      return data;

    } else {
      // this.toasterService.warning('Error: No existen servicios asociados al Usuario', 'Error', {enableHtml: true, closeButton: true, timeOut: 6000 });
      return;
    }
  }

  async getUserServiceRol(service: any, userservice: any) {

    const userservicerol = [];

      if (service && service.length > 0 && userservice.length > 0) {
        for (let i = 0; i < service.length; i += 1) {
          const result = service[i];
          let find = false;
          for (let x = 0; x < userservice.length; x += 1) {
            const res = userservice[x];
            if (result.id === res.id) {
              const data = new UserRolService(res.userrol_id, res.user_id, result.id, result.project_id, res.service_name, res.show, res.store, res.update, res.delete, res.grant, res.status);
              find = true;
              userservicerol.push(data);
              // console.log(data);
              break;
            }
          }
          if (find === false) {
            const nodata = new UserRolService(0, this.usuario.id, result.id, result.project_id, result.service_name, 0, 0, 0, 0, 0, 0);
            // console.log(nodata);
            userservicerol.push(nodata);
            // console.log(result);
          }
        }
        // console.log(userservicerol);
        return userservicerol;
      }

      if (service && service.length > 0 && userservice.length === 0) {
        for (let i = 0; i < service.length; i += 1) {
          const result = service[i];
          const nodata = new UserRolService(0, this.usuario.id, result.id, result.project_id, result.service_name, 0, 0, 0, 0, 0, 0);
          userservicerol.push(nodata);
        }
        // console.log(userservicerol);
        return userservicerol;
      }

    // return false;
  }

  getError() {
    this.cd.markForCheck();
    this.status = 'error';
    this.isLoading = false;
    this.toasterService.warning('Error: No existen servicios asociados al Usuario', 'Error', {enableHtml: true, closeButton: true, timeOut: 6000 });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
