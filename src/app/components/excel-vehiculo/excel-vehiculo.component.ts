import { Component, OnInit , ViewChild, Inject, Input, OnDestroy, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import * as FileSaver from 'file-saver';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

// MODEL
import { Service } from '../../models/types';

// SERVICES
import { DataService, OrderserviceService, UserService } from '../../services/service.index';

//UTILITY
import { DateDialogComponent } from '../../components/date-dialog/date-dialog.component';
import * as moment from 'moment';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'app-excel-vehiculo',
  templateUrl: './excel-vehiculo.component.html',
  styleUrls: ['./excel-vehiculo.component.css']
})
export class ExcelVehiculoComponent implements OnInit, OnDestroy, OnChanges {

  forTime = 500;

  private token;

  public services: Service[] = [];
  public project: string;
  project_id: number;
  servicename: string;
  service_id: number;


  dateend: any = undefined;

  firtsFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  isLoadingResults = false;
  isRateLimitReached = false;
  show_table = false;
  bandera = false;
  liberar = false;
  checkValidation = false;
  checkPost = false;
  checkValidationPost = false;
  checkboxAuto = false;
  checkOrdenes = false;

  checkboxUpdateVIN = false;
  checkboxRegistro = false;
  checkboxPicking = false;

  arrayBuffer: any;
  file: File;
  nombreFile: string;

  usuarios: Array<Object> = [];
  tipoServicio: Array<Object> = [];
  marca: Array<Object> = [];
  color: Array<Object> = [];
  status: Array<Object> = [];

  arrayCarga: Array<String> = [];
  arrayExcel: Array<Object> = [];
  arrayExcelSuccess: Array<Object> = [];
  arrayExcelPicking: Array<Object> = [];
  arrayExcelError: Array<Object> = [];
  arrayExcelErrorPost: Array<Object> = [];

  countError = 0;
  countSuccess = 0;
  countErrorPost = 0;
  countSuccessPost = 0;
  countJokerPost = 0;
  countExiste = 0;
  countErrorOrdenes = 0;
  countSuccessOrdenes = 0;
  countJokerOrdenes = 0;

  msj_ordenes: string;
  msj_snack: string;
  msj: string;

  displayedColumns: string[] = ['cc_number', 'marca', 'descripcion', 'color', 'patio', 'espiga', 'posicion', 'observacion',
  'order_number', 'tipo_servicio', 'asignado_a', 'required_date', 'observation', 'estatus'];

  dataSource = new MatTableDataSource();
  dataSourceClientes = new MatTableDataSource();
  dataSourceOrdenes = new MatTableDataSource();

  subscription: Subscription;

  displayedColumnsPicking: string[] = ['ubicacion_OCA', 'ubicacion_SAP', 'cc_number', 'marca', 'descripcion', 'color', 'estatus'];
  dataSourcePicking = new MatTableDataSource();
  @ViewChild('paginatorPicking', { static: true }) paginatorPicking: MatPaginator;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('paginatorClientes', { static: true }) paginatorClientes: MatPaginator;
  @ViewChild('paginatorOrdenes', { static: true }) paginatorOrdenes: MatPaginator;
  @Output() ServicioSeleccionado: EventEmitter<string>;
  @Input() id: number;
  @Input() table: string;

  constructor(
    public dataService: DataService,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _orderService: OrderserviceService,
    private _userService: UserService,
  ) {
    this.token = this._userService.getToken();
    this.ServicioSeleccionado = new EventEmitter();
  }

  ngOnInit() {

    /*
    this.dataSource.paginator = this.paginator;
    this.dataSourceClientes.paginator = this.paginatorClientes;
    this.dataSourceOrdenes.paginator = this.paginatorOrdenes;
    this.firtsFormGroup = this._formBuilder.group({
      confirmarCtrl: ['', Validators.required],
      inputCtrl: ['', Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({
      confirmarCli: ['', Validators.required]
    });

    this.getColor();
    this.getMarca();
    this.getTipoServicio(this.service_id);
    this.getInspectores();
    */
  }

  ngOnChanges(changes: SimpleChanges) {
    this.service_id = this.id;
    this.getServices(this.service_id);
    this.firtsFormGroup = this._formBuilder.group({
      confirmarCtrl: ['', Validators.required],
      inputCtrl: ['', Validators.required],
      inputDate: [{value: '', disabled: true}]
    });

    this.secondFormGroup = this._formBuilder.group({
      confirmarCli: ['', Validators.required]
    });

    this.getColor();
    this.getMarca();
    this.getTipoServicio(this.service_id);
    this.getStatus(this.service_id);
    this.resetAll();
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  checkConfirmacion(event) {
    if (!event.checked) {
      this.checkValidation = false;
    } else {
      this.checkValidation = true;
    }
  }

  checkConfirmacionPost(event) {
    if (!event.checked) {
      this.checkValidationPost = false;
    } else {
      this.checkValidationPost = true;
    }
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

  incomingfile(event) {
    this.file = event.target.files[0];
    if (this.file == null) {
      this.bandera = false;
      this.show_table = false;
      this.dataSource = null;
      this.countError = 0;
      this.countSuccess = 0;
      this.countErrorPost = 0;
      this.checkValidation = false;
      this.dateend = undefined;
      this.resetAll();
    } else {
      this.nombreFile = this.file.name;
      this.bandera = true;
      if (!this.checkboxUpdateVIN && !this.checkboxRegistro && !this.checkboxPicking) {
        this.openDialogDate();
      }
    }
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
        this.dateend = newdateend + ' ' + time.hour + ':' + time.minute + ':59';
        this.firtsFormGroup.controls['inputDate'].setValue(this.dateend);
      }
    });
  }

  public Upload() {
    if (this.checkboxPicking) {
        this.gerenarPicking();
    } else {
      this.UploadFile();
    }
  }


  validarUndefined(value: String): String {

    if (value === undefined || value.trim().length === 0) {
      value = '';
    } else {
      value = value.trim();
    }

    return value;

  }

  public gerenarPicking() {

    this.arrayExcel = [];
    this.arrayExcelSuccess = [];
    this.arrayExcelError = [];
    this.arrayExcelErrorPost = [];
    this.countError = 0;
    this.countSuccess = 0;
    this.countExiste = 0;
    this.countJokerPost = 0;
    this.countJokerPost = 0;
    this.countSuccessPost = 0;
    this.dataSource = null;
    this.dataSourceClientes = null;
    this.paginator = null;
    this.paginatorClientes = null;

    this.arrayCarga = [];
    this.arrayExcelPicking  = [];
    this.dataSourcePicking = null;
    this.paginatorPicking = null;

    if (this.file != null) {

      this.isRateLimitReached = true;
      this.isLoadingResults = true;
      this.show_table = true;

      const fileReader = new FileReader();

      fileReader.onload = (e) => {

          this.arrayBuffer = fileReader.result;
          const data = new Uint8Array(this.arrayBuffer);
          const arr = new Array();

          for (let i = 0; i !== data.length; ++i) {
            arr[i] = String.fromCharCode(data[i]);
          }

          const bstr = arr.join('');
          const workbook = XLSX.read(bstr, {type: 'binary'});
          const first_sheet_name = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[first_sheet_name];
          this.arrayCarga = XLSX.utils.sheet_to_json(worksheet, {raw: true});

          if (this.arrayCarga.length === 0) {
            this.msj_snack = 'Carga sin registros validos!';
            this.openSnackBar(this.msj_snack, 'Min 1 Registro');
            this.isLoadingResults = false;
            this.isRateLimitReached = false;
            this.show_table = false;
            return;
          }

          if (this.arrayCarga.length > 500) {
            this.msj_snack = 'Carga supera limite de registros permitidos!';
            this.openSnackBar(this.msj_snack, 'Max 500 Registros');
            this.isLoadingResults = false;
            this.isRateLimitReached = false;
            this.show_table = false;
            return;
          }

          const delay = (amount: number) => {
            return new Promise((resolve) => {
              setTimeout(resolve, amount);
            });
          };

          const that = this;

          async function loop() {

            for (let ii = 0; ii < that.arrayCarga.length; ii++) {

              let banderaJson: Boolean = false;
              let concatError = '';

              const ubicacion_ex: String = that.validarUndefined(that.arrayCarga[ii]['ubicacion']);
              let cc_number: String = '' + that.arrayCarga[ii]['cc_number'];
              const marca_ex: String = that.validarUndefined(that.arrayCarga[ii]['marca']);
              const descripcion_ex: String = that.validarUndefined(that.arrayCarga[ii]['descripcion']);
              const color_ex: String = that.validarUndefined(that.arrayCarga[ii]['color']);
              const fecha_ex: String = that.validarUndefined(that.arrayCarga[ii]['fecha']);
              const texto_breve: String = that.validarUndefined(that.arrayCarga[ii]['texto_breve']);
              const estatus_venta: String = that.validarUndefined(that.arrayCarga[ii]['estatus_venta']);
              const via_ex: String = that.validarUndefined(that.arrayCarga[ii]['via']);
              const sucursal_ex: String = that.validarUndefined(that.arrayCarga[ii]['sucursal']);

              // Validar campos
              if (cc_number === 'undefined' || cc_number.trim().length === 0) {
                cc_number = '';
                concatError = 'cc_number no ingresado';
                banderaJson = true;
              } else {
                cc_number = cc_number.trim();
              }

              let objectJson: object = {
                'ubicacion_OCA': 'S/N',
                'ubicacion_SAP': 'S/N',
                'cc_number': cc_number,
                'marca': 'S/N',
                'descripcion': 'S/N',
                'color': 'S/N',
                'fecha': 'S/N',
                'via': 'S/N',
                'texto_breve': 'S/N',
                'estatus_venta': 'S/N',
                'sucursal': 'S/N',
                'estatus': 'S/N'
              };

              if (banderaJson) {
                const success: Object = {
                  'estatus' : 'Registro invalido: ' + concatError
                };
                objectJson = Object.assign(objectJson, success);
                that.arrayExcelPicking.push(objectJson);
                that.refreshTablePicking();
              } else {

                await delay(that.forTime);

                that.dataService.getValidateExisteCLiente(that.service_id, cc_number, that.token.token, false).then(
                  (res: any) => {
                    res.subscribe(
                      (some) => {
                        // console.log(some['datos']);
                        if (some['datos'].length > 1) {
                          const obj: Object = {
                            'ubicacion_OCA': 'S/N',
                            'ubicacion_SAP': ubicacion_ex,
                            'cc_number': cc_number,
                            'marca': marca_ex,
                            'descripcion': descripcion_ex,
                            'color': color_ex,
                            'fecha': fecha_ex,
                            'via': via_ex,
                            'texto_breve': texto_breve,
                            'estatus_venta': estatus_venta,
                            'sucursal': sucursal_ex,
                            'estatus' : 'Error: VIN Duplicado',
                          };
                          objectJson = Object.assign(objectJson, obj);
                          that.refreshTablePicking();
                        } else {
                          // console.log(some['datos'][0]);

                          let color = '';
                          if ( some['datos'][0]['color'] && some['datos'][0]['color'].length > 0 ) {
                            color = some['datos'][0]['color'];
                          } else if ( some['datos'][0]['secondcolor'] && some['datos'][0]['secondcolor'].length > 0 ) {
                            color = some['datos'][0]['secondcolor'];
                          } else {
                            color = 'S/N';
                          }

                          let modelo = '';
                          if ( some['datos'][0]['modelo'] && some['datos'][0]['modelo'].length > 0 ) {
                            modelo = some['datos'][0]['modelo'];
                          } else if ( some['datos'][0]['description'] && some['datos'][0]['description'].length > 0 ) {
                            modelo = some['datos'][0]['description'];
                          } else {
                            modelo = 'S/N';
                          }

                          const obj: Object = {
                            // tslint:disable-next-line:max-line-length
                            'ubicacion_OCA': some['datos'][0]['patio'] + '-' + some['datos'][0]['espiga'] + '-' + some['datos'][0]['posicion'],
                            'ubicacion_SAP': ubicacion_ex,
                            'marca': some['datos'][0]['marca'],
                            'descripcion': modelo,
                            'color': color,
                            'fecha': fecha_ex,
                            'via': via_ex,
                            'texto_breve': texto_breve,
                            'estatus_venta': estatus_venta,
                            'sucursal': sucursal_ex,
                            'estatus': 'Success: VIN validado'
                          };
                          objectJson = Object.assign(objectJson, obj);
                          that.arrayExcelPicking.push(objectJson);
                          that.refreshTablePicking();
                        }
                      },
                      (error) => {
                        console.log(<any>error);
                        if (error['error']['mensaje'] === 'no se encuentra cliente') {
                          const obj: Object = {
                            'ubicacion_OCA': 'S/N',
                            'ubicacion_SAP': ubicacion_ex,
                            'cc_number': cc_number,
                            'marca': marca_ex,
                            'descripcion': descripcion_ex,
                            'color': color_ex,
                            'fecha': fecha_ex,
                            'via': via_ex,
                            'texto_breve': texto_breve,
                            'estatus_venta': estatus_venta,
                            'sucursal': sucursal_ex,
                            'estatus' : 'Error: VIN no registrado',
                            };
                          objectJson = Object.assign(objectJson, obj);
                          that.arrayExcelPicking.push(objectJson);
                          that.refreshTablePicking();
                        }

                      }
                    );
                  }
                );
              }
            }
          }

          loop();
      };
      fileReader.readAsArrayBuffer(this.file);
    }
  }


  public UploadFile() {

    this.arrayCarga = [];
    this.arrayExcel = [];
    this.arrayExcelSuccess = [];
    this.arrayExcelError = [];
    this.arrayExcelErrorPost = [];
    this.arrayExcelPicking = [];
    this.countError = 0;
    this.countSuccess = 0;
    this.countExiste = 0;
    this.countJokerPost = 0;
    this.countJokerPost = 0;
    this.countSuccessPost = 0;
    this.dataSource = null;
    this.dataSourceClientes = null;
    this.dataSourcePicking = null;
    this.paginatorPicking = null;
    this.paginator = null;
    this.paginatorClientes = null;

    if (this.file != null) {

      this.isRateLimitReached = true;
      this.isLoadingResults = true;
      this.show_table = true;

      const fileReader = new FileReader();

      fileReader.onload = (e) => {

          this.arrayBuffer = fileReader.result;
          const data = new Uint8Array(this.arrayBuffer);
          const arr = new Array();

          for (let i = 0; i !== data.length; ++i) {
            arr[i] = String.fromCharCode(data[i]);
          }

          const bstr = arr.join('');
          const workbook = XLSX.read(bstr, {type: 'binary'});
          const first_sheet_name = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[first_sheet_name];
          this.arrayCarga = XLSX.utils.sheet_to_json(worksheet, {raw: true});

          if (this.arrayCarga.length === 0) {
            this.msj_snack = 'Carga sin registros validos!';
            this.openSnackBar(this.msj_snack, 'Min 1 Registro');
            this.isLoadingResults = false;
            this.isRateLimitReached = false;
            this.show_table = false;
            return;
          }

          if (this.arrayCarga.length > 1001) {
            this.msj_snack = 'Carga supera limite de registros permitidos!';
            this.openSnackBar(this.msj_snack, 'Max 500 Registros');
            this.isLoadingResults = false;
            this.isRateLimitReached = false;
            this.show_table = false;
            return;
          }

          const delay = (amount: number) => {
            return new Promise((resolve) => {
              setTimeout(resolve, amount);
            });
          };

          const that = this;

          async function loop() {

            for (let ii = 0; ii < that.arrayCarga.length; ii++) {

              let banderaJson: Boolean = false;
              let concatError = '';

              let cc_number: String = '' +  that.arrayCarga[ii]['cc_number'];
              let marca: String = '' +  that.arrayCarga[ii]['marca'];
              let marca_id: Number = 0;
              let descripcion: String = '' +  that.arrayCarga[ii]['descripcion'];
              let color: String = '' +  that.arrayCarga[ii]['color'];
              let color_id: Number = 0;
              let ubicacion: String = '' +  that.arrayCarga[ii]['ubicacion'];
              let observacion: String = '' +  that.arrayCarga[ii]['observacion'];
              // ------------------ Orden
              let order_number: String = '' +  that.arrayCarga[ii]['order_number'];
              let tipo_servicio: String = '' +  that.arrayCarga[ii]['tipo_servicio'];
              let servicetype_id: Number = 0;
              let asignado_a: String = '' +  that.arrayCarga[ii]['asignado_a'];
              let assigned_to: Number = 0;
              let required_date: String = '' +  that.arrayCarga[ii]['required_date'];
              let patio: string;
              let espiga: string;
              let posicion: string;
              let observacion_orden: String = '' +  that.arrayCarga[ii]['observacion_orden'];
              let status: String = '' + that.arrayCarga[ii]['status'];
              let status_id: Number;

              // Validar campos
              if (cc_number === 'undefined' || cc_number.trim().length === 0) {
                cc_number = '';
                banderaJson = true;
                concatError = concatError + 'Cc_number; ';
              } else {
                cc_number = cc_number.trim();
              }


              if (status === 'undefined' || status.trim().length === 0) {
                status = '';
              } else {
                status = status.trim();
                const response: number = that.validarSelect('name', status, that.status);
                if (response > 0) {
                  status_id = response;
                } else {
                  concatError = concatError + 'Status orden; ';
                  banderaJson = true;
                }
              }

              if (marca === 'undefined' || marca.trim().length === 0) {
                marca = '';
                banderaJson = true;
                concatError = concatError + 'Marca; ';
              } else {
                marca = marca.trim();
                const response: number = that.validarSelect('title', marca, that.marca);
                if (response > 0) {
                  marca_id = response;
                } else {
                  concatError = concatError + 'Marca; ';
                  banderaJson = true;
                }
              }

              if (descripcion === 'undefined' || descripcion.trim().length === 0) {
                descripcion = '';
                banderaJson = true;
                concatError = concatError + 'Descripción; ';
              } else {
                descripcion = descripcion.trim();
              }

              if (color === 'undefined' || color.trim().length === 0) {
                color = 'S/N';
              } else {
                color = color.trim();
                const response: number = that.validarSelect('title', color, that.color);
                if (response > 0) {
                  color_id = response;
                } else {
                  color_id = null;
                }
              }

              if (observacion === 'undefined' || observacion.trim().length === 0) {
                observacion = 'S/N';
              } else {
                observacion = observacion.replace(/\–/g, '-');
                observacion = observacion.replace(/\&/g, 'Y');
                const observacion_array: string[] = observacion.split(' ');
                observacion = '';
                for (let i = 0; i !== observacion_array.length; ++i) {
                  if (observacion_array[i].trim().length > 0) {
                    observacion = observacion + observacion_array[i].trim() + ' ';
                  }
                }
                observacion = observacion.trim();
              }

              if (observacion_orden === 'undefined' || observacion_orden.trim().length === 0) {

                if (that.checkboxRegistro || that.checkboxUpdateVIN) {
                  observacion_orden = '';
                } else {
                  observacion_orden = 'S/N';
                }

              } else {
                
                observacion_orden = observacion_orden.replace(/\–/g, '-');
                observacion_orden = observacion_orden.replace(/\&/g, 'Y');
                const observacion_orden_array: string[] = observacion_orden.split(' ');
                observacion_orden = '';
                for (let i = 0; i !== observacion_orden_array.length; ++i) {
                  if (observacion_orden_array[i].trim().length > 0) {
                    observacion_orden = observacion_orden + observacion_orden_array[i].trim() + ' ';
                  }
                }
                observacion_orden = observacion_orden.trim();
              }

              // ----- validación orden

              if (!that.checkboxAuto) {
                if (order_number === 'undefined' || order_number.trim().length === 0) {
                  order_number = '';
                  if (!that.checkboxRegistro && !that.checkboxUpdateVIN) {
                    banderaJson = true;
                    concatError = concatError + 'Order_number; ';
                  } else {
                    // No pasa nada
                  }
                } else {
                  order_number = order_number.trim();
                }
              } else {
                const date: Date = new Date();
                const newDate = that.getDateFormar(date);
                const random = Math.floor((Math.random() * 100) + 1);
                order_number = newDate + '' + random + '' + ii;
              }


              if (tipo_servicio === 'undefined' || tipo_servicio.trim().length === 0) {
                tipo_servicio = '';
                if (!that.checkboxRegistro && !that.checkboxUpdateVIN) {
                  banderaJson = true;
                  concatError = concatError + 'Tipo servicio; ';
                } else {
                  // No pasa nada
                }
              } else {
                tipo_servicio = tipo_servicio.trim();
                const response: number = that.validarTipoServicio(tipo_servicio, that.tipoServicio);
                if ( response > 0) {
                    servicetype_id = response;
                } else if (!that.checkboxRegistro && !that.checkboxUpdateVIN) {
                  concatError = concatError + 'Tipo servicio; ' ;
                  banderaJson = true;
                }
              }

              if (asignado_a === 'undefined' || asignado_a.trim().length === 0) {
                asignado_a = '';
              } else {
                asignado_a = asignado_a.trim();
                const response: number = that.validarSelect('usuario', asignado_a, that.usuarios);
                if ( response > 0) {
                  assigned_to = response;
                } else {
                  concatError = concatError + 'Asignado a; ' ;
                  banderaJson = true;
                }
              }

              if (required_date === 'undefined' || required_date.trim().length === 0) {
                required_date = '';
              } else {
                required_date = required_date.trim();
                required_date = required_date.replace(/ /g, '');
                required_date = required_date.substring(0, 10) + ' ' + required_date.substring(10, required_date.length);
                if (required_date.match(/^[0-3][0-9]\.[0-1][0-9]\.[0-2][0-9][0-9][0-9] $/)) {
                  required_date = required_date.replace(/\./g, '-');
                  required_date = required_date + ' 23:59:59';
                } else {
                  concatError = concatError + 'Fecha requerida; ' ;
                  banderaJson = true;
                }
              }

              if (ubicacion === 'undefined' && ubicacion.trim().length === 0) {
                banderaJson = true;
                concatError = concatError + 'Ubicación; ';
                patio = '';
                espiga = '';
                posicion = '';
              } else {
                ubicacion = ubicacion.trim();
                const ubicacion_array: string[] = ubicacion.split('-');
                if (ubicacion_array.length === 3) {
                  patio = ubicacion_array[0];
                  espiga = ubicacion_array[1];
                  posicion = ubicacion_array[2];
                } else {
                  banderaJson = true;
                  concatError = concatError + 'Ubicación; ';
                  patio = '';
                  espiga = '';
                  posicion = '';
                }
              }

              let objectJson: object = {
                'cc_number': cc_number,
                'marca': marca,
                'marca_id': marca_id,
                'descripcion': descripcion,
                'color': color,
                'color_id': color_id,
                'patio': patio,
                'espiga': espiga,
                'posicion': posicion,
                'observacion': observacion,
                'bandera': false,
                'order_number': order_number,
                'service_id': that.service_id,
                'tipo_servicio': tipo_servicio,
                'servicetype_id': servicetype_id,
                'asignado_a': asignado_a,
                'assigned_to': assigned_to,
                'required_date': required_date,
                'observation': observacion_orden,
                'status_id': status_id,
                'status': status,
                'ubicacion': patio + '-' + espiga + '-' + posicion,
                'vencimiento_date': '',
                'label': '',
                'cc_id': '',
                'id': '',
                'orden_id': '',
                'parametro': 0,
                'estatus': '',
                'banderatracker': false                
              };

              if (that.liberar) {
                objectJson['banderatracker'] = that.liberar;
              }

              if (that.dateend !== undefined) {
                //const newdateend = moment(that.dateend.value).format('YYYY-MM-DD');
                //objectJson['vencimiento_date'] = newdateend + ' 23:59:59';
                objectJson['vencimiento_date'] = that.dateend;
              }

              if (banderaJson) {
                const success: Object = {
                  'estatus' : 'Error en registro: ' + concatError,
                  'label': 'red',
                  'parametro': 0
                };
                objectJson = Object.assign(objectJson, success);
                that.arrayExcel.push(objectJson);
                that.arrayExcelError.push(objectJson);
                that.countError = that.countError + 1;
                that.refreshTable();
              } else {

                await delay(that.forTime);

                that.dataService.getValidateExisteCLiente(that.service_id, cc_number, that.token.token, false).then(
                  (res: any) => {
                    res.subscribe(
                      (some) => {
                        // console.log(some['datos']);
                        if (some['datos'].length > 1) {
                          const obj: Object = {
                            'estatus' : 'Error: Cliente Duplicado',
                            'label': 'red',
                            'parametro': 0
                          };
                          objectJson = Object.assign(objectJson, obj);
                          that.arrayExcel.push(objectJson);
                          that.arrayExcelError.push(objectJson);
                          that.countError = that.countError + 1;
                          that.refreshTable();
                        } else {
                          // console.log(some['datos'][0]['id']);
                          const obj: Object = {
                            'cc_id': some['datos'][0]['cc_id'],
                            'estatus': 'VIN registrado',
                            'parametro': 1,
                            'label': 'green'
                          };
                          objectJson = Object.assign(objectJson, obj);
                          that.arrayExcel.push(objectJson);
                          that.arrayExcelSuccess.push(objectJson);
                          that.countSuccess = that.countSuccess + 1;
                          // this.countExiste = this.countExiste + 1;
                          that.refreshTable();
                        }

                      },
                      (error) => {
                        console.log(<any>error);
                        if (error['error']['mensaje'] === 'no se encuentra cliente') {
                          const obj: Object = {
                            'estatus' : 'Registro valido',
                            'parametro': 2,
                            'label': 'green'
                            };
                          objectJson = Object.assign(objectJson, obj);
                          that.countSuccess = that.countSuccess + 1;
                          that.arrayExcel.push(objectJson);
                          that.arrayExcelSuccess.push(objectJson);
                          that.refreshTable();
                        }

                      }
                    );
                  }
                );
              }
            }
          }

          loop();
      };
      fileReader.readAsArrayBuffer(this.file);
    }
  }

  checkAutoGenerar(event) {
    if (!event.checked) {
      this.checkboxAuto = false;
    } else {
      this.checkboxAuto = true;
    }
  }

  checkLiberar(event) {
    if (!event.checked) {
      this.checkboxAuto = false;
      this.liberar = false;
    } else {
      this.liberar = true;
      this.checkboxAuto = true;
    }
  }  

  checkUpdateVIN(event) {
    if (!event.checked) {
      this.checkboxUpdateVIN = false;
    } else {
      this.checkboxUpdateVIN = true;
    }
  }

  checkRegistro(event) {
    if (!event.checked) {
      this.checkboxRegistro = false;
    } else {
      this.checkboxRegistro = true;
    }
  }

  checkPicking(event) {
    if (!event.checked) {
      this.checkboxPicking = false;
    } else {
      this.checkboxPicking = true;
    }
  }

  getTipoServicio(id) {
    this.dataService.getTipoServicio(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.tipoServicio = some['datos'];
          },
          (error) => {
            console.log(<any>error);
          }
        );
      }
    );
  }

  getMarca() {
    this.dataService.getMarca(this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.marca = some['marca'];
          },
          (error) => {
            console.log(<any>error);
          }
        );
      }
    );
  }

  getColor() {
    this.dataService.getColor(this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.color = some['color'];
          },
          (error) => {
            console.log(<any>error);
          }
        );
      }
    );
  }

  getInspectores() {
    this.dataService.getInspectores(this.project_id, this.token.token).then(
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


  getStatus(id) {
    this.dataService.getStatus(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.status = some['datos'];
            // console.log(this.status);
          },
          (error) => {
            console.log(<any>error);
          }
        );
      }
    );
  }

  getDateFormar(date: Date) {
    const dia = date.getDate();
    const mes = date.getMonth() + 1;
    const year = date.getFullYear();
    const minutos = date.getMinutes();
    const segundos = date.getSeconds();
    const milisegundos = date.getMilliseconds();
    return dia + '' + mes + '' + year + '' + minutos + '' + segundos + '' + milisegundos;
  }

  validarTipoServicio(termino: any, array_val: Array<object>) {
    let id = 0;
    if ( array_val.length > 0 ) {
      array_val.forEach(function(valor, indice, array) {
       if ( valor['name'].toLowerCase() === (termino).toLowerCase()) {
          id = valor['id'];
       }
      }, this);
    }
    return id;
  }

  validarSelect(key: string, termino: any, arrayObject: Array<object>) {
    let id = 0;
    if (arrayObject.length > 0) {
      arrayObject.forEach(function(valor, indice, array) {
       if (valor[key].toLowerCase() === (termino).toLowerCase()) {
          id = valor['id'];
       }
      }, this);
    }
    return id;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilterCli(filterValue: string) {
    this.dataSourceClientes.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceClientes.paginator) {
      this.dataSourceClientes.paginator.firstPage();
    }
  }
  applyFilterOrdenes(filterValue: string) {
    this.dataSourceOrdenes.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceOrdenes.paginator) {
      this.dataSourceOrdenes.paginator.firstPage();
    }
  }

  refreshTable() {
    this.dataSource = new MatTableDataSource(this.arrayExcel);
    this.dataSource.paginator = this.paginator;

    if (this.arrayExcel.length === this.arrayCarga.length) {
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        // console.log(this.arrayExcel);

        if (this.countExiste === this.arrayExcelSuccess.length) {
          this.checkPost = true;
        } else {
          this.checkPost = false;
        }
    }
  }

  fulltable() {
    if (this.arrayExcelSuccess.length > 0) {
      this.dataSourceClientes = new MatTableDataSource(this.arrayExcelSuccess);
      this.dataSourceClientes.paginator = this.paginatorClientes;
      if (this.arrayExcelSuccess.length === this.countExiste) {
        this.countSuccessPost = this.countExiste;
      }
    }
  }

  fulltableOrdenes() {
    if (this.arrayExcelSuccess.length > 0) {
      this.dataSourceOrdenes = new MatTableDataSource(this.arrayExcelSuccess);
      this.dataSourceOrdenes.paginator = this.paginatorOrdenes;
    }
  }

  refreshTableClientes() {
    this.dataSourceClientes = new MatTableDataSource(this.arrayExcelSuccess);
    this.dataSourceClientes.paginator = this.paginatorClientes;
    if (this.arrayExcelSuccess.length === (this.countSuccessPost + this.countErrorPost + this.countJokerPost)) {
      this.isLoadingResults = false;
      this.isRateLimitReached = false;
      if (this.countSuccessPost > 0) {
      }
    }
  }

  refreshTableOdernes() {
    this.dataSourceOrdenes = new MatTableDataSource(this.arrayExcelSuccess);
    this.dataSourceOrdenes.paginator = this.paginatorOrdenes;
    if (this.arrayExcelSuccess.length === (this.countJokerOrdenes + this.countErrorOrdenes + this.countSuccessOrdenes)) {
      this.isLoadingResults = false;
      this.isRateLimitReached = false;
    }
  }

  refreshTablePicking() {
    this.dataSourcePicking = new MatTableDataSource(this.arrayExcelPicking);
    this.dataSourcePicking.paginator = this.paginatorPicking;

    if (this.arrayExcelPicking.length === this.arrayCarga.length) {
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
    }
  }

  uploadExcelPost() {

    this.countErrorPost = 0;
    this.countSuccessPost = 0;
    this.countJokerPost = 0;
    this.isLoadingResults = true;
    this.isRateLimitReached = true;
    this.checkPost = true;
    this.msj = 'registrados';

    const delay = (amount: number) => {
      return new Promise((resolve) => {
        setTimeout(resolve, amount);
      });
    };

    const that = this;

    async function loop() {

      for (let ii = 0; ii < that.arrayExcelSuccess.length; ii++) {

        if (that.arrayExcelSuccess[ii]['parametro'] === 2) {
          // console.log('1');
          await delay(that.forTime);
          that.dataService.postDataBD(that.arrayExcelSuccess[ii], that.project_id, that.token.token).then(
            (res: any) => {
              res.subscribe(
                (some) => {
                  // console.log(some);
                  that.countSuccessPost = that.countSuccessPost + 1;
                  that.arrayExcelSuccess[ii]['estatus'] = some['message'];
                  that.arrayExcelSuccess[ii]['label'] = 'green';
                  that.arrayExcelSuccess[ii]['cc_id'] = some['lastInsertedId'];
                  that.refreshTableClientes();
                },
                (error) => {
                  console.log(<any>error);
                  that.countErrorPost = that.countErrorPost + 1;
                  that.arrayExcelSuccess[ii]['estatus'] = error['error']['message'];
                  that.arrayExcelErrorPost.push(that.arrayExcelSuccess[ii]);
                  that.arrayExcelSuccess[ii]['label'] = 'red';
                  that.arrayExcelSuccess[ii]['parametro'] = 0;
                  that.refreshTableClientes();
                }
              );
            }
          );
        }

        if (that.checkboxUpdateVIN && that.arrayExcelSuccess[ii]['parametro'] === 1) {
          // console.log('2');
          await delay(that.forTime);
          // tslint:disable-next-line:max-line-length
          const rutalink: string = '/marca/' + that.arrayExcelSuccess[ii]['marca_id']  + '/vehiculo/' + that.arrayExcelSuccess[ii]['cc_id'] ;
          that.dataService.putDataBD(rutalink, that.arrayExcelSuccess[ii], that.project_id, that.token.token).then(
            (res: any) => {
              res.subscribe(
                (some) => {
                  // console.log(some);
                  that.countSuccessPost = that.countSuccessPost + 1;
                  that.arrayExcelSuccess[ii]['estatus'] = some['mensaje'];
                  that.arrayExcelSuccess[ii]['label'] = 'green';
                  that.refreshTableClientes();
                },
                (error) => {
                  console.log(<any>error);
                  console.log('Error put');
                  that.countErrorPost = that.countErrorPost + 1;
                  that.arrayExcelSuccess[ii]['estatus'] = error['error']['message'];
                  that.arrayExcelErrorPost.push(that.arrayExcelSuccess[ii]);
                  that.arrayExcelSuccess[ii]['label'] = 'red';
                  that.arrayExcelSuccess[ii]['parametro'] = 0;
                  that.refreshTableClientes();
                }
              );
            }
          );
        }

        if (that.checkboxRegistro && !that.checkboxUpdateVIN && that.arrayExcelSuccess[ii]['parametro'] === 1) {
          // console.log('3');
          that.countJokerPost = that.countJokerPost + 1;
          that.refreshTableClientes();
        }

        if (!that.checkboxRegistro && !that.checkboxUpdateVIN && that.arrayExcelSuccess[ii]['parametro'] === 1) {
          // console.log('4');
          that.countJokerPost = that.countJokerPost + 1;
          that.refreshTableClientes();
        }

        if ((that.arrayExcelSuccess[ii]['parametro'] !== 1 && that.arrayExcelSuccess[ii]['parametro'] !== 2)
          && !that.checkboxUpdateVIN && !that.checkboxRegistro) {
            // console.log('5');
            that.countJokerPost = that.countJokerPost + 1;
            that.refreshTableClientes();
        }

      }
    }

    loop();

  }

  uploadExcelPostOrdenes() {

    this.countErrorOrdenes = 0;
    this.countSuccessOrdenes = 0;
    this.countJokerOrdenes = 0;
    this.isLoadingResults = true;
    this.isRateLimitReached = true;
    this.checkOrdenes = true;
    this.msj_ordenes = 'registradas';

    const delay = (amount: number) => {
      return new Promise((resolve) => {
        setTimeout(resolve, amount);
      });
    };

    const that = this;

    async function loop() {

      for (let ii = 0; ii < that.arrayExcelSuccess.length; ii++) {

        if (that.arrayExcelSuccess[ii]['parametro'] !== 0) {

          await delay(that.forTime);

          that.dataService.postOrder(that.arrayExcelSuccess[ii], that.project_id, that.token.token).then(
            (res: any) => {
              res.subscribe(
                (some) => {
                  // console.log(some);
                  that.countSuccessOrdenes = that.countSuccessOrdenes + 1;
                  that.arrayExcelSuccess[ii]['estatus'] = some['message'];
                  that.arrayExcelSuccess[ii]['label'] = 'green';
                  that.arrayExcelSuccess[ii]['orden_id'] = some['lastInsertedId'];
                  that.refreshTableOdernes();
                },
                (error) => {
                  console.log(<any>error);
                  that.countErrorOrdenes = that.countErrorOrdenes + 1;
                  that.arrayExcelSuccess[ii]['estatus'] = error['error']['message'];
                  that.arrayExcelErrorPost.push(that.arrayExcelSuccess[ii]);
                  that.arrayExcelSuccess[ii]['label'] = 'red';
                  that.arrayExcelSuccess[ii]['parametro'] = 0;
                  that.refreshTableOdernes();
                }
              );
            }
          );
        }
      }
    }

    loop();

  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(VehiculoOverviewDialog, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result === true) {

        this.countErrorPost = 0;
        this.countSuccessPost = 0;
        this.countJokerPost = 0;
        this.isLoadingResults = true;
        this.isRateLimitReached = true;
        this.msj = 'eliminados';

        this.deleteCliente();

      }
    });
  }

  deleteCliente(): any {

    const delay = (amount: number) => {
          return new Promise((resolve) => {
            setTimeout(resolve, amount);
          });
        };

        const that = this;

        async function loop() {

          for (let ii = 0; ii < that.arrayExcelSuccess.length; ii++) {

            const id: string = '' + that.arrayExcelSuccess[ii]['cc_id'];
            if (id.trim().length > 0  && that.arrayExcelSuccess[ii]['parametro']  === 2) {

              await delay(that.forTime);

              that.dataService.deleteCustomer(that.arrayExcelSuccess[ii]['cc_id'], that.project_id, that.token.token).then(
                (res: any) => {
                  res.subscribe(
                    (some) => {
                      // console.log(some);
                      that.countSuccessPost = that.countSuccessPost + 1;
                      that.arrayExcelSuccess[ii]['estatus'] = some['message'];
                      that.arrayExcelSuccess[ii]['label'] = 'green';
                      that.refreshTableClientes();
                    },
                    (error) => {
                      console.log(<any>error);
                      that.countErrorPost = that.countErrorPost + 1;
                      that.arrayExcelSuccess[ii]['estatus'] = error['error']['message'];
                      that.arrayExcelSuccess[ii]['parametro'] = 0;
                      that.refreshTableClientes();
                    }
                  );
                }
              );
            } else {
              that.countJokerPost = that.countJokerPost + 1;
              that.refreshTableClientes();
            }
          }
        }
        loop();
        this.checkPost = false;
  }

  openDialogRollbackOrdenes(): void {
    const dialogRef = this.dialog.open(VehiculoOverviewDialog, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
     // console.log('The dialog was closed ' + result);

      if ( result === true ) {

        this.countErrorOrdenes = 0;
        this.countSuccessOrdenes = 0;
        this.countJokerOrdenes = 0;
        this.isLoadingResults = true;
        this.isRateLimitReached = true;
        this.msj_ordenes = 'eliminadas';

        this.deleteOrdenes();

      }

    });
  }

  deleteOrdenes(): any {

    const delay = (amount: number) => {
      return new Promise((resolve) => {
        setTimeout(resolve, amount);
      });
    };

    const that = this;

    async function loop() {

      for (let ii = 0; ii < that.arrayExcelSuccess.length; ii++) {

        const lastInsertedId: string = '' + that.arrayExcelSuccess[ii]['orden_id'];
        if ( lastInsertedId.trim().length > 0 && that.arrayExcelSuccess[ii]['parametro'] > 0) {

          await delay(that.forTime);

          that.dataService.deleteOrdenBD(that.arrayExcelSuccess[ii]['orden_id'], that.project_id, that.token.token).then(
            (res: any) => {
              res.subscribe(
                (some) => {
                  // console.log(some);
                  that.countSuccessOrdenes = that.countSuccessOrdenes + 1;
                  that.arrayExcelSuccess[ii]['estatus'] = some['message'];
                  that.arrayExcelSuccess[ii]['label'] = 'green';
                  that.refreshTableOdernes();
                },
                (error) => {
                  console.log(<any>error);
                  that.countErrorOrdenes = that.countErrorOrdenes + 1;
                  that.arrayExcelSuccess[ii]['estatus'] = error['error']['message'];
                  that.arrayExcelSuccess[ii]['label'] = 'red';
                  that.arrayExcelSuccess[ii]['parametro'] = 0;
                  that.refreshTableOdernes();
                }
              );
            }
          );

        } else {
          that.countJokerOrdenes = that.countJokerOrdenes + 1;
          that.refreshTableOdernes();
        }
      }
    }

    loop();

    this.checkOrdenes = false;
  }

  downloadErrorExcel() {
    const excelFileName = 'ErrorExcel';
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.arrayExcelError);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  downloadPickingExcel() {
    const excelFileName = 'PickingOca';
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.arrayExcelPicking);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  downloadPostErrorExcel() {
    const excelFileName = 'ErrorExcel';
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.arrayExcelErrorPost);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  resetAll() {

    this.file = null;
    this.bandera = false;
    this.nombreFile = null;
    this.firtsFormGroup.controls['confirmarCtrl'].setValue('');
    this.firtsFormGroup.controls['inputCtrl'].setValue('');
    this.secondFormGroup.controls['confirmarCli'].setValue('');
    this.dataSource = null;
    this.dataSourceClientes = null;
    this.show_table = false;
    this.countError = 0;
    this.countSuccess = 0;
    this.countErrorPost = 0;
    this.countSuccessPost = 0;
    this.countJokerPost = 0;
    this.countErrorOrdenes = 0;
    this.countJokerOrdenes = 0;
    this.countSuccessOrdenes = 0;
    this.checkPost = false;
    this.checkOrdenes = false;
    this.msj = '';
    this.msj_ordenes = '';
    this.arrayCarga = [];
    this.arrayExcel = [];
    this.arrayExcelSuccess = [];
    this.arrayExcelError = [];
    this.arrayExcelErrorPost = [];
    this.arrayExcelPicking = [];
    this.countExiste = 0;

  }
}

@Component({
  selector: 'app-vehiculo-overview-dialog',
  templateUrl: './vehiculo-overview-dialog.html',
})

// tslint:disable-next-line:component-class-suffix
export class VehiculoOverviewDialog {
  constructor(
    public dialogRef: MatDialogRef<VehiculoOverviewDialog>
    ) {}
}

