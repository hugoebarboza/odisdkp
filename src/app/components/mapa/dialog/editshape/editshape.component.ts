import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService, CustomformService } from 'src/app/services/service.index';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-editshape',
  templateUrl: './editshape.component.html',
  styleUrls: ['./editshape.component.css']
})

export class EditshapeComponent implements OnInit {

  forma: FormGroup;
  identity: any;
  isLoading = true;
  title = 'Editar figura:';
  token: any;
  project_id = 0;
  categoria = [];
  service_id = 0;

  constructor(
    public cdf: ChangeDetectorRef,
    public _userService: UserService,
    public _customForm: CustomformService,
    public toasterService: ToastrService,
    public dialogRef: MatDialogRef<EditshapeComponent>,
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
        id: new FormControl(0),
        name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
        description: new FormControl(null, [Validators.required, Validators.minLength(2)]),
        id_categoria: new FormControl(null, [Validators.required]),
        coordinates: new FormControl(null, [Validators.required, Validators.minLength(2)]),
        type: new FormControl(0),
        status: new FormControl(0)
      });
      this.forma.setValue({
        'id': this.data.id,
        'name': this.data.name,
        'description': this.data.description,
        'type': this.data.type,
        'id_categoria': this.data.id_categoria,
        'coordinates': JSON.stringify(this.data.coordinates),
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
    const update: any = await this._customForm.updateMapFigura(this.token.token, object, pila.id_categoria, pila.id);
    if (update && update.status === 'success') {
      // this.getAtributo(this.servicetype);
      // console.log(pila);
      this.toasterService.success('Figura registradas exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
      this.isLoading = false;
      return this.dialogRef.close(pila);
    } else {
      Swal.fire('Importante', 'A ocurrido un error con el registro de la figura', 'error');
      this.isLoading = false;
    }
  }

}
