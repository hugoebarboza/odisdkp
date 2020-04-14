import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';


import Swal from 'sweetalert2';

// MODELS
import { Team, UserFirebase } from '../../../../models/types';

// FIREBASE
import { AngularFireAuth } from '@angular/fire/auth';


// SERVICES
import { CustomerService, UserService } from 'src/app/services/service.index';


@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.css']
})
export class EditTeamComponent implements OnInit, OnDestroy {

  destroy = new Subject();
  isLoading: boolean;
  isLoadingData: boolean;
  team: Team;
  title = 'Editar miembros al equipo';
  forma: FormGroup;
  identity: any;
  equipo: [] = [];
  mismatch = false;
  proyecto: any;
  proyectos = [];
  project_id: number;
  roles:  any[] = [];
  status: string;
  subscription: Subscription;
  token: any;
  totalRegistros = 0;
  userFirebase: UserFirebase;

  constructor(
    private _customerService: CustomerService,
    public _userService: UserService,
    private firebaseAuth: AngularFireAuth,
    public dialogRef: MatDialogRef<EditTeamComponent>,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.isLoading = true;
    this.isLoadingData = true;
    this.identity = this._userService.getIdentity();
    this.project_id = this.data.team.project_id;
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();
    this.firebaseAuth.authState
    .pipe(
      takeUntil(this.destroy),
    )
    .subscribe(
      (auth) => {
        if (auth) {
          this.userFirebase = auth;
        }
    });

    // this.team = this.data.team;

  }

  ngOnInit() {
    if (this.project_id && this.project_id > 0) {
      this.proyecto = this.filterProject(this.project_id);
      if (this.proyecto && this.proyecto.id > 0) {
        this.buildForma(this.data.team);
        this.getData(this.data.team);
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

  buildForma(data: any) {
    if (data.id && data.id > 0) {
      this.isLoading = false;
      // console.log(data);
      this.forma = new FormGroup({
        id: new FormControl(data.id, [Validators.required]),
        project_id: new FormControl({value: this.project_id, disabled: true}, [Validators.required]),
        descripcion: new FormControl({value: data.descripcion, disabled: true}, [Validators.required, Validators.minLength(2)]),
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


  getData(data: any) {
    if (data.id && data.id > 0) {
      this.subscription = this._customerService.getDeTeam( this.token.token, data.id )
      .subscribe( (resp: any) => {
        // console.log(resp);
        this.totalRegistros = resp.datos.length;
        // console.log(this.totalRegistros);
        this.equipo = resp.datos;
        this.isLoadingData = false;
        this.status = 'success';
      },
      error => {
        this.status = 'error';
        this.isLoadingData = false;
        console.log(<any>error);
      }
      );

    }
  }

  remove(data: any) {
    if (data && data.id > 0 && this.data.team && this.data.team.id > 0) {
      this._customerService.removerUserTeam(this.token.token, data.id, this.data.team.id).subscribe(
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
    } else {
      return;
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


}
