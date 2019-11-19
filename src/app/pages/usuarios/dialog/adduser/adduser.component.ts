import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

// HELPERS
import { MustMatch } from '../../../../helpers/must-match.validator';

// MODELS
import { Departamento, Proyecto, User } from 'src/app/models/types';

// SERVICES
import { UserService } from 'src/app/services/service.index';


@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AddUserComponent implements OnInit {

  title = 'Agregar Usuario';
  disableSelect = new FormControl(true);
  departamentos: Array<Departamento> = [];
  departamento_id: number;
  forma: FormGroup;
  identity: any;
  isLoading = true;
  mismatch = false;
  proyectos: Array<Proyecto> = [];
  project_id: number;
  roles:  any[] = [];
  token: any;
  user: User;


  constructor(
    public _userService: UserService,
    public dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {
    this.isLoading = true;
    this.departamentos = this._userService.getDepartamentos();
    this.departamento_id = this.data.departamento_id;
    this.identity = this._userService.getIdentity();
    this.project_id = this.data.project_id;
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    if (this.project_id && this.departamento_id && this.departamentos) {
      this.getRoleUser();
      this.isLoading = false;

      this.forma = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      surname: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      email2: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      password2: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      dni: new FormControl(null),
      dv: new FormControl(null),
      role_id: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
      telefono: new FormControl(null),
      telefono2: new FormControl(null),
      project_id: new FormControl({value: this.project_id, disabled: true}, [Validators.required]),
      departamento_id: new FormControl({value: this.departamento_id, disabled: true}, [Validators.required])
    }, {
      validators: [this.verifyEqual('password', 'password2'), MustMatch('email', 'email2')]
    });

    this.forma.setValue({
      'name': '',
      'surname': '',
      'email': '',
      'email2': '',
      'password': '',
      'password2': '',
      'dni': '',
      'dv': '',
      'role_id': 1,
      'status': 1,
      'telefono': '',
      'telefono2': '',
      'project_id': this.project_id,
      'departamento_id': this.departamento_id,
    });

    }
  }


  verifyEqual( data: string, data2: string) {
    return (group: FormGroup) => {
      const password1 = group.controls[data].value;
      const password2 = group.controls[data2].value;
      if (password1 === password2) {
       return null;
      }
      return {
        mismatch: true
      };
    };
  }



  confirmAdd() {
    if (this.forma.invalid) {
      Swal.fire('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
      return;
    }

    this.user = new User('', this.forma.value.dni, this.forma.value.dv, '', this.forma.value.name, this.forma.value.email, this.forma.value.password, this.forma.value.role_id, this.forma.value.surname, '', 1, this.forma.value.telefono, this.forma.value.telefono2, this.forma.value.status, this.project_id, this.departamento_id);
    if (this.user) {
      this.dialogRef.close();
      this._userService.registeruseremployee(this.token.token, this.user).subscribe(
        response => {
         if (response.status === 'success') {
           Swal.fire('Usuario creado', this.user.email, 'success' );
           this.forma.reset();
         } else {
           Swal.fire('Importante', response.message , 'error');
         }
        },
        error => {
          Swal.fire('Importante', error, 'error');
        }
      );
    }

  }

  getRoleUser() {
    if (this.token.token) {
      this._userService.getRoleUser(this.token.token, this.identity.role).subscribe(
        response => {
          if (!response) {
            return false;
          }
            if (response.status === 'success') {
              this.roles = response.datos;
            }
        },
            error => {
            console.log(<any>error);
            }
        );
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


}
