import { Component, Inject } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs/Subscription';
import { timer } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

// FIREBASE
import { AngularFireAuth } from '@angular/fire/auth';

// SERVICES
import { CdfService, CustomformService, UserService } from 'src/app/services/service.index';

// MODELS
import { UserFirebase } from 'src/app/models/types';



@Component({
  selector: 'app-show-label-notification',
  templateUrl: './show-label-notification.component.html',
  styleUrls: ['./show-label-notification.component.css']
})
@UntilDestroy()
export class ShowLabelNotificationComponent  {

  destinatario = [];
  destroy = new Subject();
  identity: any;
  isLoading: boolean;
  notification: any = [];
  subscription: Subscription;
  title = 'Etiquetar notificación del formulario: ';
  token: any;
  userFirebase: UserFirebase;

  // BUTTONS
  barButtonOptionsDisabled: MatProgressButtonOptions = {
    active: false,
    text: 'Guardar y Enviar',
    buttonColor: 'primary',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: true
  };


  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Guardar y Enviar',
    buttonColor: 'primary',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  };


  constructor(
    private _cdf: CdfService,
    public _customForm: CustomformService,
    public _userService: UserService,
    public dialogRef: MatDialogRef<ShowLabelNotificationComponent>,
    private firebaseAuth: AngularFireAuth,
    private toasterService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
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
    this.load();
  }

  load() {

    this.isLoading = true;

    if (!this.data) {
      this.isLoading = false;
      return;
    }

    if (this.data && this.token.token) {
      this.showFormNotification(this.data);
    }

  }

  async showFormNotification(data: any) {
    if (!data) {
      return;
    }

    if (data && data.notification.servicetype_id > 0 && data.notification.formnotification_id > 0) {
      this.isLoading = true;
      const response: any = await this._customForm.showFormNotification(this.token.token, data.notification.servicetype_id, data.notification.formnotification_id);

      if (response && response.datos) {
        this.notification = response.datos[0];
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    }
  }


  submit(users = [], notification: any) {
    if (!users || !notification) {
      return;
    }

    this.barButtonOptions.active = true;
    this.barButtonOptions.text = 'Procesando...';


    if (users.length > 0 && this.data) {
      for (let x = 0; x < users.length; x++) {
        const usermail = users[x];

        const msg = {
          toEmail: usermail.email,
          fromTo: this.identity.email,
          subject: 'OCA GLOBAL - Nueva notificación - ' + notification.main,
          body: notification.body,
          project: this.data.project.project_name,
          service_name: this.data.notification.service_name,
          servicetype_name: this.data.notification.servicetype,
          order_number: this.data.notification.order_number,
          service_id: this.data.notification.service_id,
          order_id: this.data.notification.order_id
          };

        // console.log(msg);

        this._cdf.httpEmailNotification(this.token.token, msg).subscribe(
          response => {
            if (!response) {
            return false;
            }
            if (response.status === 200) {
              // console.log(response);
            this.destinatario = [];
            this.toasterService.success('Notificación enviada exitosamente.', 'Exito', {timeOut: 8000});
            this.subscription = timer(2000).subscribe(_res => this.onNoClick());
            this.barButtonOptions.active = false;
            this.barButtonOptions.text = 'Guardar y Enviar';

            }
          },
            error => {
            this.barButtonOptions.active = false;
            this.barButtonOptions.text = 'Guardar y Enviar';
            console.log(<any>error);
            }
          );
      }

    }


  }

  taguser(data: any)  {
    if (data.length === 0) {
      data = '';
      this.destinatario = data;
      return;
    }

    if (data.length > 0) {
      this.destinatario = data;
      // console.log(this.destinatario);
    }
 }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
