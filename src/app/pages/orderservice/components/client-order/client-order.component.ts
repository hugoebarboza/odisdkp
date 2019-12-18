import { Component, OnInit, SimpleChanges, OnChanges, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Service } from 'src/app/models/types';
import { Subscription } from 'rxjs';
// import { ToastrService } from 'ngx-toastr';
import { OrderserviceService, ProjectsService, UserService, DataService } from 'src/app/services/service.index';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import Swal from 'sweetalert2';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

import * as _moment from 'moment';
import { ToastrService } from 'ngx-toastr';
const moment = _moment;

@Component({
  selector: 'app-client-order',
  templateUrl: './client-order.component.html',
  styleUrls: ['./client-order.component.css']
})
export class ClientOrderComponent implements OnInit, OnChanges {

  @Input() id: number;
  @Input() ccnumber_s: Array<string>;
  @Output() ServicioSeleccionado: EventEmitter<string>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  forTime = 1000;

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
  role = 0;
  minDateValue: Date;
  forma: FormGroup;
  total = 0;
  progreso = 0;
  countSuccess = 0;
  countError = 0;

  arrayPost = [];
  dataSource = new MatTableDataSource() ;

  isLoading = false;
  // displayedColumns: string[] = ['index', 'cc_number', 'order_number', 'servicetype', 'asignado_a', 'vencimiento_date', 'observation', 'estado', 'detalle'];
  displayedColumns: string[] = ['index', 'cc_number', 'order_number', 'estado', 'detalle'];

  es = {
    firstDayOfWeek: 0,
    dayNames: [ 'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado' ],
    dayNamesShort: [ 'dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb' ],
    dayNamesMin: [ 'D', 'L', 'M', 'X', 'J', 'V', 'S' ],
    monthNames: [ 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre' ],
    monthNamesShort: [ 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic' ],
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
    public toasterService: ToastrService,
    // private toasterService: ToastrService,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.ServicioSeleccionado = new EventEmitter();
    this.role = this.identity.role;
  }


  ngOnInit() {
    this.minDateValue = new Date();
  }

  ngOnChanges(_changes: SimpleChanges) {

    this.minDateValue = new Date();
    this.forma = new FormGroup({
      servicetype: new FormControl (null, [Validators.required, Validators.minLength(1)]),
      assigned_to: new FormControl (null),
      listccnumber: new FormControl ('', [Validators.required, Validators.minLength(1)]),
      observation: new FormControl (''),
      date_end: new FormControl (null)
    });

    if (this.ccnumber_s && this.ccnumber_s.length > 0) {
        let list = '';
        for (let i = 0; i < this.ccnumber_s.length; i++) {
          list = list + this.ccnumber_s[i] + '\n';
        }
        this.forma.controls['listccnumber'].setValue(list);
        this.total = this.ccnumber_s.length;
        if (this.total > 500) {
          Swal.fire('Importante', 'Supero limite de 500 registros máximos', 'error');
        }
    }

    this.service_id = this.id;
    this.getTipoServicio(this.service_id);
    this.getServices(this.service_id);
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
      }
    );
  }

  onKey(value: any) {

    if (value.length > 0) {
      const arrayClient = value.split('\n');
      const arrayclientfinal = [];
      for (let i = 0; i < arrayClient.length; i++) {
        let cc_number = arrayClient[i];
        cc_number = cc_number.trim();
        if (cc_number.length > 0) {
          arrayclientfinal.push(cc_number);
        }
      }
      this.total = arrayclientfinal.length;

      if (this.total > 500) {
        Swal.fire('Importante', 'Supero limite de 500 registros máximos', 'error');
      }

    } else {
      this.total = 0;
      this.progreso = 0;
    }

  }

  addOrdenes (data: any) {

    const that = this;

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta por iniciar el registro masivo de ordenes (' + this.total + ')',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then( start => {
      if (start.value) {
        if (start) {
          that.addOrdenesTrue(data);
        }
      }
    });
  }

  addOrdenesTrue (data: any) {

    this.isLoading = true;

    let arrayClient = data.listccnumber;
    arrayClient = arrayClient.split('\n');

    const arrayclientfinal = [];
    for (let i = 0; i < arrayClient.length; i++) {
      let cc_number = arrayClient[i];
      cc_number = cc_number.trim();
      if (cc_number.length > 0) {
        arrayclientfinal.push(cc_number);
      }
    }

    this.total = arrayclientfinal.length;
    this.progreso = 0;
    this.countSuccess = 0;
    this.countError = 0;

    const delay = (amount: number) => {
      return new Promise((resolve) => {
        setTimeout(resolve, amount);
      });
    };

    const that = this;

    async function loop() {

      that.arrayPost = [];
      that.dataSource = null;

      for (let i = 0; i < arrayclientfinal.length; i++) {

        await delay(that.forTime);

        const cc_number = arrayclientfinal[i];

        const objectJson: object = {
          'cc_id': null,
          'cc_number': cc_number,
          'order_number': that.generatorcasenumber(),
          'service_id': that.service_id,
          'servicetype_id': data.servicetype.id,
          'servicetype': data.servicetype.name,
          'assigned_to': null,
          'asignado_a': null,
          'observation': '',
          'vencimiento_date': null,
          'estado': '',
          'detalle': '',
        };

        if (data.date_end !== null) {
          objectJson['vencimiento_date'] = moment(data.date_end).format('YYYY-MM-DD HH:mm:ss');
        }

        if (data.observation !== null) {
          objectJson['observation'] = data.observation.replace(/[\s\n]/g, ' ');
        }

        if (data.assigned_to !== null) {
          objectJson['assigned_to'] = data.assigned_to.id;
          objectJson['asignado_a'] = data.assigned_to.usuario;
        }

        that.dataService.getValidateExisteCLiente(that.service_id, cc_number, that.token.token, false ).then(
          (res: any) => {
            res.subscribe(
              (some) => {

                // console.log(some);

                if (some['datos'].length > 1) {
                  objectJson['detalle'] = 'Error: Cliente duplicado';
                  objectJson['estado'] = 'error';
                  that.arrayPost.push(objectJson);
                  that.progreso++;
                  that.countError++;
                  that.dataSource = new MatTableDataSource(that.arrayPost);
                  that.dataSource.paginator = that.paginator;
                  that.dataSource.sort = that.sort;

                  if (arrayclientfinal.length === (i + 1)) {
                    that.isLoading = false;
                  }
                } else {

                  if (some['datos'].length === 1) {

                    objectJson['cc_id'] = some['datos'][0]['cc_id'];
                    objectJson['cc_number'] = some['datos'][0]['cc_number'];

                    that.dataService.postOrder(objectJson, that.project_id, that.token.token).then(
                      (respuesta: any) => {
                        respuesta.subscribe(
                          (params) => {
                            // console.log(params);
                            objectJson['detalle'] = 'Success: ' + params['message'];
                            objectJson['estado'] = 'success';
                            that.arrayPost.push(objectJson);
                            that.progreso++;
                            that.countSuccess++;
                            that.dataSource = new MatTableDataSource(that.arrayPost);
                            that.dataSource.paginator = that.paginator;
                            that.dataSource.sort = that.sort;
                            if (arrayclientfinal.length === (i + 1)) {
                              that.isLoading = false;
                            }
                          },
                          (error) => {
                            console.log(<any>error);
                            objectJson['detalle'] = 'Error: ' + error['error']['message'];
                            objectJson['estado'] = 'error';
                            that.arrayPost.push(objectJson);
                            that.progreso++;
                            that.countError++;
                            that.dataSource = new MatTableDataSource(that.arrayPost);
                            that.dataSource.paginator = that.paginator;
                            that.dataSource.sort = that.sort;
                            if (arrayclientfinal.length === (i + 1)) {
                              that.isLoading = false;
                            }
                          }
                        );
                      }
                    );

                  }

                }

              },
              (error) => {
                console.log(<any>error);
                objectJson['detalle'] = 'Error: ' + error['error']['mensaje'];
                objectJson['estado'] = 'error';
                that.arrayPost.push(objectJson);
                that.progreso++;
                that.countError++;
                that.dataSource = new MatTableDataSource(that.arrayPost);
                that.dataSource.paginator = that.paginator;
                that.dataSource.sort = that.sort;
                if (arrayclientfinal.length === (i + 1)) {
                  that.isLoading = false;
                }
              }
            );
          }
        );

      }

    }

    loop();

  }

  resetForm() {

    if (this.isLoading ) {
      Swal.fire('Importante', 'Carga en progreso, favor espere a que finalize', 'error');
    } else {

      this.forma.reset();
      this.arrayPost = [];
      this.total = 0;
      this.dataSource = null;
      this.progreso = 0;
      this.countSuccess = 0;
      this.countError = 0;

    }
  }

  generatorcasenumber() {
    const random = Math.floor((Math.random() * 100) + 1);
    return moment(new Date()).format('YYYYMMDDHHmmss') + '' + random;
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

}
