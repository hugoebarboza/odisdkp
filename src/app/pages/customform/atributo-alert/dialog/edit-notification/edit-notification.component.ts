import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CustomformService, OrderserviceService, UserService, DataService } from 'src/app/services/service.index';
import { NewAlertComponent } from '../new-alert/new-alert.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-notification',
  templateUrl: './edit-notification.component.html',
  styleUrls: ['./edit-notification.component.css']
})
export class EditNotificationComponent implements OnInit, OnDestroy {

  forma: FormGroup;
  identity: any;
  isLoading = true;
  proyectos: any;
  servicestype = [];
  title = 'Editar notificación del formulario:';
  token: any;
  subscription: Subscription;
  usuarios: Array<UserMail> = [];
  project_id = 0;

  constructor(
    public _customForm: CustomformService,
    private _orderService: OrderserviceService,
    public _userService: UserService,
    private cd: ChangeDetectorRef,
    public dataService: DataService,
    public dialogRef: MatDialogRef<NewAlertComponent>,
    public toasterService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    if (!this.data) {
      this.isLoading = false;
      return;
    }

    this.buildForma();
    this.cd.markForCheck();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async buildForma() {

    if (this.data && this.data.notification) {

      const notification: any = this.data.notification;
      this.project_id = this.data.project_id;
      this.servicestype.push(notification.servicetype_id);
      this.getInspectores();

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

      this.showFormNotification(notification);
      this.cd.markForCheck();

    }

  }

  async showFormNotification(notification: any) {

    if (notification && notification.id > 0) {

      this.isLoading = true;
      const data: any = await this._customForm.showFormNotification(this.token.token, notification.servicetype_id, notification.id);

      if (data && data.datos) {
        const formnotification: any = data.datos;

        const type: number = +formnotification[0].type;

        this.forma.setValue({
          'servicetype_name': this.data.notification.servicetype_name,
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

        this.cd.markForCheck();
      }

      this.isLoading = false;
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
        this.dialogRef.close({formulario: formulario, forma: forma});
        this.toasterService.success('Notificación actualizada exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
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

  selectType($event: any) {
    if ($event && $event.value && $event.value > 0) {
      const value: number = +$event.value;
      if (value === 1) {
        this.forma.controls.user.enable();
        this.forma.controls.main.enable();
        this.forma.controls.body.enable();
        this.forma.controls.value.disable();
        this.forma.controls.value.setValue('');
      } else if (value === 2) {
        this.forma.controls.user.disable();
        this.forma.controls.main.disable();
        this.forma.controls.body.disable();
        this.forma.controls.value.enable();
        this.forma.controls.user.setValue([]);
        this.forma.controls.main.setValue('');
        this.forma.controls.body.setValue('');
      } else if (value === 3) {
        this.forma.controls.user.enable();
        this.forma.controls.main.enable();
        this.forma.controls.body.enable();
        this.forma.controls.value.enable();
      }
    }
  }

  getInspectores() {
    this.dataService.getInspectores(this.project_id, this.token.token, this.identity.role).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            const users: Array<UserMail> = [];
            for (let i = 0; i < some['datos'].length; i++) {
              users.push({email: some['datos'][i]['email']});
            }
            this.usuarios = users;
          },
          (error) => {
            console.log(<any>error);
          }
        );
      }
    );
  }

  getServiceType(id: number) {
    if (id && id > 0) {
      this.servicestype = [];
      this.subscription = this._orderService.getServiceType(this.token.token, id).subscribe(
        response => {
                  if (!response) {
                    this.cd.markForCheck();
                    return;
                  }
                  if (response.status === 'success') {
                    this.servicestype = response.datos;
                    this.cd.markForCheck();
                  }
        });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

interface UserMail {
  email: string;
}
