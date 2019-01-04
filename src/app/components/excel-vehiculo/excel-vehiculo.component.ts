import { Component, OnInit , ViewChild, Inject, Input, OnDestroy, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import * as XLSX from 'xlsx';
import { DataService } from '../../services/data.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import * as FileSaver from 'file-saver';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

//MODEL
import { Service } from '../../models/Service';

//SERVICES
import { UserService } from '../../services/user.service';
import { OrderserviceService } from '../../services/orderservice.service';
import { Subscription } from 'rxjs';

import { DateDialogComponent } from '../../components/date-dialog/date-dialog.component';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'app-excel-vehiculo',
  templateUrl: './excel-vehiculo.component.html',
  styleUrls: ['./excel-vehiculo.component.css']
})
export class ExcelVehiculoComponent implements OnInit, OnDestroy, OnChanges {

  private token;

  public services: Service[] = [];
  public project: string;
  project_id:number;
  servicename:string;
  service_id: number;


  dateend: any = undefined;

  firtsFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  isLoadingResults = false;
  isRateLimitReached = false;
  show_table = false;
  bandera = false;
  checkValidation = false;
  checkPost = false;
  checkValidationPost = false;
  checkboxAuto = false;
  checkOrdenes = false;

  checkboxUpdateVIN = false;
  checkboxRegistro = false;

  arrayBuffer: any;
  file: File;
  nombreFile: string;

  usuarios: Array<Object> = [];
  tipoServicio: Array<Object> = [];
  marca: Array<Object> = [];
  color: Array<Object> = [];

  arrayCarga: Array<String> = [];
  arrayExcel: Array<Object> = [];
  arrayExcelSuccess: Array<Object> = [];
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

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorClientes') paginatorClientes: MatPaginator;
  @ViewChild('paginatorOrdenes') paginatorOrdenes: MatPaginator;
  @Output() ServicioSeleccionado: EventEmitter<string>;
  @Input() id : number;
  @Input() table : string;

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
    this.resetAll();
  }


  ngOnDestroy(){
    //console.log('se va cerrar');
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

  getServices(id){      
    this.subscription = this._orderService.getService(this.token.token, id).subscribe(
    response => {
              if(!response){
                return;
              }
              if(response.status == 'success'){    
                this.services = response.datos; 
                this.servicename = this.services['service_name'];
                this.project = this.services['project']['project_name'];
                this.project_id = this.services['project']['id'];
                this.ServicioSeleccionado.emit(this.servicename);
                if(this.project_id > 0){
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
      this.checkValidation = false;
      this.dateend = undefined;
      this.resetAll();
    } else {
      this.nombreFile = this.file.name;
      this.bandera = true;
      this.openDialogDate();
    }
  }

  openDialogDate(): void {

    const dialogRef = this.dialog.open(DateDialogComponent, {
      width: '350px',
      data: {
              dateend: null,
              title: 'Fecha de vencimiento'
            }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result !== undefined) {
        this.dateend = new FormControl(result['dateend']);
      }

    });
  }

  public Upload() {

    this.arrayCarga = [];
    this.arrayExcel = [];
    this.arrayExcelSuccess = [];
    this.arrayExcelError = [];
    this.arrayExcelErrorPost = [];
    this.countError = 0;
    this.countSuccess = 0;
    this.countExiste = 0;
    this.dataSource = null;
    this.dataSourceClientes = null;
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

          this.arrayCarga.forEach(function(valor, indice, array) {

            let banderaJson: Boolean = false;
            let concatError = '';

            let cc_number: String = '' + valor['cc_number'];
            let marca: String = '' + valor['marca'];
            let marca_id: Number = 0;
            let descripcion: String = '' + valor['descripcion'];
            let color: String = '' + valor['color'];
            let color_id: Number = 0;
            let ubicacion: String = '' + valor['ubicacion'];
            let observacion: String = '' + valor['observacion'];
            // ------------------ Orden
            let order_number: String = '' + valor['order_number'];
            let tipo_servicio: String = '' + valor['tipo_servicio'];
            let servicetype_id: Number = 0;
            let asignado_a: String = '' + valor['asignado_a'];
            let assigned_to: Number = 0;
            let required_date: String = '' + valor['required_date'];
            let patio: string;
            let espiga: string;
            let posicion: string;
            let observacion_orden: String = '' + valor['observacion_orden'];

            // Validar campos
            if (cc_number === 'undefined' || cc_number.trim().length === 0) {
              cc_number = '';
              banderaJson = true;
              concatError = concatError + 'Cc_number; ';
            } else {
              cc_number = cc_number.trim();
            }

            if (marca === 'undefined' || marca.trim().length === 0) {
              marca = '';
              banderaJson = true;
              concatError = concatError + 'Marca; ';
            } else {
              marca = marca.trim();
              const response: number = this.validarSelect('title', marca, this.marca);
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
              // banderaJson = true;
              // concatError = concatError + 'Color; ';
            } else {
              color = color.trim();
              /**
              const color_array: string[] = color.split(' ');
              color = '';
              for (let i = 0; i !== color_array.length; ++i) {
                if (i === 0) {
                  color = color + color_array[i].trim();
                }
              }*/
              const response: number = this.validarSelect('title', color, this.color);
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
              observacion_orden = 'S/N';
            } else {
              observacion_orden = observacion_orden.replace(/\–/g, '-');
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

            if (!this.checkboxAuto) {
              if (order_number === 'undefined' || order_number.trim().length === 0) {
                order_number = '';
                if (!this.checkboxRegistro) {
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
              const newDate = this.getDateFormar(date);
              const random = Math.floor((Math.random() * 100) + 1);
              order_number = newDate + '' + random + '' + indice;
            }

            if (tipo_servicio === 'undefined' || tipo_servicio.trim().length === 0) {
              tipo_servicio = '';
              banderaJson = true;
              concatError = concatError + 'Tipo servicio; ';
            } else {
              tipo_servicio = tipo_servicio.trim();
              const response: number = this.validarTipoServicio(tipo_servicio, this.tipoServicio);
              if ( response > 0) {
                  servicetype_id = response;
              } else {
                concatError = concatError + 'Tipo servicio; ' ;
                banderaJson = true;
              }
            }

            if (asignado_a === 'undefined' || asignado_a.trim().length === 0) {
              asignado_a = '';
            } else {
              asignado_a = asignado_a.trim();
              const response: number = this.validarSelect('usuario', asignado_a, this.usuarios);
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
                required_date = required_date + '11:59:59';
              } else {
                concatError = concatError + 'Fecha requerida; ' ;
                banderaJson = true;
              }
            }


            if (ubicacion === 'undefined'  && ubicacion.trim().length === 0) {
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
              'bandera': this.checkboxMedidor,
              'order_number': order_number,
              'service_id': this.service_id,
              'tipo_servicio': tipo_servicio,
              'servicetype_id': servicetype_id,
              'asignado_a': asignado_a,
              'assigned_to': assigned_to,
              'required_date': required_date,
              'observation': observacion_orden,
              'ubicacion': patio + '-' + espiga + '-' + posicion,
              'vencimiento_date': '',
              'label': '',
              'cc_id': '',
              'id': '',
              'orden_id': '',
              'parametro': 0,
              'estatus': ''
            };

            if (this.dateend !== undefined) {
              objectJson['vencimiento_date'] = this.dateend;
            }

            if (banderaJson) {
              const success: Object = {
                'estatus' : 'Error en registro: ' + concatError,
                'label': 'red',
                'parametro': 0
              };
              objectJson = Object.assign(objectJson, success);
              this.arrayExcel.push(objectJson);
              this.arrayExcelError.push(objectJson);
              this.countError = this.countError + 1;
              this.refreshTable();
            } else {
              this.dataService.getValidateExisteCLiente(this.service_id, cc_number, '', false, this.token.token).then(
                (res: any) => {
                  res.subscribe(
                    (some) => {
                      //console.log(some['datos']);
                      if (some['datos'].length > 1) {
                        const obj: Object = {
                          'estatus' : 'Error: Cliente Duplicado',
                          'label': 'red',
                          'parametro': 0
                        };
                        objectJson = Object.assign(objectJson, obj);
                        this.arrayExcel.push(objectJson);
                        this.arrayExcelError.push(objectJson);
                        this.countError = this.countError + 1;
                        this.refreshTable();
                      } else {
                        // console.log(some['datos'][0]['id']);
                        const obj: Object = {
                          'cc_id': some['datos'][0]['cc_id'],
                          'estatus': 'VIN registrado',
                          'parametro': 1,
                          'label': 'green'
                        };
                        objectJson = Object.assign(objectJson, obj);
                        this.arrayExcel.push(objectJson);
                        this.arrayExcelSuccess.push(objectJson);
                        this.countSuccess = this.countSuccess + 1;
                        // this.countExiste = this.countExiste + 1;
                        this.refreshTable();
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
                        this.countSuccess = this.countSuccess + 1;
                        this.arrayExcel.push(objectJson);
                        this.arrayExcelSuccess.push(objectJson);
                        this.refreshTable();
                      }

                    }
                  );
                }
              );
            }
          }, this);
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
            //console.log(some);
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
            //console.log(some);
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

  getDateFormar(date: Date) {
    const dia = date.getDate();
    const mes = date.getMonth() + 1;
    const year = date.getFullYear();
    const minutos = date.getMinutes();
    const segundos = date.getSeconds();
    const milisegundos = date.getMilliseconds();
    return dia + '' + mes + '' + year + '' + minutos + '' + segundos + '' + milisegundos;
  }

  validarTipoServicio(termino: string, array_val: Array<object>) {
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

  validarSelect(key: string, termino: string, arrayObject: Array<object>) {
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
        //console.log(this.arrayExcel);

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

  uploadExcelPost() {

    this.countErrorPost = 0;
    this.countSuccessPost = 0;
    this.countJokerPost = 0;
    this.isLoadingResults = true;
    this.isRateLimitReached = true;
    this.checkPost = true;
    this.msj = 'registrados';

    this.arrayExcelSuccess.forEach(function(valor, indice, array) {

      //console.log(JSON.stringify(valor));

      if (this.arrayExcelSuccess[indice]['parametro'] === 2) {
        this.dataService.postDataBD(this.arrayExcelSuccess[indice], this.project_id, this.token.token).then(
          (res: any) => {
            res.subscribe(
              (some) => {
                //console.log(some);
                this.countSuccessPost = this.countSuccessPost + 1;
                this.arrayExcelSuccess[indice]['estatus'] = some['message'];
                this.arrayExcelSuccess[indice]['label'] = 'green';
                this.arrayExcelSuccess[indice]['cc_id'] = some['lastInsertedId'];
                this.refreshTableClientes();
              },
              (error) => {
                console.log(<any>error);
                this.countErrorPost = this.countErrorPost + 1;
                this.arrayExcelSuccess[indice]['estatus'] = error['error']['message'];
                this.arrayExcelErrorPost.push(this.arrayExcelSuccess[indice]);
                this.arrayExcelSuccess[indice]['label'] = 'red';
                this.arrayExcelSuccess[indice]['parametro'] = 0;
                this.refreshTableClientes();
              }
            );
          }
        );
      }

      if (this.checkboxUpdateVIN && this.arrayExcelSuccess[indice]['parametro'] === 1) {
        // tslint:disable-next-line:max-line-length
        const rutalink: string = '/marca/' + this.arrayExcelSuccess[indice]['marca_id']  + '/vehiculo/' + this.arrayExcelSuccess[indice]['cc_id'] ;
        this.dataService.putDataBD(rutalink, this.arrayExcelSuccess[indice], this.project_id, this.token.token).then(
          (res: any) => {
            res.subscribe(
              (some) => {
                //console.log(some);
                this.countSuccessPost = this.countSuccessPost + 1;
                this.arrayExcelSuccess[indice]['estatus'] = some['mensaje'];
                this.arrayExcelSuccess[indice]['label'] = 'green';
                this.refreshTableClientes();
              },
              (error) => {
                console.log(<any>error);
                console.log('Error put');
                this.countErrorPost = this.countErrorPost + 1;
                this.arrayExcelSuccess[indice]['estatus'] = error['error']['message'];
                this.arrayExcelErrorPost.push(this.arrayExcelSuccess[indice]);
                this.arrayExcelSuccess[indice]['label'] = 'red';
                this.arrayExcelSuccess[indice]['parametro'] = 0;
                this.refreshTableClientes();
              }
            );
          }
        );
      }

      if (!this.checkboxUpdateVIN && this.arrayExcelSuccess[indice]['parametro'] === 1) {
        this.countSuccessPost = this.countSuccessPost + 1;
        this.refreshTableClientes();
      } else {
        if ((this.arrayExcelSuccess[indice]['parametro'] !== 1 && this.arrayExcelSuccess[indice]['parametro'] !== 2)
            || this.checkboxUpdateVIN  === false ) {
          this.countJokerPost = this.countJokerPost + 1;
          this.refreshTableClientes();
        }
      }

    }, this);

  }

  uploadExcelPostOrdenes() {

    this.countErrorOrdenes = 0;
    this.countSuccessOrdenes = 0;
    this.countJokerOrdenes = 0;
    this.isLoadingResults = true;
    this.isRateLimitReached = true;
    this.checkOrdenes = true;
    this.msj_ordenes = 'registradas';

    this.arrayExcelSuccess.forEach(function(valor, indice, array) {
      // console.log(JSON.stringify(valor));
      this.arrayExcelSuccess[indice]['latitud'] = '';
      this.arrayExcelSuccess[indice]['longitud'] = '';
      // console.log(JSON.stringify(valor));

      if (this.arrayExcelSuccess[indice]['parametro'] !== 0) {
        this.dataService.postOrder(this.arrayExcelSuccess[indice], this.project_id, this.token.token).then(
          (res: any) => {
            res.subscribe(
              (some) => {
                //console.log(some);
                this.countSuccessOrdenes = this.countSuccessOrdenes + 1;
                this.arrayExcelSuccess[indice]['estatus'] = some['message'];
                this.arrayExcelSuccess[indice]['label'] = 'green';
                this.arrayExcelSuccess[indice]['orden_id'] = some['lastInsertedId'];
                this.refreshTableOdernes();
              },
              (error) => {
                console.log(<any>error);
                this.countErrorOrdenes = this.countErrorOrdenes + 1;
                this.arrayExcelSuccess[indice]['estatus'] = error['error']['message'];
                this.arrayExcelErrorPost.push(this.arrayExcelSuccess[indice]);
                this.arrayExcelSuccess[indice]['label'] = 'red';
                this.arrayExcelSuccess[indice]['parametro'] = 0;
                this.refreshTableOdernes();
              }
            );
          }
        );
      }

    }, this);

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

        this.arrayExcelSuccess.forEach(function(valor, indice, array) {
          const id: string = '' + valor['cc_id'];
          if (id.trim().length > 0  && valor['parametro']  === 2) {
            this.dataService.deleteCustomer(valor['cc_id'], this.project_id, this.token.token).then(
              (res: any) => {
                res.subscribe(
                  (some) => {
                    //console.log(some);
                    this.countSuccessPost = this.countSuccessPost + 1;
                    this.arrayExcelSuccess[indice]['estatus'] = some['message'];
                    this.arrayExcelSuccess[indice]['label'] = 'green';
                    this.refreshTableClientes();
                  },
                  (error) => {
                    console.log(<any>error);
                    this.countErrorPost = this.countErrorPost + 1;
                    this.arrayExcelSuccess[indice]['estatus'] = error['error']['message'];
                    this.arrayExcelSuccess[indice]['parametro'] = 0;
                    this.refreshTableClientes();
                  }
                );
              }
            );
          } else {
            this.countJokerPost = this.countJokerPost + 1;
            this.refreshTableClientes();
          }
        }, this);
        this.checkPost = false;
      }
    });
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

        this.arrayExcelSuccess.forEach(function(valor, indice, array) {

          const lastInsertedId: string = '' + valor['orden_id'];
          if ( lastInsertedId.trim().length > 0 && valor['parametro'] > 0) {
            this.dataService.deleteOrdenBD(valor['orden_id'], this.project_id, this.token.token).then(
              (res: any) => {
                res.subscribe(
                  (some) => {
                    //console.log(some);
                    this.countSuccessOrdenes = this.countSuccessOrdenes + 1;
                    this.arrayExcelSuccess[indice]['estatus'] = some['message'];
                    this.arrayExcelSuccess[indice]['label'] = 'green';
                    this.refreshTableOdernes();
                  },
                  (error) => {
                    console.log(<any>error);
                    this.countErrorOrdenes = this.countErrorOrdenes + 1;
                    this.arrayExcelSuccess[indice]['estatus'] = error['error']['message'];
                    this.arrayExcelSuccess[indice]['label'] = 'red';
                    this.arrayExcelSuccess[indice]['parametro'] = 0;
                    this.refreshTableOdernes();
                  }
                );
              }
            );

          } else {
            this.countJokerOrdenes = this.countJokerOrdenes + 1;
            this.refreshTableOdernes();
          }

        }, this);

        this.checkOrdenes = false;
      }

    });
  }

  downloadErrorExcel() {
    const excelFileName = 'ErrorExcel';
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.arrayExcelError);
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

