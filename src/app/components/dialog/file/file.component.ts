import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';



@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {

  title = "Documentos de Proyecto";
  project_id: number;
  service_id: number;
  tiposervicio_id: number;
  order_id: number = 0;
  error: string;
  private CARPETA_ARCHIVOS = '';
  colorToggle: string;
  backgroundColorToggle: string;
  selected = new FormControl(0);

  links = ['Listado', 'Almacenar'];
  activeLink = this.links[0];
  background = '';

  constructor(
  	public dialogRef: MatDialogRef<FileComponent>,
    @Inject(MAT_DIALOG_DATA) public data 
  	) { 
  	  this.colorToggle = 'primary';
  	  this.backgroundColorToggle = 'primary';
      this.project_id = data['project'];
      this.service_id = data['servicio'];
      this.tiposervicio_id = data['tiposervicio'];   
      this.order_id = data['orderid'];   
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.error = '';
  }

}
