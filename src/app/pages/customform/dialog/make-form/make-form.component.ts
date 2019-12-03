import { Component, OnInit, Inject, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import Swal from 'sweetalert2';

// SERVICES
import { CustomformService, OrderserviceService, UserService } from 'src/app/services/service.index';

// TOASTER MESSAGES
import { ToastrService } from 'ngx-toastr';

// MODELS
import { Form } from 'src/app/models/types';


@Component({
  selector: 'app-make-form',
  templateUrl: './make-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./make-form.component.css']
})
export class MakeFormComponent implements OnInit, OnDestroy {

  forma: FormGroup;
  identity: any;
  isLoading = true;
  proyectos: any;
  services: [];
  servicestype = [];
  title = 'Añadir Formulario a Proyecto';
  token: any;
  subscription: Subscription;

  constructor(
    public _customForm: CustomformService,
    private _orderService: OrderserviceService,
    public _userService: UserService,
    private cd: ChangeDetectorRef,
    public dialogRef: MatDialogRef<MakeFormComponent>,
    public toasterService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
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
    if (this.data && this.data.data && this.data.data.id > 0 ) {
      const filterservice = await this.filterProject(this.data.data.id);
      if (filterservice) {
        this.services = filterservice.service;
        // console.log(this.services);
      }

      this.forma = new FormGroup({
        name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
        descripcion: new FormControl(null, [Validators.required, Validators.minLength(2)]),
        service_id: new FormControl(0, [Validators.required]),
        servicetype_id: new FormControl(),
        status: new FormControl(0, [Validators.required]),
      });

      this.forma.setValue({
        'name': '',
        'descripcion': '',
        'service_id': 0,
        'servicetype_id': 0,
        'status': 1
      });

      this.isLoading = false;
      this.cd.markForCheck();

    }

  }

  async saveForma(forma: any, id: number) {
    if (this.forma.invalid) {
      Swal.fire('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
      return;
    }

    const formulario: Form = new Form(0, id, forma.value.service_id, forma.value.servicetype_id, forma.value.name, forma.value.descripcion, forma.value.status, '', '', '', '');

    if (formulario) {
      const store: any = await this._customForm.store(this.token.token, formulario, id);
      // console.log(store);
      if (store && store.status === 'success') {
        this.dialogRef.close();
        this.toasterService.success('Formulario creado exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
        return;
      } else {
        this.dialogRef.close();
        Swal.fire('Importante', 'A ocurrido un error en la actualización de formulario', 'error');
        return;
      }

    } else {
      this.dialogRef.close();
      Swal.fire('Importante', 'A ocurrido un error en la creación del formulario', 'error');
      return;
    }
  }

  async filterProject(id: number) {
    if (this.proyectos && this.proyectos) {
      for (let i = 0; i < this.proyectos.length; i += 1) {
        const result = this.proyectos[i];
        if (result.id === id) {
            return result;
        }
      }
      return -1;
    }
  }

  selectChangeServicio(event: any) {
    if (event && event.id && event.id > 0) {
      this.getServiceType(event.id);
    }
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
                    // console.log(this.servicestype);
                  }
        });
    }
  }



  onNoClick(): void {
    this.dialogRef.close();
  }
}
