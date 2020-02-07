import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

// SERVICES
import { UserService } from 'src/app/services/service.index';


@Component({
  selector: 'app-add-sed',
  templateUrl: './add-sed.component.html',
  styleUrls: ['./add-sed.component.css']
})
export class AddSedComponent implements OnInit {

  id: number;
  identity: any;
  loading = false;
  project: any;
  project_id: number;
  project_name: string;
  proyectos = [];
  selected = new FormControl(0);
  subtitle = 'Seleccione cualquiera de las siguientes opciones.';
  title = 'Tipos de SED';
  totalRegistros = 0;
  token: any;

  constructor(
    public _userService: UserService,
    public dialogRef: MatDialogRef<AddSedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    if (this.data.project_id > 0) {
      this.project_id = this.data.project_id;
      this.id = this.data.service_id;
      this.project = this.filter();
      this.project_name = this.project.project_name;
      this.loading = false;
    }
  }

  loadDataTotal(total: number) {
    this.totalRegistros = total;
  }

  filter() {
    if (this.proyectos && this.project_id) {
      for ( let i = 0; i < this.proyectos.length; i += 1) {
        const result = this.proyectos[i];
        if (result.id === this.project_id) {
            return result;
        }
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
