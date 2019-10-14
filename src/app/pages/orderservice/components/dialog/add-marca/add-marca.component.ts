import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl } from '@angular/forms';

//MODELS
import { Proyecto } from 'src/app/models/types';

//SERVICES
import { UserService } from 'src/app/services/service.index';

@Component({
  selector: 'app-add-marca',
  templateUrl: './add-marca.component.html',
  styleUrls: ['./add-marca.component.css']
})
export class AddMarcaComponent implements OnInit {

  id:number;
  identity: any;
  loading: boolean = false;
  project: any;
  project_id: number
  project_name: string;
  proyectos: Array<Proyecto> = [];
  selected = new FormControl(0);
  subtitle:string = "Seleccione cualquiera de las siguientes opciones."
  title:string = "Marca de Vehículo";
  totalRegistros: number = 0;
  token: any;    

  constructor(    
    public _userService: UserService,
    public dialogRef: MatDialogRef<AddMarcaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.proyectos = this._userService.getProyectos();

   }


  ngOnInit() {
    if(this.data.project_id > 0){
      this.project_id = this.data.project_id;
      this.id = this.data.service_id;
      this.project = this.filter();
      this.project_name = this.project.project_name;
      this.loading = false;
    }    
  }

  loadDataTotal(total:number){
    this.totalRegistros = total;    
  }  

  filter(){
    if(this.proyectos && this.project_id){
      for(var i = 0; i < this.proyectos.length; i += 1){
        var result = this.proyectos[i];
        if(result.id === this.project_id){
            return result;
        }
      }
    }    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}