import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// MODELS
import { Proyecto } from 'src/app/models/types';

// SERVICE
import { UserService } from 'src/app/services/service.index';

@Component({
  selector: 'app-add-doc',
  templateUrl: './add-doc.component.html',
  styleUrls: ['./add-doc.component.css']
})
export class AddDocComponent implements OnInit {

  identity: any;
  isLoading = true;
  path = 'allfiles/projects/';
  project: any;
  proyectos: Array<Proyecto> = [];
  service: any;
  token: any;


  constructor(
    public _userService: UserService,
    public dialogRef: MatDialogRef<AddDocComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.proyectos = this._userService.getProyectos();
    this.path = this.path + this.data.project_id + '/' + this.data.service_id + '/files';

  }

  ngOnInit() {
    if (this.data.project_id > 0) {
      this.project = this.filter();
      this.service = this.filterService();
      this.isLoading = false;
    }
  }


  filter() {
    if (this.proyectos && this.data.project_id) {
      for (let i = 0; i < this.proyectos.length; i += 1) {
        const result = this.proyectos[i];
        if (result.id === this.data.project_id) {
            return result;
        }
      }
    }
  }

  filterService() {
    if (this.project.service && this.data.service_id) {
      for (let i = 0; i < this.project.service.length; i += 1) {
        const result = this.project.service[i];
        if (result.id === this.data.service_id) {
            return result;
        }
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
