import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

//MODELS
import { Proyecto, ServiceType } from 'src/app/models/types';

//SERVICES
import { OrderserviceService, UserService } from 'src/app/services/service.index';


@Component({
  selector: 'app-add-service-type-value',
  templateUrl: './add-service-type-value.component.html',
  styleUrls: ['./add-service-type-value.component.css']
})
export class AddServiceTypeValueComponent implements OnInit {

  id:number;
  identity: any;
  loading: boolean = false;
  project: any;
  project_id: number
  project_name: string;
  proyectos: Array<Proyecto> = [];
  selected = new FormControl(0);
  service: any;
  servicetype: ServiceType[] = [];
  serviceTypeName: string = '';
  subtitle:string = "Seleccione cualquiera de las siguientes opciones."
  subscription: Subscription;
  title:string = "Valor de Tipo de Servicio";
  totalRegistros: number = 0;
  token: any;    

  constructor(    
    public _userService: UserService,
    public dataService: OrderserviceService,
    public dialogRef: MatDialogRef<AddServiceTypeValueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.proyectos = this._userService.getProyectos();

   }


  ngOnInit() {
    if(this.data.project_id > 0){
      //this.loadServiceType();
      this.project_id = this.data.project_id;
      this.id = this.data.service_id;
      this.project = this.filter();
      this.service = this.filterService();
      this.project_name = this.project.project_name;
      this.loading = false;
    }    
  }

  loadDataTotal(total:number){
    this.totalRegistros = total;    
  }  

  loadServiceTypeName(data:string){
    this.serviceTypeName = data;    
  }  


  public loadServiceType(){  
    this.servicetype = null;    
    this.subscription = this.dataService.getServiceType(this.token, this.data.service_id).subscribe(
    (response: any) => {
              if(!response){
                return;
              }
              if(response.status == 'success'){                  
                this.servicetype = response.datos;
                //console.log(this.servicetype);
              }
              },
    (error) => { 
                console.log(<any>error);
                }            
              );        
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

  filterService(){
    if(this.project.service && this.id){
      for(var i = 0; i < this.project.service.length; i += 1){
        var result = this.project.service[i];
        if(result.id === this.id){
            return result;
        }
      }
    }    
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
