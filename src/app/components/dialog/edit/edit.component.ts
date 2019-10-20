import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, NgForm} from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

// FIREBASE

import { AngularFireAuth } from '@angular/fire/auth';

// MOMENT
import * as _moment from 'moment';
const moment = _moment;

// SERVICES
import { CdfService, OrderserviceService, ProjectsService, UserService } from '../../../services/service.index';

// MODELS
import { Order, Service, ServiceType, ServiceEstatus, User, UserFirebase } from '../../../models/types';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    // {provide: MAT_DATE_LOCALE, useValue: { useUtc: true }},
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    // {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    // {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class EditComponent implements OnInit, OnDestroy {

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

  constructor(
    private _cdf: CdfService,
    private _orderService: OrderserviceService,
    private _projectService: ProjectsService,
    private _route: Router,
    private _userService: UserService,
    public dataService: OrderserviceService,
    public dialogRef: MatDialogRef<EditComponent>,
    private firebaseAuth: AngularFireAuth,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {


    this.created =  new FormControl(moment().format('YYYY[-]MM[-]DD HH:mm:ss'));
    this.title = 'Editar Orden N.';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this._userService.handleAuthentication(this.identity, this.token);
    this.role = this._userService.identity.role;
    this.servicetype_id = this.data.servicetype_id;
    this.serviceid = this.data.service_id;

    this.firebaseAuth.authState.subscribe(
      (auth) => {
        if (auth) {
          this.userFirebase = auth;
        }
    });

    this.route = this._route.url.split('?')[0];

    if (this.token.token != null) {
      // console.log(this.data['order_id']);
      // console.log(this.data['service_id']);
       this.loadData();
    }

  }

  ngOnInit() {
    // console.log(this.data);
    this.category_id = this.data['category_id'];
    // console.log(this.value);
    // console.log(this.category_id);
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
            value: this.data['order_date'],
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
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    
  }

  confirmEdit(form: NgForm): void {
    const editform = form;
    let j = 0;
    this.myArray = editform.value;

    // console.log(this.myArray);
    // console.log(this.orderatributo);
    // console.log(this.atributo);

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

    const objPila = {pila: this.pila };
    const obj = Object.assign(this.data, objPila);

    //console.log(objPila);

    this.dataService.update(this.token.token, this.data['order_id'], obj, this.category_id);

    /*
    for (var propiedad in this.pila) {
      console.log(propiedad);
      console.log(this.pila[propiedad]);
    }*/

    // console.log(obj);
    // console.log(this.data);
    // console.log(this.pila);
   // this.dataService.update(this.token.token, this.data['order_id'], editform.value, this.category_id);

   if (this.destinatario.length > 0)  {
    // SEND CDF MESSAGING AND NOTIFICATION
    this.sendCdf(this.destinatario);
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

  public loadData() {
      this.loading = true;
      this.order = null;
      // tslint:disable-next-line:max-line-length
      this.subscription = this._orderService.getShowOrderService(this.token.token, this.data['service_id'], this.data['order_id']).subscribe(
      response => {
      if (!response) {
        return;
         }
          this.order = response.datos;
          if (this.order[0]['patio']) {
            this.data.patio = this.order[0]['patio'];
          }
          if (this.order[0]['espiga']) {
            this.data.espiga = this.order[0]['espiga'];
          }
          if (this.order[0]['posicion']) {
            this.data.posicion = this.order[0]['posicion'];
          }
          // console.log(response.datos);
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
            //console.log(this.orderatributo);
            //console.log(this.atributo);

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
            //console.log(this.atributo);

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

  public getOrderAtributo() {

      this.isOrderLoading = true;
      this.order = null;
      // tslint:disable-next-line:max-line-length
      this.subscription = this._orderService.getShowOrderService(this.token.token, this.data['service_id'], this.data['order_id']).subscribe(
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

  }

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
    this.subscription = this._orderService.getService(this.token.token, this.data['service_id']).subscribe(
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
                   this.loadUserProject(this.project_id);
                }
              }
              });
    }

  public loadServiceType() {
    this.servicetype = null;
    this.subscription = this._orderService.getServiceType(this.token.token, this.data['service_id']).subscribe(
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
    this.subscription = this._orderService.getServiceEstatus(this.token.token, this.data['service_id']).subscribe(
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
                this.results = response.datos.data;
              }
              });
      } else {
        this.results = null;
      }
   }

  taguser(data) {
    if (data.length === 0) {
      data = '';
      return;
    }

    if (data.length > 0) {
      this.destinatario = data;
      // console.log(this.destinatario);
    }
  }

  onSelectMethod(event): any {
    //console.log(event);
    const d = new Date(Date.parse(event));
    const datecalendar = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    return datecalendar;
    // console.log(this.myDate);
  }

}
