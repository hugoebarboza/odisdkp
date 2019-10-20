import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { HttpErrorResponse } from '@angular/common/http';

import swal from 'sweetalert';

//MODELS
import { Proyecto, Service, ServiceValue, ServiceEstatus, ServiceTypeValue } from 'src/app/models/types';

//MOMENT
import * as _moment from 'moment';
const moment = _moment;

//SERVICES
import { OrderserviceService, ProjectsService, UserService } from 'src/app/services/service.index';
import { ServiceType } from '../../../../models/types';

//REDUX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { LoginAction } from 'src/app/contador.actions';




@Component({
  selector: 'app-clone-service',
  templateUrl: './clone-service.component.html',
  styleUrls: ['./clone-service.component.css']
})
export class CloneServiceComponent implements OnInit {

  forma: FormGroup;
  identity:any;
  isLoading: boolean = true;
  lastInsertedId: number;
  project: any;
  proyectos: Array<Proyecto> = [];
  service: Service;
  services: Service;
  service_data: Service;
  service_name: string;
  subscription: Subscription;
  title: string = 'Clonar proyecto ';
  token:any;

  constructor(
    public _dataService: OrderserviceService,
    public _project: ProjectsService,
    public _userService: UserService,
    public dialogRef: MatDialogRef<CloneServiceComponent>,
    public snackBar: MatSnackBar,
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();
   }

   ngOnInit() {
    if(this.data.project_id > 0){
      this.project = this.filter();
      this.service = this.filterService();
      this.isLoading = false;
      this.forma = new FormGroup({      
        order_number: new FormControl(null, [Validators.required, Validators.minLength(2)]),
        service_name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      }, );
      
      this.forma.setValue({
        'order_number': '',
        'service_name':''
      })
    }


    this.subscription = this._dataService.getService(this.token.token, this.data.service_id).subscribe(
      response => {
                if(!response){
                  return;
                }
                if(response.status == 'success'){
                  this.services = response.datos;
                  if(this.services && this.services['servicedetail'][0]){
                    this.service_data = response.datos.servicedetail[0];

                    if (this.service_data.reception_date !== '0000-00-00 00:00:00') {
                      this.service_data.reception_date =  moment(this.service_data.reception_date).format('YYYY-MM-DD HH:mm');
                    } else {
                      this.service_data.reception_date = null;
                    }
                
                    if (this.service_data.required_date !== '0000-00-00 00:00:00') {
                      this.service_data.required_date =  moment(this.service_data.required_date).format('YYYY-MM-DD HH:mm');
                    } else {
                      this.service_data.required_date = null;
                    }
                
                    if (this.service_data.due_date !== '0000-00-00 00:00:00') {
                      this.service_data.due_date =  moment(this.service_data.due_date).format('YYYY-MM-DD HH:mm');
                    } else {
                      this.service_data.due_date = null;
                    }
                
                    if (this.service_data.other_assigned_date_toitocivil !== '0000-00-00 00:00:00') {
                      this.service_data.other_assigned_date_toitocivil =  moment(this.service_data.other_assigned_date_toitocivil).format('YYYY-MM-DD HH:mm');
                    } else {
                      this.service_data.other_assigned_date_toitocivil = null;
                    }
                
                    if (this.service_data.other_assigned_date_toitoelec !== '0000-00-00 00:00:00') {
                      this.service_data.other_assigned_date_toitoelec =  moment(this.service_data.other_assigned_date_toitoelec).format('YYYY-MM-DD HH:mm');
                    } else {
                      this.service_data.other_assigned_date_toitoelec = null;
                    }
                
                    if (this.service_data.reception_crodate !== '0000-00-00 00:00:00') {
                      this.service_data.reception_crodate =  moment(this.service_data.reception_crodate).format('YYYY-MM-DD HH:mm');
                    } else {
                      this.service_data.reception_crodate = null;
                    }
                
                    if (this.service_data.checked_crodate !== '0000-00-00 00:00:00') {
                      this.service_data.checked_crodate =  moment(this.service_data.checked_crodate).format('YYYY-MM-DD HH:mm');
                    } else {
                      this.service_data.checked_crodate = null;
                    }
                
                    if (this.service_data.send_edpdate !== '0000-00-00 00:00:00') {
                      this.service_data.send_edpdate =  moment(this.service_data.send_edpdate).format('YYYY-MM-DD HH:mm');
                    } else {
                      this.service_data.send_edpdate = null;
                    }
                
                    if (this.service_data.accept_edpdate !== '0000-00-00 00:00:00') {
                      this.service_data.accept_edpdate =  moment(this.service_data.accept_edpdate).format('YYYY-MM-DD HH:mm');
                    } else {
                      this.service_data.accept_edpdate = null;
                    }
                
                    if (this.service_data.reject_edpdate !== '0000-00-00 00:00:00') {
                      this.service_data.reject_edpdate =  moment(this.service_data.reject_edpdate).format('YYYY-MM-DD HH:mm');
                    } else {
                      this.service_data.reject_edpdate = null;
                    }
                
                    if (this.service_data.assigned_date_touser1 !== '0000-00-00 00:00:00') {
                      this.service_data.assigned_date_touser1 =  moment(this.service_data.assigned_date_touser1).format('YYYY-MM-DD HH:mm');
                    } else {
                      this.service_data.assigned_date_touser1 = null;
                    }
                
                    if (this.service_data.assigned_date_touser2 !== '0000-00-00 00:00:00') {
                      this.service_data.assigned_date_touser2 =  moment(this.service_data.assigned_date_touser2).format('YYYY-MM-DD HH:mm');
                    } else {
                      this.service_data.assigned_date_touser2 = null;
                    }

                  }  
                }
     });    


  }

  confirmClone(){
		if(this.forma.invalid || !this.forma.value.order_number || !this.forma.value.service_name){
			swal('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
			return;
    }
    //console.log(this.forma.value);
    if(this.forma.valid){
      this.service_data.order_number = this.forma.value.order_number;
      this.service_data.service_name = this.forma.value.service_name;
    }
    
    //console.log(this.service_data);
    //return;

    this._project.cloneService(this.token.token, this.service_data, this.data.project_id, this.data.service_id).subscribe(
      (data:any) => { 
        //console.log(data);
        if(data.status === 'success'){
          this.lastInsertedId = data.lastInsertedId;
          if(data && this.lastInsertedId > 0){
            this.afterCloneAddServiceValue(data, this.lastInsertedId);
            this.afterCloneAddServiceType(data, this.lastInsertedId);
            this.afterCloneAddServiceStatus(data, this.lastInsertedId);  
          }
          this.onNoClick();
          swal('Proyecto clonado exitosamente ', '', 'success' );
          this.refresh();
        }else{
          this.onNoClick();
          swal('No fue posible procesar su solicitud', '', 'error');
        }				  
          },
          (err: HttpErrorResponse) => {	
          this.onNoClick();
          swal('No fue posible procesar su solicitud', err.error.message, 'error');
        });


  }

  private afterRefresch(p:any, i:any): void {
    const obj: any = {project: p, identificacion: i};
    const accion = new LoginAction(obj);
    this.store.dispatch( accion );
    //console.log('redux dispacth action refresch menu')
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

  
  afterCloneAddServiceValue(data: any, id:number){
    //return;
    if(data.service_value && data.service_value.length > 0 && id > 0){
      let service_value: ServiceValue;
      service_value = new ServiceValue (0, id, data.service_value[0].value_id, data.service_value[0].from_date, data.service_value[0].to_date, data.service_value[0].status, '', '');
      //console.log(service_value);
      this._project.addServiceValue(this.token.token, id, service_value)
              .subscribe( (resp: any) => {              
                if(!resp){
                  this.snackBar.open('Error registrando Service Value!!!', '', {duration:3000, });
                  return;        
                }
                if(resp.status == 'success'){
                  this.snackBar.open('Solicitud de registro Service Value procesada satisfactoriamente!!!', '', {duration: 1000,});            
                }else{
                }
              },
                error => {
                  this.snackBar.open('Error registrando Service Value!!!', error.error.mensaje, {duration:3000, });
                  console.log(<any>error);
                }       
              );  
  
    }else{
      return;
    }
    
  }


  afterCloneAddServiceStatus(data: any, id:number){
    if(data.service_status && data.service_status.length > 0 && id > 0){
      data.service_status.forEach(res => {
        //console.log(res);
        let service_status: ServiceEstatus;
        service_status = new ServiceEstatus (0, id, res.name, res.code, res.class, res.label , res.order_by, 0, 1, '', '');
        this._dataService.addEstatus(this.token.token, service_status, id)
        .subscribe( (resp: any) => {              
          if(!resp){
            this.snackBar.open('Error registrando Service Status!!!', '', {duration: 3000, });
            return;        
          }
          if(resp.status == 'success'){
            this.snackBar.open('Solicitud de registro de Service Status procesada satisfactoriamente!!!', '', {duration: 3000});
          }else{
          }
        },
          error => {
            this.snackBar.open('Error registrando Service Status!!!', error.error.mensaje, {duration:3000, });
            console.log(<any>error);
          }       
        );

      });      
    }else{
      return;
    }
  }

  afterCloneAddServiceType(data: any, id:number){
      
    if(data.service_type && data.service_type.length > 0 && id > 0){      
      data.service_type.forEach(res => {
        //console.log(res);
        let service_type: ServiceType;        
        service_type = new ServiceType (1, res.id, res.name, res.shortname, res.ndocumento, res.ddocumento, res.status, res.observation, res.sign, '', '');
        //console.log(service_type);
        this._project.addServiceType(this.token.token, id, service_type)
        .subscribe( (resp: any) => {
          if (!resp) {
            this.snackBar.open('Error registrando Service Type!!!', '', {duration: 3000, });
            return;
          }
          if (resp.status === 'success') {
            if (res.id && data) {
              let lastInsertedSTId = resp.lastInsertedId;
              //console.log(lastInsertedSTId);
              this.filterServiceTypeValue(res.id, data.service_type_value, lastInsertedSTId)
            }    
            this.snackBar.open('Solicitud de registro de Service Type procesada satisfactoriamente!!!', '', {duration: 3000});
            this.forma.reset();
          } else {
          }
        },
          error => {
            this.snackBar.open('Error registrando Service Type!!!', error.error.mensaje, {duration:3000, });
            console.log(<any>error);
          }
        );
      });
    }else{
      return;
    }    
  }

  afterCloneAddServiceTypeValue(id:number, data: any){
    if(id && data){
      let service_type_value: ServiceTypeValue;
      service_type_value = new ServiceTypeValue (0, id, data[0].value_id, data[0].from_date, data[0].to_date, data[0].status, '', '');
      //console.log(service_type_value);
      this._project.addServiceTypeValue(this.token.token, id, service_type_value)
      .subscribe( (resp: any) => {              
        if(!resp){
          this.snackBar.open('Error registrando Service Type Value!!!', '', {duration:3000, });
          return;        
        }
        if(resp.status == 'success'){
          this.snackBar.open('Solicitud de registro de Service Type Value procesada satisfactoriamente!!!', '', {duration: 3000,});
        }else{
        }
      },
        error => {
          this.snackBar.open('Error registrando Service Type Value!!!', error.error.mensaje, {duration:3000, });
          console.log(<any>error);
        }       
      );  

    }else{
      return;
    }
  }

  filterServiceTypeValue(id:number, data:any, newid: number){
    if(id && data){
      for(var i = 0; i < data.length; i += 1){
        var result = data[i];
        if(result.id === id){
          if(result.value && result.value.services_types_values_active.length > 0)
          this.afterCloneAddServiceTypeValue(newid, result.value.services_types_values_active)
          //console.log(result.value.services_types_values_active);
        }
      }      
    }
  }


  filter(){
    if(this.proyectos && this.data.project_id){
      for(var i = 0; i < this.proyectos.length; i += 1){
        var result = this.proyectos[i];
        if(result.id === this.data.project_id){
            return result;
        }
      }
    }    
  }

  filterService(){
    if(this.project.service && this.data.service_id){
      for(var i = 0; i < this.project.service.length; i += 1){
        var result = this.project.service[i];
        if(result.id === this.data.service_id){
            return result;
        }
      }
    }    
  }  


  onNoClick(): void {
    this.dialogRef.close();
  }

}
