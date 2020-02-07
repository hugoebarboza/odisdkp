import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs/Subscription';

import Swal from 'sweetalert2';

// MODELS
import {
  Proyecto,
  Service
  } from 'src/app/models/types';


// SERVICES
import { UserService } from 'src/app/services/service.index';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  customerid: number;
  id: number;
  identity: any;
  loading = false;
  project: any;
  project_name: string;
  proyectos: Array<Proyecto> = [];
  title = 'Usuarios de Proyecto';
  totalRegistros = 0;
  totalRegistrosNoActive = 0;
  selected = new FormControl(0);
  subtitle = 'Seleccione los usuarios de acuerdo a las siguientes opciones.';
  subscription: Subscription;
  status: string;
  token: any;

  constructor(
    public _userService: UserService,
    public dialogRef: MatDialogRef<UserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Service,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.proyectos = this._userService.getProyectos();

  }

  ngOnInit() {

    if (this.data.project_id > 0) {
      this.id = this.data.project_id;
      this.project = this.filter();
      this.project_name = this.project.project_name;
      this.customerid = this.project.customer_id;
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  loadDataUser(total: number) {
    this.totalRegistros = total;
  }

  loadDataUserNoActive(total: number) {
    this.totalRegistrosNoActive = total;
  }


  adduser(userid: number) {
    if (userid > 0) {
      this._userService.adduser(this.token.token, userid, this.id).subscribe(
        response => {
         if (response.status === 'success') {
          this.dialogRef.close();
          Swal.fire('Solicitud procesada ', 'exitosamente.', 'success' );
         } else {
          this.dialogRef.close();
          Swal.fire('No fue posible procesar su solicitud', '', 'error');
        }
        },
        error => {
          this.dialogRef.close();
          Swal.fire('No fue posible procesar su solicitud', error.error.message, 'error');
        }
      );
    }
  }



  remover(userid: number) {
    if (userid === this.identity.sub ) {
      this.dialogRef.close();
      Swal.fire('No puede borrar usuario', 'No se puede borrar a si mismo', 'error');
      return;
    }

    this._userService.remover(this.token.token, userid, this.id).subscribe(
      response => {
       if (response.status === 'success') {
        this.dialogRef.close();
        Swal.fire('Solicitud procesada ', 'exitosamente.', 'success' );
       } else {
        this.dialogRef.close();
        Swal.fire('No fue posible procesar su solicitud', '', 'error');
       }
      },
      error => {
        this.dialogRef.close();
        Swal.fire('No fue posible procesar su solicitud', error, 'error');
      }
    );

  }

  filter() {
    if (this.proyectos && this.id) {
      for (let i = 0; i < this.proyectos.length; i += 1) {
        const result = this.proyectos[i];
        if (result.id === this.id) {
            return result;
        }
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
