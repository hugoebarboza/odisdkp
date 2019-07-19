import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

//MODELS
import { Proyecto, Service, User } from 'src/app/models/types';

//REDUX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { LoginAction } from 'src/app/contador.actions';


//SERVICES
import { OrderserviceService, ProjectsService, UserService } from '../../../../services/service.index';


@Component({
  selector: 'app-deleteservice',
  templateUrl: './deleteservice.component.html',
  styleUrls: ['./deleteservice.component.css']
})
export class DeleteServiceComponent implements OnInit {

  identity: any;
  public title: string = 'Eliminar';
  public loading: boolean = true;
  proyectos: Array<Proyecto> = [];
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
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) {
    this.identity = this._userService.getIdentity();   
    this.proyectos = this._userService.getProyectos();
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
    this.refresh();
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


  refresh(){    
    //this.RefreshMenu.emit(1);
    this.subscription = this._project.getProyectos(this.token.token, this.identity.dpto).subscribe(
      response => {
          if (response.status == 'success'){
            this.proyectos = response.datos;
            let key = 'proyectos';
            this._userService.saveStorage(key, this.proyectos);
            this.afterRefresch(this.proyectos, this.identity);
          }
        }
      );
  }

  private afterRefresch(p:any, i:any): void {
    const obj: any = {project: p, identificacion: i};
    const accion = new LoginAction(obj);
    this.store.dispatch( accion );
    //console.log('redux dispacth action refresch menu')
  }

  
  ngOnDestroy() {
    //console.log('La página se va a cerrar');
    this.subscription.unsubscribe();
  }

}
