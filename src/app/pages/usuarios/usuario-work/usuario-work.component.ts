import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Sort, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormControl, Validators } from '@angular/forms';

// MODELS
import { Order } from 'src/app/models/types';

// DIALOG
import { ShowComponent } from 'src/app/components/dialog/show/show.component';

// SERVICES
import { OrderserviceService, UserService } from 'src/app/services/service.index';

// MOMENT
import * as _moment from 'moment';
const moment = _moment;



@Component({
  selector: 'app-usuario-work',
  templateUrl: './usuario-work.component.html',
  styleUrls: ['./usuario-work.component.css']
})
export class UsuarioWorkComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) matSort: MatSort;


  datedesde: FormControl;
  datehasta: FormControl;
  date = new FormControl(moment(new Date()).format('YYYY[-]MM[-]DD'));
  filterValue = '';
  formfilterValue: FormControl = new FormControl();
  pageSize = 15;
  pageIndex = 0;
  pageSizeOptions: number[] = [15, 30, 100, 200];
  regionMultiCtrl: FormControl = new FormControl('', Validators.required );
  filtersregion = {
    fieldValue: '',
    criteria: '',
    filtervalue: ''
  };
  selectedColumnn = {
    fieldValue: 'orders.create_at',
    criteria: '',
    columnValue: ''
  };
  selectedColumnnDate = {
    fieldValue: 'orders.create_at',
    criteria: '',
    columnValueDesde: this.date.value,
    columnValueHasta: this.date.value
  };
  selectedColumnnUsuario = {
    fieldValue: 'orders_details.assigned_to',
    criteria: '',
    columnValue: ''
  };
  sort: Sort = {
    active: 'create_at',
    direction: 'desc',
  };


  dataSource: MatTableDataSource<Order[]>;
  isMobile: any;
  indexitem: number;
  id: any;
  identity: any;
  isLoading = true;
  isLoadingResults = true;
  isRateLimitReached = false;
  resultsLength = 0;
  selectedRow: Number;
  sub: any;
  subscription: Subscription;
  token: any;
  user: any;
  userordenes: any[] = [];



  displayedColumns: string[] = ['order_number', 'cc_number', 'direccion', 'servicetype', 'user', 'create_at', 'userassigned', 'time', 'atentiontime', 'estatus', 'actions'];

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positiondatasourceaction = new FormControl(this.positionOptions[3]);



  constructor(
    private _route: ActivatedRoute,
    private _orderService: OrderserviceService,
    public _userService: UserService,
    public dialog: MatDialog,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.sub = this._route.params.subscribe(params => {
      const id = +params['id'];
      this.id = id;
    });

  }

  ngOnInit() {
    if (this.id && this.id > 0) {
      this.subscription = this._userService.getUserShowInfo(this.token.token, this.id).subscribe(
        response => {
          this.isLoading = false;
          if (!response) {
            return;
          }
          if (response.status === 'success') {
            this.user = response.data[0];
          }
        },
        (error: any) => {
          this.isLoading = false;
          console.log(<any>error);
        }
      );
      this.getParams(this.id);
    }
  }



  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getParams(id: any) {

    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    } else {
      this.pageIndex = 0;
    }


    this.isLoading = true;
    this.selectedColumnnUsuario.columnValue = id;
    this.selectedColumnn.fieldValue = '';
    this.selectedColumnn.columnValue = '';
    this.filtersregion.fieldValue = '';
    this.datedesde = new FormControl(moment(this.selectedColumnnDate.columnValueDesde).format('YYYY[-]MM[-]DD'));
    this.datehasta = new FormControl(moment(this.selectedColumnnDate.columnValueHasta).format('YYYY[-]MM[-]DD'));
    this.selectedColumnnDate.columnValueDesde = this.datedesde.value;
    this.selectedColumnnDate.columnValueHasta = this.datehasta.value;

    // console.log(this.selectedColumnnUsuario);

    if (this.selectedColumnnUsuario.columnValue && this.selectedColumnnUsuario.columnValue) {

      this._orderService.gettUserOrdenes(this.token.token, id, 'create_at', 'desc', this.pageSize, 0)
        .then(response => {
          // console.log(response);
          this.getData(response);
        })
        .catch(error => {
              this.isLoading = false;
              this.isLoadingResults = false;
              this.isRateLimitReached = true;
              console.log(<any>error);
        });
    }
  }


  public getData(response: any) {
    if (response) {
        response.subscribe(
          (some: any) => {
            if (some.status === 'success') {
              if (some.datos && some.datos.data) {
                this.resultsLength = some.datos.total;
                this.isRateLimitReached = false;
                } else {
                this.resultsLength = 0;
                this.isRateLimitReached = true;
                }
                this.dataSource = new MatTableDataSource(some.datos.data);
            }
            this.isLoadingResults = false;
          },
          (error) => {
            this.isLoadingResults = false;
            this.isRateLimitReached = true;
            this._userService.logout();
            console.log(<any>error);
          });
    } else {
      return;
    }
  }

  handleSortChange(sort: Sort): void {
    this.sort.active = sort.active;
    this.sort.direction = sort.direction;
    this.isLoadingResults = true;
    if (this.selectedColumnnUsuario.columnValue && this.selectedColumnnUsuario.columnValue && this.id > 0) {
      this._orderService.gettUserOrdenes(this.token.token, this.id, this.sort.active, this.sort.direction, this.pageSize, this.paginator.pageIndex)
        .then(response => {
          this.getData(response);
        })
        .catch(error => {
              this.isLoading = false;
              this.isLoadingResults = false;
              this.isRateLimitReached = true;
              console.log(<any>error);
        });
    }

  }


  onPaginateChange(event) {
    this.isLoadingResults = true;
    this.pageSize = event.pageSize;

    if (this.selectedColumnnUsuario.columnValue && this.selectedColumnnUsuario.columnValue && this.id > 0) {
      this._orderService.gettUserOrdenes(this.token.token, this.id, this.sort.active, this.sort.direction, this.pageSize, this.paginator.pageIndex)
        .then(response => {
          this.getData(response);
        })
        .catch(error => {
              this.isLoading = false;
              this.isLoadingResults = false;
              this.isRateLimitReached = true;
              console.log(<any>error);
        });
    }

   }


   showOrder(order: any) {
    const dialogRef = this.dialog.open(ShowComponent, {
      width: '1000px',
      disableClose: true,
      data: {order_id: order.order_id, order_number: order.order_number, service_id: order.service_id,
        category_id: order.category_id, customer_id: order.customer_id, cc_number: order.cc_number,
        servicetype_id: order.servicetype_id, status_id: order.status_id, estatus: order.estatus,
        order_date: order.order_date, required_date: order.required_date, vencimiento_date: order.vencimiento_date, observation: order.observation,
        create_at: order.create_at, usercreate: order.user, update_at: order.update_at, userupdate: order.userupdate,
        project_name: order.project_name, service_name: order.service_name, servicetype: order.servicetype,
        region: order.region, provincia: order.provincia, comuna: order.comuna, direccion: order.direccion}

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


}
