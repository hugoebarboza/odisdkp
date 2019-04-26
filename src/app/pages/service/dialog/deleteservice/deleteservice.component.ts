import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

//MODELS
import { Service, User } from '../../../../models/types';

//SERVICES
import { OrderserviceService, ProjectsService, UserService } from '../../../../services/service.index';


@Component({
  selector: 'app-deleteservice',
  templateUrl: './deleteservice.component.html',
  styleUrls: ['./deleteservice.component.css']
})
export class DeleteServiceComponent implements OnInit {
  public title: string = 'Eliminar';
  public loading: boolean = true;
  public project: string;
  public project_id: number = 0;
  public services: Service;
  public service_detail: Service;
  public service_data: Service;
  public service_name: string;
  public subscription: Subscription;
  public token: any;
  public users: User[] = [];
  public users_ito: User[] = [];



  constructor(
    public _customer: OrderserviceService,
    public _project: ProjectsService,
    public _userService: UserService,
    public dialogRef: MatDialogRef<DeleteServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) {     
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    if(this.data.service_id > 0){
      this.subscription = this._customer.getService(this.token.token, this.data.service_id).subscribe(
        response => {
                  if(!response){
                    this.loading = false;
                    return;
                  }
                  if(response.status == 'success'){
                    this.services = response.datos;                  
                    this.project = this.services['project']['project_name'];
                    this.project_id = this.services['project']['id'];
                    this.service_name = this.services['service_name'];
                    if(this.services['servicedetail'][0]){
                      this.service_detail = response.datos.servicedetail;                      
                      this.service_data = response.datos.servicedetail[0];
                    }    
                    
                    if(this.project_id >0){
                      this.loadUserProject(this.project_id);
                    }                
                    
                    this.loading = false;
                  }
       });

    }
  }

  confirmDelete(){
    this._project.deleteService(this.token.token, this.project_id, this.data.service_id);
  }

  loadUserProject(id:number){
    this.subscription = this._project.getUserProject(this.token.token, id, 7).subscribe(
    response => {
              if(!response){
                return;
              }
              if(response.status == 'success'){    
                this.users = response.datos;
              }
              });        

    this.subscription = this._project.getUserProject(this.token.token, id, 4).subscribe(
    response => {
              if(!response){
                return;
              }
              if(response.status == 'success'){    
                this.users_ito = response.datos;
              }
              });
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.subscription.unsubscribe();
  }

  ngOnDestroy() {
    //console.log('La página se va a cerrar');
    this.subscription.unsubscribe();
  }

}
