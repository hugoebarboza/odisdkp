import { Component, OnInit , ViewChild, Input, OnDestroy, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import * as FileSaver from 'file-saver';
import {MatDialog, MatDialogRef} from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { DateDialogComponent } from '../../components/date-dialog/date-dialog.component';

// SERVICES
import { DataService, OrderserviceService, UserService } from 'src/app/services/service.index';

// MODEL
import { Service } from 'src/app/models/types';

// MOMENT
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

export class ExcelComponent implements OnInit, OnDestroy, OnChanges {

  forTime = 1200;
  identity: any;
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
  checkboxDupOt = false;

  project_id: number;
  servicename: string;

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

  set: Array<Object> = [];
  alimentador: Array<Object> = [];
  sed: Array<Object> = [];
  clavelectura: Array<Object> = [];

  country_id = 0;
  region: Array<Object> = [];
  provincia: Array<Object> = [];
  comuna: Array<Object> = [];

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
  // toppings = new FormControl(this.options);
  // toppingList: string[] = ['Medidor', 'Zona'];

  // tslint:disable-next-line:max-line-length
  // toppingList: string[] = ['Nombre CC', 'Ruta', 'Calle', 'Número',  'Block', 'Depto', 'Región', 'Provincia', 'Comuna', 'Medidor',  'Modelo medidor', 'Tarifa', 'Constante', 'Giro', 'Zona', 'Sector', 'Mercado'];

  displayedColumns: string[] = ['cc_number', 'nombrecc', 'ruta', 'calle', 'numero',
  'block', 'depto', 'region', 'provincia', 'comuna', 'latitud', 'longitud', 'medidor',
  'modelo_medidor', 'transformador', 'tarifa', 'constante', 'giro', 'zona', 'sector', 'mercado', 'observacion',
  'order_number', 'tipo_servicio', 'asignado_a', 'required_date', 'observation', 'set', 'alimentador', 'sed', 'clave_lectura', 'llave_circuito', 'fase', 'factor', 'fecha_ultima_lectura', 'fecha_ultima_deteccion', 'estatus'];

  dataSource = new MatTableDataSource();
  dataSourceClientes = new MatTableDataSource();
  dataSourceOrdenes = new MatTableDataSource();

  subscription: Subscription;

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
    // private activatedRoute: ActivatedRoute,
    private _userService: UserService,
    private _orderService: OrderserviceService
  ) {

    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.ServicioSeleccionado = new EventEmitter();

    // const currentDate = new Date();

    this.firtsFormGroup = this._formBuilder.group({
      confirmarCtrl: ['', Validators.required],
      inputCtrl: ['', Validators.required],
      inputDate: [{value: '', disabled: true}]
    });

    this.secondFormGroup = this._formBuilder.group({
      confirmarCli: ['', Validators.required]
    });

  }

  ngOnInit() {
  }

  ngOnChanges(_changes: SimpleChanges) {
    // console.log('onchange exceladdress');
    // console.log(this.table);
    this.resetAll();
    this.service_id = this.id;
    // this.dataSource.paginator = this.paginator;
    // this.dataSourceClientes.paginator = this.paginatorClientes;
    // this.dataSourceOrdenes.paginator = this.paginatorOrdenes;
    this.getServices(this.service_id);
    this.getTarifa(this.service_id);
    this.getConstante(this.service_id);
    this.getSector(this.service_id);
    this.getGiro(this.service_id);
    this.getZona(this.service_id);
    this.getMercado(this.service_id);
    this.getTipoServicio(this.service_id);

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
    // this.paginator = null;
    // this.paginatorClientes = null;

    if (this.file != null) {

      this.isRateLimitReached = true;
      this.isLoadingResults = true;
      this.show_table = true;

      const fileReader = new FileReader();

      fileReader.onload = () => {

        this.arrayBuffer = fileReader.result;
        const data = new Uint8Array(this.arrayBuffer);
        const arr = new Array();

        for (let i = 0; i !== data.length; ++i) {
          arr[i] = String.fromCharCode(data[i]);
        }

        const bstr = arr.join('');
        let workbook;
        try {
          workbook = XLSX.read(bstr, {type: 'binary'});
        } catch (e) {
          this.msj_snack = 'Error: Archivo Excel de carga';
          this.openSnackBar(this.msj_snack, 'Validar archivo');
          this.resetAll();
          return;
        }
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

            // ------------------ Cliente
            let cc_number: String = '' + that.arrayCarga[ii]['cc_number'];
            let nombrecc: String = '' + that.arrayCarga[ii]['nombrecc'];
            let ruta: String = '' + that.arrayCarga[ii]['ruta'];
            let calle: String = '' + that.arrayCarga[ii]['calle'];
            let numero: String = '' + that.arrayCarga[ii]['numero'];
            let block: String = '' + that.arrayCarga[ii]['block'];
            let depto: String = '' + that.arrayCarga[ii]['depto'];
            let region: String = '' + that.arrayCarga[ii]['region'];
            let id_region = 0;
            let provincia: String = '' + that.arrayCarga[ii]['provincia'];
            let id_provincia = 0;
            let comuna: String = '' + that.arrayCarga[ii]['comuna'];
            let id_comuna = 0;
            let medidor: String = '' + that.arrayCarga[ii]['medidor'];
            let modelo_medidor: String = '' + that.arrayCarga[ii]['modelo_medidor'];
            let transformador: String = '' + that.arrayCarga[ii]['transformador'];
            let leido_por: String = '' + that.arrayCarga[ii]['leido_por'];
            let observacion: String = '' + that.arrayCarga[ii]['observacion'];
            let tarifa: String = '' + that.arrayCarga[ii]['tarifa'];
            let id_tarifa: Number = 0;
            let constante: String = '' + that.arrayCarga[ii]['constante'];
            let id_constante: Number = 0;
            let giro: String = '' + that.arrayCarga[ii]['giro'];
            let id_giro: Number = 0;
            let zona: String = '' + that.arrayCarga[ii]['zona'];
            let id_zona: Number = 0;
            let sector: String = '' + that.arrayCarga[ii]['sector'];
            let id_sector: Number = 0;
            let mercado: String = '' + that.arrayCarga[ii]['mercado'];
            let id_mercado: Number = 0;
            let latitud: String = '' + '' + that.arrayCarga[ii]['latitud'];
            let longitud: String = '' + '' + that.arrayCarga[ii]['longitud'];
            // ------------------ Orden
            let order_number: String = '' + that.arrayCarga[ii]['order_number'];
            let tipo_servicio: String = '' + that.arrayCarga[ii]['tipo_servicio'];
            let servicetype_id: Number = 0;
            let asignado_a: String = '' + that.arrayCarga[ii]['asignado_a'];
            let assigned_to: Number = 0;
            let required_date: String = '' + that.arrayCarga[ii]['required_date'];
            let observation: String = '' + that.arrayCarga[ii]['observation'];
            let lectura: string = '' + that.arrayCarga[ii]['lectura'];

            // Campos Adicionales del Cliente
            let set: string = '' + that.arrayCarga[ii]['set'];
            let id_set: Number = 0;
            let alimentador: string = '' + that.arrayCarga[ii]['alimentador'];
            let id_alimentador: Number = 0;
            let sed: string = '' + that.arrayCarga[ii]['sed'];
            let id_sed: Number = 0;
            let clave_lectura: string = '' + that.arrayCarga[ii]['clave_lectura'];
            let id_clavelectura: Number = 0;
            let llave_circuito: string = '' + that.arrayCarga[ii]['llave_circuito'];
            let fase: string = '' + that.arrayCarga[ii]['fase'];
            let factor: string = '' + that.arrayCarga[ii]['factor'];
            let fecha_ultima_lectura: string = '' + that.arrayCarga[ii]['fecha_ultima_lectura'];
            let fecha_ultima_deteccion: string = '' + that.arrayCarga[ii]['fecha_ultima_deteccion'];
            let falta_ultimo_cnr: string = '' + that.arrayCarga[ii]['falta_ultimo_cnr'];

            if (set === 'undefined' || set.trim().length === 0) {
              set = '';
              alimentador = '';
              sed = '';
            } else {
              set = set.trim();
              const responseSet: any = that.validarSelectSed(set, that.set);
              if (responseSet) {
                id_set = responseSet.id;

                if (alimentador === 'undefined' || alimentador.trim().length === 0) {
                  alimentador = '';
                  sed = '';
                } else {
                  alimentador = alimentador.trim();
                  const resAlimnetador: any = that.validarSelectALimnetadorSed(alimentador, that.alimentador, id_set, 'id_set');
                  if (resAlimnetador) {
                    if (resAlimnetador.id_set === id_set) {
                      id_alimentador = resAlimnetador.id;

                      if (sed === 'undefined' || sed.trim().length === 0) {
                        sed = '';
                      } else {
                        sed = sed.trim();
                        const resSed: any = that.validarSelectALimnetadorSed(sed, that.sed, id_alimentador, 'id_alimentador');
                        if (resSed) {
                          if (resSed.id_alimentador === id_alimentador) {
                            id_sed = resSed.id;
                          } else {
                            banderaJson = true;
                            concatError = concatError + 'Sed no pertenece a Alimnetador ' + alimentador + '; ';
                          }
                        } else {
                          banderaJson = true;
                          concatError = concatError + 'Sed; ';
                        }
                      }

                    } else {
                      banderaJson = true;
                      concatError = concatError + 'Alimentador no pertenece a Set ' + set + '; ';
                    }

                  } else {
                    banderaJson = true;
                    concatError = concatError + 'Alimentador; ';
                  }
                }

              } else {
                banderaJson = true;
                concatError = concatError + 'Set; ';
              }
            }

            if (clave_lectura === 'undefined' || clave_lectura.trim().length === 0) {
              clave_lectura = '';
              } else {
                clave_lectura = clave_lectura.trim();
                const response: number = that.validarSelect(clave_lectura, that.clavelectura);
                if (response > 0) {
                  id_clavelectura = response;
                } else {
                  banderaJson = true;
                  concatError = concatError + 'Clave lectura; ';
                }
            }

            if (llave_circuito === 'undefined' || llave_circuito.trim().length === 0) {
              llave_circuito = '';
            } else {
              llave_circuito = llave_circuito.trim();
            }

            if (fase === 'undefined' || fase.trim().length === 0) {
              fase = '';
            } else {
              fase = fase.trim();
            }

            if (factor === 'undefined' || factor.trim().length === 0) {
              factor = '';
            } else {
              factor = factor.trim();
            }

            if (fecha_ultima_lectura === 'undefined' || fecha_ultima_lectura.trim().length === 0) {
              fecha_ultima_lectura = '';
            } else {
              // fecha_ultima_lectura = fecha_ultima_lectura.replace(/ /g, '');
              // fecha_ultima_lectura = fecha_ultima_lectura.substring(0, 10) + ' ' + fecha_ultima_lectura.substring(10, fecha_ultima_lectura.length);
              fecha_ultima_lectura = fecha_ultima_lectura.trim();
              if (fecha_ultima_lectura.match(/^[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]\ [0-2][0-9]\:[0-6][0-9]\:[0-6][0-9]$/) 
              || fecha_ultima_lectura.match(/^[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/)
              || fecha_ultima_lectura.match(/^[0-3][0-9]\-[0-1][0-9]\-[0-2][0-9][0-9][0-9]$/)) {

                if (fecha_ultima_lectura.match(/^[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/)) {
                  fecha_ultima_lectura = fecha_ultima_lectura + ' 00:00:00';
                }
                if (fecha_ultima_lectura.match(/^[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/)) {
                  let date = fecha_ultima_lectura;
                  date = date.substring(0, 1) + date.substring(4, 7) + date.substring(8, 10);
                  fecha_ultima_lectura = date + ' 00:00:00';
                }
              } else {
                concatError = concatError + 'Fecha ultima lectura error en formato (YYYY-MM-DD HH:MM:SS o YYYY-MM-DD o DD-MM-YYYY); ' ;
                banderaJson = true;
              }
            }

            if (fecha_ultima_deteccion === 'undefined' || fecha_ultima_deteccion.trim().length === 0) {
              fecha_ultima_deteccion = '';
            } else {
              // fecha_ultima_deteccion = fecha_ultima_deteccion.replace(/ /g, '');
              // fecha_ultima_deteccion = fecha_ultima_deteccion.substring(0, 10) + ' ' + fecha_ultima_deteccion.substring(10, fecha_ultima_deteccion.length);
              fecha_ultima_deteccion = fecha_ultima_deteccion.trim();
              if (fecha_ultima_deteccion.match(/^[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]\ [0-2][0-9]\:[0-6][0-9]\:[0-6][0-9]$/)
              || fecha_ultima_deteccion.match(/^[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/)
              || fecha_ultima_deteccion.match(/^[0-3][0-9]\-[0-1][0-9]\-[0-2][0-9][0-9][0-9]$/)) {
                if (fecha_ultima_deteccion.match(/^[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/)) {
                  fecha_ultima_deteccion = fecha_ultima_deteccion + ' 00:00:00';
                }
                if (fecha_ultima_deteccion.match(/^[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/)) {
                  let date = fecha_ultima_deteccion;
                  date = date.substring(0, 1) + date.substring(4, 7) + date.substring(8, 10);
                  fecha_ultima_deteccion = date + ' 00:00:00';
                }
              } else {
                concatError = concatError + 'Fecha ultima detección error en formato (YYYY-MM-DD HH:MM:SS o YYYY-MM-DD o DD-MM-YYYY); ' ;
                banderaJson = true;
              }
            }

            if (falta_ultimo_cnr === 'undefined' || falta_ultimo_cnr.trim().length === 0) {
              falta_ultimo_cnr = '';
            } else {
              falta_ultimo_cnr = falta_ultimo_cnr.trim();
            }

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

            if (region === 'undefined' || region.trim().length === 0 || provincia === 'undefined' || provincia.trim().length === 0 || comuna === 'undefined' || comuna.trim().length === 0) {
              region = '';
              banderaJson = true;
              concatError = concatError + 'Campos Región, Provincia o Comuna vacíos; ';
            } else {
              if (region === 'undefined' || region.trim().length === 0) {
                region = '';
                banderaJson = true;
                concatError = concatError + 'Region; ';
              } else {
                region = region.trim();
                region = that.eliminarDiacriticosEs(region);
                const resRegion: any = that.validarRegionProvinciaComuna(region, that.region, 'region_name', that.country_id, 'country_id');
                if (resRegion) {
                  id_region = resRegion.id;

                  if (provincia === 'undefined' || provincia.trim().length === 0) {
                    provincia = '';
                    banderaJson = true;
                    concatError = concatError + 'Provincia; ';
                  } else {
                    provincia = provincia.trim();
                    provincia = that.eliminarDiacriticosEs(provincia);
                    const resProvincia: any = that.validarRegionProvinciaComuna(provincia, that.provincia, 'province_name', id_region, 'region_id');
                    if (resProvincia) {
                      if (resProvincia.region_id === id_region) {
                        id_provincia = resProvincia.id;

                        if (comuna === 'undefined' || comuna.trim().length === 0) {
                          comuna = '';
                          banderaJson = true;
                          concatError = concatError + 'Comuna; ';
                        } else {
                          comuna = comuna.trim();
                          comuna = that.eliminarDiacriticosEs(comuna);
                          const resComuna: any = that.validarRegionProvinciaComuna(comuna, that.comuna, 'commune_name', id_provincia, 'province_id');
                          if (resComuna) {
                            if (resComuna.province_id === id_provincia) {
                              id_comuna = resComuna.id;
                            } else {
                              banderaJson = true;
                              concatError = concatError + 'Comuna no pertenece a provincia ' + provincia + '; ';
                            }
                          } else {
                            banderaJson = true;
                            concatError = concatError + 'Comuna; ';
                          }
                        }

                      } else {
                        banderaJson = true;
                        concatError = concatError + 'Provincia no pertenece a región ' + region + '; ';
                      }

                    } else {
                      banderaJson = true;
                      concatError = concatError + 'Provincia; ';
                    }
                  }

                } else {
                  banderaJson = true;
                  concatError = concatError + 'Región; ';
                }
              }
            }



            // Medidor validación
            /**
            let checkboxMedidor = false;
            let checkboxZona = false;

            if (that.toppings !== undefined && that.toppings.value !== null) {
              const arrayItem: [] = that.toppings.value;
              for (let i = 0; i !== arrayItem.length; ++i) {

                if (arrayItem[i] === 'Medidor') {
                  checkboxMedidor = true;
                }

                if (arrayItem[i] === 'Zona') {
                  checkboxZona = true;
                }
              }
            }*/

            if (medidor === 'undefined' || medidor.trim().length === 0) {
              medidor = '';
              /*if (checkboxMedidor) {
                banderaJson = true;
                concatError = concatError + 'Medidor; ';
              }*/
            } else {
              medidor = medidor.trim();
            }

            if (modelo_medidor === 'undefined' || modelo_medidor.trim().length === 0) {
              modelo_medidor = '';
            } else {
              modelo_medidor = modelo_medidor.trim();
            }

            if (transformador === 'undefined' || transformador.trim().length === 0) {
              transformador = '';
            } else {
              transformador =  transformador.trim();
            }

            if (lectura === 'undefined' || lectura.trim().length === 0) {
              lectura = '0';
            } else {
              // tslint:disable-next-line:radix
              if (isNaN(parseInt(lectura))) {
                banderaJson = true;
                concatError = concatError + 'Lectura invalida; ';
              } else {
                    // tslint:disable-next-line:radix
                    if (parseInt(lectura) % 1 === 0) {
                      // tslint:disable-next-line:radix
                      lectura = '' + parseInt(lectura);
                    } else {
                      console.log('Es un numero decimal');
                      banderaJson = true;
                      concatError = concatError + 'Lectura invalida; ';
                    }
              }
            }

            if (leido_por === 'undefined' || leido_por.trim().length === 0) {
              leido_por = '';
            } else {
              leido_por = leido_por.trim();
            }

            if (observacion === 'undefined' || observacion.trim().length === 0) {
              observacion = 'S/N';
            } else {
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

            if (tarifa === 'undefined' || tarifa.trim().length === 0) {
              tarifa = '';
              } else {
                tarifa = tarifa.trim();
                const response: number = that.validarSelect(tarifa, that.tarifa);
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
                const response: number = that.validarSelect(constante, that.constante);
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
                const response: number = that.validarSelect(giro, that.giro);
                if (response > 0) {
                    id_giro = response;
                } else {
                  banderaJson = true;
                  concatError = concatError + 'Giro; ';
                }
            }

            if (zona === 'undefined' || zona.trim().length === 0) {
              zona = '';
              /*
              if (checkboxZona) {
                banderaJson = true;
                concatError = concatError + 'Zona; ';
              }*/
            } else {
                zona = zona.trim();
                const response: number = that.validarSelect(zona, that.zona);
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
                const response: number = that.validarSelect(sector, that.sector);
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
                const response: number = that.validarSelect(mercado, that.mercado);
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

            if (that.checkboxAuto) {
              const date: Date = new Date();
              const newDate = that.getDateFormar(date);
              const random = Math.floor((Math.random() * 100) + 1);
              order_number = newDate + '' + random + '' + ii;
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
              const response: number = that.validarTipoServicio(tipo_servicio, that.tipoServicio);
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
              const response: number = that.validarSelectUser(asignado_a, that.usuarios);
              if ( response > 0) {
                assigned_to =  response;
              } else {
                concatError = concatError + 'Asignado a; ' ;
                banderaJson = true;
              }
            }

            if (required_date === 'undefined' || required_date.trim().length === 0) {
              required_date = '';
            } else {
              // required_date = required_date.replace(/ /g, '');
              // required_date = required_date.substring(0, 10) + ' ' + required_date.substring(10, required_date.length);
              required_date = required_date.trim();
              if (required_date.match(/^[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]\ [0-2][0-9]\:[0-6][0-9]\:[0-6][0-9]$/)
                  || required_date.match(/^[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/)
                  || required_date.match(/^[0-3][0-9]\-[0-1][0-9]\-[0-2][0-9][0-9][0-9]$/)) {

                if (required_date.match(/^[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/)) {
                  required_date = required_date + ' 00:00:00';
                }
                if (required_date.match(/^[0-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/)) {
                  let date = required_date;
                  date = date.substring(0, 1) + date.substring(4, 7) + date.substring(8, 10);
                  required_date = date + ' 00:00:00';
                }
              } else {
                concatError = concatError + 'Fecha requerida error en formato (YYYY-MM-DD HH:MM:SS o YYYY-MM-DD o DD-MM-YYYY); ' ;
                banderaJson = true;
              }
            }

            if (observation === 'undefined' || observation.trim().length === 0) {
              observation = 'S/N';
            } else {
              observation = observation.replace(/\&/g, 'Y');
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
              'transformador': transformador,
              'lectura': lectura,
              'leido_por': leido_por,
              'observacion': observacion,
              'region': region,
              'id_region': id_region,
              'provincia': provincia,
              'id_provincia': id_provincia,
              'comuna': comuna,
              'id_comuna': id_comuna,
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
              'bandera': true,
              'order_number': order_number,
              'service_id': that.service_id,
              'tipo_servicio': tipo_servicio,
              'servicetype_id': servicetype_id,
              'asignado_a': asignado_a,
              'assigned_to': assigned_to,
              'required_date': required_date,
              'observation': observation,
              'vencimiento_date': '',

              'set': set,
              'id_set': id_set,
              'alimentador': alimentador,
              'id_alimentador': id_alimentador,
              'sed': sed,
              'id_sed': id_sed,
              'clave_lectura': clave_lectura,
              'id_clavelectura': id_clavelectura,
              'llave_circuito': llave_circuito,
              'fase': fase,
              'factor': factor,
              'fecha_ultima_lectura': fecha_ultima_lectura,
              'fecha_ultima_deteccion': fecha_ultima_deteccion,

              'label': '',
              'cc_id': '',
              'orden_id': '',
              'parametro': 0,
              'estatus': '',
              'duplicar_ot': that.checkboxDupOt
            };

            if (that.dateend !== undefined) {
              // const newdateend = moment(that.dateend.value).format('YYYY-MM-DD');
              // objectJson['vencimiento_date'] = newdateend + ' 23:59:59';
              objectJson['vencimiento_date'] = that.dateend;
            }


            let carcaterespecial =  JSON.stringify(objectJson);

            carcaterespecial = carcaterespecial.replace(/#/g, '');
            carcaterespecial = carcaterespecial.replace(/¥/g, '');
            carcaterespecial = carcaterespecial.replace(/—/g, '');
            carcaterespecial = carcaterespecial.replace(/&/g, '');

            objectJson = JSON.parse(carcaterespecial);

            /**
            if (JSON.stringify(objectJson).search('#') !== -1 ) {
              banderaJson = true;
              concatError = concatError + ' Caracter especial [#] No permitido';
            }

            if (JSON.stringify(objectJson).search('¥') !== -1 ) {
              banderaJson = true;
              concatError = concatError + ' Caracter especial [¥] No permitido';
            }

            if (JSON.stringify(objectJson).search('—') !== -1 ) {
              banderaJson = true;
              concatError = concatError + ' Caracter especial [—] No permitido';
            }

            if (JSON.stringify(objectJson).search('&') !== -1 ) {
              banderaJson = true;
              concatError = concatError + ' Caracter especial [&] No permitido';
            }
            */

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

              /* const link: String = 'searchcustomer/project/service/' +
              that.service_id + '?region=' + region + '&provincia=' + provincia + '&comuna=' + comuna; */

               // tslint:disable-next-line:max-line-length
               that.dataService.getValidateExisteCLiente(that.service_id, cc_number, that.token.token, objectJson ).then(
                (res: any) => {
                  res.subscribe(
                    (some) => {
                      // console.log(some['datos']);
                      if (some['datos'].length > 1) {
                        const obj: Object = {
                          'estatus' : 'Error: Cliente duplicado',
                          'label': 'red',
                          'parametro': 0,
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
                          'estatus': 'Cliente registrado',
                          'parametro': 1,
                          'label': 'green'
                        };
                        objectJson = Object.assign(objectJson, obj);
                        that.arrayExcel.push(objectJson);
                        that.arrayExcelSuccess.push(objectJson);
                        that.countSuccess = that.countSuccess + 1;
                        that.countExiste = that.countExiste + 1;
                        that.refreshTable();
                      }

                    },
                    (error) => {
                      console.log(<any>error);
                      if (error['error']['mensaje'] === 'no se encuentra cliente') {
                        const localidad: Object = {
                          'estatus' : 'Registro valido',
                          'parametro': 2,
                          'label': 'green'
                          };
                        objectJson = Object.assign(objectJson, localidad);
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

  eliminarDiacriticosEs(texto) {
    texto = texto.toLowerCase();
    texto = texto.replace(/á/g, 'a');
    texto = texto.replace(/é/g, 'e');
    texto = texto.replace(/í/g, 'i');
    texto = texto.replace(/ó/g, 'o');
    texto = texto.replace(/ú/g, 'u');
    texto = texto.replace(/ñ/g, 'n');
    return texto;
  }

  checkAutoGenerar(event) {
    if (!event.checked) {
      this.checkboxAuto = false;
    } else {
      this.checkboxAuto = true;
    }
  }

  checkduplicatOt(event) {
    if (!event.checked) {
      this.checkboxDupOt = false;
    } else {
      this.checkboxDupOt = true;
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
          (_error) => {
            // console.log(<any>error);
          }
        );
      }
    );
  }

  getSetAlimentadorSed(project_id: number) {
    this.dataService.getSetAlimentadorSed(project_id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.set = some['set'];
            this.alimentador = some['alimentador'];
            this.sed = some['sed'];
          },
          (_error) => {
            // console.log(<any>error);
          }
        );
      }
    );
  }

  getRegionProvinciaComuna(country_id: number) {
    this.dataService.getRegionProvinciaComuna(country_id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            const regiontem =  JSON.stringify(some['region']);
            this.region = JSON.parse(this.eliminarDiacriticosEs(regiontem));
            const provinciatem =  JSON.stringify(some['provincia']);
            this.provincia = JSON.parse(this.eliminarDiacriticosEs(provinciatem));
            const comunatem =  JSON.stringify(some['comuna']);
            this.comuna = JSON.parse(this.eliminarDiacriticosEs(comunatem));
          },
          (_error) => {
            // console.log(<any>error);
          }
        );
      }
    );
  }

  getClaveLectura(project_id: number) {
    this.dataService.getClaveLectura(project_id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.clavelectura = some['datos']['clavelectura'];
          },
          (_error) => {
            // console.log(<any>error);
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
                this.country_id = this.services['project']['country_id'];
                if (this.project_id > 0) {
                  this.getInspectores();
                  this.getRegionProvinciaComuna(this.services['project']['country_id']);
                  this.getSetAlimentadorSed(this.project_id);
                  this.getClaveLectura(this.project_id);
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
          (_error) => {
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
          (_error) => {
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
          (_error) => {
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
          (_error) => {
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
          (_error) => {
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

  validarTipoServicio(termino: any, array_val: Array<object>) {
    let id = 0;
    if ( array_val.length > 0 ) {
      array_val.forEach(function(valor, _indice, _array) {
       if ( valor['name'].toLowerCase() === (termino).toLowerCase()) {
          id = valor['id'];
       }
      }, this);
    }
    return id;
  }

  validarSelectUser(termino: any, array_val: Array<object>) {
    let id = 0;
    if ( array_val.length > 0 ) {
      array_val.forEach(function(valor, _indice, _array) {
       if ( valor['usuario'].toLowerCase() === (termino).toLowerCase()) {
          id = valor['id'];
       }
      }, this);
    }
    return id;
  }

  validarSelect(termino: any, arrayObject: Array<object>) {
    let id = 0;
    if (arrayObject.length > 0) {
      arrayObject.forEach(function(valor, _indice, _array) {
       if (valor['descripcion'].toLowerCase() === (termino).toLowerCase()) {
          id = valor['id'];
       }
      }, this);
    }
    return id;
  }

  validarSelectSed(termino: any, arrayObject: Array<object>) {
    if (!termino) {
      return false;
    }
    let element: any;
    if (arrayObject.length > 0) {
      arrayObject.forEach(function(valor, _indice, _array) {
       if (valor['descripcion'].toLowerCase() === (termino).toLowerCase()) {
        element = valor;
       }
      }, this);
    }
    return element;
  }

  validarSelectALimnetadorSed(termino: any, arrayObject: Array<object>, id: Number, id_descripcion: string) {
    if (!termino) {
      return false;
    }
    let element: any;
    if (arrayObject.length > 0) {
      for (let i = 0; i < arrayObject.length; i++) {
        if (arrayObject[i][id_descripcion] === id && arrayObject[i]['descripcion'].toLowerCase() === (termino).toLowerCase()) {
          element = arrayObject[i];
          break;
        }
      }
    }
    return element;
  }

  validarRegionProvinciaComuna(termino: any, arrayObject: Array<object>, value: string, id: number, descId: string) {
    if (!termino) {
      return false;
    }
    let element: any;
    if (arrayObject.length > 0) {
      arrayObject.forEach(function(valor, _indice, _array) {
       if (valor[descId] === id && valor[value].toLowerCase() === (termino).toLowerCase()) {
        // console.log('------------------------------- ' + valor[value].toLowerCase() + ' - ' + (termino).toLowerCase());
        element = valor;
       }
      }, this);
    }
    return element;
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

  uploadExcelPost() { /// cluentes

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
        } else {
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

        await delay(that.forTime);

        that.arrayExcelSuccess[ii]['latitud'] = '';
        that.arrayExcelSuccess[ii]['longitud'] = '';
        if (that.arrayExcelSuccess[ii]['parametro'] !== 0) {
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
        } else {
          that.countErrorOrdenes = that.countErrorOrdenes + 1;
          that.refreshTableOdernes();
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
    const dialogRef = this.dialog.open(DialogOverviewDialog, {
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

        await delay(that.forTime);

        const lastInsertedId: string = '' +  that.arrayExcelSuccess[ii]['orden_id'];
        if ( lastInsertedId.trim().length > 0 &&  that.arrayExcelSuccess[ii]['parametro'] > 0) {
          that.dataService.deleteOrdenBD( that.arrayExcelSuccess[ii]['orden_id'], that.project_id, that.token.token).then(
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
    this.countExiste = 0;

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

