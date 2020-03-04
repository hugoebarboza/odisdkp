import { Component, Inject } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// SERVICES
import { UserService, CustomformService } from 'src/app/services/service.index';

@Component({
  selector: 'app-show-notificacion',
  templateUrl: './show-notificacion.component.html',
  styleUrls: ['./show-notificacion.component.css']
})
@UntilDestroy()
export class ShowNotificacionComponent  {

  identity: any;
  isLoading: boolean;
  token: any;

  constructor(
    public _customForm: CustomformService,
    public _userService: UserService,
    public dialogRef: MatDialogRef<ShowNotificacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { 
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.load();
  }

  load() {
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

    if (data && data.servicetype_id > 0 && data.formnotification_id > 0) {
      this.isLoading = true;
      const response: any = await this._customForm.showFormNotification(this.token.token, data.servicetype_id, data.formnotification_id);

      if (response && response.datos) {
        // const formnotification: any = data.datos;
        console.log(response);

      this.isLoading = false;
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
