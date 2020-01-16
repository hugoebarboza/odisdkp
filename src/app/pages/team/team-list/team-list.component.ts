import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, TooltipPosition } from '@angular/material';
import { FormControl } from '@angular/forms';

// import Swal from 'sweetalert2';

// MODEL
import { Proyecto } from 'src/app/models/types';


// SERVICES
import { SettingsService, UserService } from 'src/app/services/service.index';

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
  isLoading = true;
  page = 1;
  pageSize = 0;
  project: any;
  project_name = '';
  proyectos: Array<Proyecto> = [];
  sub: any;
  subscription: Subscription;
  status: string;
  team = [];
  termino = '';
  title: string;
  token: any;
  totalRegistros = 0;

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionrightaction = new FormControl(this.positionOptions[5]);


  constructor(
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
        this.loadTeam();
        } else {
          this._router.navigate(['/notfound']);
        }
      }
    });
  }

  ngOnInit() {
    this.cd.markForCheck();
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

  loadTeam() {

    this.isLoading = true;

    this.subscription = this._userService.getTeamPaginate( this.token.token, this.id, this.page )
              .subscribe( (resp: any) => {
                console.log(resp);
                this.totalRegistros = resp.datos.total;
                console.log(this.totalRegistros);
                this.team = resp.datos.data;
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

  searchTeam( termino: string ) {
    if ( termino.length <= 0 || !termino) {
      this.loadTeam();
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

    this.loadTeam();
  }



}
