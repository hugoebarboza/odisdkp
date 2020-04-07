import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService, CustomformService } from 'src/app/services/service.index';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-newshape',
  templateUrl: './newshape.component.html',
  styleUrls: ['./newshape.component.css']
})
export class NewshapeComponent implements OnInit {

  forma: FormGroup;
  identity: any;
  isLoading = true;
  title = 'Añadir figura:';
  token: any;
  project_id = 0;
  categoria = [];
  service_id = 0;

  constructor(
    public cdf: ChangeDetectorRef,
    public _userService: UserService,
    public _customForm: CustomformService,
    public toasterService: ToastrService,
    public dialogRef: MatDialogRef<NewshapeComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    if (this.data && this.data.service_id && this.data.service_id > 0) {
      this.service_id = this.data.service_id;
      console.log(this.service_id);
      this.getCategory();
    }
  }

  ngOnInit() {
    if (!this.data) {
      this.isLoading = false;
      return;
    }
    this.buildForma();
  }

  buildForma() {
    console.log('PASOOO ->', this.data);
    if (this.data && this.data.coordinates) {
      this.forma = new FormGroup({
        name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
        description: new FormControl(null, [Validators.required, Validators.minLength(2)]),
        id_categoria: new FormControl(null, [Validators.required]),
        coordinates: new FormControl(null, [Validators.required, Validators.minLength(2)]),
        type: new FormControl(0),
        status: new FormControl(0),
      });
      this.forma.setValue({
        'name': '',
        'description': '',
        'id_categoria': null,
        'coordinates': JSON.stringify(this.data.coordinates),
        'type': this.data.type,
        'status': 1
      });
      this.isLoading = false;
      this.cdf.detectChanges();
    }
  }

  async getCategory() {
    const response: any = await this._customForm.showMapCategory(this.token.token, this.service_id);
    console.log(response);
    if (response && response.status && response.status === 'success') {
      this.categoria = response.datos;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async saveForma(forma: FormGroup) {
    // const form: any = JSON.parse(JSON.stringify(forma.getRawValue()));
    // console.log(JSON.stringify(forma.getRawValue()));
    const pila: any = JSON.parse(JSON.stringify(forma.getRawValue()));
    const object: object = {'pila': pila};
    this.isLoading = true;
    const store: any = await this._customForm.storeMapFigura(this.token.token, object, pila.id_categoria);
    // console.log(store);
    if (store && store.status === 'success') {
      // this.getAtributo(this.servicetype);
      this.toasterService.success('Figura registradas exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
      this.isLoading = false;
      const data = store.data;
      data.id_categoria = Number(data.id_categoria);
      data.id = Number(store.lastInsertedId);
      this.dialogRef.close(data);
    } else {
      Swal.fire('Importante', 'A ocurrido un error con el registro de la figura', 'error');
      this.isLoading = false;
    }
  }

}
