import { Component, OnInit , Inject, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import * as XLSX from 'xlsx';
import { DataService } from '../../services/data.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import * as FileSaver from 'file-saver';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { DateDialogComponent } from '../../components/date-dialog/date-dialog.component';

//SERVICES
import { UserService } from '../../services/user.service';
import { OrderserviceService } from '../../services/orderservice.service';

//MODEL
import { Service } from '../../models/Service';

//MOMENT
import * as _moment from 'moment';
const moment = _moment;


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

// CLIENTE EXISTE EN EL EXCEL DUPLICADO
// GENERAR ORDEN CON ID CLIENTE

@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.css']
})

// @Input() id : number;
export class ExcelComponent implements OnInit, OnChanges {

  public token;
  public services: Service[] = [];
  public project: string;
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
  
  
  project_id:number;
  servicename:string;


  arrayBuffer: any;
  file: File;
  nombreFile: string;

  usuarios: Array<Object> = [];
  tipoServicio: Array<Object> = [];
  tarifa: Array<Object> = [];
  constante: Array<Object> = [];
  giro: Array<Object> = [];
  sector: Array<Object> = [];
  zona: Array<Object> = [];
  mercado: Array<Object> = [];

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

  options: string[] = [ 'Número CC' ];
  toppings = new FormControl(this.options);


  toppingList: string[] = ['Nombre CC', 'Ruta', 'Calle', 'Número',
  'Block', 'Depto', 'Región', 'Provincia', 'Comuna', 'Medidor',
  'Modelo medidor', 'Tarifa', 'Constante', 'Giro', 'Zona', 'Sector', 'Mercado'];

  displayedColumns: string[] = ['cc_number', 'nombrecc', 'ruta', 'calle', 'numero',
  'block', 'depto', 'region', 'provincia', 'comuna', 'latitud', 'longitud', 'medidor',
  'modelo_medidor', 'tarifa', 'constante', 'giro', 'zona', 'sector', 'mercado', 'observacion',
  'order_number', 'tipo_servicio', 'asignado_a', 'required_date', 'observation', 'estatus'];

  dataSource = new MatTableDataSource();
  dataSourceClientes = new MatTableDataSource();
  dataSourceOrdenes = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorClientes') paginatorClientes: MatPaginator;
  @ViewChild('paginatorOrdenes') paginatorOrdenes: MatPaginator;
  @Output() ServicioSeleccionado: EventEmitter<string>;
  @Input() id : number;

  constructor(
    public dataService: DataService,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
   	private _userService: UserService,  
   	private _orderService: OrderserviceService
  ) {
    this.token = this._userService.getToken();
    this.ServicioSeleccionado = new EventEmitter(); 
  	/*
    this.activatedRoute.params.subscribe(
      params => this.service_id = params['id']
    );
    */

    const currentDate = new Date();

    this.firtsFormGroup = this._formBuilder.group({
      confirmarCtrl: ['', Validators.required],
      inputCtrl: ['', Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({
      confirmarCli: ['', Validators.required]
    });

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

    this.getTarifa(this.service_id);
    this.getConstante(this.service_id);
    this.getSector(this.service_id);
    this.getGiro(this.service_id);
    this.getZona(this.service_id);
    this.getMercado(this.service_id);
    this.getTipoServicio(this.service_id);
    this.getInspectores();
    */
	
  }


  ngOnChanges(changes: SimpleChanges) {
  	this.resetAll();
  	this.service_id = this.id;
    //this.dataSource.paginator = this.paginator;
    //this.dataSourceClientes.paginator = this.paginatorClientes;
    //this.dataSourceOrdenes.paginator = this.paginatorOrdenes;
    this.getServices(this.service_id);
    this.getTarifa(this.service_id);
    this.getConstante(this.service_id);
    this.getSector(this.service_id);
    this.getGiro(this.service_id);
    this.getZona(this.service_id);
    this.getMercado(this.service_id);
    this.getTipoServicio(this.service_id);


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

  incomingfile(event) {
  	this.file = null;
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
      disableClose: true,
      data: {
              dateend: null,
              title: 'Fecha de vencimiento'
            }
    });
    dialogRef.afterClosed().subscribe(result => {
    	console.log(result);

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

          if (this.arrayCarga.length > 501) {
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

            // ------------------ Cliente
            let cc_number: String = '' + valor['cc_number'];
            let nombrecc: String = '' + valor['nombrecc'];
            let ruta: String = '' + valor['ruta'];
            let calle: String = '' + valor['calle'];
            let numero: String = '' + valor['numero'];
            let block: String = '' + valor['block'];
            let depto: String = '' + valor['depto'];
            let region: String = '' + valor['region'];
            let provincia: String = '' + valor['provincia'];
            let comuna: String = '' + valor['comuna'];
            let medidor: String = '' + valor['medidor'];
            let modelo_medidor: String = '' + valor['modelo_medidor'];
            let observacion: String = '' + valor['observacion'];
            let tarifa: String = '' + valor['tarifa'];
            let id_tarifa: Number = 0;
            let constante: String = '' + valor['constante'];
            let id_constante: Number = 0;
            let giro: String = '' + valor['giro'];
            let id_giro: Number = 0;
            let zona: String = '' + valor['zona'];
            let id_zona: Number = 0;
            let sector: String = '' + valor['sector'];
            let id_sector: Number = 0;
            let mercado: String = '' + valor['mercado'];
            let id_mercado: Number = 0;
            let latitud: String = '' + '' + valor['latitud'];
            let longitud: String = '' + '' + valor['longitud'];
            // ------------------ Orden
            let order_number: String = '' + valor['order_number'];
            let tipo_servicio: String = '' + valor['tipo_servicio'];
            let servicetype_id: Number = 0;
            let asignado_a: String = '' + valor['asignado_a'];
            let assigned_to: Number = 0;
            let required_date: String = '' + valor['required_date'];
            let observation: String = '' + valor['observation'];

            // Validar campos

            if (cc_number === 'undefined' || cc_number.trim().length === 0) {
              cc_number = '';
              banderaJson = true;
              concatError = concatError + 'Cc_number; ';
            } else {
              cc_number = cc_number.trim();
            }

            if (nombrecc === 'undefined' || nombrecc.trim().length === 0) {
              nombrecc = '';
              banderaJson = true;
              concatError = concatError + 'Nombrecc; ';
            } else {
              const nombrecc_array: string[] = nombrecc.split(' ');
              nombrecc = '';
              for (let i = 0; i !== nombrecc_array.length; ++i) {
                if (nombrecc_array[i].trim().length > 0) {
                  nombrecc = nombrecc + nombrecc_array[i].trim() + ' ';
                }
              }
              nombrecc = nombrecc.trim();
            }

            if (ruta === 'undefined' || ruta.trim().length === 0) {
              ruta = '';
            } else {
              ruta = ruta.trim();
            }

            if (calle === 'undefined' || calle.trim().length === 0) {
              calle = '';
              banderaJson = true;
              concatError = concatError + 'Calle; ';
            } else {
              const calle_array: string[] = calle.split(' ');
              calle = '';
              for (let i = 0; i !== calle_array.length; ++i) {
                if (calle_array[i].trim().length > 0) {
                  calle = calle + calle_array[i].trim() + ' ';
                }
              }
              calle = calle.trim();
            }

            if (numero === 'undefined' || numero.trim().length === 0) {
              numero = '';
              banderaJson = true;
              concatError = concatError + 'Numero; ';
            } else {
              numero = numero.trim();
            }

            if (block === 'undefined' || block.trim().length === 0) {
              block = '';
            } else {
              block = block.trim();
            }

            if (depto === 'undefined' || depto.trim().length === 0) {
              depto = '';
            } else {
              depto = depto.trim();
            }

            if (region === 'undefined' || region.trim().length === 0) {
              region = '';
              banderaJson = true;
              concatError = concatError + 'Region; ';
            } else {
              region = region.trim();
            }

            if (provincia === 'undefined' || provincia.trim().length === 0) {
              provincia = '';
              banderaJson = true;
              concatError = concatError + 'Provincia; ';
            } else {
              provincia = provincia.trim();
            }

            if (comuna === 'undefined' || comuna.trim().length === 0) {
              comuna = '';
              banderaJson = true;
              concatError = concatError + 'Comuna; ';
            } else {
              comuna = comuna.trim();
            }

            // Medidor validación
            let checkboxMedidor = false;

            if (this.toppings !== undefined && this.toppings.value !== null) {
              const arrayItem: [] = this.toppings.value;
              for (let i = 0; i !== arrayItem.length; ++i) {

                if (arrayItem[i] === 'Medidor') {
                  checkboxMedidor = true;
                }
              }
            }

            if (medidor === 'undefined' || medidor.trim().length === 0) {
              medidor = '';
              if (checkboxMedidor) {
                banderaJson = true;
                concatError = concatError + 'Medidor; ';
              }
            } else {
              medidor = medidor.trim();
            }

            if (modelo_medidor === 'undefined' || modelo_medidor.trim().length === 0) {
              modelo_medidor = '';
            } else {
              modelo_medidor = modelo_medidor.trim();
            }

            if (observacion === 'undefined' || observacion.trim().length === 0) {
              observacion = 'S/N';
            } else {
              const observacion_array: string[] = observacion.split(' ');
              observacion = '';
              for (let i = 0; i !== observacion_array.length; ++i) {
                if (observacion_array[i].trim().length > 0) {
                  observacion = observacion + observacion_array[i].trim() + ' ';
                }
              }
              observacion = observacion.trim();
            }

            if (tarifa === 'undefined' || tarifa.trim().length === 0) {
              tarifa = '';
              } else {
                tarifa = tarifa.trim();
                const response: number = this.validarSelect(tarifa, this.tarifa);
                if (response > 0) {
                    id_tarifa = response;
                } else {
                  banderaJson = true;
                  concatError = concatError + 'Tarifa; ';
                }
            }

            if (constante === 'undefined' || constante.trim().length === 0) {
              constante = '';
              } else {
                constante = constante.trim();
                const response: number = this.validarSelect(constante, this.constante);
                if (response > 0) {
                    id_constante = response;
                } else {
                  banderaJson = true;
                  concatError = concatError + 'Constante; ';
                }
            }

            if (giro === 'undefined' || giro.trim().length === 0) {
              giro = '';
              } else {
                giro = giro.trim();
                const response: number = this.validarSelect(giro, this.giro);
                if (response > 0) {
                    id_giro = response;
                } else {
                  banderaJson = true;
                  concatError = concatError + 'Giro; ';
                }
            }

            if (zona === 'undefined' || zona.trim().length === 0) {
              zona = '';
              } else {
                zona = zona.trim();
                const response: number = this.validarSelect(zona, this.zona);
                if (response > 0) {
                    id_zona = response;
                } else {
                  banderaJson = true;
                  concatError = concatError + 'Zona; ';
                }
            }

            if (sector === 'undefined' || sector.trim().length === 0) {
              sector = '';
              } else {
                sector = sector.trim();
                const response: number = this.validarSelect(sector, this.sector);
                if (response > 0) {
                    id_sector = response;
                } else {
                  banderaJson = true;
                  concatError = concatError + 'Sector; ';
                }
            }

            if (mercado === 'undefined' || mercado.trim().length === 0) {
              mercado = '';
              } else {
                mercado = mercado.trim();
                const response: number = this.validarSelect(mercado, this.mercado);
                if (response > 0) {
                    id_mercado = response;
                } else {
                  banderaJson = true;
                  concatError = concatError + 'Mercado; ';
                }
            }

            if (latitud === 'undefined' || latitud.trim().length === 0) {
              latitud = 'S/N';
            } else {
              latitud = latitud.trim();
            }

            if (longitud === 'undefined' || longitud.trim().length === 0) {
              longitud = 'S/N';
            } else {
              longitud = longitud.trim();
            }

            // ----- ORDEN

            if (this.checkboxAuto) {
              const date: Date = new Date();
              const newDate = this.getDateFormar(date);
              const random = Math.floor((Math.random() * 100) + 1);
              order_number = newDate + '' + random + '' + indice;
            } else {
              if (order_number === 'undefined' || order_number.trim().length === 0) {
                order_number = '';
                banderaJson = true;
                concatError = concatError + 'N.Orden; ';
              } else {
                order_number = order_number.trim();
              }
            }

            if (tipo_servicio === 'undefined' || tipo_servicio.trim().length === 0) {
              tipo_servicio = '';
              concatError = concatError + 'Tipo servicio; ';
              banderaJson = true;
            } else {
              tipo_servicio = tipo_servicio.trim();
              const response: number = this.validarTipoServicio(tipo_servicio, this.tipoServicio);
              if ( response > 0) {
                  servicetype_id =  response;
              } else {
                concatError = concatError + 'Tipo servicio; ' ;
                banderaJson = true;
              }
            }

            if (asignado_a === 'undefined' || asignado_a.trim().length === 0) {
              asignado_a = '';
            } else {
              asignado_a = asignado_a.trim();
              const response: number = this.validarSelectUser(asignado_a, this.usuarios);
              if ( response > 0) {
                assigned_to =  response;
              } else {
                concatError = concatError + 'Asignado a; ' ;
                banderaJson = true;
              }
            }

            console.log(required_date);
            console.log(required_date.trim().length);

            if (required_date === 'undefined' || required_date.trim().length === 0) {
              console.log(required_date);
              required_date = '';
            } else {
              required_date = required_date.replace(/ /g, '');
              required_date = required_date.substring(0, 10) + ' ' + required_date.substring(10, required_date.length);
              if (required_date.match(/^[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]\ [0-2][0-9]\:[0-6][0-9]\:[0-6][0-9]$/)) {
              } else {
                concatError = concatError + 'Fecha requerida [0000-00-00 00:00:00]; ' ;
                banderaJson = true;
              }
            }

            if (observation === 'undefined' || observation.trim().length === 0) {
              observation = 'S/N';
            } else {
              const observation_array: string[] = observation.split(' ');
              observation = '';
              for (let i = 0; i !== observation_array.length; ++i) {
                if (observation_array[i].trim().length > 0) {
                  observation = observation + observation_array[i].trim() + ' ';
                }
              }
              observation = observation.trim();
            }

            let objectJson: object = {
              'cc_number': cc_number,
              'nombrecc': nombrecc,
              'ruta': ruta,
              'calle': calle,
              'numero': numero,
              'block': block,
              'depto': depto,
              'latitud': latitud,
              'longitud': longitud,
              'medidor': medidor,
              'modelo_medidor': modelo_medidor,
              'observacion': observacion,
              'region': region,
              'id_region': 0,
              'provincia': provincia,
              'id_provincia': 0,
              'comuna': comuna,
              'id_comuna': 0,
              'tarifa': tarifa,
              'id_tarifa': id_tarifa,
              'constante': constante,
              'id_constante': id_constante,
              'giro': giro,
              'id_giro': id_giro,
              'zona': zona,
              'id_zona': id_zona,
              'sector': sector,
              'id_sector': id_sector,
              'mercado': mercado,
              'id_mercado': id_mercado,
              'bandera': checkboxMedidor,
              'order_number': order_number,
              'service_id': this.service_id,
              'tipo_servicio': tipo_servicio,
              'servicetype_id': servicetype_id,
              'asignado_a': asignado_a,
              'assigned_to': assigned_to,
              'required_date': required_date,
              'observation': observation,
              'vencimiento_date': '',
              'label': '',
              'cc_id': '',
              'orden_id': '',
              'parametro': 0,
              'estatus': ''
            };

            if (this.dateend !== undefined) {
              //console.log(this.dateend.value);
        	  var newdateend = moment(this.dateend.value).format("YYYY-MM-DD HH:mm:ss");
              objectJson['vencimiento_date'] = newdateend;
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
              const link: String = 'searchcustomer/project/service/' +
              this.service_id + '?region=' + region + '&provincia=' + provincia +
               '&comuna=' + comuna;
              this.dataService.getValidateExisteCLiente(this.service_id, cc_number, medidor, checkboxMedidor, this.token.token).then(
                (res: any) => {
                  res.subscribe(
                    (some) => {
                      console.log(some['datos']);
                      if (some['datos'].length > 1) {
                        this.arrayExcel.push(objectJson);
                        this.arrayExcelError.push(objectJson);
                        this.countError = this.countError + 1;
                        this.refreshTable();
                      } else {
                        // console.log(some['datos'][0]['id']);
                        const obj: Object = {
                          'cc_id': some['datos'][0]['cc_id'],
                          'estatus': 'Cliente registrado',
                          'parametro': 1,
                          'label': 'green'
                        };
                        objectJson = Object.assign(objectJson, obj);
                        this.arrayExcel.push(objectJson);
                        this.arrayExcelSuccess.push(objectJson);
                        this.countSuccess = this.countSuccess + 1;
                        this.countExiste = this.countExiste + 1;
                        this.refreshTable();
                      }

                    },
                    (error) => {
                      console.log(<any>error);
                      if (error['error']['mensaje'] === 'no se encuentra cliente') {
                        this.dataService.getSearchcustomer(link, this.token.token).then(
                          (respuesta: any) => {
                            respuesta.subscribe(
                              (resSome) => {
                                const localidad: Object = {
                                  'id_region' : resSome['datos']['region_id'],
                                  'id_provincia' : resSome['datos']['provincia_id'],
                                  'id_comuna' : resSome['datos']['comuna_id'],
                                  'region' : resSome['datos']['region_name'],
                                  'provincia' : resSome['datos']['province_name'],
                                  'comuna' : resSome['datos']['commune_name'],
                                  'estatus' : 'Registro valido',
                                  'parametro': 2,
                                  'label': 'green'
                                  };
                                objectJson = Object.assign(objectJson, localidad);
                                this.countSuccess = this.countSuccess + 1;
                                this.arrayExcel.push(objectJson);
                                this.arrayExcelSuccess.push(objectJson);
                                this.refreshTable();
                              },
                              (resError) => {
                              	 //console.log(resError);
                                // console.log(<any>resError);
                                const estatus: Object = {
                                  'estatus' : 'Error: Campos Localidad',
                                  'label': 'red',
                                  'parametro': 0,
                                  };
                                objectJson = Object.assign(objectJson, estatus);
                                this.arrayExcel.push(objectJson);
                                this.arrayExcelError.push(objectJson);
                                this.countError = this.countError + 1;
                                this.refreshTable();
                              }
                            );
                          }
                        );
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

  getTipoServicio(id) {
    this.dataService.getTipoServicio(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            //console.log(some);
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
  getTarifa(id) {
    this.dataService.getTarifa(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.tarifa = some['datos']['tarifa'];
          },
          (error) => {
            // console.log(<any>error);
          }
        );
      }
    );
  }


   getServices(id){      
    this._orderService.getService(this.token.token, id).subscribe(
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


  getConstante(id) {
    this.dataService.getConstante(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.constante = some['datos']['constante'];
          },
          (error) => {
            // console.log(<any>error);
          }
        );
      }
    );
  }
  getGiro(id) {
    this.dataService.getGiro(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.giro = some['datos']['giro'];
          },
          (error) => {
            // console.log(<any>error);
          }
        );
      }
    );
  }
  getSector(id) {
    this.dataService.getSector(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.sector = some['datos']['sector'];
          },
          (error) => {
            // console.log(<any>error);
          }
        );
      }
    );
  }
  getZona(id) {
    this.dataService.getZona(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.zona = some['datos']['zona'];
          },
          (error) => {
            // console.log(<any>error);
          }
        );
      }
    );
  }
  getMercado(id) {
    this.dataService.getMercado(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.mercado = some['datos']['mercado'];
          },
          (error) => {
            // console.log(<any>error);
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

  validarSelectUser(termino: string, array_val: Array<object>) {
    let id = 0;
    if ( array_val.length > 0 ) {
      array_val.forEach(function(valor, indice, array) {
       if ( valor['usuario'].toLowerCase() === (termino).toLowerCase()) {
          id = valor['id'];
       }
      }, this);
    }
    return id;
  }

  validarSelect(termino: string, arrayObject: Array<object>) {
    let id = 0;
    if (arrayObject.length > 0) {
      arrayObject.forEach(function(valor, indice, array) {
       if (valor['descripcion'].toLowerCase() === (termino).toLowerCase()) {
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

applyFilterCliente(filterValue: string) {
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
        console.log(this.arrayExcel);

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

      // console.log(JSON.stringify(valor));

      if (this.arrayExcelSuccess[indice]['parametro'] === 2) {
        this.dataService.postDataBD(this.arrayExcelSuccess[indice], this.project_id, this.token.token).then(
          (res: any) => {
            res.subscribe(
              (some) => {
                console.log(some);
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
      } else {
        this.countJokerPost = this.countJokerPost + 1;
        this.refreshTableClientes();
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
                console.log(some);
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
    const dialogRef = this.dialog.open(DialogOverviewDialog, {
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
                    console.log(some);
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
    const dialogRef = this.dialog.open(DialogOverviewDialog, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed ' + result);

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
                    console.log(some);
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
    this.dateend = undefined; 

  }
}

@Component({
  selector: 'app-dialog-overview-dialog',
  templateUrl: './dialog-overview-dialog.html',
})

// tslint:disable-next-line:component-class-suffix
export class DialogOverviewDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewDialog>
    ) {}
}

