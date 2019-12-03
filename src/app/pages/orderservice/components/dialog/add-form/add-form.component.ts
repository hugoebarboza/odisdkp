import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { UserService, CustomformService } from 'src/app/services/service.index';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.css']
})
export class AddFormComponent implements OnInit {

  identity: any;
  isLoading: Boolean = false;
  isLoadingProjectForm: Boolean = false;
  isLoadingProjectFormField: Boolean = false;
  project: any;
  project_id: number;
  project_name: string;
  orderid = 0;
  token: any;
  projectformdata = [];
  projectformfield = [];

  estructuraDatos: [];

  nameForm: String = '';
  descripcionForm: String = '';

  formFormularios: FormGroup;

  constructor(
    public _userService: UserService,
    public dialogRef: MatDialogRef<AddFormComponent>,
    private cd: ChangeDetectorRef,
    public toasterService: ToastrService,
    public _customForm: CustomformService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
   }

  ngOnInit() {

    if (this.data.project > 0) {

      this.orderid = this.data.orderid;
      this.project_id = this.data.project;

      this.cargarProjectForm(this.project_id);

      this.formFormularios = new FormGroup({
        formularios: new FormControl (null, [Validators.required]),
      });
    }

  }

  async cargarProjectForm (id: number) {
    if (id && id > 0) {
      this.isLoadingProjectForm = true;
      this.projectformdata = [];
      const data: any = await this._customForm.getProjectForm(this.token.token, id);
      if (data && data.datos.length > 0) {
        this.projectformdata = data.datos;
        this.isLoadingProjectForm = false;
        this.cd.markForCheck();
      } else {
        this.projectformdata = [];
        this.isLoadingProjectForm = false;
        this.cd.markForCheck();
      }
    }
  }

  changeprojectformdata(data: any) {
    if (data) {
      this.nameForm = data.name;
      this.descripcionForm = data.descripcion;
      this.cargarProjectFormField(this.project_id, data.id);
    }
  }

  async cargarProjectFormField (id: number, formid: number) {

    if (id && id > 0 && formid && formid > 0) {
      this.isLoadingProjectFormField = true;
      this.projectformfield = [];

      const response: any = await this._customForm.getFormResource(this.token.token, this.orderid, formid);
      const form: any = await this._customForm.getProjectFormField(this.token.token, id, formid);

      if (response && response.status === 'success' && response.datos.length > 0) {

        const res = response.datos;

        const arraydata: Array<Array<object>> = [];

        let num = 0;

        for (let i = 0; i < res.length; i++) {
          const element: any = res[i];

          if (arraydata.length === 0) {
            arraydata[num] = [element];
          } else {

            if (arraydata[num] && element.order_by === num) {
              const arr = arraydata[num];
              arr.push(element);
              arraydata[num] = arr;
            } else {
              num = num + 1;
              arraydata[num] = [element];
            }

          }

        }

        if (form && form.datos.length > 0 && arraydata.length > 0) {
          this.estructuraDatos = form.datos;
          const datos: [] = form.datos;
          for (let i = 0; i < arraydata.length; i++) {
            const registro = arraydata[i];
            this.projectformfield.push(this.getEstructuraAndForm(datos, registro));
            this.isLoadingProjectFormField = false;
            this.cd.markForCheck();
          }
        }

      } else {
        if (form && form.datos.length > 0) {
          this.estructuraDatos = form.datos;
          const datos: [] = form.datos;
          this.projectformfield.push(this.getEstructura(datos));
          this.isLoadingProjectFormField = false;
          this.cd.markForCheck();
        } else {
          this.projectformfield = [];
          this.isLoadingProjectFormField = false;
          this.cd.markForCheck();
        }
      }
    }
  }


  getEstructuraAndForm(data: Array<Object>, registro: Array<Object>): Array<Object> {

    if (data && data.length > 0) {

      const arr: Array<Object> = [];

      for (let i = 0; i < data.length; i++) {
        const element: any = data[i];
        let boovalidate = false;
        for (let x = 0; x < registro.length; x++) {
          const reg: any = registro[x];
          if (reg.de_form_id === element.id) {
            boovalidate = true;
            const estructura: Object = {
              orderid: this.orderid,
              description: element.description,
              form_id: element.form_id,
              id: element.id,
              name: element.name,
              order_by: element.order_by,
              predetermined: element.predetermined,
              required: element.required,
              rol: element.rol,
              type: element.type,
              type_id: element.type_id,
              value: reg.valor,
            };

            arr.push(estructura);
          }

        }

        if (!boovalidate) {
          const estructura: Object = {
            orderid: this.orderid,
            description: element.description,
            form_id: element.form_id,
            id: element.id,
            name: element.name,
            order_by: element.order_by,
            predetermined: element.predetermined,
            required: element.required,
            rol: element.rol,
            type: element.type,
            type_id: element.type_id,
            value: '',
          };
          arr.push(estructura);
        }


      }

      return arr;

    }

  }

  getEstructura(data: Array<Object>): Array<Object> {

    if (data && data.length > 0) {

      const arr: Array<Object> = [];

      for (let i = 0; i < data.length; i++) {
        const element: any = data[i];

        const estructura: Object = {
          orderid: this.orderid,
          description: element.description,
          form_id: element.form_id,
          id: element.id,
          name: element.name,
          order_by: element.order_by,
          predetermined: element.predetermined,
          required: element.required,
          rol: element.rol,
          type: element.type,
          type_id: element.type_id,
          value: '',
        };

        arr.push(estructura);

      }

      return arr;

    }

  }


  async saveFormField(formdata: any) {

    if (formdata) {
      const data: object = {'pila': formdata, 'form_id': formdata[0][0]['form_id']};
      // console.log(JSON.stringify(data));
      const store: any = await this._customForm.storepostFormResource(this.token.token, data, this.orderid);
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
      Swal.fire('Importante', 'A ocurrido un error en la creación del formulario', 'error');
      return;
    }
  }

  cancelFormField() {
    const that = this;
      Swal.fire({
        title: '¿Esta seguro?',
        text: 'Esta seguro de cancelar el registro del formulario',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      }).then( borrar => {
        if (borrar.value) {
          if (borrar) {
            that.projectformfield  = [];
              that.nameForm = '';
              that.descripcionForm = '';
              that.formFormularios.setValue({
                'formularios': null
              });

          }
        }
      });

  }

  agregarForm() {
    // console.log(this.estructuraDatos);
    this.projectformfield.push(this.getEstructura(this.estructuraDatos));
  }

  deleteFormField(data: any) {

    if (data) {

      const that = this;
      Swal.fire({
        title: '¿Esta seguro?',
        text: 'Esta seguro de borrar parte del registro del formulario',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      }).then( borrar => {
        if (borrar.value) {
          if (borrar) {
            that.projectformfield.splice(that.projectformfield.indexOf(data), 1);
            if (that.projectformfield.length === 0) {
              that.nameForm = '';
              that.descripcionForm = '';
              that.formFormularios.setValue({
                'formularios': null
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

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
