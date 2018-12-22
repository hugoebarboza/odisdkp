import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatProgressButtonOptions } from 'mat-progress-buttons'
import { MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { FileItem } from '../../../models/file-item';
import { CargaImagenesService } from '../../../services/carga-imagenes.service';


//MOMENT
import * as _moment from 'moment';
const moment = _moment;


@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.css'],
})
export class CargaComponent implements OnInit {


  title = "Carga de Documentos";
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
  }


  estaSobreElemento = false;
  archivos: FileItem[] = [];
  uploadTrack: FileItem[] = [];

  @Input() projectid : number;
  @Input() serviceid : number;
  @Input() orderid : number;

  constructor( 
    public _cargaImagenes: CargaImagenesService,
    public snackBar: MatSnackBar,
    ) { 


      this.created =  new FormControl(moment().format('YYYY[-]MM[-]DD HH:MM'));
  }

  ngOnInit() {
    if (this.orderid == 0){
      this.CARPETA_ARCHIVOS = 'filesprojects/'+this.projectid+'/'+this.serviceid;
    }
    if (this.orderid > 0){
      this.CARPETA_ARCHIVOS = 'filesorders/'+this.projectid+'/'+this.orderid;
    }
  }

  cargarImagenes() {
    //console.log(this.archivos);
    this._cargaImagenes.cargarImagenesFirebase( this.archivos,  this.CARPETA_ARCHIVOS, this.created.value);

    this.snackBar.open('Guardadon documentos.', '', {duration: 2000,});    
  }

  limpiarArchivos() {
    this.archivos = [];
  }



}
