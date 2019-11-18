import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import Swal from 'sweetalert2';

// SERVICES
import { CustomformService, OrderserviceService, UserService } from 'src/app/services/service.index';

// TOASTER MESSAGES
import { ToastrService } from 'ngx-toastr';

// MODELS
import { Form } from 'src/app/models/types';


@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./edit-form.component.css']
})
export class EditFormComponent implements OnInit, OnDestroy {

  forma: FormGroup;
  identity: any;
  isLoading = true;
  isLoadingProjectFormField = true;
  project: any;
  proyectos: any;
  projectformfield = [];
  services: [];
  servicestype = [];
  title = 'Editar Formulario Proyecto';
  token: any;
  subscription: Subscription;


  constructor(
    public _customForm: CustomformService,
    private _orderService: OrderserviceService,
    public _userService: UserService,
    private cd: ChangeDetectorRef,
    public dialogRef: MatDialogRef<EditFormComponent>,
    public toasterService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();
  }



  async ngOnInit() {
    if (!this.data) {
      this.isLoading = false;
      return;
    }
    if (this.data && this.data.id > 0 && this.data.service_id > 0) {
      const project = await this.filterProjectByService(this.data.service_id);
      this.project = project;
      if (project && project.id > 0) {
        this.services = project.service;
        this.cargarProjectFormField(project.id, this.data.id);
        this.cd.markForCheck();
      }
    } else {
      return;
    }
    this.cd.markForCheck();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  async buildForma(data: any) {


    if (this.data) {
      this.forma = new FormGroup({
        name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
        descripcion: new FormControl(null, [Validators.required, Validators.minLength(2)]),
        service_id: new FormControl('', [Validators.required]),
        servicetype_id: new FormControl(),
        status: new FormControl(0, [Validators.required]),
      });

      this.forma.setValue({
        'name': data.name,
        'descripcion': data.descripcion,
        'service_id': data.service_id,
        'servicetype_id': data.servicetype_id,
        'status': 1
      });

      // console.log(this.forma.value);
      if (this.forma.value.service_id) {
        this.getServiceType(this.forma.value.service_id);
        this.cd.markForCheck();
      }
      this.isLoading = false;
      this.cd.markForCheck();

    }

  }

  async cargarProjectFormField (id: number, formid: number) {
    if (id && id > 0 && formid && formid > 0) {
      this.isLoadingProjectFormField = true;
      this.projectformfield = [];

      const data: any = await this._customForm.getProjectFormField(this.token.token, id, formid);

      if (data && data.datos_forma) {
        this.projectformfield = data.datos_forma;
        // console.log(this.projectformfield);
        this.isLoadingProjectFormField = false;
        // this.createForm();
        this.buildForma(this.projectformfield);
        this.cd.markForCheck();
      } else {
        this.projectformfield = [];
        this.isLoadingProjectFormField = false;
        this.cd.markForCheck();
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

    const formulario: Form = new Form(this.data.id, this.project.id, forma.value.service_id, forma.value.servicetype_id, forma.value.name, forma.value.descripcion, status, '', '', '', '');
    if (formulario && this.project.id > 0 && this.data.id > 0) {
      const update: any = await this._customForm.update(this.token.token, formulario, this.project.id, this.data.id);
      if (update && update.status === 'success') {
        this.dialogRef.close(1);
        this.toasterService.success('Formulario actualizado exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
        return;
      } else {
        Swal.fire('Importante', 'A ocurrido un error en la actualización de formulario', 'error');
        return;
      }
    } else {
      Swal.fire('Importante', 'A ocurrido un error en la actualización de formulario', 'error');
      return;
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

  filterProjectByService(id: number) {
    if ( id && id > 0 && this.proyectos && this.proyectos.length > 0) {
      for (let i = 0; i < this.proyectos.length; i += 1) {
        const result = this.proyectos[i];
        if (result && result.service) {
          for (let y = 0; y < result.service.length; y += 1) {
            const response = result.service[y];
            if (response && response.id === id) {
              return result;
            }
          }
        }
      }
    }
  }

}
