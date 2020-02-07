import { Component, OnInit, OnDestroy, Inject } from '@angular/core';

import { Router } from '@angular/router';
import { FormControl, Validators} from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import Swal from 'sweetalert2';
// FIREBASE

import { AngularFireAuth } from '@angular/fire/auth';

// MOMENT
import * as _moment from 'moment';
const moment = _moment;

// SERVICES
import { CdfService, OrderserviceService, ProjectsService, UserService, CustomerService, DataService } from 'src/app/services/service.index';

// MODELS
import { Order, Service, ServiceType, ServiceEstatus, User, UserFirebase } from 'src/app/models/types';

@Component({
  selector: 'app-clonar-ot',
  templateUrl: './clonar-ot.component.html',
  styleUrls: ['./clonar-ot.component.css']
})
export class ClonarOtComponent implements OnInit, OnDestroy  {

  active: Boolean = true;
  title: string;
  identity;
  created: FormControl;
  destinatario = [];
  kpi: Number = 0;
  serviceid: Number = 0;
  servicetype_id: Number = 0;
  public token;
  public services: Service[] = [];
  public project: string;
  public servicetype: ServiceType[] = [];
  public serviceestatus: ServiceEstatus[] = [];
  public users: User[] = [];
  equipos: Array<Object> = [];
  public servicename;
  public projectname;
  public order: Order[] = [];
  public termino: string;
  public results: Object = [];
  public sub: any;
  public service_id: number;
  public show: Boolean = false;
  // public pila: Object = [];
  public pila = [];
  public myArray = [];
  public myDate: any;
  service_name: string;
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2077, 0, 1);
  loading: boolean;
  isOrderLoading: boolean;
  index: number;
  id: number;
  project_id: number;
  category_id: number;
  customer_id: number;
  en: any;
  value: Date;
  atributo = new Array();
  orderatributo = new Array();
  role: number;
  route: String = '';
  subscription: Subscription;
  userFirebase: UserFirebase;

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  clientInfo: object;
  client_loading = false;

  data: any = {};

  constructor(
    private _cdf: CdfService,
    public _dataService: DataService,
    private _orderService: OrderserviceService,
    private _projectService: ProjectsService,
    private _route: Router,
    private _userService: UserService,
    private _customerService: CustomerService,
    public dialogRef: MatDialogRef<ClonarOtComponent>,
    private firebaseAuth: AngularFireAuth,
    @Inject(MAT_DIALOG_DATA) public infodata: any

  ) {

    this.created =  new FormControl(moment().format('YYYY[-]MM[-]DD HH:mm:ss'));
    this.title = 'Clonar Orden N.';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this._userService.handleAuthentication(this.identity, this.token);
    this.role = this._userService.identity.role;
    this.serviceid = this.infodata.service_id;

    this.firebaseAuth.authState.subscribe(
      (auth) => {
        if (auth) {
          this.userFirebase = auth;
        }
    });

    this.route = this._route.url.split('?')[0];

    if (this.token.token != null) {
       this.loadData();
    }

  }

  ngOnInit() {
    this.category_id = this.infodata['category_id'];
    this.loadService();
    this.loadServiceType();
    this.loadServiceEstatus();
    this.en = {
            firstDayOfWeek: 0,
            dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: [ 'January', 'February', 'March', 'April', 'May', 'June',
             'July', 'August', 'September', 'October', 'November', 'December' ],
            monthNamesShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
            value: new Date(),
            today: 'Hoy',
            clear: 'Borrar'
        };

  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  submit() {
    // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    // console.log('La página se va a cerrar');
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  confirmClonar(): void {

    let j = 0;

    if (this.data.observation) {
      this.data.observation = this.data.observation.replace(/[\s\n]/g, ' ');
    }

    for (let i = 0; i < this.atributo.length; i++) {

      if (this.atributo[i]['type'] !== 'label' || this.atributo[i]['type'] !== 'layout_line') {

        if (this.orderatributo.length > 0) {

          for (let ii = 0; ii < this.orderatributo.length; ii++) {

            if (this.atributo[i]['id'] === this.orderatributo[ii]['atributo_id']) {

              let valorpila = this.orderatributo[ii]['valor'];

              // tslint:disable-next-line:max-line-length
              if ( !valorpila || valorpila === null  || (typeof valorpila === 'undefined') || valorpila === '' || valorpila === ' ') {
                  this.pila[j] = { id: this.atributo[i]['id'], value: 'S/N' };
                  j++;
              } else {

                if (this.atributo[i]['type'] === 'date') {
                  const newDate = moment(valorpila, 'DD/MM/YYYY');
                  const day = newDate.date() ;
                  const month = newDate.month() + 1;
                  const year = newDate.year();
                  let d: String = '';
                  let m: String = '';

                  if (day < 10) {
                    d = '0' + day;
                  } else { d = '' + day; }
                  if (month < 10) {
                    m = '0' + month;
                  } else { m = '' + month; }
                  const date =  d + '/' + m + '/' + year;
                  valorpila = date;
                }
                if (this.atributo[i]['type'] === 'chip') {
                  valorpila = JSON.stringify(valorpila);
                }
                this.pila[j] = { id: this.atributo[i]['id'], value: valorpila };
                j++;
              }
            }

          }

        } else {

          let valorpila = this.atributo[i]['datopila'];

          // tslint:disable-next-line:max-line-length
          if ( !valorpila || valorpila === null  || (typeof valorpila === 'undefined') || valorpila === '' || valorpila === ' ') {
              this.pila[j] = { id: this.atributo[i]['id'], value: 'S/N' };
              j++;
          } else {
            if (this.atributo[i]['type'] === 'date') {
              const newDate = moment(valorpila, 'DD/MM/YYYY');
              const day = newDate.date() ;
              const month = newDate.month() + 1;
              const year = newDate.year();
              const date =  day + '/' + month + '/' + year;
              valorpila = date;
            }
            if (this.atributo[i]['type'] === 'chip') {
              valorpila = JSON.stringify(valorpila);
            }
            this.pila[j] = { id: this.atributo[i]['id'], value: valorpila };
            j++;
          }

        }

      }

    }

    const objPila = {
      pila: this.pila,
      duplicar_ot: true
    };
    const obj = Object.assign(this.data, objPila);
    // console.log(obj);
    this._orderService.add(this.token.token, obj, this.category_id).subscribe(
      response => {
        if (!response) {
          this.isOrderLoading = false;
          return;
        }
        if (response.status === 'success') {
          Swal.fire('Clonada Orden de Trabajo: ', this.data.order_number + ' exitosamente.', 'success' );
        } else {
          Swal.fire('N. Orden de Trabajo: ', this.data.order_number + ' no fue posible clonarla.' , 'error');
        }
      },
      error => {
        console.log(<any>error);
        Swal.fire('No fue posible procesar su solicitud', error.error.message, 'error');
      }
    );

   if (this.destinatario.length > 0)  {
    this.sendCdf(this.destinatario);
   }
  }

  public loadAtributo(event: any) {
    if (event > 0) {
    this.show = true;
    this.isOrderLoading = true;
    this.subscription = this._orderService.getAtributoServiceType(this.token.token, event).subscribe(
    response => {

              if (!response) {
                this.isOrderLoading = false;
                return;
              }
              if (response.status === 'success') {
                const atributotem = response.datos;

                if (atributotem.length > 0) {
                  atributotem.forEach(element => {
                    if (element.type === 'chip') {
                      element.datos = JSON.parse(element.datos);
                      element.datos = element.datos.chip;
                      element.datos.forEach(elemento => {
                        elemento.descripcion = elemento.value;
                        elemento.value = false;
                      });
                      element.datopila = element.datos;
                    }
                    // tslint:disable-next-line:max-line-length
                    if (element.type !== 'chip' && element.type !== 'label' && element.type !== 'layout_line' && element.type !== 'spinner' && element.type !== 'radio') {
                      element.datopila = element.datos;
                    }
                  });
                }

                this.orderatributo = [];
                this.atributo = atributotem;
                // console.log(this.atributo);

                this.isOrderLoading = false;
              }
              },
          error => {
          this.isOrderLoading = false;
          console.log(<any>error);
          });
    }

  }

  sendCdf(data) {
    if (!data) {
      return;
    }

    // tslint:disable-next-line:max-line-length
    const body = 'Edición de orden en Proyecto: ' + this.project + ', Servicio: ' + this.service_name + ', con Orden N.: ' + this.data.order_number + ' y, Observación: ' + this.data.observation;

    if (this.destinatario.length > 0 && this.userFirebase.uid) {
      for (const d of data) {

        const notification = {
          userId: this.userFirebase.uid,
          userIdTo: d.id,
          title: 'Edición de orden de trabajo',
          message: body,
          create_at: this.created.value,
          status: '1',
          idUx: this.data.order_number,
          descriptionidUx: 'bd',
          routeidUx: `${this.route}`
        };

        this._cdf.fcmsend(this.token.token, notification).subscribe(
          response => {
            if (!response) {
            return false;
            }
            if (response.status === 200) {
              // console.log(response);
            }
          },
            error => {
            console.log(<any>error);
            }
          );

          const msg = {
            toEmail: d.email,
            fromTo: this.userFirebase.email,
            subject: 'OCA GLOBAL - Nueva notificación',
            // tslint:disable-next-line:max-line-length
            message: `<strong>Hola ${d.name} ${d.surname}. <hr> <div>&nbsp;</div> Tiene una nueva notificación, enviada a las ${this.created.value} por ${this.userFirebase.email}</strong><div>&nbsp;</div> <div> ${body}</div>`,
          };

          this._cdf.httpEmail(this.token.token, msg).subscribe(
            response => {
              if (!response) {
              return false;
              }
              if (response.status === 200) {
                // console.log(response);
              }
            },
              error => {
              console.log(<any>error);
              }
            );
      }

    }

  }

  getEquipos(id) {
    // console.log(id);
    this._dataService.getEquipos(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.equipos = some['datos'];
          },
          (error) => {
            console.log(<any>error);
          }
        );
      }
    );
  }

  moreClient(event: boolean) {

    if (event) {
      this.client_loading = true;

      if (this.project_id > 0) {
        this._customerService.getProjectCustomerDetail(this.token.token, this.project_id, this.order[0]['cc_id']).subscribe(
          response => {
            if (response.status === 'success') {
              const customer: any = response.datos;

                  for (let i = 0; i < customer.length; i++) {
                     if (customer) {
                       this.clientInfo = {
                        name_table: customer[i]['name_table'],
                        cc_number: customer[i]['cc_number'],
                        nombrecc: customer[i]['nombrecc'],
                        ruta: customer[i]['ruta'],
                        calle: customer[i]['calle'],
                        numero: customer[i]['numero'],
                        block: customer[i]['block'],
                        depto: customer[i]['depto'],
                        latitud: customer[i]['latitud'],
                        longitud: customer[i]['longitud'],
                        medidor: customer[i]['medidor'],
                        modelo_medidor: customer[i]['modelo_medidor'],
                        id_tarifa: customer[i]['id_tarifa'],
                        id_constante: customer[i]['id_constante'],
                        id_giro: customer[i]['id_giro'],
                        id_sector: customer[i]['id_sector'],
                        id_zona: customer[i]['id_zona'],
                        id_mercado: customer[i]['id_mercado'],
                        tarifa: customer[i]['tarifa'],
                        constante: customer[i]['constante'],
                        giro: customer[i]['giro'],
                        sector: customer[i]['sector'],
                        zona: customer[i]['zona'],
                        mercado: customer[i]['mercado'],
                        id_region: customer[i]['id_region'],
                        id_provincia: customer[i]['id_provincia'],
                        id_comuna: customer[i]['id_comuna'],
                        region: customer[i]['region'],
                        provincia: customer[i]['province'],
                        comuna: customer[i]['comuna'],
                        observacion: customer[i]['observacion'],
                        marca_id: customer[i]['marca_id'],
                        modelo_id: customer[i]['modelo_id'],
                        description: customer[i]['description'],
                        color_id: customer[i]['color_id'],
                        marca: customer[i]['marca'],
                        modelo: customer[i]['modelo'],
                        color: customer[i]['color'],
                        patio: customer[i]['patio'],
                        espiga: customer[i]['espiga'],
                        posicion: customer[i]['posicion'],
                        set: customer[i]['set'],
                        alimentador: customer[i]['alimentador'],
                        sed: customer[i]['sed'],
                        llave_circuito: customer[i]['llave_circuito'],
                        fase: customer[i]['fase'],
                        clavelectura: customer[i]['clavelectura'],
                        factor: customer[i]['factor'],
                        fecha_ultima_lectura: customer[i]['fecha_ultima_lectura'],
                        fecha_ultima_deteccion: customer[i]['fecha_ultima_deteccion'],
                        falta_ultimo_cnr: customer[i]['falta_ultimo_cnr'],
                       };

                       this.client_loading = false;
                       break;
                     }
                  }

             } else {
              if (response.status === 'error') {
                this.client_loading = false;
                // console.log(response);
              }
            }
          },
              error => {
                this.client_loading = false;
                console.log(<any>error);
              }
          );
        }

    } else {
      this.clientInfo = null;
    }
  }

  public loadData() {
      this.loading = true;
      this.order = null;
      // tslint:disable-next-line:max-line-length
      this.subscription = this._orderService.getShowOrderService(this.token.token, this.infodata['service_id'], this.infodata['order_id']).subscribe(
      response => {
      if (!response) {
        return;
         }

          this.order = response.datos;

          // console.log(this.order);

          this.servicetype_id = this.order[0]['servicetype_id'];

          this.data.project = this.order[0]['project_name'];
          this.data.order_id = this.order[0]['order_id'];
          this.data.order_number = this.order[0]['order_number'];
          this.data.service_id = this.order[0]['service_id'];
          this.data.category_id = this.order[0]['category_id'];
          this.data.customer_id = this.order[0]['customer_id'];
          this.data.cc_number = this.order[0]['cc_number'];
          this.data.servicetype_id = this.order[0]['servicetype_id'];
          this.data.status_id = this.order[0]['status_id'];
          this.data.assigned_to = this.order[0]['assigned_to'];
          this.data.team_id = this.order[0]['team_id'];
          this.data.order_date = this.order[0]['order_date'];
          this.data.required_date = this.order[0]['required_date'];
          this.data.vencimiento_date = this.order[0]['vencimiento_date'];
          this.data.leido_por = this.order[0]['leido_por'];
          this.data.observation = this.order[0]['observation'];
          this.data.create_at = this.order[0]['create_at'];

          if (this.order[0]['patio']) {
            this.data.patio = this.order[0]['patio'];
          }
          if (this.order[0]['espiga']) {
            this.data.espiga = this.order[0]['espiga'];
          }
          if (this.order[0]['posicion']) {
            this.data.posicion = this.order[0]['posicion'];
          }
          // console.log(this.order );
        if (this.order.length > 0) {

          const atributotem = response.atributo;
          const orderatributotem: Array<any> = response.orderatributo;

          if (orderatributotem.length > 0) {
            atributotem.forEach(element => {
              if (element.type === 'chip') {
                orderatributotem.forEach(elemento => {
                  if (element.id === elemento.atributo_id) {

                    elemento.valor = JSON.parse(elemento.valor); // OrderAtributo
                    const datos = JSON.parse(element.datos);
                    const datoschip: Array<any> = datos.chip; // Atributo

                    datoschip.forEach(chip => {
                      let validate = false;
                      elemento.valor.forEach(elementchip => {
                        if (chip.value === elementchip.descripcion) {
                          validate = true;
                        }
                      });
                      if (!validate) {
                        elemento.valor.push({'value': false, 'descripcion': chip.value});
                      }
                    });

                    elemento.valor.forEach(elementchip => {
                      let validate = false;
                      datoschip.forEach(chip => {
                        if (elementchip.descripcion === chip.value) {
                          validate = true;
                        }
                      });
                      if (!validate) {
                        datoschip.push({'value': elementchip.descripcion});
                        element.datos = JSON.stringify({'chip': datoschip});
                      }
                    });

                  }
                });
              }
              if (element.type === 'radio') {
                orderatributotem.forEach(elemento => {
                  if (element.id === elemento.atributo_id) {
                    const datos = JSON.parse(element.datos);
                    const datosradio: Array<any> = datos.radio;
                    let validate = false;
                    datosradio.forEach(radio => {
                      if (radio.value === elemento.valor) {
                        validate = true;
                      }
                    });
                    if (!validate && elemento.valor !== 'S/N') {
                      datosradio.push({'value': elemento.valor});
                      element.datos = JSON.stringify({'radio': datosradio});
                    }
                  }
                });
              }
              if (element.type === 'spinner') {
                orderatributotem.forEach(elemento => {
                  if (element.id === elemento.atributo_id) {
                    const datos = JSON.parse(element.datos);
                    const datosspinner: Array<any> = datos.spinner;
                    let validate = false;
                    datosspinner.forEach(spinner => {
                      if (spinner.value === elemento.valor) {
                        validate = true;
                      }
                    });
                    if (!validate && elemento.valor !== 'S/N') {
                      datosspinner.push({'value': elemento.valor});
                      element.datos = JSON.stringify({'spinner': datosspinner});
                    }
                  }
                });
              }
              if (element.type === 'date') {
                orderatributotem.forEach(elemento => {
                  if (element.id === elemento.atributo_id) {
                    if (elemento.valor === 'S/N') {
                      elemento.valor = null;
                    } else {
                     // NADA
                    }
                  }
                });
              }
            });


            this.atributo = atributotem;
            this.orderatributo = orderatributotem;

          } else if (atributotem.length > 0) {
            atributotem.forEach(element => {
              if (element.type === 'chip') {
                element.datos = JSON.parse(element.datos);
                element.datos = element.datos.chip;
                element.datos.forEach(elemento => {
                  elemento.descripcion = elemento.value;
                  elemento.value = false;
                });
                element.datopila = element.datos;
              }
              // tslint:disable-next-line:max-line-length
              if (element.type !== 'chip' && element.type !== 'label' && element.type !== 'layout_line' && element.type !== 'spinner' && element.type !== 'radio') {
                element.datopila = element.datos;
              }
            });

            this.atributo = atributotem;

          }

          this.loading = false;

        } else {
          this.loading = false;
        }
        // console.log(this.servicename);
      }
      );
   }

  toggle() {
    this.show = !this.show;
    /**
    if (this.show) {
      this.getOrderAtributo();
    }*/
  }

  /**
  public getOrderAtributo() {

      this.isOrderLoading = true;
      this.order = null;
      // tslint:disable-next-line:max-line-length
      this.subscription = this._orderService.getShowOrderService(this.token.token, this.infodata['service_id'], this.infodata['order_id']).subscribe(
      response => {
        if (!response) {
          this.isOrderLoading = false;
          return;
        }
        this.order = response.datos;
          // console.log(response.datos);
        if (this.order.length > 0) {

          this.atributo = response.atributo;
          this.orderatributo = response.orderatributo;
          this.isOrderLoading = false;

        } else {
          this.isOrderLoading = false;
        }
        // console.log(this.servicename);
      }
    );

  } */

  /**
  public isArray(obj): boolean {
    return Array.isArray(obj);
  }
  */

  public isDisabled(userRol: number, requeridoRol: number): boolean {
    if (requeridoRol > userRol) {
      return true;
    } else {
      return false;
    }
  }

  public loadService() {
    this.servicetype = null;
    this.subscription = this._orderService.getService(this.token.token, this.infodata['service_id']).subscribe(
    response => {
              if (!response) {
                return;
              }
              if (response.status === 'success') {
                this.services = response.datos;
                this.kpi = response.datos.kpi;
                this.service_name = this.services['service_name'];
                this.project = this.services['project']['project_name'];
                this.project_id = this.services['project']['id'];
                this.project_id = this.services['project']['id'];
                if (this.project_id > 0) {
                  this.getEquipos(this.project_id);
                  this.loadUserProject(this.project_id);
                }
              }
              });
    }

  public loadServiceType() {
    this.servicetype = null;
    this.subscription = this._orderService.getServiceType(this.token.token, this.infodata['service_id']).subscribe(
    response => {
              if (!response) {
                return;
              }
              if (response.status === 'success') {
                this.servicetype = response.datos;
              }
              });
    }

  public loadServiceEstatus() {
    this.serviceestatus = null;
    this.subscription = this._orderService.getServiceEstatus(this.token.token, this.infodata['service_id']).subscribe(
    response => {
              if (!response) {
                return;
              }
              if (response.status === 'success') {
                this.serviceestatus = response.datos;
              }
              });
    }


   public loadUserProject(id) {
    this.subscription = this._projectService.getUserProject(this.token.token, id, 5).subscribe(
    response => {
              if (!response) {
                return;
              }
              if (response.status === 'success') {
                this.users = response.datos;
              }
              });

   }

   public searchCustomer(termino: string) {

    this.termino = termino.trim();
    if (this.termino.length > 0) {
      this.active = true;
    } else {
      this.active = false;
    }

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

  taguser(data) {
    if (data.length === 0) {
      data = '';
      this.destinatario = [];
      return;
    }

    if (data.length > 0) {
      this.destinatario = data;
      // console.log(this.destinatario);
    }
  }

  onSelectMethod(event): any {
    const d = new Date(Date.parse(event));
    const datecalendar = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    return datecalendar;
  }

}
