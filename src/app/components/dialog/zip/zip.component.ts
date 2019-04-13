import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

//MOMENT
import * as _moment from 'moment';
const moment = _moment;


@Component({
  selector: 'app-zip',
  templateUrl: './zip.component.html',
  styleUrls: ['./zip.component.css']
})
export class ZipComponent {
  
  title = "Zip de Imágenes";
  date = new FormControl(moment(new Date()).format('YYYY[-]MM[-]DD'));
  tiposervicio: Array<Object> = [];
  zona: Array<Object> = [];
  zona_id = 0;
  tipoServicio_id = 0;

  selectedColumnnDate = {
    fieldValue: '',
    criteria: '',
    columnValueDesde: this.date.value,
    columnValueHasta: this.date.value
  };


  constructor(
    public dialogRef: MatDialogRef<ZipComponent>,
    @Inject(MAT_DIALOG_DATA) public data ) {
      this.tiposervicio = data['tiposervicio'];
      this.zona = data['zona'];
      this.data.date = this.date.value;
      this.data.dateend = this.date.value;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}