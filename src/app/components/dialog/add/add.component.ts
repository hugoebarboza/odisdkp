import { Component, Inject, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

// FIREBASE
import { AngularFireAuth } from '@angular/fire/auth';

// MOMENT
import * as _moment from 'moment';
const moment = _moment;

// SERVICES
import { CdfService, DataService, OrderserviceService, ProjectsService, UserService, WebsocketService } from 'src/app/services/service.index';

// MODELS
import { Order, Service, ServiceType, ServiceEstatus, User, UserFirebase } from 'src/app/models/types';
import Swal from 'sweetalert2';


interface ObjectServiceType {
  id: number;
  name: string;
}

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./add.component.css']
})

export class AddComponent implements OnInit, OnDestroy {

  equipos: Array<Object> = [];
  public title: string;
  active: Boolean = false;
  isvalid: Boolean = true;
  destinatario = [];
  created: FormControl;
  public identity: any;
  public token: any;
  public services: Service[] = [];
  public project: string;
  public servicetype: ServiceType[] = [];
  public users: User[] = [];
  // private sub: any;
  public arrayservicetype: ObjectServiceType[] = [];
  public termino: string;
  public results: Object = [];
  role: number;
  route: String = '';
  sub: any;
  public serviceestatus: ServiceEstatus[] = [];
  public show: Boolean = false;
  public showdate: Boolean = false;

  myDate: any;
  service_name: string;
  isLoading = false;
  loading: boolean;
  isOrderLoading: boolean;
  category_id: number;
  id: number;
  project_id: number;
  atributo = new Array();
  day = new Date().getDate();
  month = new Date().getMonth();
  year = new Date().getFullYear();
  hour = new Date().getHours();
  minutes = new Date().getMinutes();
  seconds = new Date().getSeconds();
  date = new FormControl(new Date());
  selectedUsers: any;
  selectedTeam: any;
  userFirebase: UserFirebase;

  serializedDate = new FormControl((new Date()).toISOString());
  en: any;

  subscription: Subscription;

  formControl = new FormControl('', [Validators.required]);

  destroy = new Subject();

  constructor(
    private _cdf: CdfService,
    public _dataService: DataService,
    private _orderService: OrderserviceService,
    private _projectService: ProjectsService,
    private _route: Router,
    public _userService: UserService,
    private cd: ChangeDetectorRef,
    public dataService: OrderserviceService,
    public dialogRef: MatDialogRef<AddComponent>,
    private firebaseAuth: AngularFireAuth,
    public wsService: WebsocketService,
    @Inject(MAT_DIALOG_DATA) public data: Order
  ) {

    this.created =  new FormControl(moment().format('YYYY[-]MM[-]DD HH:mm:ss'));
    this.title = 'Agregar Orden';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.role = 5; // USUARIOS INSPECTORES

    this.firebaseAuth.authState
                     .pipe(
                      takeUntil(this.destroy),
                     )
                     .subscribe(
                        (auth) => {
                          if (auth) {
                            this.userFirebase = auth;
                          }
                      });

    this.route = this._route.url.split('?')[0];

  }

  isRequired(detailatributo: any) {
    // const element: HTMLElement = document.getElementById(detailatributo.id) as HTMLElement;
    // console.log(detailatributo);
    if (detailatributo && detailatributo.required && detailatributo.required === 1) {
      if (this.identity.role <= detailatributo.rol) {
        // element.setAttribute('required', '');
        return true;
      } else {
        // element.removeAttribute('required');
        return false;
      }
    } else {
      // element.removeAttribute('required');
      return false;
    }

  }

  ngOnInit() {
     // console.log(this.data);
     // this.data.['order_date'] = "0000-00-00";
     this.category_id = this.data['category_id'];
     this.loadService();
     this.loadServiceType();
     this.loadServiceEstatus();
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

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Dato Requerido' : '';
  }

  ngOnDestroy() {
    this.destroy.next(null);
    // console.log('La página se va a cerrar');
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  submit() {
    // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onGenerarOrder() {
    // tslint:disable-next-line:max-line-length
    const order = this.identity.sub + '' + this.day + '' + this.month + '' + this.year + '' + this.hour + '' + this.minutes + '' + this.seconds + '' + Math.round(Math.random() * 100 + 1);
    this.data.order_number = order;
    const isWhitespace = order.trim().length === 0;
    this.isvalid = !isWhitespace;
  }

  getEquipos(id) {
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

  public confirmAdd(_form: any): void {

    const pila = [];
    let j = 0;

    if (this.selectedUsers) {
      this.data.assigned_to = this.selectedUsers.id;
    }

    if (this.selectedTeam) {
      this.data.team_id = this.selectedTeam.id;
    }

    if (this.data.observation) {
      this.data.observation = this.data.observation.replace(/[\s\n]/g, ' ');
    }

    if (this.data.order_date) {
      this.data.order_date = new FormControl(moment(this.data.order_date).format('YYYY[-]MM[-]DD HH:mm:ss')).value;
    }

    if (this.data.required_date) {
      this.data.required_date = new FormControl(moment(this.data.required_date).format('YYYY[-]MM[-]DD HH:mm:ss')).value;
    }

    if (this.data.vencimiento_date) {
      this.data.vencimiento_date = new FormControl(moment(this.data.vencimiento_date).format('YYYY[-]MM[-]DD HH:mm:ss')).value;
    }

    for (let i = 0; i < this.atributo.length; i++) {

      if (this.atributo[i]['type'] !== 'label' || this.atributo[i]['type'] !== 'layout_line') {

        let valorpila = this.atributo[i]['datopila'];

        // tslint:disable-next-line:max-line-length
        if ( !valorpila || valorpila === null  || (typeof valorpila === 'undefined') || valorpila === '' || valorpila === ' ') {
            pila[j] = { id: this.atributo[i]['id'], value: 'S/N' };
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
          pila[j] = { id: this.atributo[i]['id'], value: valorpila };
          j++;
        }

      }
    }

    const objPila = {pila: pila};
    const obj = Object.assign(this.data, objPila);

    this.dataService.add(this.token.token, obj, this.category_id).subscribe(
      response => {

        if (!response) {
          this.isOrderLoading = false;
          return;
        }
        if (response.status === 'success') {

          // Socket data
          const payload = {
            userid: this.identity.sub,
            serviceid: this.data['service_id'],
            orderid: response.lastInsertedId,
          };

          Swal.fire('Creada Orden de Trabajo: ', this.data.order_number + ' exitosamente.', 'success' );

          this.wsService.emit('store-order', payload);

          if (response.formnotificacion && response.formnotificacion.length > 0) {
            this.sendformnotificacion(response.formnotificacion, response.order, response.project, response.service, response.servicetype, response.lastInsertedId);
          }

        } else {
          Swal.fire('N. Orden de Trabajo: ', this.data.order_number + ' no fue posible crearla.' , 'error');
        }
      },
      error => {
        console.log(<any>error);
        Swal.fire('No fue posible procesar su solicitud', error.error.message, 'error');
      }
    );

    if (this.destinatario.length > 0)  {
      // SEND CDF MESSAGING AND NOTIFICATION
      this.sendCdf(this.destinatario);
    }

  }


  sendformnotificacion(formnotificacion: any, orderdata: any, project: any, service: any, servicetype: any, lastInsertedId: any) {
    if (!formnotificacion) {
      return;
    }

    for (let i = 0; i < formnotificacion.length; i++) {
      const element: any = formnotificacion[i];

      const user: any = JSON.parse(element.user);

      for (let x = 0; x < user.length; x++) {
        const usermail = user[x];

        const msg = {
          toEmail: usermail.email,
          fromTo: this.identity.email,
          subject: 'OCA GLOBAL - Nueva notificación - ' + element.main,
          body: element.body,
          project: project.project_name,
          service_name: service.service_name,
          servicetype_name: servicetype.name,
          order_number: orderdata.order_number,
          service_id: orderdata.service_id,
          order_id: lastInsertedId
          };

        // console.log(msg);

        this._cdf.httpEmailNotification(this.token.token, msg).subscribe(
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

  public isDisabled(userRol: number, requeridoRol: number): boolean {
    if (requeridoRol > userRol) {
      return true;
    } else {
      return false;
    }
  }

  sendCdf(data: any) {
    if (!data) {
      return;
    }

    // tslint:disable-next-line:max-line-length
    const body = 'Creación de orden en Proyecto: ' + this.project + ', Servicio: ' + this.service_name + ', con Orden N.: ' + this.data.order_number;

    if (this.destinatario.length > 0 && this.userFirebase.uid) {
      for (const d of data) {

        const notification = {
          userId: this.userFirebase.uid,
          userIdTo: d.id,
          title: 'Nueva orden de trabajo',
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

  public loadService() {
    this.servicetype = null;
    this.subscription = this._orderService.getService(this.token.token, this.data['service_id']).subscribe(
    response => {
              if (!response) {
                return;
              }
              if (response.status === 'success') {
                this.services = response.datos;
                this.service_name = this.services['service_name'];
                this.project = this.services['project']['project_name'];
                this.project_id = this.services['project']['id'];
                 if (this.project_id > 0) {
                   this.loadUserProject(this.project_id);
                   this.getEquipos(this.project_id);
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
                // console.log(this.servicetype);
              }
              });
    }

   public loadUserProject(id: number) {
    this.subscription = this._projectService.getUserProject(this.token.token, id, this.role).subscribe(
    response => {
              if (!response) {
                return;
              }
              if (response.status === 'success') {
                this.users = response.datos;
              }
              });
   }

   public noWhitespace(termino: string) {
    const isWhitespace = termino.trim().length === 0;
    this.isvalid = !isWhitespace;
  }

  public searchCustomer(termino: string) {
    this.termino = termino.trim();
    if (this.termino.length > 0) {
      this.isLoading = true;
      this.active = true;
    } else {
      this.isLoading = false;
      this.active = false;
    }
    if (this.termino.length > 1) {

      this.subscription = this._orderService.getCustomer(this.token.token, this.termino, this.category_id).subscribe(
      response => {
            if (!response) {
              this.cd.markForCheck();
              this.isLoading = true;
              return;
            }
            if (response.status === 'success') {
              this.results = response.datos;
              this.isLoading = false;
              this.cd.markForCheck();
            }
            });
    } else {
      this.results = null;
      this.cd.markForCheck();
    }
  }

  public loadAtributo(event: any) {
    if (event > 0) {
    this.show = true;
    this.isOrderLoading = true;
    this.subscription = this._orderService.getAtributoServiceType(this.token.token, event).subscribe(
    response => {
      // console.log(response);
              if (!response) {
                this.cd.markForCheck();
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

                this.atributo = atributotem;
                // console.log(this.atributo);

                this.isOrderLoading = false;
                this.cd.markForCheck();
              }
              },
          error => {
          this.isOrderLoading = false;
          this.cd.markForCheck();
          console.log(<any>error);
          });
    }

  }

  public loadServiceEstatus() {

    this.subscription = this._orderService.getServiceEstatus(this.token.token, this.data['service_id']).subscribe(
    response => {
              if (!response) {
                return;
              }
              if (response.status === 'success') {
                this.serviceestatus = response.datos;
                if (this.serviceestatus.length > 0) {
                  this.data.status_id = this.serviceestatus.slice(-1)[0].id;
                }
              }
            });
    }


  taguser(data)  {
      if (data.length === 0) {
        data = '';
        return;
      }

      if (data.length > 0) {
        this.destinatario = data;
        // console.log(this.destinatario);
      }
   }


  toggle() {
    this.show = !this.show;
    if (this.show) {
      // this.getOrderAtributo();
    }
  }

  toggledate() {
    this.showdate = !this.showdate;
  }

  displayFn(value: any) {
    if (value) {
      // this.valid = true;
      // this.selected = value;
      // console.log(this.selected);
      // console.log(this.selected.length);
      // return this.selected;
    }
  }

}
