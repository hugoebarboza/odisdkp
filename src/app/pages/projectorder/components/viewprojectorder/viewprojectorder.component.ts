import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Sort, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { Subscription } from 'rxjs/Subscription';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { shareReplay, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

// CSV
import * as FileSaver from 'file-saver';

// DIALOG
import { ShowComponent } from 'src/app/components/shared/shared.index';

// SERVICES
import { ModalManageService, OrderserviceService, ProjectsService, SettingsService, UserService } from 'src/app/services/service.index';

// TOASTER MESSAGES
import { ToastrService } from 'ngx-toastr';


// MOMENT
import * as _moment from 'moment';
const moment = _moment;


@Component({
  selector: 'app-viewprojectorder',
  templateUrl: './viewprojectorder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./viewprojectorder.component.css']
})
@UntilDestroy()
export class ViewProjectOrderComponent implements OnDestroy {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) matSort: MatSort;

  assigned_to: number;
  country = '';
  dataSource: MatTableDataSource<any>;
  datasourceLength = 0;
  durationInSeconds = 5;
  id: number;
  identity: any;
  indexitem: any;
  isDisabled = false;
  isLoading: boolean;
  isRateLimitReached: boolean;
  isMobile = '';
  masterusers = [];
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
  servicestatus = [];
  since: any;
  sub: any;
  // subscription: Subscription;
  teams = [];
  title = '';
  token: any;
  users = [];


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
  selectedServiceStatus: any;
  selectedTeam: any;
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
    { name: 'order_number', label: 'N. Orden', csv: 1, order: 1 },
    { name: 'cc_number', label: 'N. Cliente', csv: 1, order: 2 },
    { name: 'orderdetail_direccion', label: 'Realizado En', csv: 1, order: 3 },
    { name: 'direccion', label: 'Ubicación', csv: 1, order: 4 },
    { name: 'servicetype', label: 'Servicio', csv: 1, order: 5 },
    { name: 'user', label: 'Informador', csv: 1, order: 6 },
    { name: 'create_at', label: 'Creado El', csv: 1, order: 7 },
    { name: 'update_at', label: 'Editado El', csv: 1, order: 8 },
    { name: 'userassigned', label: 'Responsable', csv: 1, order: 9 },
    { name: 'time', label: 'T. Ejecución', csv: 1, order: 10 },
    { name: 'atentiontime', label: 'T. Atención', csv: 0, order: 0 },
    { name: 'estatus', label: 'Estatus', csv: 1, order: 11 },
    { name: 'actions', label: 'Acciones', csv: 0, order: 0 }
  ];

  displayedColumns: string[] = ['order_number', 'cc_number', 'region', 'direccion', 'servicetype', 'user', 'userupdate', 'userassigned', 'create_at', 'update_at', 'time', 'atentiontime', 'estatus', 'actions'];
  columnsOrderToDisplay: string[] = this.columns.map(column => column.name);
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionheaderaction = new FormControl(this.positionOptions[2]);
  positiondatasourceaction = new FormControl(this.positionOptions[3]);
  positionleftaction = new FormControl(this.positionOptions[4]);
  positionrightaction = new FormControl(this.positionOptions[5]);




  constructor(
    public _modalManage: ModalManageService,
    private _orderService: OrderserviceService,
    private _projectService: ProjectsService,
    private _route: ActivatedRoute,
    public _router: Router,
    public _userService: UserService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    public label: SettingsService,
    public snackBar: MatSnackBar,
    private toasterService: ToastrService,
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
        this.selectedMaster = 'Informador';
        this.selectedResponsable = 'Responsable';
        this.selectedTeam = 'Equipo';
        this.project_name = this.project.project_name;
        this.country = this.project.country_name;
        this.since = moment(this.project.create_at).locale('ES').format('LL');
        this.load();
        this.loadTeam(this.id);
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
    this.dataSource = new MatTableDataSource();
    /*
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.dataSource = new MatTableDataSource();
    }*/
  }


  getData(response: any, csv?: any) {


    this.isLoading = true;
    this.cd.markForCheck();
    if (response && response.status === 'success') {
      if (response.datos && response.datos.data) {
        this.dataSource = new MatTableDataSource(response.datos.data);
        this.isLoading = false;
        this.isRateLimitReached = false;
        if (this.dataSource && this.dataSource.data.length > this.datasourceLength) {
          this.datasourceLength = this.dataSource.data.length;
        }
        this.resultsLength = response.datos.total;
       if (csv && csv === 1) {
          this.buildCsv(this.dataSource);
        }
      } else {
        this.resultsLength = 0;
        this.isRateLimitReached = true;
        }
        this.isLoading = false;
        this.isRateLimitReached = false;
        this.cd.markForCheck();
        if (csv === 1) {
        this.isDisabled = false;
        }
      } else {
        this.isLoading = false;
        this.cd.markForCheck();
        this.dataSource = new MatTableDataSource();
        return;
      }
  }


  async load() {
    this.cd.markForCheck();
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
    this.selectedServiceStatus = 'Estatus de Servicio';
    this.selectedMaster = 'Informador';
    this.selectedResponsable = 'Responsable';
    this.selectedTeam = 'Equipo';
    this.pageSize = 15;
    this.sort.active = 'orders.create_at';
    this.sort.direction = 'desc';
    this.pageIndex = 0;
    this.isLoading = true;


    this._projectService.getProjectOrderService(
      this.filterValue, this.searchparams, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,
      this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta,
      this.selectedColumnnUsuario.fieldValue, this.selectedColumnnUsuario.columnValue,
      this.sort.active, this.sort.direction, this.pageSize, this.pageIndex, this.id, this.token.token)
      .pipe(
        tap(),
        shareReplay(),
        untilDestroyed(this)
      )
      .subscribe( (resp: any) => {
        this.getData(resp);
        // this.isLoading = false;
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

  loadTeam(id: number) {


    this._userService.getTeamPaginate( this.token.token, id)
    .pipe(
      tap(),
      shareReplay(),
      untilDestroyed(this)
    )
    .subscribe( (resp: any) => {
      // console.log(this.totalRegistros);
      this.teams = resp.datos.data;
      this.cd.markForCheck();
    },
    error => {
      console.log(<any>error);
      this.cd.markForCheck();
    }
    );

  }


  loadUserProject(id: number) {

    this._projectService.getUserProject(this.token.token, id, 5)
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

   loadMasterUserProject(id: number) {

    this._projectService.getMasterUserProject(this.token.token, id, 6)
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
                this.masterusers = response.datos;
                this.cd.markForCheck();
              }
              });

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


  loadServiceStatus(id: number) {
    this.cd.markForCheck();
    this._orderService.getServiceEstatus(this.token, id)
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
                  this.servicestatus = response.datos;
                  this.cd.markForCheck();
                }
                },
      (error) => {
                  console.log(<any>error);
                  }
                );
  }


   async getQuery(pageSize: number, csv = 0) {

    // console.log(this.paginator.pageIndex);
    this.pageSize = pageSize;
    this.isLoading = true;
    this._projectService.getProjectOrderService(
      this.filterValue, this.searchparams, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,
      this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta,
      this.selectedColumnnUsuario.fieldValue, this.selectedColumnnUsuario.columnValue,
      this.sort.active, this.sort.direction, pageSize, this.paginator.pageIndex, this.id, this.token.token)
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
        if (csv === 1) {
          const err = 'No se encontraron incidencias.';
          this.toasterService.error('Error: ' + err, '', {enableHtml: true, closeButton: true, timeOut: 6000 });
          this.isDisabled = false;
        }
        console.log(<any>error);
        this.dataSource = new MatTableDataSource();
        this.isLoading = false;
        this.isRateLimitReached = true;
        this.cd.markForCheck();
      }
      );

   }


  async onPaginateChange(event) {
    // this.pageSize = event.pageSize;
    this.cd.markForCheck();
    this.getQuery(event.pageSize);
  }

  async handleSortChange(sort: Sort) {
    if (sort.active && sort.direction) {
      this.sort = sort;
      this.selectedColumnn.fieldValue = '';
    }

    this.cd.markForCheck();
    this.getQuery(this.pageSize);
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
    this.getQuery(this.pageSize);

  }

  datePicker(event: MatDatepickerInputEvent<Date>) {
    // console.log(event.value);
    if (event.value) {
      const datedesde = new FormControl(moment(this.selectedColumnnDate.columnValueDesde).format('YYYY[-]MM[-]DD'));
      const datehasta = new FormControl(moment(this.selectedColumnnDate.columnValueHasta).format('YYYY[-]MM[-]DD'));
      this.selectedColumnnDate.columnValueDesde = datedesde.value;
      this.selectedColumnnDate.columnValueHasta = datehasta.value;
      this.cd.markForCheck();
      this.getQuery(this.pageSize);
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
      this.loadServiceStatus(data.id);
    }


    this.cd.markForCheck();
    this.getQuery(this.pageSize);

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
    this.getQuery(this.pageSize);

  }


  searchServiceStatus(data: any) {
    if (!data) {
      if (this.searchparams.length > 0) {
        for (let i = 0; i < this.searchparams.length; i++) {
          const result = this.searchparams[i].fieldValue;
          if ( result === 'orders_details.status_id') {
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
          if ( result === 'orders_details.status_id') {
            this.searchparams.splice(i, 1);
            break;
          }
        }
      }

      const param: SearchParam = {
        fieldValue: 'orders_details.status_id',
        columnValue: data.id
      };

      this.searchparams.push(param);
    }



    this.cd.markForCheck();
    this.getQuery(this.pageSize);

  }

  searchEquipo(data: any) {
    if (!data) {
      if (this.searchparams.length > 0) {
        for (let i = 0; i < this.searchparams.length; i++) {
          const result = this.searchparams[i].fieldValue;
          if ( result === 'orders_details.team_id') {
            this.searchparams.splice(i, 1);
            break;
          }
        }
      }
    }

    if (data && data.id) {
      for (let i = 0; i < this.searchparams.length; i++) {
        const result = this.searchparams[i].fieldValue;
        if ( result === 'orders_details.team_id') {
          this.searchparams.splice(i, 1);
          break;
        }
      }

      const param: SearchParam = {
        fieldValue: 'orders_details.team_id',
        columnValue: data.id
      };

      this.searchparams.push(param);
    }


    this.cd.markForCheck();
    this.getQuery(this.pageSize);

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
    this.getQuery(this.pageSize);

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
    this.getQuery(this.pageSize);

  }


  showItem(order_id: number, order_number: string, category_id: number, customer_id: number, cc_number: string, servicetype_id: number, status_id: number, estatus: string, order_date: string, required_date: string, vencimiento_date: string, observation: string, create_at: string, usercreate: string, project_name: string, service_name: string, servicetype: string, update_at: string, userupdate: string, region: string, provincia: string, comuna: string, direccion: string, serviceid: number) {

    if (!order_id || !serviceid) {
      return;
    }

    const dialogRef = this.dialog.open(ShowComponent, {
      width: '1000px',
      disableClose: true,
      data: {order_id: order_id, order_number: order_number, service_id: serviceid,
        category_id: category_id, customer_id: customer_id, cc_number: cc_number,
        servicetype_id: servicetype_id, status_id: status_id, estatus: estatus,
        order_date: order_date, required_date: required_date, vencimiento_date: vencimiento_date, observation: observation,
        create_at: create_at, usercreate: usercreate, update_at: update_at, userupdate: userupdate,
        project_name: project_name, service_name: service_name, servicetype: servicetype,
        region: region, provincia: provincia, comuna: comuna, direccion: direccion}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
      }
    });
  }

  showModal(id: number) {
    // console.log(id);
    if (id > 0) {
      this.cd.markForCheck();
      this._modalManage.showModal(id);
      this.assigned_to = id;
    } else {
      return;
    }
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

  async ExportTOExcel($event: any, limit = 0) {

    this.isDisabled = true;

    if ($event === 1) {

      if (limit === 0) {
      this.cd.markForCheck();
      this.getQuery(this.pageSize, 1);
      }

      if (limit > 0) {
        this.cd.markForCheck();
        this.getQuery(limit, 1);
      }
    }

  }

  async buildCsv(data: any) {
    if (data && data.data.length > 0) {

      let csv: any = await this.buildHeader(this.columns);

      if (csv) {
        csv = csv + '\n';
        const length = data.data.length;

        for (let i = 0; i <= data.data.length; i++) {
          if (data.data[i] && data.data[i].order_number) {
            csv = csv + data.data[i]['order_number'] + ';' + data.data[i]['cc_number'] + ';' + data.data[i]['orderdetail_direccion'] + ';' + data.data[i]['direccion'] + ';' +
            data.data[i]['servicetype'] + ';' + data.data[i]['user'] + ';' + data.data[i]['create_at'] + ';' + data.data[i]['update_at'] + ';' + data.data[i]['userassigned'] + ';' +
            data.data[i]['time'] + ';' + data.data[i]['estatus'] + ';';
          }
          csv = csv + '\n';

          if (length === i) {
            const FILE_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;';
            const FILE_EXTENSION = '.csv';
            const fileName = 'Incidencias';

            const blob = new Blob([csv], {type: FILE_TYPE});
            FileSaver.saveAs(blob, fileName + '_export_' + new Date().getTime() + FILE_EXTENSION);
            this.cd.markForCheck();
          }
        }
      }

    }

  }

  async buildHeader(data?: any) {
    if (!data) {
      return;
    }

    const sortdata: any = await this.sortArray(data);

    if (sortdata && sortdata.length > 0) {
      let header = '';
      for (let i = 0; i < sortdata.length; i++) {
        if (sortdata[i].csv === 1) {
          header = header + sortdata[i].label + ';';
        }
      }
      return header;
    }
  }

  async sortArray(data?: any) {
    if (!data) {
      return;
    }

    if (data && data.length > 0) {
      const sortdata = [];
      const length = data.length;
      for (let i = 0; i <= data.length; i++) {
        if (data[i] && data[i].csv === 1 && data[i].order > 0) {
          sortdata.push(data[i]);
        }
        if (length === i) {
          // sort by value
          sortdata.sort(function (a, b) {
            return a.order - b.order;
          });
          return sortdata;
        }
      }
    }


  }


}

export interface SearchParam {
  fieldValue: any;
  columnValue: any;
}

