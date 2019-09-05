import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl } from '@angular/forms';

//MODELS
import { Proyecto } from 'src/app/models/types';

//SERVICES
import { UserService } from 'src/app/services/service.index';

@Component({
  selector: 'app-add-project-currency-value',
  templateUrl: './add-project-currency-value.component.html',
  styleUrls: ['./add-project-currency-value.component.css']
})
export class AddProjectCurrencyValueComponent implements OnInit {

  customerid:number
  identity: any;
  loading: boolean = false;
  project: any;
  project_id: number
  project_name: string;
  proyectos: Array<Proyecto> = [];
  selected = new FormControl(0);
  subtitle:string = "Seleccione cualquiera de las siguientes opciones."
  title:string = "Baremos de Proyecto";
  totalRegistros: number = 0;
  token: any;   

  constructor(    
    public _userService: UserService,
    public dialogRef: MatDialogRef<AddProjectCurrencyValueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.proyectos = this._userService.getProyectos();

   }


   ngOnInit() {
    if(this.data.project_id > 0){
      this.project_id = this.data.project_id;
      this.project = this.filter();
      this.project_name = this.project.project_name;
      this.customerid = this.project.customer_id;
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