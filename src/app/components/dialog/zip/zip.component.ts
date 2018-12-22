import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-zip',
  templateUrl: './zip.component.html',
  styleUrls: ['./zip.component.css']
})
export class ZipComponent {

  title = "Zip de Imágenes";
  tiposervicio: Array<Object> = [];
  zona: Array<Object> = [];
  zona_id = 0;
  tipoServicio_id = 0;

  constructor(
    public dialogRef: MatDialogRef<ZipComponent>,
    @Inject(MAT_DIALOG_DATA) public data ) {
      this.tiposervicio = data['tiposervicio'];
      this.zona = data['zona'];
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}