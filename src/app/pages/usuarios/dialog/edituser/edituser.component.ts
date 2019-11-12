import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

// HELPERS
import { MustMatch } from '../../../../helpers/must-match.validator';

// MODELS
import { User } from 'src/app/models/types';

// SERVICES
import { UserService } from 'src/app/services/service.index';



@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css']
})
export class EditUserComponent implements OnInit {

  title = 'Editar Usuario';
  forma: FormGroup;
  identity: any;
  isLoading = true;
  roles:  any[] = [];
  token: any;
  usuario: any;
  user: User;

  constructor(
    public _userService: UserService,
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.isLoading = true;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.usuario = this.data.usuario;
  }

  ngOnInit() {
    if (this.usuario) {
      this.getRoleUser();
      this.isLoading = false;
    }
      this.forma = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      surname: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      email2: new FormControl(null, [Validators.required, Validators.email]),
      dni: new FormControl(null),
      dv: new FormControl(null),
      role_id: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
      telefono: new FormControl(null),
      telefono2: new FormControl(null),
    }, {
      validators: MustMatch('email', 'email2')
    });

    this.forma.setValue({
      'name': this.usuario.name,
      'surname': this.usuario.surname,
      'email': this.usuario.email.toLowerCase(this.usuario.email),
      'email2': this.usuario.email.toLowerCase(this.usuario.email),
      'dni': this.usuario.dni,
      'dv': this.usuario.dv,
      'role_id': this.usuario.role_id,
      'status': this.usuario.status,
      'telefono': this.usuario.telefono1,
      'telefono2': this.usuario.telefono2
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmEdit() {
    if (this.forma.invalid) {
      Swal.fire('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
      return;
    }

    this.user = new User(this.usuario.id, this.forma.value.dni, this.forma.value.dv, '', this.forma.value.name, this.forma.value.email, '', this.forma.value.role_id, this.forma.value.surname, '', 1, this.forma.value.telefono, this.forma.value.telefono2, this.forma.value.status, 1, 1);

    if (this.user) {
      this.dialogRef.close();
      this._userService.update(this.token.token, this.user, this.user.id)
      .subscribe( (resp: any) => {
        if (!resp) {
          return;
        }
        if (resp.status === 'success') {
          Swal.fire('Usuario actualizado', this.user.name + ' ' + this.user.surname, 'success' );
        } else {
          Swal.fire('Importante', 'A ocurrido un error en el procesamiento de información', 'error');
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



}
