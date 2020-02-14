import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CustomformService, UserService, DataService } from 'src/app/services/service.index';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-alert',
  templateUrl: './new-alert.component.html',
  styleUrls: ['./new-alert.component.css']
})

export class NewAlertComponent implements OnInit, OnDestroy {

  forma: FormGroup;
  identity: any;
  isLoading = true;
  proyectos: any;
  servicestype = [];
  title = 'Añadir notificación del formulario:';
  token: any;
  subscription: Subscription;
  usuarios: Array<UserMail> = [];
  project_id = 0;

  constructor(
    public _customForm: CustomformService,
    public _userService: UserService,
    private cd: ChangeDetectorRef,
    public dataService: DataService,
    public dialogRef: MatDialogRef<NewAlertComponent>,
    public toasterService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.identity = this._userService.getIdentity();
    // this.proyectos = this._userService.getProyectos();
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
    if (this.data && this.data.servicetype) {
      const servicetype: any = this.data.servicetype;
      this.project_id = this.data.project_id;
      this.servicestype.push(servicetype);
      this.getInspectores();

      this.forma = new FormGroup({
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

      this.forma.setValue({
        'name': '',
        'description': '',
        'servicetype_id': servicetype.id,
        'type': 0,
        'value': '',
        'user': [],
        'main': '',
        'body': '',
        'status': 1
      });

      this.isLoading = false;
      this.cd.markForCheck();

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

  async saveForma(forma: any) {
    if (forma.invalid) {
      Swal.fire('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
      return;
    }

    const formulario: any = forma.getRawValue();
    if (formulario) {
      const type: number = +formulario.type;
      formulario.type = type;
      const store: any = await this._customForm.storeFormNotification(this.token.token, formulario, formulario.servicetype_id);
      if (store && store.status === 'success') {
        this.dialogRef.close(store.lastInsertedId);
        this.toasterService.success('Notificación creada exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
        return;
      } else  if (store && store.status === 'error') {
        this.dialogRef.close(0);
        Swal.fire('Importante', 'A ocurrido un error en la creación de la notificación ' + store.message, 'error');
        return;
      }
    } else {
      this.dialogRef.close(0);
      Swal.fire('Importante', 'A ocurrido un error en la creación de la notificación', 'error');
      return;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

interface UserMail {
  email: string;
}
