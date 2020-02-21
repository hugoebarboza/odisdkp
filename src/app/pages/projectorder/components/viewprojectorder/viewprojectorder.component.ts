import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Sort, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs/Subscription';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

// SERVICES
import { OrderserviceService, ProjectsService, SettingsService, UserService } from 'src/app/services/service.index';


// MOMENT
import * as _moment from 'moment';
const moment = _moment;


@Component({
  selector: 'app-viewprojectorder',
  templateUrl: './viewprojectorder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./viewprojectorder.component.css']
})
export class ViewProjectOrderComponent implements OnDestroy {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) matSort: MatSort;

  country = '';
  dataSource: MatTableDataSource<any>;
  datasourceLength = 0;
  durationInSeconds = 5;
  id: number;
  identity: any;
  indexitem: any;
  isLoading = true;
  isRateLimitReached = false;
  isMobile = '';
  profile: any;
  project: any;
  project_name = '';
  proyectos: any;
  pageIndex: number;
  pageSize = 15;
  pageSizeOptions: number[] = [15, 30, 100, 200];
  pageEvent: PageEvent;
  resultsLength = 0;
  selectedRow: any;
  servicetype = [];
  since: any;
  sub: any;
  subscription: Subscription;
  title = '';
  token: any;
  users = [];
  masterusers = [];

  // SEARCH PARAMS
  date = new FormControl(moment(new Date()).format('YYYY[-]MM[-]DD'));
  filterValue = '';
  fromdate = moment(Date.now() - 7 * 24 * 3600 * 1000).format('YYYY-MM-DD');
  searchparams = [];
  selectedDate: any;
  selectedMaster: any;
  selectedResponsable: any;
  selectedService: any;
  selectedServiceType: any;
  selectedColumnn = {
    fieldValue: '',
    criteria: '',
    columnValue: ''
  };
  selectedColumnnDate = {
    fieldValue: 'orders.create_at',
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
    { name: 'order_number', label: 'N. Orden' },
    { name: 'cc_number', label: 'N. Cliente' },
    { name: 'orderdetail_direccion', label: 'Realizado En' },
    { name: 'direccion', label: 'Ubicación' },
    { name: 'servicetype', label: 'Servicio' },
    { name: 'user', label: 'Informador' },
    { name: 'create_at', label: 'Creado El' },
    { name: 'userassigned', label: 'Responsable' },
    { name: 'time', label: 'T. Ejecución' },
    { name: 'atentiontime', label: 'T. Atención' },
    { name: 'estatus', label: 'Estatus' },
    { name: 'actions', label: 'Acciones' }
  ];

  displayedColumns: string[] = ['order_number', 'cc_number', 'region', 'direccion', 'servicetype', 'user', 'userupdate', 'userassigned', 'create_at', 'update_at', 'time', 'atentiontime', 'estatus', 'actions'];
  columnsOrderToDisplay: string[] = this.columns.map(column => column.name);
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
    private cd: ChangeDetectorRef,
    public label: SettingsService,
    public snackBar: MatSnackBar
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
        this.selectedMaster = 'Informador';
        this.selectedResponsable = 'Responsable';
        this.project_name = this.project.project_name;
        this.country = this.project.country_name;
        this.since = moment(this.project.create_at).locale('ES').format('LL');
        this.load();
        this.loadUserProject(this.id);
        this.loadMasterUserProject(this.id);
        } else {
          this._router.navigate(['/notfound']);
        }
      }
    });


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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  getData(response: any) {

    if (response && response.status === 'success') {
      if (response.datos && response.datos.data) {
        this.dataSource = new MatTableDataSource(response.datos.data);
        if (this.dataSource && this.dataSource.data.length > this.datasourceLength) {
          this.datasourceLength = this.dataSource.data.length;
        }
        this.resultsLength = response.datos.total;
        this.isRateLimitReached = false;
      } else {
        this.resultsLength = 0;
        this.isRateLimitReached = true;
        }
        this.isLoading = false;
        this.cd.markForCheck();
      } else {
      // console.log('No Response');
        this.dataSource = new MatTableDataSource();
        return;
      }
      this.cd.markForCheck();
  }


  load() {
    this.cd.markForCheck();
    this.isLoading = true;
    this.filterValue = '';
    this.selectedColumnn.columnValue = '';
    this.selectedColumnn.fieldValue = '';
    this.fromdate = moment(Date.now() - 7 * 24 * 3600 * 1000).format('YYYY-MM-DD');
    this.date = new FormControl(moment(new Date()).format('YYYY[-]MM[-]DD'));
    this.selectedColumnnDate.fieldValue = 'orders.create_at';
    this.selectedColumnnDate.columnValueDesde = this.fromdate;
    this.selectedColumnnDate.columnValueHasta = this.date.value;
    this.selectedColumnnUsuario.fieldValue = '';
    this.selectedColumnnUsuario.columnValue = '';
    this.searchparams = [];
    this.selectedDate = 'Fecha';
    this.selectedService = 'Servicio';
    this.selectedServiceType = 'Tipo de Servicio';
    this.selectedMaster = 'Informador';
    this.selectedResponsable = 'Responsable';
    this.pageSize = 15;
    this.sort.active = 'create_at';
    this.sort.direction = 'desc';
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    } else {
      this.pageIndex = 0;
    }


    this.subscription = this._projectService.getProjectOrderService(
      this.filterValue, this.searchparams, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,
      this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta,
      this.selectedColumnnUsuario.fieldValue, this.selectedColumnnUsuario.columnValue,
      this.sort.active, this.sort.direction, this.pageSize, this.pageIndex, this.id, this.token.token)
      .subscribe( (resp: any) => {
        this.getData(resp);
        this.snackBar.open('Incidencias de los últimos 7 días.', 'Información', {duration: this.durationInSeconds * 1500, });
        this.cd.markForCheck();
      },
      error => {
        console.log(<any>error);
        this.isLoading = false;
        this.dataSource = new MatTableDataSource();
        this.isRateLimitReached = true;
        this.cd.markForCheck();
      }
      );

  }

  loadUserProject(id: number) {

    this.subscription = this._projectService.getUserProject(this.token.token, id, 5).subscribe(
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

   loadMasterUserProject(id: number) {

    this.subscription = this._projectService.getMasterUserProject(this.token.token, id, 6).subscribe(
    response => {
              if (!response) {
                return;
              }
              if (response.status === 'success') {
                this.masterusers = response.datos;
                this.cd.markForCheck();
              }
              });

   }

   loadServiceType(id: number) {
    this.cd.markForCheck();
    this.subscription = this._orderService.getServiceType(this.token, id).subscribe(
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



   getQuery() {

    this.isLoading = true;
    this.subscription = this._projectService.getProjectOrderService(
      this.filterValue, this.searchparams, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,
      this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta,
      this.selectedColumnnUsuario.fieldValue, this.selectedColumnnUsuario.columnValue,
      this.sort.active, this.sort.direction, this.pageSize, this.paginator.pageIndex, this.id, this.token.token)
      .subscribe( (resp: any) => {
        this.getData(resp);
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


  async onPaginateChange(event) {
    this.pageSize = event.pageSize;
    this.cd.markForCheck();
    this.getQuery();
  }

  async handleSortChange(sort: Sort) {
    if (sort.active && sort.direction) {
      this.sort = sort;
      this.selectedColumnn.fieldValue = '';
    }

    this.cd.markForCheck();
    this.getQuery();
  }


  searchDate(data: any) {

    this.selectedColumnnDate.fieldValue = 'orders.create_at';

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
    this.getQuery();

  }

  datePicker(event: MatDatepickerInputEvent<Date>) {
    // console.log(event.value);
    if (event.value) {
      const datedesde = new FormControl(moment(this.selectedColumnnDate.columnValueDesde).format('YYYY[-]MM[-]DD'));
      const datehasta = new FormControl(moment(this.selectedColumnnDate.columnValueHasta).format('YYYY[-]MM[-]DD'));
      this.selectedColumnnDate.columnValueDesde = datedesde.value;
      this.selectedColumnnDate.columnValueHasta = datehasta.value;
      this.getQuery();
    }
    this.cd.markForCheck();
  }


  searchService(data: any) {
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
    this.getQuery();

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
    this.getQuery();

  }



  searchResponsable(data: any) {
    if (!data) {
      if (this.searchparams.length > 0) {
        for (let i = 0; i < this.searchparams.length; i++) {
          const result = this.searchparams[i].fieldValue;
          if ( result === 'orders_details.assigned_to') {
            this.searchparams.splice(i, 1);
            break;
          }
        }
      }
    }

    if (data && data.id) {
      for (let i = 0; i < this.searchparams.length; i++) {
        const result = this.searchparams[i].fieldValue;
        if ( result === 'orders_details.assigned_to') {
          this.searchparams.splice(i, 1);
          break;
        }
      }

      const param: SearchParam = {
        fieldValue: 'orders_details.assigned_to',
        columnValue: data.id
      };

      this.searchparams.push(param);
    }


    this.cd.markForCheck();
    this.getQuery();

  }


  searchInformador(data: any) {
    if (!data) {
      if (this.searchparams.length > 0) {
        for (let i = 0; i < this.searchparams.length; i++) {
          const result = this.searchparams[i].fieldValue;
          if ( result === 'orders_details.create_by') {
            this.searchparams.splice(i, 1);
            break;
          }
        }
      }
    }

    if (data && data.id) {

      for (let i = 0; i < this.searchparams.length; i++) {
        const result = this.searchparams[i].fieldValue;
        if ( result === 'orders_details.create_by') {
          this.searchparams.splice(i, 1);
          break;
        }
      }

      const param: SearchParam = {
        fieldValue: 'orders_details.create_by',
        columnValue: data.id
      };

      this.searchparams.push(param);
    }


    this.cd.markForCheck();
    this.getQuery();

  }


  showItem() {

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

