import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { DataService, OrderserviceService, UserService, ProjectsService } from 'src/app/services/service.index';
import { Subscription, concat, of, Subject, Observable } from 'rxjs';
import { Service } from 'src/app/models/types';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError, delay } from 'rxjs/operators';
// MOMENT
import * as _moment from 'moment';
import { DateDialogComponent } from 'src/app/components/date-dialog/date-dialog.component';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
const moment = _moment;
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-makeinspection',
  templateUrl: './makeinspection.component.html',
  styleUrls: ['./makeinspection.component.css']
})
export class MakeinspectionComponent implements OnInit, OnChanges, OnDestroy {

  @Input() id: number;
  @Output() ServicioSeleccionado: EventEmitter<string>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  identity: any;
  service_id: number;
  token;
  usuarios: Array<Object> = [];
  tipoServicio: Array<Object> = [];
  project_id: number;
  subscription: Subscription;
  services: Service[] = [];
  servicename: string;
  project: string;
  forma: FormGroup;
  isLoadingSave = false;
  isLoadingDelete = false;
  ccnumber$: Observable<any[]>;
  ccnumberLoading = false;
  ccnumberInput = new Subject<string>();
  listOrdenes: Array<Object> = [];
  status: Array<Object> = [];
  displayedColumns: string[] = ['ID', 'servicetype', 'assigned_to', 'ccnumber', 'date_end', 'observation', 'cantidad', 'actions'];
  // displayedColumns: string[] = ['servicetype', 'assigned_to', 'ccnumber', 'status', 'date_end', 'observation', 'cantidad', 'actions'];
  dataSource = new MatTableDataSource() ;
  forTime = 1000;
  role: number = 0;
  total: number = 0;

  indexitem: number;
  editando: boolean = false;
  show: boolean = false;
  upload: boolean = false;

  arrayPost: Array<Object> = [];

  minDateValue: Date;

  es = {
    firstDayOfWeek: 0,
    dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
    dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
    dayNamesMin: [ "D","L","M","X","J","V","S" ],
    monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
    monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ],
    today: 'Hoy',
    clear: 'Borrar'
  };

  constructor(
    public dataService: DataService,
    private _userService: UserService,
    private _orderService: OrderserviceService,
    private _proyectoService: ProjectsService,
    public dialog: MatDialog,
    public _customer: OrderserviceService,
    private toasterService: ToastrService,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.ServicioSeleccionado = new EventEmitter();
    this.role = this.identity.role;
  }

  ngOnInit() {
    this.minDateValue = new Date();
  }

  ngOnChanges(changes: SimpleChanges) {
    // this.resetAll();

    this.minDateValue = new Date();
    this.forma = new FormGroup({
      servicetype: new FormControl (null, [Validators.required, Validators.minLength(1)]),
      assigned_to: new FormControl (null),
      ccnumber: new FormControl ('', [Validators.required, Validators.minLength(1)]),
      observation: new FormControl (''),
      status: new FormControl (null, [Validators.required, Validators.minLength(1)]),
      date_end: new FormControl (''),
      cantidad: new FormControl (null, [Validators.required])
    });
    this.service_id = this.id;
    this.getTipoServicio(this.service_id);
    this.getServices(this.service_id);
    this.getStatus(this.service_id);
    this.loadccnumber();
  }

  loadccnumber() {

    this.ccnumber$ = concat(
      of([]), // default items
      this.ccnumberInput.pipe(
         debounceTime(200),
         distinctUntilChanged(),
         tap(() => this.ccnumberLoading = true),
         switchMap(term => this.getList(term).pipe(
             catchError(() => of([])), // empty list on error
             tap(() => this.ccnumberLoading = false)
         ))
      )
    );

  }

  openDialogDate(): void {
    const dialogRef = this.dialog.open(DateDialogComponent, {
      width: '350px',
      disableClose: true,
      data: {
              dateend: null,
              title: 'Fecha de vencimiento',
              time: {hour: 23, minute: 59}
            }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const newdateend = moment(result.dateend).format('YYYY-MM-DD');
        const time: any = result.time;
        const dateend = newdateend + ' ' + time.hour + ':' + time.minute + ':59';
        this.forma.controls['date_end'].setValue(dateend);
      } else {
        this.forma.controls['date_end'].setValue('');
      }
    });
  }

  clearDate() {
    this.forma.controls['date_end'].setValue('');
  }

  getStatus(id) {
    this.dataService.getStatus(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            //console.log(some['datos']);
            this.status = some['datos'];

            if (some.datos && some.datos.length > 0) {
              for (let i = 0; i < some.datos.length; i++) {

                if (i === some.datos.length - 1) {
                  this.forma.controls['status'].setValue(some.datos[i]);
                }
              }
            }
            // console.log(this.status);
          },
          (error) => {
            console.log(<any>error);
          }
        );
      }
    );
  }

  getList(term: string): Observable<any> {

    if (term.length > 0) {
       console.log(term);
      return this._customer.getCustomer(this.token.token, term, this.project_id).map((res: any) => {
        if (!res) {
           return [];
         }
        if (res.status === 'success') {
          return res.datos;
       }
      });
     } else {
      this.ccnumberLoading = false;
      return of([]).pipe(delay(500));
     }
  }

  ngOnDestroy () {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getTipoServicio(id) {
    this.dataService.getTipoServicio(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            this.tipoServicio = some['datos'];
          },
          (error) => {
            console.log(<any>error);
          }
        );
      }
    );
  }

  getInspectores() {
    this._proyectoService.getProjectUser(this.token.token, this.project_id, this.role).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.usuarios = some['datos'];
          },
          (error) => {
            console.log(<any>error);
          }
        );
      }
    );
  }

  getServices(id) {
    this.subscription = this._orderService.getService(this.token.token, id).subscribe(
     response => {
               if (!response) {
                 return;
               }
               if (response.status === 'success') {
                 this.services = response.datos;
                 this.servicename = this.services['service_name'];
                 this.project = this.services['project']['project_name'];
                 this.project_id = this.services['project']['id'];
                 this.ServicioSeleccionado.emit(this.servicename);
                 if (this.project_id > 0) {
                   this.getInspectores();
                 }
               }
               });
     }

  reset() {
    this.indexitem = -1;
    this.listOrdenes = [];
    this.dataSource = null;
    this.upload = false;
    this.arrayPost = [];
    this.total = 0;
  }

  addOrdenes (data: any): void {

    const obj = {
      assigned_to: data.assigned_to,
      cantidad: data.cantidad,
      ccnumber: data.ccnumber,
      countupload: 0,
      date_end: data.date_end,
      estado: '',
      posicion: 0,
      observation: data.observation,
      servicetype: data.servicetype,
      status: data.status
    };

    if (obj.date_end && obj.date_end !== null) {
      obj.date_end = moment(obj.date_end).format('YYYY-MM-DD HH:mm:ss');
    } else {
      obj.date_end = '';
    }

    this.listOrdenes.push(obj);

    let suma = 0;
    for (let i = 0; i < this.listOrdenes.length; i++) {
      this.listOrdenes[i]['posicion'] = (i + 1);
      suma = suma + this.listOrdenes[i]['cantidad'];
    }

    this.total = suma;

    this.dataSource = new MatTableDataSource(this.listOrdenes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  edit(element: any, i: number) {

    this.forma.setValue({
      'servicetype': element.servicetype,
      'assigned_to': element.assigned_to,
      'ccnumber': element.ccnumber,
      'observation': element.observation,
      'status': element.status,
      'date_end': element.date_end,
      'cantidad': element.cantidad
    });

    this.toasterService.success('Edición activada, Editar formulario', 'Exito',  {timeOut: 6000,});

    this.delete(i);

  }

  generatorcasenumber() {
    const random = Math.floor((Math.random() * 100) + 1);
    return moment(new Date()).format('YYYYMMDDHHmmss') + '' + random;
  }

  procesarAll() {

    const delayy = (amount: number) => {
      return new Promise((resolve) => {
        setTimeout(resolve, amount);
      });
    };

    const that = this;

    async function  loop() {

      let user_assigned = 0;

      if (that.listOrdenes && that.listOrdenes.length > 0) {

        that.upload = true;

        for (let i = 0; i < that.listOrdenes.length; i++) {

          for (let ii = 0; ii < that.listOrdenes[i]['cantidad']; ii++) {
            await delayy(that.forTime);


            console.log(that.listOrdenes[i]);
            if(that.listOrdenes[i]['assigned_to'] !== null && that.listOrdenes[i]['assigned_to']['id'] ){              
              user_assigned = that.listOrdenes[i]['assigned_to']['id']; 
            }
            const objectJson: object = {
              'cc_id': that.listOrdenes[i]['ccnumber']['cc_id'],
              'cc_number': that.listOrdenes[i]['ccnumber']['cc_number'],
              'order_number': that.generatorcasenumber(),
              'service_id': that.id,
              'servicetype_id': that.listOrdenes[i]['servicetype']['id'],
              'status_id': that.listOrdenes[i]['status']['id'],
              'assigned_to': user_assigned,
              'observation': that.listOrdenes[i]['observation'].replace(/[\s\n]/g, ' '),
              'vencimiento_date': that.listOrdenes[i]['date_end']
            };

            that.listOrdenes[i]['countupload'] = ii + 1;

            that.dataService.postOrder(objectJson, that.project_id, that.token.token).then(
              (res: any) => {
                res.subscribe(
                  (some) => {
                    console.log(some);
                    if (that.listOrdenes[i]['estado'].length === 0 || that.listOrdenes[i]['estado'] !== 'error') {
                      that.listOrdenes[i]['estado'] = 'success';
                    }
                    objectJson['detalle'] = some['message'];
                    that.arrayPost.push(objectJson);
                  },
                  (error) => {
                    console.log(<any>error);
                    that.listOrdenes[i]['estado'] = 'error';
                    objectJson['detalle'] = error['error']['message'];
                    that.arrayPost.push(objectJson);
                  }
                );
              }
            );
          }
        }
      }
    }

    loop();

  }

  downloadExcel() {
    if (this.arrayPost.length > 0) {
      const excelFileName = 'DetalleCarga';
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.arrayPost);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, excelFileName);
    }
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  delete(i: number) {
    this.indexitem = i;
    this.editando = false;
    this.isLoadingDelete = true;

    setTimeout(() => {
      this.listOrdenes.splice(i, 1);

      let suma = 0;
      for (let ii = 0; ii < this.listOrdenes.length; ii++) {
        this.listOrdenes[ii]['posicion'] = (ii + 1);
        suma = suma + this.listOrdenes[ii]['cantidad'];
      }
      this.total = suma;

      this.dataSource = new MatTableDataSource(this.listOrdenes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.indexitem = -1;
      this.isLoadingDelete = false;
    },
    500);
  }

}
