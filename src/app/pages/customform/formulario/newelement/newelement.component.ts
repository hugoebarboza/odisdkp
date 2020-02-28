import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { UserService } from 'src/app/services/service.index';
import { FormGroup, FormControl, Validators } from '@angular/forms';
/**
interface Pila {
  id: number;
  servicetype_id: number;
  order_by: number;
  descripcion: String;
  type: String;
  datos: any;
  dependencia: String;
  observacion: String;
  required: number;
  rol: number;
  status: number;
  create_by: number;
  create_at: String;
  update_by: number;
  update_at: String;
} */

@Component({
  selector: 'app-newelement',
  templateUrl: './newelement.component.html',
  styleUrls: ['./newelement.component.css']
})
export class NewelementComponent implements OnInit {

  identity: any;
  token: any;
  roles = [];
  types = [
    {type: 'date', value: 'Fecha'},
    {type: 'datepicker', value: 'Fecha y hora'},
    {type: 'timepicker', value: 'Hora'},
    {type: 'spinner', value: 'Lista deplegable'},
    {type: 'layout_line', value: 'Salto de linea'},
    {type: 'radio', value: 'Seleción única'},
    {type: 'chip', value: 'Seleción multiple'},
    {type: 'text', value: 'Texto'},
    {type: 'textarea', value: 'Texto amplio'},
    {type: 'int', value: 'Texto numerico'},
    {type: 'double', value: 'Texto numerico con decimales'},
    {type: 'label', value: 'Título'}
  ];
  forma: FormGroup;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<NewelementComponent>,
    public _userService: UserService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
    }

  addRow(): void {

    const form = this.forma.getRawValue();

    if (form && form.type && form.type === 'spinner') {
      const datosfiltro = form.datos;
      const newdatosfiltro: Array<any> = [];
      for (let i = 0; i < datosfiltro.length; i++) {
        const element = datosfiltro[i];
        if (element.label) {
          newdatosfiltro.push({value: element.label});
        } else {
          newdatosfiltro.push({value: element});
        }
      }
      form.datos = newdatosfiltro;
    }
    console.log(form);

    this._bottomSheetRef.dismiss({
      message: 'success',
      data: form
    });

  }

  ngOnInit(): void {
    this.getRoleUser();

    this.forma = new FormGroup({
      id: new FormControl(0),
      servicetype_id: new FormControl({value: 0, disabled: true}, [Validators.required]),
      order_by: new FormControl(0),
      descripcion: new FormControl('', [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      datos: new FormControl(null),
      dependencia: new FormControl({value: '', disabled: true}),
      observacion: new FormControl({value: '', disabled: true}),
      required: new FormControl(0, [Validators.required]),
      rol: new FormControl(null, [Validators.required]),
      status: new FormControl(0, [Validators.required]),
      create_by: new FormControl(0, [Validators.required]),
      create_at: new FormControl({value: '', disabled: true}),
      update_by: new FormControl({value: 0, disabled: true}),
      update_at: new FormControl({value: '', disabled: true})
    });

    this.forma.setValue({
      'id': 0,
      'servicetype_id': this.data.servicetype.id,
      'order_by': 0,
      'descripcion': '',
      'type': null,
      'datos': null,
      'dependencia': '',
      'observacion': '',
      'required': 0,
      'rol': null,
      'status': 1,
      'create_by': this.identity.sub,
      'create_at': '',
      'update_by': 0,
      'update_at': ''
    });
  }

  showRespuestas(type: any): boolean {
    if (type === 'text' || type === 'textarea' || type === 'int' || type === 'double') {
      return true;
    }
    return false;
  }

  changetype(type: any) {

    if (type === 'layout_line') {
      this.forma.controls['descripcion'].setValue('linear');
      this.forma.controls['descripcion'].disable();
      this.forma.controls['descripcion'].updateValueAndValidity();
    } else {
      this.forma.controls['descripcion'].setValue('');
      this.forma.controls['descripcion'].enable();
      this.forma.controls['descripcion'].updateValueAndValidity();
    }

    if (type === 'spinner' || type === 'radio' || type === 'chip') {
        this.forma.controls['datos'].setValue([]);
        this.forma.controls['datos'].setValidators([Validators.required, Validators.minLength(1)]);
    } else {
      this.forma.controls['datos'].setValue('');
      this.forma.controls['datos'].clearValidators();
      this.forma.controls['datos'].updateValueAndValidity();
    }
  }

  getRoleUser() {
    if (this.token.token) {
      this._userService.getRoleUser(this.token.token, this.identity.role).subscribe(
        response => {
          if (!response) {
            return false;
          }
          if (response.status === 'success') {
            this.roles = response.datos;
          }
        },
            error => {
            console.log(<any>error);
            }
        );
    }

  }

}
