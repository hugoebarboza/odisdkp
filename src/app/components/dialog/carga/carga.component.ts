import { Component, OnInit, Input,  } from '@angular/core';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl} from '@angular/forms';

import { FileItem } from 'src/app/models/types';

import { CargaImagenesService } from 'src/app/services/service.index';


// MOMENT
import * as _moment from 'moment';
const moment = _moment;


@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.css'],
})
export class CargaComponent implements OnInit {


  title = 'Carga de Documentos';
  error: string;
  created: FormControl;
  private CARPETA_ARCHIVOS = '';

  barButtonOptionsDisabled: MatProgressButtonOptions = {
    active: false,
    text: 'Guardar',
    buttonColor: 'primary',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: true
  };


  estaSobreElemento = false;
  archivos: FileItem[] = [];
  uploadTrack: FileItem[] = [];

  @Input() projectid: number;
  @Input() serviceid: number;
  @Input() orderid: number;

  constructor(
    public _cargaImagenes: CargaImagenesService,
    public snackBar: MatSnackBar,
    ) {
      this.created =  new FormControl(moment().format('YYYY[-]MM[-]DD HH:MM'));
  }

  ngOnInit() {
    if (this.orderid === 0) {
      this.CARPETA_ARCHIVOS = 'filesprojects/' + this.projectid + '/' + this.serviceid;
    }
    if (this.orderid > 0) {
      this.CARPETA_ARCHIVOS = 'filesorders/' + this.projectid + '/' + this.orderid;
    }
  }

  cargarImagenes() {
    this._cargaImagenes.cargarImagenesFirebase( this.archivos,  this.CARPETA_ARCHIVOS, this.created.value);

    this.snackBar.open('Guardadon documentos.', '', {duration: 2000, });
  }

  limpiarArchivos() {
    this.archivos = [];
  }

}
