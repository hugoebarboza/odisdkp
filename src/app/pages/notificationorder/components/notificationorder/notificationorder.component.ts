import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { shareReplay, tap } from 'rxjs/operators';

// COMPONENTS
import { ShowComponent } from 'src/app/components/shared/shared.index';
import { ShowLabelNotificationComponent } from '../../dialog/show-label-notification/show-label-notification.component';
import { ShowNotificacionComponent } from '../../dialog/show-notificacion/show-notificacion.component';

// SERVICES
import { OrderserviceService, ProjectsService, SettingsService, UserService } from 'src/app/services/service.index';


// MOMENT
import * as _moment from 'moment';
const moment = _moment;


@Component({
  selector: 'app-notificationorder',
  templateUrl: './notificationorder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./notificationorder.component.css']
})
@UntilDestroy()
export class NotificationOrderComponent implements OnDestroy {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) matSort: MatSort;


  country = '';
  dataSource: MatTableDataSource<any>;
  id: number;
  identity: any;
  indexitem: any;
  isLoading: boolean;
  isRateLimitReached: boolean;
  isMobile = '';
  masterusers = [];
  // pageIndex = 0;
  pageSize = 15;
  pageSizeOptions: number[] = [15, 30, 100, 200];
  project: any;
  project_name = '';
  proyectos: any;
  resultsLength = 0;
  selectedRow: any;
  servicetype = [];
  since: any;
  sub: any;
  title = '';
  token: any;
  users = [];

  // SEARCH PARAMS
  date = new FormControl(moment(new Date()).format('YYYY[-]MM[-]DD'));
  filterValue = '';
  fromdate = moment(Date.now() - 7 * 24 * 3600 * 1000).format('YYYY-MM-DD');
  searchparams = [];
  selectedDate: any;
  selectedResponsable: any;
  selectedService: any;
  selectedServiceType: any;
  selectedServiceStatus: any;
  selectedColumnn = {
    fieldValue: '',
    criteria: '',
    columnValue: ''
  };
  selectedColumnnDate = {
    fieldValue: 'log_formnotification.create_at',
    criteria: '',
    columnValueFrom: this.fromdate,
    columnValueDesde: this.date.value,
    columnValueHasta: this.date.value
  };
  selectedColumnnFilterDate = [
    {value: 1, name: 'Semana'},
    {value: 2, name: 'Mes'},
    {value: 3, name: 'Año'},
    {value: 4, name: 'Rango'},
  ];
  selectedColumnnUsuario = {
    fieldValue: '',
    criteria: '',
    columnValue: ''
  };
  sort: Sort = {
    active: 'create_at',
    direction: 'desc',
  };


  // TABLE HEADERS
  columns: Array<any> = [
    { name: 'order_number', label: 'N. Orden', csv: 1, order: 1 },
    { name: 'type', label: 'Tipo', csv: 1, order: 2 },
    { name: 'service_name', label: 'Servicio', csv: 1, order: 3 },
    { name: 'servicetype', label: 'Tipo de Servicio', csv: 1, order: 3 },
    { name: 'user', label: 'Informador', csv: 1, order: 4 },
    { name: 'create_at', label: 'Creado El', csv: 1, order: 5 },
    { name: 'actions', label: 'Acciones', csv: 0, order: 0 }
  ];

  displayedColumns: string[] = ['order_number', 'type', 'service_name', 'servicetype', 'user', 'create_at', 'actions'];
  columnsOrderToDisplay: string[] = this.columns.map(column => column.name);



  // MESSAGES
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionheaderaction = new FormControl(this.positionOptions[2]);
  positiondatasourceaction = new FormControl(this.positionOptions[3]);
  positionleftaction = new FormControl(this.positionOptions[4]);
  positionrightaction = new FormControl(this.positionOptions[5]);


  constructor(
    private _orderService: OrderserviceService,
    private _projectService: ProjectsService,
    private _route: ActivatedRoute,
    public _router: Router,
    public _userService: UserService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    public label: SettingsService,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.proyectos = this._userService.getProyectos();
    this.label.getDataRoute().subscribe(data => {
      this.title = data.subtitle;
    });

    this.sub = this._route.params.subscribe(async params => {
      this.cd.markForCheck();
      const id = +params['id'];
      this.id = id;
      if (this.id && this.proyectos) {
        this.project = await this.filter(this.id);
        if (this.project !== 'Undefined' && this.project !== null && this.project) {
        this.cd.markForCheck();
        this.searchparams = [];
        this.selectedDate = 'Fecha';
        this.selectedService = 'Servicio';
        this.selectedServiceType = 'Tipo de Servicio';
        this.selectedServiceStatus = 'Estatus de Servicio';
        this.selectedResponsable = 'Informador';
        this.project_name = this.project.project_name;
        this.country = this.project.country_name;
        this.since = moment(this.project.create_at).locale('ES').format('LL');
        this.load();
        this.loadUserProject(this.id);
        // this.loadMasterUserProject(this.id);
        } else {
          this._router.navigate(['/notfound']);
        }
      }
    });

  }

  ngOnDestroy() {
    this.dataSource = new MatTableDataSource();
  }


  async filter(id: number) {
    if (this.proyectos && id) {
      for (let i = 0; i < this.proyectos.length; i += 1) {
        const result = this.proyectos[i];
        if (result.id === id) {
           return await result;
        }
      }
    }
  }

  getData(response: any, csv?: any) {
    // console.log(response);
    this.cd.markForCheck();
    if (response && response.status === 'success') {
      if (response.datos && response.datos.data) {
        this.dataSource = new MatTableDataSource(response.datos.data);
        this.isLoading = false;
        this.isRateLimitReached = false;
        this.resultsLength = response.datos.total;
       if (csv && csv === 1) {
          // this.buildCsv(this.dataSource);
        }
      } else {
        this.resultsLength = 0;
        this.isRateLimitReached = true;
        }
        this.isLoading = false;
        this.isRateLimitReached = false;
        this.cd.markForCheck();
      } else {
      // console.log('No Response');
      this.isLoading = false;
        this.cd.markForCheck();
        this.dataSource = new MatTableDataSource();
        return;
      }
  }


  async getQuery(pageSize: number, pageIndex: number, csv = 0) {

    // console.log(this.paginator.pageIndex);
    this.pageSize = pageSize;
    this.isLoading = true;
    this._projectService.getProjectOrderNotificacion(
      this.filterValue, this.searchparams, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,
      this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta,
      this.selectedColumnnUsuario.fieldValue, this.selectedColumnnUsuario.columnValue,
      this.sort.active, this.sort.direction, pageSize, pageIndex, this.id, this.token.token)
      .pipe(
        tap(),
        shareReplay(),
        untilDestroyed(this)
      )
      .subscribe( (resp: any) => {
        this.getData(resp, csv);
        this.cd.markForCheck();
      },
      error => {
        console.log(<any>error);
        this.dataSource = new MatTableDataSource();
        this.isLoading = false;
        this.isRateLimitReached = true;
        this.cd.markForCheck();
      }
      );

   }

  async load() {
    this.cd.markForCheck();
    this.filterValue = '';
    this.selectedColumnn.columnValue = '';
    this.selectedColumnn.fieldValue = '';
    this.fromdate = moment(Date.now() - 7 * 24 * 3600 * 1000).format('YYYY-MM-DD');
    this.date = new FormControl(moment(new Date()).format('YYYY[-]MM[-]DD'));
    this.selectedColumnnDate.fieldValue = 'log_formnotification.create_at';
    this.selectedColumnnDate.columnValueDesde = this.fromdate;
    this.selectedColumnnDate.columnValueHasta = this.date.value;
    this.selectedColumnnUsuario.fieldValue = '';
    this.selectedColumnnUsuario.columnValue = '';
    this.searchparams = [];
    this.selectedDate = 'Fecha';
    this.selectedService = 'Servicio';
    this.selectedServiceType = 'Tipo de Servicio';
    this.selectedServiceStatus = 'Estatus de Servicio';
    this.selectedResponsable = 'Informador';
    this.sort.active = 'log_formnotification.create_at';
    this.sort.direction = 'desc';
    const pageIndex = 0;
    this.isLoading = true;

    this.getQuery(this.pageSize, pageIndex);

  }

  async handleSortChange(sort: Sort) {

    if (sort.active && sort.direction) {
      this.sort = sort;
      this.selectedColumnn.fieldValue = '';
    }

    this.cd.markForCheck();
    this.getQuery(this.pageSize, this.paginator.pageIndex);
  }

  async onPaginateChange(event) {

    this.cd.markForCheck();
    this.getQuery(event.pageSize, this.paginator.pageIndex);
  }


  searchDate(data: any) {

    this.selectedColumnnDate.fieldValue = 'log_formnotification.create_at';

    if (!data) {
      this.selectedColumnnDate.columnValueDesde = this.fromdate;
      this.selectedColumnnDate.columnValueHasta = this.date.value;
    }

    if (data && data.value === 1) {
      this.fromdate = moment(Date.now() - 7 * 24 * 3600 * 1000).format('YYYY-MM-DD');
      this.date = new FormControl(moment(new Date()).format('YYYY[-]MM[-]DD'));
      this.selectedColumnnDate.columnValueDesde = this.fromdate;
      this.selectedColumnnDate.columnValueHasta = this.date.value;
    }

    if (data && data.value === 2) {
      this.fromdate = moment(Date.now() - 30 * 24 * 3600 * 1000).format('YYYY-MM-DD');
      this.date = new FormControl(moment(new Date()).format('YYYY[-]MM[-]DD'));
      this.selectedColumnnDate.columnValueDesde = this.fromdate;
      this.selectedColumnnDate.columnValueHasta = this.date.value;
   }


    if (data && data.value === 3) {
      this.fromdate = moment(Date.now() - 365 * 24 * 3600 * 1000).format('YYYY-MM-DD');
      this.date = new FormControl(moment(new Date()).format('YYYY[-]MM[-]DD'));
      this.selectedColumnnDate.columnValueDesde = this.fromdate;
      this.selectedColumnnDate.columnValueHasta = this.date.value;
   }


    if (data && data.value === 4) {
      return;
    }

    this.cd.markForCheck();
    this.getQuery(this.pageSize, this.paginator.pageIndex);

  }


  datePicker(event: MatDatepickerInputEvent<Date>) {
    // console.log(event.value);
    if (event.value) {
      const datedesde = new FormControl(moment(this.selectedColumnnDate.columnValueDesde).format('YYYY[-]MM[-]DD'));
      const datehasta = new FormControl(moment(this.selectedColumnnDate.columnValueHasta).format('YYYY[-]MM[-]DD'));
      this.selectedColumnnDate.columnValueDesde = datedesde.value;
      this.selectedColumnnDate.columnValueHasta = datehasta.value;
      this.cd.markForCheck();
      this.getQuery(this.pageSize, this.paginator.pageIndex);
    }
    this.cd.markForCheck();
  }


  searchService(data: any) {
    this.selectedServiceType = 'Tipo de Servicio';
    if (!data) {
      if (this.searchparams.length > 0) {
        for (let i = 0; i < this.searchparams.length; i++) {
          const result = this.searchparams[i].fieldValue;
          if ( result === 'orders_details.service_id') {
            this.searchparams.splice(i, 1);
            break;
          }
        }
      }
    }

    if (data && data.id) {
      if (this.searchparams.length > 0) {
        for (let i = 0; i < this.searchparams.length; i++) {
          const result = this.searchparams[i].fieldValue;
          if ( result === 'orders_details.service_id') {
            this.searchparams.splice(i, 1);
            break;
          }
        }
      }

      const param: SearchParam = {
        fieldValue: 'orders_details.service_id',
        columnValue: data.id
      };

      this.searchparams.push(param);

      this.loadServiceType(data.id);
    }


    this.cd.markForCheck();
    this.getQuery(this.pageSize, this.paginator.pageIndex);

  }

  searchServiceType(data: any) {
    if (!data) {
      if (this.searchparams.length > 0) {
        for (let i = 0; i < this.searchparams.length; i++) {
          const result = this.searchparams[i].fieldValue;
          if ( result === 'orders_details.servicetype_id') {
            this.searchparams.splice(i, 1);
            break;
          }
        }
      }
    }

    if (data && data.id) {
      if (this.searchparams.length > 0) {
        for (let i = 0; i < this.searchparams.length; i++) {
          const result = this.searchparams[i].fieldValue;
          if ( result === 'orders_details.servicetype_id') {
            this.searchparams.splice(i, 1);
            break;
          }
        }
      }

      const param: SearchParam = {
        fieldValue: 'orders_details.servicetype_id',
        columnValue: data.id
      };

      this.searchparams.push(param);
    }



    this.cd.markForCheck();
    this.getQuery(this.pageSize, this.paginator.pageIndex);

  }


  searchResponsable(data: any) {
    if (!data) {
      if (this.searchparams.length > 0) {
        for (let i = 0; i < this.searchparams.length; i++) {
          const result = this.searchparams[i].fieldValue;
          if ( result === 'log_formnotification.create_by') {
            this.searchparams.splice(i, 1);
            break;
          }
        }
      }
    }

    if (data && data.id) {
      for (let i = 0; i < this.searchparams.length; i++) {
        const result = this.searchparams[i].fieldValue;
        if ( result === 'log_formnotification.create_by') {
          this.searchparams.splice(i, 1);
          break;
        }
      }

      const param: SearchParam = {
        fieldValue: 'log_formnotification.create_by',
        columnValue: data.id
      };

      this.searchparams.push(param);
    }


    this.cd.markForCheck();
    this.getQuery(this.pageSize, this.paginator.pageIndex);

  }

  loadServiceType(id: number) {
    this.cd.markForCheck();
    this._orderService.getServiceType(this.token, id)
    .pipe(
      tap(),
      shareReplay(),
      untilDestroyed(this)
    )
    .subscribe(
      (response: any) => {
                if (!response) {
                  return;
                }
                if (response.status === 'success') {
                  this.servicetype = response.datos;
                  this.cd.markForCheck();
                }
                },
      (error) => {
                  console.log(<any>error);
                  }
                );
  }


  loadUserProject(id: number) {

    this._projectService.getUserProject(this.token.token, id, 7)
    .pipe(
      tap(),
      shareReplay(),
      untilDestroyed(this)
    )
    .subscribe(
    response => {
              if (!response) {
                return;
              }
              if (response.status === 'success') {
                this.users = response.datos;
                this.cd.markForCheck();
              }
              });
   }


  showItem(order_id: number, serviceid: number) {

    if (!order_id || !serviceid) {
      return;
    }

    const dialogRef = this.dialog.open(ShowComponent, {
      width: '1000px',
      disableClose: true,
      data: {order_id: order_id, service_id: serviceid}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
      }
    });
  }

  showNotificationItem(servicetype_id: number, formnotification_id: number) {
    if (!servicetype_id || !formnotification_id) {
      return;
    }

    const dialogRef = this.dialog.open(ShowNotificacionComponent, {
      width: '477px',
      disableClose: true,
      data: {servicetype_id: servicetype_id, formnotification_id: formnotification_id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
      }
    });

  }


  showLabel(id: number, project: any, notification: any) {
    if (!id || !notification) {
      return;
    }

    const dialogRef = this.dialog.open(ShowLabelNotificationComponent, {
      width: '477px',
      disableClose: true,
      data: {id: id, project: project, notification: notification},
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
      }
    });

  }



  hoverIn(index: number) {
    this.indexitem = index;
  }


  hoverOut(_index: number) {
    this.indexitem = -1;

  }

  setClickedRow(index: number, orderid: number) {
    this.selectedRow = index;
    const order_id = orderid;
    if (!this.selectedRow || !order_id) {
      return;
    }
  }


}

export interface SearchParam {
  fieldValue: any;
  columnValue: any;
}
