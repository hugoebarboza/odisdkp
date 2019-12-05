import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

// MOMENT
import * as _moment from 'moment';
const moment = _moment;


// MODELS
import {
  Color,
  Comuna,
  Constante,
  Customer,
  Giro,
  Marca,
  Mercado,
  Modelo,
  Provincia,
  Region,
  Sector,
  Service,
  Tarifa,
  Zona } from 'src/app/models/types';


// SERVICES
import { CountriesService, CustomerService, OrderserviceService, UserService } from 'src/app/services/service.index';

@Component({
  selector: 'app-addcustomer',
  templateUrl: './addcustomer.component.html',
  styleUrls: ['./addcustomer.component.css']
})

export class AddcustomerComponent implements OnInit, OnDestroy {

  public title: string;
  clavelectura = [];
  public identity: any;
  public token: any;
  public customer: Customer;
  public termino: string;
  public results: Object = [];
  public resultsprovincias: Object = [];
  public resultscomunas: Object = [];
  private services: Service[] = [];
  public region: Region;
  public provincia: Provincia;
  public comuna: Comuna;

  proyectos: any;
  public tarifas: Tarifa;
  public constantes: Constante;
  public giros: Giro;
  public sectores: Sector;
  public zonas: Zona;
  public mercados: Mercado;

  public marcas: Marca;
  public modelos: Modelo;
  public colors: Color;

  project_type: number;
  public project: string;
  proyecto: any;
  project_id: number;

  set = [];
  alimentador = [];
  sed = [];

  day = new Date().getDate();
  month = new Date().getMonth();
  year = new Date().getFullYear();
  hour = new Date().getHours();
  minutes = new Date().getMinutes();
  seconds = new Date().getSeconds();

  id: number;
  category_id: number;
  step = 0;
  en: any;

  subscription: Subscription;

  formControl = new FormControl('', [Validators.required]);

  constructor(
    private _userService: UserService,
    private _orderService: OrderserviceService,
    private _regionService: CountriesService,
    private _customerService: CustomerService,
    public dialogRef: MatDialogRef<AddcustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer
  ) {
    this.proyectos = this._userService.getProyectos();
    this.title = 'Agregar Cliente.';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.customer = new Customer('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, 0, 0, '', '', 0, '', '', '', '', '', '', '');
    this.id = this.data['service_id'];
    this.en = {
      firstDayOfWeek: 0,
      dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      // tslint:disable-next-line:max-line-length
      monthNames: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
      monthNamesShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
      today: 'Hoy',
      clear: 'Borrar'
    };
  }



  ngOnInit() {
    if (this.id && this.id > 0) {
      this.proyecto = this.filterProjectByService(this.id);
      // console.log(this.proyecto);
    }

    if (this.proyecto && this.proyecto.id > 0) {
      this.loadInfo(this.proyecto.id);
    }

  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Dato Requerido' : '';
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  onGenerarCliente() {
  const client = this.identity.sub + '' + this.day + '' + this.month + '' + this.year + '' + this.hour + '' + this.minutes + '' + this.seconds + '' + Math.round(Math.random() * 100 + 1);
  this.customer.cc_number = client;
  }

  filterProjectByService(id: number) {
    for (let i = 0; i < this.proyectos.length; i += 1) {
      const result = this.proyectos[i];
      if (result && result.service) {
        for (let y = 0; y < result.service.length; y += 1) {
          const response = result.service[y];
          if (response && response.id === id) {
            return result;
          }
        }
      }
    }
  }



  public loadInfo(id: number) {
                    this.subscription = this._regionService.getRegion(this.token.token, this.identity.country).subscribe(
                    response => {
                       if (response.status === 'success') {
                              this.region = response.datos.region;
                            } else {
                              this.region = null;
                            }
                     });

                    // GET SERVICE AND CATEGORY CLIENT
                    this.subscription = this._orderService.getService(this.token.token, this.id).subscribe(
                    response => {
                      if (response.status === 'success') {
                        this.services = response.datos;
                        this.category_id = this.services['projects_categories_customers']['id'];
                        this.project = this.services['project']['project_name'];
                        this.project_id = this.services['project']['id'];
                        this.project_type = response.datos.project.project_type;
                      }
                    });

                    // GET CLAVE LECTURA
                    this.subscription = this._customerService.getProjectClaveLectura(this.token.token, id).subscribe(
                      response => {
                              if (response.status === 'success') {
                                this.clavelectura = response.datos.clavelectura;
                              } else {
                                this.clavelectura = [];
                               // console.log(this.tarifa);
                              }
                            });


                    // GET SET
                    this.subscription = this._customerService.getProjectSet(this.token.token, id).subscribe(
                      response => {
                              if (response.status === 'success') {
                                this.set = response.datos.set;
                              } else {
                                this.set = [];
                               // console.log(this.tarifa);
                              }
                            });


                    // GET TARIFA
                    this.subscription = this._customerService.getTarifa(this.token.token, this.id).subscribe(
                    response => {
                            if (response.status === 'success') {
                              this.tarifas = response.datos.tarifa;
                            } else {
                              this.tarifas = null;
                             // console.log(this.tarifa);
                            }
                            });

                    // GET CONSTANTE
                    this.subscription = this._customerService.getConstante(this.token.token, this.id).subscribe(
                    response => {
                            if (response.status === 'success') {
                              this.constantes = response.datos.constante;
                            } else {
                              this.constantes = null;
                            }
                            });

                    // GET GIRO
                    this.subscription = this._customerService.getGiro(this.token.token, this.id).subscribe(
                    response => {
                            if (response.status === 'success') {
                              this.giros = response.datos.giro;
                            } else {
                              this.giros = null;
                            }
                            });

                    // GET SECTOR
                    this.subscription = this._customerService.getSector(this.token.token, this.id).subscribe(
                    response => {
                    if ( response.status === 'success') {
                      this.sectores = response.datos.sector;
                    } else {
                      this.sectores = null;
                    }
                    });

                    // GET ZONA
                    this.subscription = this._customerService.getZona(this.token.token, this.id).subscribe(
                    response => {
                    if (response.status === 'success') {
                      this.zonas = response.datos.zona;
                    } else {
                      this.zonas = null;
                    }
                    });

                    // GET MERCADO
                   this.subscription = this._customerService.getMercado(this.token.token, this.id).subscribe(
                    response => {
                            if (response.status === 'success') {
                              this.mercados = response.datos.mercado;
                            } else {
                              this.mercados = null;

                            }
                            });

                    // GET MARCA DE VEHICULOS
                   this.subscription = this._customerService.getMarca(this.token.token).subscribe(
                    response => {
                            if (response.status === 'success') {
                              this.marcas = response.marca;
                            } else {
                              this.marcas = null;

                            }
                            });


                    // GET COLORES DE VEHICULOS
                   this.subscription = this._customerService.getColor(this.token.token).subscribe(
                    response => {
                            if (response.status === 'success') {
                              this.colors = response.color;
                            } else {
                              this.colors = null;

                            }
                            });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }


  confirmAdd(_form: any) {

    if (this.customer.fecha_ultima_lectura) {
      const fecha_ultima_lectura = new FormControl(moment(this.customer.fecha_ultima_lectura).format('YYYY[-]MM[-]DD'));
      this.customer.fecha_ultima_lectura = fecha_ultima_lectura.value;
    }

    if (this.customer.fecha_ultima_deteccion) {
      const fecha_ultima_deteccion = new FormControl(moment(this.customer.fecha_ultima_deteccion).format('YYYY[-]MM[-]DD'));
      this.customer.fecha_ultima_deteccion = fecha_ultima_deteccion.value;
    }

    this._customerService.add(this.token.token, this.customer, this.category_id);
    this.dialogRef.close();
  }


    public searchCustomer(termino: string) {
     this.termino = termino.trim();
     if (this.termino.length > 2) {
       this.subscription = this._orderService.getCustomer(this.token.token, this.termino, this.category_id).subscribe(
        response => {
              if (!response) {
                return;
              }
              if (response.status === 'success') {
                this.results = response.datos;
              }
              });
      } else {
        this.results = null;
      }
   }

   onSelectRegion(regionid: number) {
     if (regionid > 0) {
       this.resultscomunas = null;
       this.subscription = this._regionService.getProvincia(this.token.token, regionid).subscribe(
        response => {
              if (!response) {
                return;
              }
              if (response.status === 'success') {
                this.resultsprovincias = response.datos.provincia;
                this.customer.id_provincia = null;
                this.customer.id_comuna = null;
              }
              });
      } else {
        this.resultsprovincias = null;
      }
   }

   onSelectProvincia(provinciaid: number) {
     if (provinciaid > 0) {
       this.subscription = this._regionService.getComuna(this.token.token, provinciaid).subscribe(
        response => {
              if (!response) {
                return;
              }
              if (response.status === 'success') {
                this.resultscomunas = response.datos.comuna;
                this.customer.id_comuna = null;
              }
              });
      } else {
        this.resultscomunas = null;
      }

   }

   onSelectComuna(_event: any) {
   // this.states = this._dataService.getStates().filter((item)=> item.countryid == countryid);
   }


   onSelectSet(id: number) {
    if (id > 0) {
      this.alimentador = [];
      this.subscription = this._customerService.getSetAlimentador(this.token.token, id).subscribe(
       response => {
             if (!response) {
               return;
             }
             if (response.status === 'success') {
               this.alimentador = response.datos.alimentador;
             }
             });
     } else {
       this.alimentador = [];
     }
  }


  onSelectAlimentador(id: number) {
    if (id > 0) {
      this.sed = [];
      this.subscription = this._customerService.getAlimentadorSed(this.token.token, id).subscribe(
       response => {
             if (!response) {
               return;
             }
             if (response.status === 'success') {
               this.sed = response.datos.sed;
             }
             });
     } else {
       this.sed = [];
     }
  }


  public loadSector() {
      this.subscription = this._customerService.getSector(this.token.token, this.id).subscribe(
      response => {
              if (response.status === 'success') {
                this.sectores = response.datos.sector;
              } else {
                this.sectores = null;
              }
              });
    }

   onSelectMarca(marcaid: number) {
     if (marcaid > 0) {
       this.subscription = this._customerService.getModelo(this.token.token, marcaid).subscribe(
        response => {
              if (!response) {
                return;
              }
              if (response.status === 'success') {
                this.modelos = response.datos;
              } else {
                this.modelos = null;
              }
              });
      } else {
        this.modelos = null;
      }
   }




}
