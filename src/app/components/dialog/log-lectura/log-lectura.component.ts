import { Component, OnInit, Inject } from '@angular/core';
import { DataService } from 'src/app/services/service.index';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-log-lectura',
  templateUrl: './log-lectura.component.html',
  styleUrls: ['./log-lectura.component.css']
})
export class LogLecturaComponent implements OnInit {

  public identity: any;
  public token: any;
  logAddress: any;
  isLoading = true;
  cc_number: string;
  promedio = 0;

  constructor(
    public dataService: DataService,
    public dialogRef: MatDialogRef<LogLecturaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    if (this.data.cc_id && this.data.token) {
      this.token = this.data.token;
      this.cc_number = this.data.cc_number;
      this.getLogLectura(this.data.cc_id);
    }
  }

  getLogLectura(cc_id: any) {
    this.isLoading = true;
    this.dataService.getLogLectura(cc_id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            this.isLoading = false;
            if (some['datos']) {
              const lecturaArrayDatos: Array<object> = some['datos'];
              let suma = 0;
              const lecturaArray: Array<number> = [];
              for (let i = 0; i < lecturaArrayDatos.length; i++) {
                suma = suma + Number(lecturaArrayDatos[i]['lectura']);
                lecturaArray.push(lecturaArrayDatos[i]['lectura']);
              }
              this.promedio = Math.floor(suma / lecturaArrayDatos.length);
              this.logAddress = lecturaArray;
            }
          },
          (_error) => {
            this.isLoading = false;
            this.logAddress = null;
            console.log(<any>_error);
          }
        );
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
