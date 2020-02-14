import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { Proyecto } from 'src/app/models/types';
import { CustomformService, UserService, SettingsService, KpiService, OrderserviceService } from 'src/app/services/service.index';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NewAlertComponent } from './dialog/new-alert/new-alert.component';
import Swal from 'sweetalert2';
import { EditNotificationComponent } from './dialog/edit-notification/edit-notification.component';
import { ListNotificationComponent } from './dialog/list-notification/list-notification.component';

@Component({
  selector: 'app-atributo-alert',
  templateUrl: './atributo-alert.component.html',
  styleUrls: ['./atributo-alert.component.css']
})
export class AtributoAlertComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav', {static: false}) sidenav: any;

  subscription: Subscription;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  project_id = 0;
  identity: any;
  project: any;
  token: any;
  proyectos: Array<Proyecto> = [];
  servicios: Array<any> = [];
  roles = [];
  sub: any;
  title = '';
  element: HTMLElement;
  element2: HTMLElement;
  atributo = new Array();
  displayedColumns: string[] = ['descripcion', 'datos'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  isLoadingAtributos = true;
  isLoadingAtributosSave = false;
  isLoadingMenu = true;
  isLoading = false;
  forma: FormGroup;
  booaction = true;

  constructor(
    public kpiservice: KpiService,
    public _customForm: CustomformService,
    private _orderService: OrderserviceService,
    private _route: ActivatedRoute,
    public _userService: UserService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    public label: SettingsService,
    media: MediaMatcher,
    public toasterService: ToastrService,
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.cd.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();

    this.label.getDataRoute().subscribe(data => {
      this.title = data.subtitle;
    });

    this.isLoadingMenu = false;
    this.sub = this._route.params.subscribe(params => {
      this.project_id = +params['id'];
      if (this.project_id) {

        this.project = this.filter();
        this.servicios = this.project.service;
        this.isLoadingMenu = true;

        this.forma = new FormGroup({
          servicetype_name: new FormControl(''),
          id: new FormControl(0, [Validators.required]),
          name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
          description: new FormControl(null, [Validators.required, Validators.minLength(2)]),
          servicetype_id: new FormControl({value: 0, disabled: true}, [Validators.required]),
          type: new FormControl(0, [Validators.required, Validators.minLength(1)]),
          value: new FormControl({value: 0, disabled: true}, [Validators.required, Validators.minLength(1)]),
          user: new FormControl({value: [], disabled: true}, [Validators.required, Validators.minLength(1)]),
          main: new FormControl({value: '', disabled: true}, [Validators.required, Validators.minLength(2)]),
          body: new FormControl({value: '', disabled: true}, [Validators.required, Validators.minLength(2)]),
          status: new FormControl(0),
        });

      }
      this.cd.markForCheck();
    });
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

  ngOnInit() {
  }

  autoGrowTextZone(e: any) {
    e.target.style.height = '0px';
    e.target.style.height = (e.target.scrollHeight + 25) + 'px';
  }

  async getServicetype(service: any, x: number) {
    if (service && !service.servicetype) {
      this.isLoadingMenu = false;
      const data: any = await this._customForm.getTipoServicio(service.id, this.token.token);
      this.isLoadingMenu = true;
      if (data && data.datos) {
        for (let i = 0; i < this.servicios.length; i++) {
          if (this.servicios[i]['id'] === service.id) {
            this.servicios[i]['servicetype'] = data.datos;
            this.element = document.getElementById('service' + x) as HTMLElement;
            this.element.setAttribute('aria-expanded', 'true');
            this.element2 = document.getElementById('service' + x) as HTMLElement;
            this.element2.setAttribute('data-toggle', 'collapse');
            break;
          }
        }
      }
    }
  }

  async getNotificationsRefresh(servicetype_id: any) {
    this.isLoadingMenu = false;
    const data: any = await this._customForm.getFormNotification(this.token.token, servicetype_id);
    this.isLoadingMenu = true;

    if (data && (data.datos || data.noform)) {
      for (let i = 0; i < this.servicios.length; i++) {
        if (this.servicios[i]['servicetype']) {
          const servicetypetem: any = this.servicios[i]['servicetype'];
          for (let x = 0; x < servicetypetem.length; x++) {
            if (servicetypetem[x]['id'] === servicetype_id) {
              if (data.noform) {
                this.servicios[i]['servicetype'][x]['disablednotifications'] = data.noform;
              }
              if (data.datos) {
                this.servicios[i]['servicetype'][x]['notifications'] = data.datos;
              }
              break;
            }
          }
        }
      }
    } else {
      for (let i = 0; i < this.servicios.length; i++) {
        if (this.servicios[i]['servicetype']) {
          const servicetypetem: any = this.servicios[i]['servicetype'];
          for (let x = 0; x < servicetypetem.length; x++) {
            if (servicetypetem[x]['id'] === servicetype_id) {
              this.servicios[i]['servicetype'][x]['notifications'] = [];
              this.servicios[i]['servicetype'][x]['disablednotifications'] = [];
              break;
            }
          }
        }
      }
    }

  }

  async getNotifications (servicetype: any, s_index: any, st_index: any) {

    if (!this.servicios[s_index]['servicetype'][st_index]['notifications']) {

      if (servicetype && !servicetype.servicetype) {

        this.isLoadingMenu = false;
        const data: any = await this._customForm.getFormNotification(this.token.token, servicetype.id);
        this.isLoadingMenu = true;

        if (data && (data.datos || data.noform)) {
          this.servicios[s_index]['servicetype'][st_index]['notifications'] = data.datos;
          this.servicios[s_index]['servicetype'][st_index]['disablednotifications'] = data.noform;
          /*
          for (let i = 0; i < this.servicios.length; i++) {
            if (this.servicios[i]['id'] === servicetype.service_id) {
              const servicetypetem: any = this.servicios[i]['servicetype'];
              for (let x = 0; x < servicetypetem.length; x++) {
                if (servicetypetem[x]['id'] === servicetype.id) {
                  this.servicios[i]['servicetype'][x]['notifications'] = data.datos;
                  break;
                }
              }
              break;
            }
          }*/
        }
      }
    }
  }

  async saveForma(forma: any) {
    if (!forma || forma.invalid) {
      Swal.fire('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
      return;
    }

    let status = forma.value.status;
    if (!status) {
      status = 0;
    }

    if (status === true ) {
      status = 1;
    }

    const formulario: any = forma.getRawValue();

    if (formulario && formulario.id && formulario.id > 0) {
      const update: any = await this._customForm.updateFormNotification(this.token.token, formulario, formulario.servicetype_id, formulario.id);
      if (update && update.status === 'success') {
        this.getNotificationsRefresh(formulario.servicetype_id);
        this.toasterService.success('Notificación actualizada exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
        if (!formulario.status) {
          this.resetform();
        }
        return;
      } else {
        Swal.fire('Importante', 'A ocurrido un error en la actualización de la notificación', 'error');
        return;
      }
    } else {
      Swal.fire('Importante', 'A ocurrido un error en la actualización de la notificación', 'error');
      return;
    }

  }

  viewNotificationDisabled(servicetype: any) {

    if (!servicetype) {
      return;
    }
    if (servicetype) {
      this.resetform();
      const dialogRef = this.dialog.open(ListNotificationComponent, {
        width: '677px',
        disableClose: true,
        data: {servicetype: servicetype, project_id: this.project_id}
      });
      dialogRef.afterClosed().subscribe(result => {
          if (!result) {
          this.getNotificationsRefresh(servicetype.id);
        }
      });
    }

  }

  newNotification(servicetype: any, service: any, i: any, x: any) {

    if (!servicetype || !service) {
      return;
    }

    if (servicetype && servicetype.id) {

      const dialogRef = this.dialog.open(NewAlertComponent, {
        width: '477px',
        disableClose: true,
        data: { servicetype: servicetype, project_id: this.project_id }
      });

      dialogRef.afterClosed().subscribe(lastInserId => {
        if (lastInserId > 0) {
          this.servicios[i]['servicetype'][x]['notifications'] = null;
          this.getNotifications(servicetype, i , x);
          this.showFormNotification(servicetype, lastInserId);
        }
      });

    }

  }

  async showFormNotification(servicetype: any, id: any) {

    if (id && id > 0) {

      this.isLoading = true;
      const data: any = await this._customForm.showFormNotification(this.token.token, servicetype.id, id);

      if (data && data.datos) {

        const formnotification: any = data.datos;

        const type: number = +formnotification[0].type;

        this.forma.setValue({
          'servicetype_name': servicetype.name,
          'id': formnotification[0].id,
          'servicetype_id': formnotification[0].servicetype_id,
          'name': formnotification[0].name,
          'description': formnotification[0].description,
          'type': String(formnotification[0].type),
          'value': formnotification[0].value,
          'main': formnotification[0].main,
          'body': formnotification[0].body,
          'user': JSON.parse(formnotification[0].user),
          'status': Number(formnotification[0].status)
        });

        if (type === 1) {
          this.forma.controls.user.enable();
          this.forma.controls.main.enable();
          this.forma.controls.body.enable();
          this.forma.controls.value.disable();
          this.forma.controls.value.setValue('');
        } else if (type === 2) {
          this.forma.controls.user.disable();
          this.forma.controls.main.disable();
          this.forma.controls.body.disable();
          this.forma.controls.value.enable();
          this.forma.controls.user.setValue([]);
          this.forma.controls.main.setValue('');
          this.forma.controls.body.setValue('');
        } else if (type === 3) {
          this.forma.controls.user.enable();
          this.forma.controls.main.enable();
          this.forma.controls.body.enable();
          this.forma.controls.value.enable();
        }

        this.sendGetAtributo(servicetype.id, id);

        this.cd.markForCheck();
      }

      this.isLoading = false;
    }

  }

  updateForma(forma) {
    if (!forma) {
      return;
    }
    const dialogRef = this.dialog.open(EditNotificationComponent, {
      width: '477px',
      disableClose: true,
      data: {notification: forma.getRawValue(), project_id: this.project_id}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.formulario && result.formulario.id > 0) {
        this.getNotificationsRefresh(result.formulario.servicetype_id);
        this.forma = result.forma;
      }
    });
  }

  async updatePila(data: any, forma: any) {

    const formdata = forma.getRawValue();
    const pila = [];
    for (let i = 0; i < data.length; i++) {
      const item: any = data[i];
      if ((item.type === 'spinner' || item.type === 'radio') && ( (item.alert || item.form_id > 0) || (item.form_id !== 0 && item.alert !== null))) {
        if (item.alert === 'Seleccione' ) {
          item.alert = null;
        }
        const obj = {atributo_id: item.id, valor: item.alert, status: 1, id: item.form_id};
        pila.push(obj);
      }
    }
    if (formdata && pila.length > 0) {
      this.isLoadingAtributosSave = true;
      const object: object = {'pila': pila};
      const update: any = await this._customForm.updateFieldNotification(this.token.token, object, formdata.id);
      if (update && update.status === 'success') {
        this.sendGetAtributo(formdata.servicetype_id, formdata.id);
        this.toasterService.success('Formulario actulizado exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
        this.isLoadingAtributosSave = false;
        return;
      } else {
        Swal.fire('Importante', 'A ocurrido un error con la actulización del formulario', 'error');
        return;
      }
    } else {
      Swal.fire('Importante', 'Debe selecionar al menos 1 respuesta para actulizar la Alerta', 'error');
      this.isLoadingAtributosSave = false;
      return;
    }
  }

  async savePila(data: any, forma: any) {

    const formdata = forma.getRawValue();
    const pila = [];
    for (let i = 0; i < data.length; i++) {
      const item: any = data[i];
      if (item && item.alert) {
        if (item.type === 'spinner' || item.type === 'radio') {
            const obj = {atributo_id: item.id, valor: item.alert, status: 1, id: item.form_id};
            pila.push(obj);
        }
      }
    }

    if (formdata && pila.length > 0) {
      const object: object = {'pila': pila};
      this.isLoadingAtributosSave = true;
      const store: any = await this._customForm.storepostFieldNotification(this.token.token, object, formdata.id);
      if (store && store.status === 'success') {
        this.sendGetAtributo(formdata.servicetype_id, formdata.id);
        this.toasterService.success('Formulario creado exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
        this.isLoadingAtributosSave = false;
        return;
      } else {
        Swal.fire('Importante', 'A ocurrido un error con el registro del formulario', 'error');
        this.isLoadingAtributosSave = false;
        return;
      }
    } else {
      Swal.fire('Importante', 'Debe selecionar al menos una respuesta para crear la Notificación', 'error');
      return;
    }
  }

  async sendGetAtributo(servicetype_id: any, id: any) {
    const list: any = await this._customForm.getFormFieldNotification(this.token.token, id);

    if (list && list.datos) {
      this.booaction = true;
      this.getAtributo(servicetype_id, list.datos);
    } else {
      this.getAtributo(servicetype_id);
      this.booaction = false;
    }
  }

  getAtributo(servicetype_id: any, list?: any) {

    if (servicetype_id) {

      this.isLoadingAtributos = true;
      this.atributo = null;
      this.dataSource = new MatTableDataSource();
      this.paginator.firstPage();
      this.subscription = this._orderService.getAtributoServiceType(this.token.token, servicetype_id).subscribe(
        response => {
                  if (!response) {
                    this.isLoadingAtributos = false;
                    return;
                  }
                  if (response.status === 'success') {
                    const atributotem = response.datos;
                    /**
                    if (atributotem.length > 0 && !list) {
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
                    } else */ if (atributotem.length > 0) {
                      for (let i = 0; i < atributotem.length; i++) {
                        atributotem[i]['form_id'] = 0;
                        if (list && list.length > 0) {
                          for (let x = 0; x < list.length; x++) {
                            if ( list[x]['atributo_id'] === atributotem[i]['id']) {
                              atributotem[i]['alert'] = list[x]['valor'];
                              atributotem[i]['form_id'] = list[x]['id'];
                              list.splice(x, 1);
                              break;
                            }
                          }
                        }
                        /**
                        if (atributotem[i]['type'] === 'chip') {
                          atributotem[i]['datos'] = JSON.parse(atributotem[i]['datos']);
                          atributotem[i]['datos'] = atributotem[i]['datos']['chip'];
                          atributotem[i]['datos'].forEach(elemento => {
                            elemento.descripcion = elemento.value;
                            elemento.value = false;
                          });
                          atributotem[i]['datopila'] = atributotem[i]['datos'];
                        }
                        // tslint:disable-next-line:max-line-length
                        if (atributotem[i]['type'] !== 'chip' && atributotem[i]['type'] !== 'label' && atributotem[i]['type'] !== 'layout_line' && atributotem[i]['type'] !== 'spinner' && atributotem[i]['type'] !== 'radio') {
                          atributotem[i]['datopila'] = atributotem[i]['datos'];
                        }
                        */
                      }
                    }
                    this.dataSource = new MatTableDataSource(atributotem);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.atributo = atributotem;
                    this.isLoadingAtributos = false;
                  }
                  },
              error => {
              this.isLoadingAtributos = false;
              console.log(<any>error);
              });
    }
  }

  resetform() {
    this.atributo = null;
    this.dataSource = new MatTableDataSource();
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.forma.reset();
  }

  async deleteForma(forma) {
    if (!forma) {
      return;
    }

    const formulario: any = forma.getRawValue();

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta acción es permanente. ¿Seguro de que quieres eliminar la Notificación?',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    })
    .then( async borrar => {
      if (borrar.value) {
        if (borrar) {
          const deleteform: any = await this._customForm.deleteFormNotification(this.token.token, formulario.servicetype_id, formulario.id);
          if (deleteform && deleteform.status === 'success') {
            this.getNotificationsRefresh(formulario.servicetype_id);
            this.resetform();
            this.toasterService.success('Notificación eliminada exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
            this.cd.markForCheck();
          } else {
            Swal.fire('Importante', 'A ocurrido un error en la eliminación. Verifique si existen ordenes asociadas a la notificación.', 'error');
            return;
          }
        }
      } else if (borrar.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
        );
      }
    });
  }

  sideNavOnClick() {
    this.sidenav.opened = !this.sidenav.opened;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
