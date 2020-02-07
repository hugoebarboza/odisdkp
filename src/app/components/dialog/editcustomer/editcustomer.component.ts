import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators  } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs/Subscription';


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

// MOMENT
import * as _moment from 'moment';
const moment = _moment;


@Component({
  selector: 'app-editcustomer',
  templateUrl: './editcustomer.component.html',
  styleUrls: ['./editcustomer.component.css']
})
export class EditcustomerComponent implements OnInit, OnDestroy {

  public identity: any;
  clavelectura = [];
  formControl: any;
  public provincia: Provincia;
  project_type: number;
  public results: Object = [];
  public resultsprovincias: Object = [];
  public resultscomunas: Object = [];
  public region: Region;
  private services: Service[] = [];
  public title: string;
  public token: any;
  public termino: string;

  public comuna: Comuna;
  public customer: Customer[] = [];

  public tarifas: Tarifa;
  public constantes: Constante;
  public giros: Giro;
  public sectores: Sector;
  public zonas: Zona;
  public mercados: Mercado;

  public marcas: Marca;
  public modelos: Modelo;
  public colors: Color;

  proyecto: any;
  proyectos: any;
  public project: string;
  project_id: number;
  id: number;
  cc_id: number;
  category_id: number;
  step = 0;
  subscription: Subscription;

  set = [];
  alimentador = [];
  sed = [];


  constructor(
    // private _route: ActivatedRoute,
    // private _router: Router,
    private _userService: UserService,
    private _orderService: OrderserviceService,
    private _regionService: CountriesService,
    private _customerService: CustomerService,
    public dialogRef: MatDialogRef<EditcustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer
    ) {
    this.proyectos = this._userService.getProyectos();
    this.title = 'Editar Cliente.';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    // this.customer = new Customer('','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','');
    this.id = this.data['service_id'];
    this.category_id = this.data['category_id'];
    this.cc_id = this.data['cc_id'];
    // this.loadData();
  }

  ngOnInit() {
    this.formControl = new FormControl('', [Validators.required]);
    if (this.id && this.id > 0) {
      this.proyecto = this.filterProjectByService(this.id);
    }

    if (this.proyecto && this.proyecto.id > 0) {
      this.loadInfo(this.proyecto.id);
    }

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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


  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Dato Requerido' : '';
  }


  confirmUpdate(_form) {
    if (this.data.fecha_ultima_lectura) {
      const fecha_ultima_lectura = new FormControl(moment(this.data.fecha_ultima_lectura).format('YYYY[-]MM[-]DD'));
      this.data.fecha_ultima_lectura = fecha_ultima_lectura.value;
    }

    if (this.data.fecha_ultima_deteccion) {
      const fecha_ultima_deteccion = new FormControl(moment(this.data.fecha_ultima_deteccion).format('YYYY[-]MM[-]DD'));
      this.data.fecha_ultima_deteccion = fecha_ultima_deteccion.value;
    }

    this._customerService.update(this.token.token, this.data, this.category_id, this.cc_id);
    this.dialogRef.close();
  }


  public loadData(projectid: number) {
    if (projectid > 0) {
      this.subscription = this._customerService.getProjectCustomerDetail(this.token.token, projectid, this.cc_id).subscribe(
      response => {
         if (response.status === 'success') {
            this.customer = response.datos;
              for (let i = 0; i < this.customer.length; i++) {
                 if (this.customer) {
                   this.data['nombrecc'] = this.customer[i]['nombrecc'];
                   this.data['ruta'] = this.customer[i]['ruta'];
                   this.data['calle'] = this.customer[i]['calle'];
                   this.data['numero'] = this.customer[i]['numero'];
                   this.data['block'] = this.customer[i]['block'];
                   this.data['depto'] = this.customer[i]['depto'];
                   this.data['latitud'] = this.customer[i]['latitud'];
                   this.data['longitud'] = this.customer[i]['longitud'];
                   this.data['medidor'] = this.customer[i]['medidor'];
                   this.data['modelo_medidor'] = this.customer[i]['modelo_medidor'];
                   this.data['lectura'] = this.customer[i]['lectura'];
                   this.data['id_tarifa'] = this.customer[i]['id_tarifa'];
                   this.data['id_constante'] = this.customer[i]['id_constante'];
                   this.data['id_giro'] = this.customer[i]['id_giro'];
                   this.data['id_sector'] = this.customer[i]['id_sector'];
                   this.data['id_zona'] = this.customer[i]['id_zona'];
                   this.data['id_mercado'] = this.customer[i]['id_mercado'];
                   this.data['id_region'] = this.customer[i]['id_region'];
                   this.data['id_provincia'] = this.customer[i]['id_provincia'];
                   this.data['id_comuna'] = this.customer[i]['id_comuna'];
                   this.data['observacion'] = this.customer[i]['observacion'];
                   this.data['id_set'] = this.customer[i]['id_set'];
                   this.data['id_alimentador'] = this.customer[i]['id_alimentador'];
                   this.data['id_sed'] = this.customer[i]['id_sed'];
                   this.data['llave_circuito'] = this.customer[i]['llave_circuito'];
                   this.data['fase'] = this.customer[i]['fase'];
                   this.data['id_clavelectura'] = this.customer[i]['id_clavelectura'];
                   this.data['factor'] = this.customer[i]['factor'];

                   this.data['fecha_ultima_lectura'] = this.customer[i]['fecha_ultima_lectura'];
                   this.data['fecha_ultima_deteccion'] = this.customer[i]['fecha_ultima_deteccion'];
                   this.data['falta_ultimo_cnr'] = this.customer[i]['falta_ultimo_cnr'];

                   if (this.data['id_set'] > 0) {
                    this.onSelectSet(this.data['id_set']);
                   }

                   if (this.data['id_alimentador'] > 0) {
                    this.onSelectAlimentador(this.data['id_alimentador']);
                   }


                   if (this.data['id_region'] > 0) {
                    this.onSelectRegion(this.data['id_region']);
                   }
                   if (this.data['id_provincia'] > 0) {
                    this.onSelectProvincia(this.data['id_provincia']);
                   }

                   this.data['marca_id'] = this.customer[i]['marca_id'];
                   if (this.data['marca_id'] > 0) {
                    this.onSelectMarca(this.data['marca_id']);
                   }
                   this.data['modelo_id'] = this.customer[i]['modelo_id'];
                   this.data['color_id'] = this.customer[i]['color_id'];
                   this.data['patio'] = this.customer[i]['patio'];
                   this.data['espiga'] = this.customer[i]['espiga'];
                   this.data['posicion'] = this.customer[i]['posicion'];
                   this.data['embarque_id'] = this.customer[i]['embarque_id'];


                   break;
                 }
              }

         } else {
          if (response.status === 'error') {
          }
       }
      },
          error => {
          console.log(<any>error);
          }
      );
    }
  }


  public loadInfo(id: number) {
                    // GET REGIONES
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
                        this.loadData(this.project_id);
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
                              // console.log(this.tarifas);
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
                    if (response.status === 'success') {
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


  confirmAdd(_form) {
    // console.log(this.category_id);
    // this._customerService.edit(this.token.token, this.customer, this.category_id);
    this.dialogRef.close();
  }


  public searchCustomer(termino: string) {
     this.termino = termino;
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

   public onSelectRegion(regionid: number) {
     if (regionid > 0) {
       this.resultscomunas = null;
       this.subscription = this._regionService.getProvincia(this.token.token, regionid).subscribe(
        response => {
              if (!response) {
                return;
              }
              if (response.status === 'success') {
                this.resultsprovincias = response.datos.provincia;
              }
              });
      } else {
        this.resultsprovincias = null;
      }
   }

   public onSelectProvincia(provinciaid: number) {
     if (provinciaid > 0) {
      this.subscription = this._regionService.getComuna(this.token.token, provinciaid).subscribe(
        response => {
              if (!response) {
                return;
              }
              if (response.status === 'success') {
                this.resultscomunas = response.datos.comuna;
              }
              });
      } else {
        this.resultscomunas = null;
      }

   }

   onSelectComuna(_comunaid: number) {
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

   public onSelectMarca(marcaid: number) {
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
