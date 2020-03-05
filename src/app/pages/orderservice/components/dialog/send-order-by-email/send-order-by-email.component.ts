import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs/Subscription';
import { timer } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import Swal from 'sweetalert2';

// FIREBASE
import { AngularFireAuth } from '@angular/fire/auth';

// MODELS
import { Proyecto, Service, User, UserFirebase } from 'src/app/models/types';

// SERVICES
import { CdfService, OrderserviceService, UserService, ZipService } from 'src/app/services/service.index';


import * as _moment from 'moment';
const moment = _moment;


@Component({
  selector: 'app-send-order-by-email',
  templateUrl: './send-order-by-email.component.html',
  styleUrls: ['./send-order-by-email.component.css']
})
export class SendOrderByEmailComponent implements OnInit, OnDestroy {

  destinatario = [];
  email_responsable_obra: string;
  emailbody = 'Orden de Trabajo compartida por correo.';
  id: number;
  identity: any;
  isLoading = true;
  listimageorder = [];
  subscription: Subscription;
  project: any;
  project_id: number;
  proyectos: Array<Proyecto> = [];
  service: any;
  services: Service;
  service_type: any;
  tipoServicio: any;
  title = 'Enviar Orden por Correo';
  token: any;
  user_informador: User;
  user_responsable: User;
  user_itocivil_assigned_to: User;
  user_itoelec_assigned_to: User;
  user_responsable_obra: User;
  userFirebase: UserFirebase;

  constructor(
    private _cdf: CdfService,
    public _userService: UserService,
    private firebaseAuth: AngularFireAuth,
    public dataservice: OrderserviceService,
    public dialogRef: MatDialogRef<SendOrderByEmailComponent>,
    private toasterService: ToastrService,
    public zipService: ZipService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.proyectos = this._userService.getProyectos();
    this.firebaseAuth.authState.subscribe(
      (auth) => {
        if (auth) {
          this.userFirebase = auth;
          // console.log(this.userFirebase);
        }
    });

  }

  ngOnInit() {
    if (this.data.project > 0) {
      this.project_id = this.data.project;
      this.id = this.data.service_id;
      this.project = this.filter();
      this.service = this.filterService();
      if (this.id) {
        this.getTipoServicio(this.id);
      }
      this.isLoading = false;
    }

    if (this.data.orderid) {
      // console.log(this.data.orderid);
      // this.getListImage();
    }

    if (this.data.service_id > 0) {
      // console.log(this.data.service_id);
      this.subscription = this.dataservice.getService(this.token.token, this.data.service_id).subscribe(
        response => {
                  if (!response) {
                    return;
                  }
                  if (response.status === 'success') {
                    // console.log(response.datos);
                    this.services = response.datos;
                    // console.log(this.kpi);
                    if (this.services && this.services['servicedetail'][0] && this.services['servicedetail'][0].user_informador) {
                      this.subscription = this._userService.getUserInfo(this.token.token, this.services['servicedetail'][0].user_informador).subscribe(
                        response => {
                          if (!response) {
                            return;
                          }
                          if (response.status === 'success') {
                            this.user_informador = response.data[0];
                            // console.log(this.user_informador);
                          }
                        }
                      );
                    }


                    if (this.services && this.services['servicedetail'][0] && this.services['servicedetail'][0].user_responsable) {
                      this.subscription = this._userService.getUserInfo(this.token.token, this.services['servicedetail'][0].user_responsable).subscribe(
                        response => {
                          if (!response) {
                            return;
                          }
                          if (response.status === 'success') {
                            this.user_responsable = response.data[0];
                            // console.log(this.user_responsable);
                          }
                        }
                      );
                    }


                    if (this.services && this.services['servicedetail'][0] && this.services['servicedetail'][0].user_itocivil_assigned_to) {
                      this.subscription = this._userService.getUserInfo(this.token.token, this.services['servicedetail'][0].user_itocivil_assigned_to).subscribe(
                        response => {
                          if (!response) {
                            return;
                          }
                          if (response.status === 'success') {
                            this.user_itocivil_assigned_to = response.data[0];
                          }
                        }
                      );
                    }

                    if (this.services && this.services['servicedetail'][0] && this.services['servicedetail'][0].user_itoelec_assigned_to) {
                      this.subscription = this._userService.getUserInfo(this.token.token, this.services['servicedetail'][0].user_itoelec_assigned_to).subscribe(
                        response => {
                          if (!response) {
                            return;
                          }
                          if (response.status === 'success') {
                            this.user_itoelec_assigned_to = response.data[0];
                          }
                        }
                      );
                    }

                    if (this.services && this.services['servicedetail'][0] && this.services['servicedetail'][0].responsable_obra) {
                      this.user_responsable_obra = this.services['servicedetail'][0].responsable_obra;
                    }

                    if (this.services && this.services['servicedetail'][0] && this.services['servicedetail'][0].responsable_email) {
                      this.email_responsable_obra = this.services['servicedetail'][0].responsable_email;
                    }
                  }
       });
    }

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }



  filter() {
    if (this.proyectos && this.project_id) {
      for (let i = 0; i < this.proyectos.length; i += 1) {
        const result = this.proyectos[i];
        if (result.id === this.project_id) {
            return result;
        }
      }
    }
  }

  filterService() {
    if (this.project.service && this.id) {
      for (let i = 0; i < this.project.service.length; i += 1) {
        const result = this.project.service[i];
        if (result.id === this.id) {
            return result;
        }
      }
    }
  }


  filterServiceType() {
    if (this.tipoServicio && this.data.tiposervicio) {
      for (let i = 0; i < this.tipoServicio.length; i += 1) {
        const result = this.tipoServicio[i];
        if (result.id === this.data.tiposervicio) {
            return result;
        }
      }
    }
  }


  public getListImage() {
    this.subscription = this.dataservice.getImageOrder(this.token.token, this.data.orderid).subscribe(
    response => {
      if (!response) {
        return;
      }
        if (response.status === 'success') {
          this.listimageorder = response.datos;
          // console.log(this.listimageorder);
          if (this.listimageorder.length > 0) {
          }
        }
    },
        error => {
        console.log(<any>error);
        }
    );
  }

  getTipoServicio(id: number) {
    this.zipService.getTipoServicio(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some: any) => {
            this.tipoServicio = some['datos'];
            if (this.tipoServicio) {
              this.service_type = this.filterServiceType()
            }
          },
          (error: any) => {
            console.log(<any>error);
          }
        );
      }
    );
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  sendEmail(event: number) {

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Está seguro de enviar por correo la Orden de Trabajo ? ',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    })
    .then( borrar => {
      if (borrar.value) {
        if (borrar) {
          if (event === 1 && this.destinatario.length > 0) {
            this.destinatario.forEach(res => {
              this.sendCdfUser(res.email, this.emailbody);
            });
          }
        }
      } else if (borrar.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
        );
      }
    });
  }


  sendCdfUser(to: string, body: string) {

    if (!to || !body) {
      return;
    }

    const created = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const project = {
      address: '',
      company : '',
      comentario: 'Orden de Trabajo compartida por correo.',
      name: this.project.project_name,
      observacion: '',
      description : '',
      order_number: this.data.order_number,
      service_name: this.service.service_name,
      service_type_name: this.service_type.name,
      id : this.id,
      orderid: this.data.orderid,
      pila: '',
      file: '',
      image: this.listimageorder
    };



    if (to && body && project ) {
      const asunto = 'OCA GLOBAL - Orden de Trabajo en Proyecto: ' + ' ' + this.service.service_name + '. OT: ' + this.data.order_number;
      this._cdf.httpEmailShareOrder(this.token.token, to, this.userFirebase.email, asunto, created, body, project ).subscribe(
        response => {
          if (!response) {
            this.destinatario = [];
            this.onNoClick();
            return false;
          }
          if (response.status === 200) {
            this.destinatario = [];
            this.toasterService.success('Orden de Trabajo enviada exitosamente.', 'Exito', {timeOut: 8000});
            this.subscription = timer(2000).subscribe(_res => this.onNoClick());
          }
        },
          error => {
            this.destinatario = [];
            this.onNoClick();
            console.log(<any>error);
          }
        );
    }
  }


  taguser(data) {
      this.destinatario = data;
  }


}
