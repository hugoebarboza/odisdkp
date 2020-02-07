import { Component, OnInit, Inject, SimpleChanges, OnChanges, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';



@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit, OnChanges {

  title = 'Documentos de Proyecto';
  project_id: number;
  service_id: number;
  tiposervicio_id: number;
  order_id: number;
  error: string;
  colorToggle: string;
  backgroundColorToggle: string;
  selected = new FormControl(0);
  item: any = null;
  view = new BehaviorSubject(this.item);

  links = ['Listado', 'Almacenar'];
  activeLink = this.links[0];
  background = '';

  constructor(
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<FileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.colorToggle = 'primary';
      this.backgroundColorToggle = 'primary';
      this.project_id = 0;
      this.service_id = 0;
      this.tiposervicio_id = 0;
      this.order_id = 0;
      // this.cdr.detach();
  }

  ngOnInit() {
    if (this.data) {
      const olddialogdata = this.data;
      const newdialogdata: any = {...olddialogdata};
      this.view.next(newdialogdata);
      newdialogdata.project = this.view.value.project;
      newdialogdata.servicio = this.view.value.servicio;
      newdialogdata.tiposervicio = this.view.value.tiposervicio;
      newdialogdata.orderid = this.view.value.orderid;
      this.project_id = newdialogdata.project;
      this.service_id = newdialogdata.servicio;
      this.tiposervicio_id = newdialogdata.tiposervicio;
      this.order_id = newdialogdata.orderid;
      this.cdr.markForCheck();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Block 00000 change', changes);
    if (changes) {
      console.log(changes);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.error = '';
  }

}
