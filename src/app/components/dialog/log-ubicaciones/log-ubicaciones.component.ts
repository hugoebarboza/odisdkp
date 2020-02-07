import { Component, OnInit, Inject } from '@angular/core';
import { DataService } from 'src/app/services/service.index';
import { LogLecturaComponent } from '../log-lectura/log-lectura.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-log-ubicaciones',
  templateUrl: './log-ubicaciones.component.html',
  styleUrls: ['./log-ubicaciones.component.css']
})

export class LogUbicacionesComponent implements OnInit {

  public identity: any;
  public token: any;
  logUbicaciones: any;
  isLoading = true;
  cc_number: string;

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
      this.getLogUbicaciones(this.data.cc_id);
    }
  }

  getLogUbicaciones(cc_id: any) {
    this.isLoading = true;
    this.dataService.getLogUbicaciones(cc_id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            this.isLoading = false;
            if (some['datos']) {
              this.logUbicaciones = some['datos'];
            }
          },
          (_error) => {
            this.isLoading = false;
            this.logUbicaciones = null;
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
