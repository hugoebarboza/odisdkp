import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import Swal from 'sweetalert2';

// FIREBASE
import { AngularFireAuth } from '@angular/fire/auth';


// MODELS
import { Team, UserFirebase, User } from 'src/app/models/types';


// SERVICES
import { CustomerService, ProjectsService, UserService } from 'src/app/services/service.index';



@Component({
  selector: 'app-add-user-team',
  templateUrl: './add-user-team.component.html',
  styleUrls: ['./add-user-team.component.css']
})
export class AddUserTeamComponent implements OnInit, OnDestroy {

  title = 'Añadir miembros al equipo';
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
  userFirebase: UserFirebase;
  users: User[] = [];

  constructor(
    private _customerService: CustomerService,
    private _projectService: ProjectsService,
    public _userService: UserService,
    public dialogRef: MatDialogRef<AddUserTeamComponent>,
    private firebaseAuth: AngularFireAuth,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.isLoading = true;
    this.identity = this._userService.getIdentity();
    this.project_id = this.data.team.project_id;
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
    if (this.project_id && this.project_id > 0) {
      this.isLoading = false;
      this.proyecto = this.filterProject(this.project_id);
      if (this.proyecto && this.proyecto.id > 0) {
        this.buildForma(this.data.team);
        this.loadUserProject(this.project_id);
      }
    }
  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  filterProject(id: number) {
    if (this.proyectos && this.data.team.project_id > 0) {
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

  buildForma(data: any) {
    if (data.id && data.id > 0) {
      // console.log(data);
      this.forma = new FormGroup({
        id: new FormControl(data.id, [Validators.required]),
        project_id: new FormControl({value: this.project_id, disabled: true}, [Validators.required]),
        owner_id: new FormControl(data.owner_id, [Validators.required]),
        descripcion: new FormControl(data.descripcion, [Validators.required, Validators.minLength(2)]),
        status: new FormControl(1, [Validators.required]),
      }, );

      /*
      this.forma.setValue({
        'id': data.id,
        'project_id': data.project_id,
        'descripcion': data.descripcion,
        'status': 1,
      });*/

      // console.log(this.forma);
    }
  }

  loadUserProject(id: number) {
    const role = 9;
    this.subscription = this._projectService.getUserProject(this.token.token, id, role).subscribe(
    response => {
              if (!response) {
                return;
              }
              if (response.status === 'success') {
                this.users = response.datos;
                // console.log(this.users);
              }
              });
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

   const data = new Team (this.forma.value.id, this.proyecto.id, this.forma.value.owner_id, this.forma.value.descripcion, '', equipo, this.forma.value.status, 0, '', 0, '');
    // console.log(this.forma);
    // console.log(data);


    if (this.proyecto && this.proyecto.id > 0) {
      this._customerService.updateTeam(this.token.token, data.project_id, data, data.id)
      .subscribe( (resp: any) => {
        // console.log(resp);
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
          this.snackBar.open('Error procesando solicitud!!!', error.error.mensaje, {duration: 3000, });
          console.log(<any>error);
        }
      );
    }

  }



}
