import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, TooltipPosition } from '@angular/material';
import { FormControl } from '@angular/forms';

import Swal from 'sweetalert2';

// DIALOG
import { AddTeamComponent } from '../../usuarios/dialog/add-team/add-team.component';

// MODEL
import { Proyecto, Team } from 'src/app/models/types';


// SERVICES
import { SettingsService, UserService, CustomerService } from 'src/app/services/service.index';


@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit, OnDestroy {

  departamento_id: number;
  identity: any;
  id: number;
  indexitem: number;
  isLoading = true;
  isLoadingDelete = false;
  isLoadingSave = false;
  indexitemdelete: number;
  page = 1;
  pageSize = 0;
  project: any;
  project_name = '';
  proyectos: Array<Proyecto> = [];
  sub: any;
  subscription: Subscription;
  status: string;
  teams = [];
  termino = '';
  title: string;
  token: any;
  totalRegistros = 0;

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionrightaction = new FormControl(this.positionOptions[5]);


  constructor(
    private _customerService: CustomerService,
    private _route: ActivatedRoute,
    public _router: Router,
    public _userService: UserService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    public label: SettingsService,
  ) {
    this._userService.handleAuthentication(this.identity, this.token);
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();
    this.label.getDataRoute().subscribe(data => {
      this.title = data.subtitle;
    });

    this.sub = this._route.params.subscribe(params => {
      this.cd.markForCheck();
      const id = +params['id'];
      this.id = id;
      this.termino = '';
      this.page = 1;
      this.pageSize = 0;
      if (this.id && this.proyectos) {
        this.project = this.filter();
        if (this.project !== 'Undefined' && this.project !== null && this.project) {
        this.departamento_id = this.project.department_id;
        this.project_name = this.project.project_name;
        this.load();
        } else {
          this._router.navigate(['/notfound']);
        }
      }
    });
  }

  ngOnInit() {
    this.cd.markForCheck();
    this.load();
  }

  ngOnDestroy() {
    if (this.subscription) {
    this.subscription.unsubscribe();
   }
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

  load() {

    this.isLoading = true;

    this.subscription = this._userService.getTeamPaginate( this.token.token, this.id, this.page )
              .subscribe( (resp: any) => {
                // console.log(resp);
                this.totalRegistros = resp.datos.total;
                // console.log(this.totalRegistros);
                this.teams = resp.datos.data;
                this.isLoading = false;
                this.status = 'success';
                this.cd.markForCheck();
              },
              error => {
                this.status = 'error';
                this.isLoading = false;
                console.log(<any>error);
                this.cd.markForCheck();
              }
              );

  }

  save( team: Team, i: number ) {


    this.indexitem = i;
    this.isLoadingSave = true;

    const data = new Team (team.id, team.project_id, team.descripcion, '', [], team.status, 0, '', 0, '');


    if (!data || !data.project_id) {
      Swal.fire('Importante', 'A ocurrido un error en la actualización del usuario.', 'error');
      this.isLoadingSave = false;
      this.indexitem = -1;
   }


    this._customerService.updateTeam(this.token.token, this.id, data, data.id)
            .subscribe( (resp: any) => {
              // console.log(resp);
              if (!resp) {
                return;
              }
              if (resp.status === 'success') {
                Swal.fire('Información actualizada', data.descripcion, 'success' );
                this.isLoadingSave = false;
                this.indexitem = -1;
                this.cd.markForCheck();
              } else {
                Swal.fire('Importante', 'A ocurrido un error en el procesamiento de información', 'error');
                this.isLoadingSave = false;
                this.indexitem = -1;
                this.cd.markForCheck();
              }
            },
              error => {
                Swal.fire('Importante', error, 'error');
                this.isLoadingSave = false;
                this.indexitem = -1;
                this.cd.markForCheck();
              }
            );
  }


  delete( team: Team, i: number ) {

    this.isLoadingDelete = true;
    this.indexitemdelete = i;

    const data = new Team (team.id, team.project_id, team.descripcion, '', [], team.status, 0, '', 0, '');

    if (!data || !data.project_id || !this.id) {
      Swal.fire('Importante', 'A ocurrido un error en la actualización del usuario.', 'error');
      this.isLoadingDelete = false;
      this.indexitem = -1;
   }

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar a ' + data.descripcion,
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    })
    .then( borrar => {
      if (borrar.value) {
        if (borrar) {
          this.indexitemdelete = i;
          this.isLoadingDelete = true;
          this._customerService.deleteTeam(this.token.token, this.id, data.id )
                    .subscribe( response => {
                      if (!response) {
                        return;
                      }
                      if (response.status === 'success') {
                        Swal.fire('Información eliminada', data.descripcion, 'success' );
                        this.isLoadingDelete = false;
                        this.indexitemdelete = -1;
                        this.cd.markForCheck();
                        this.load();
                      } else {
                        Swal.fire('Importante', response.message, 'error');
                        this.isLoadingDelete = false;
                        this.indexitemdelete = -1;
                        this.cd.markForCheck();
                      }
                    },
                      error => {
                        Swal.fire('Importante', error, 'error');
                        this.isLoadingDelete = false;
                        this.indexitemdelete = -1;
                        this.cd.markForCheck();
                      }
                    );
        }
      } else if (borrar.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado');
        this.isLoadingDelete = false;
        this.indexitemdelete = -1;
        this.cd.markForCheck();
      }
    });
  }



  searchTeam( termino: string ) {
    if ( termino.length <= 0 || !termino) {
      this.load();
      return;
    }
  }

  paginate( valor: number, increment: number ) {

    const desde = this.pageSize + valor;

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      this.pageSize = 0;
      return;
    }

    this.pageSize += valor;
    this.page += increment;

    if ( this.page === 0 ) {
      this.page = 1;
      return;
    }

    this.load();
  }




  addTeam(id: number) {
    if (id > 0) {
      const dialogRef = this.dialog.open(AddTeamComponent, {
        width: '777px',
        disableClose: true,
        data: { project_id: id
        }
        });

        dialogRef.afterClosed().subscribe(
              result => {
                this.cd.markForCheck();
                 if (result === 1) {
                   this.load();
                 // After dialog is closed we're doing frontend updates
                 // For add we're just pushing a new row inside DataService
                 // this.dataService.dataChange.value.push(this.OrderserviceService.getDialogData());
                 // this.refresh();
                 } else {
                 }
               });
    }
  }


}
