import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import Swal from 'sweetalert2';

// FIREBASE
import { AngularFireAuth } from '@angular/fire/auth';

// MODELS
import { Team, User, UserFirebase } from 'src/app/models/types';

// SERVICES
import { CustomerService, UserService } from 'src/app/services/service.index';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css']
})
export class AddTeamComponent implements OnInit, OnDestroy {

  title = 'Agregar Equipo';
  forma: FormGroup;
  identity: any;
  isLoading = true;
  equipo: [] = [];
  mismatch = false;
  proyecto: any;
  proyectos = [];
  project_id: number;
  roles:  any[] = [];
  subscription: Subscription;
  token: any;
  user: User;
  userFirebase: UserFirebase;


  constructor(
    private _customerService: CustomerService,
    public _userService: UserService,
    public dialogRef: MatDialogRef<AddTeamComponent>,
    private firebaseAuth: AngularFireAuth,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.isLoading = true;
    this.identity = this._userService.getIdentity();
    this.project_id = this.data.project_id;
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();
    this.firebaseAuth.authState.subscribe(
      (auth) => {
        if (auth) {
          this.userFirebase = auth;
        }
    });
  }

  ngOnInit() {
    if (this.project_id && this.project_id > 0 ) {
      this.proyecto = this.filterProject(this.project_id);
      this.isLoading = false;
      if (this.proyecto && this.proyecto.id > 0) {
        this.buildForma(this.proyecto.id);
      }

    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  filterProject(id: number) {
    if (this.proyectos && this.data.project_id > 0) {
      for (let i = 0; i < this.proyectos.length; i += 1) {
        const result = this.proyectos[i];
        if (result && result.id === id) {
            return result;
        }
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  buildForma(id: number) {
    if (id && id > 0) {
      this.forma = new FormGroup({
        project_id: new FormControl({value: this.project_id, disabled: true}, [Validators.required]),
        descripcion: new FormControl(null, [Validators.required, Validators.minLength(2)]),
        status: new FormControl(null, [Validators.required]),
      }, );

      this.forma.setValue({
        'project_id': id,
        'descripcion': '',
        'status': 1,
      });
    }
  }

  taguser(data) {
    if (data.length === 0) {
      data = '';
      this.equipo = [];
      // console.log(this.equipo);
      return;
    }

    if (data.length > 0) {
      this.equipo = data;
      // console.log(this.equipo);
    }
  }


  onSubmit(equipo: [] = []) {

    if (this.forma.invalid || !this.proyecto) {
      Swal.fire('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
      return;
   }

    const data = new Team (0, this.proyecto.id, this.forma.value.descripcion, '', equipo, this.forma.value.status, 0, '', 0, '');

    if (this.proyecto && this.proyecto.id > 0) {
      this._customerService.addTeam(this.token.token, this.proyecto.id, data)
      .subscribe( (resp: any) => {
        if (!resp) {
          this.snackBar.open('Error procesando solicitud!!!', '', {duration: 3000, });
          return;
        }
        if (resp.status === 'success') {
          this.snackBar.open('Solicitud procesada satisfactoriamente!!!', '', {duration: 3000, });
          this.forma.reset();
          setTimeout( () => {
            this.dialogRef.close(1);
          }, 1000);
        } else {
          this.snackBar.open('Error procesando solicitud!!!', '', {duration: 3000, });
          return;
        }
      },
        error => {
          this.snackBar.open('Error procesando solicitud!!!', '', {duration:3000, });
          console.log(<any>error);
        }
      );
    }

  }



}
