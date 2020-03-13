import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FormControl } from '@angular/forms';

// MODELS
import { UserService } from 'src/app/services/service.index';

@Component({
  selector: 'app-add-priority',
  templateUrl: './add-priority.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./add-priority.component.css']
})
@UntilDestroy()
export class AddPriorityComponent implements OnInit {

  identity: any;
  isLoading = true;
  project: any;
  project_name = '';
  proyectos: any;
  selected = new FormControl(0);
  subtitle = 'Seleccione cualquiera de las siguientes opciones.';
  title = 'Prioridad';
  totalRegistros: number;
  token: any;

  constructor(
    public _userService: UserService,
    public dialogRef: MatDialogRef<AddPriorityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();
  }

  async ngOnInit() {
    if (this.data && this.data.project_id > 0 && this.data.service_id > 0) {
      console.log(this.data);
      this.project = await this.filter(this.data.project_id);
      if (this.project) {
        this.project_name = this.project.project_name;
        this.isLoading = false;
      }
    }
  }


  loadDataTotal(total: number) {
    this.totalRegistros = total;
  }

  filter(id: number) {
    if (this.proyectos && id) {
      for ( let i = 0; i < this.proyectos.length; i += 1) {
        const result = this.proyectos[i];
        if (result.id === id) {
            return result;
        }
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
