import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';

//MODELS
import { 
  Comuna,
  Customer,
  Provincia,
  ProjectServiceCategorie,
  ProjectServiceType,
  Region, 
  Service, 
  User } from '../../../models/types';


//SERVICES
import { CountriesService, OrderserviceService, ProjectsService, UserService } from '../../../services/service.index';


@Component({
  selector: 'app-editservice',
  templateUrl: './editservice.component.html',
  styleUrls: ['./editservice.component.css']
})
export class EditServiceComponent implements OnInit {
  public title: string = 'Editar';
  public comunas: Comuna[] = [];
  public customers: Customer [] = [];  
  public en: any;
  public identity: any;
  public isLoading:boolean = false;
  public label: boolean;
  public loading: boolean = true;
  public new_accept_edpdate: any;
  public new_assigned_date_touser1: any;
  public new_assigned_date_touser2: any;
  public new_checked_crodate: any;
  public new_due_date: any;
  public new_other_assigned_date_toitocivil: any;
  public new_other_assigned_date_toitoelec: any;
  public new_reject_edpdate: any;
	public new_reception_date: any;
  public new_required_date: any;
  public new_reception_crodate: any;
  public new_send_edpdate: any;
  public project: string;
  public project_id: number = 0;
  public projectservicecategorie: ProjectServiceCategorie[] = [];
  public projectservicetype: ProjectServiceType[] = [];
  public provincias: Provincia[] = [];
  public regiones: Region[] = [];
  public services: Service;
  public service_detail: Service;
  public service_data: Service;
  public service_name: string;
  public termino: any;
  public users: User[] = [];
  public users_ito: User[] = [];
  public user_informador: any;
	public user_responsable:any;
	public user_itocivil_assigned_to: any;
	public user_itoelec_assigned_to: any;
  public subscription: Subscription;
  public token: any;

  constructor(
    public _customer: OrderserviceService,
    public _project: ProjectsService,
    public _regionService: CountriesService,
    public _userService: UserService,
    public dialogRef: MatDialogRef<EditServiceComponent>,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    
    this.identity = this._userService.getIdentity();
    this.loading = true;
    this.token = this._userService.getToken();
    this.en = {
      firstDayOfWeek: 0,
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"],
      monthNames: [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
      monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
      today: 'Hoy',
      clear: 'Borrar'
    };
  }

  formControl = new FormControl('', [Validators.required]);
  
  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Dato Requerido' : '';
  }  


  ngOnInit() {
    if(this.data.service_id > 0){
      //console.log(this.data.service_id);
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
                    //console.log(this.services);
                    if(this.services['servicedetail'][0]){
                      this.service_detail = response.datos.servicedetail;                      
                      this.service_data = response.datos.servicedetail[0];
                      //console.log(this.service_data);
                      if(this.service_data.region_id > 0){
                        this.onSelectRegion(this.service_data.region_id);
                      }

                      if(this.service_data.provincia_id > 0){
                        this.onSelectProvincia(this.service_data.provincia_id);
                      }

                    }  

                    if(this.project_id >0){
                      this.loadInfo();
                      this.loadProjectServiceType(this.project_id);
                      this.loadProjectServiceCategorie(this.project_id);
                      this.loadUserProject(this.project_id);
                      this.loading = false;
                    }                
                  }
       });

    }
  }

  confirmEdit(form:NgForm): void {
    if(this.services.service_name){
      this.service_data.service_name = this.services.service_name;
    }
    if(this.new_due_date){
      this.service_data.due_date = this.new_due_date;
    }
    if(this.new_reception_date){
      this.service_data.reception_date = this.new_reception_date;
    }
    if(this.new_required_date){
      this.service_data.required_date = this.new_required_date;
    }
    if(this.new_assigned_date_touser1){
      this.service_data.assigned_date_touser1 = this.new_assigned_date_touser1;
    }
    if(this.new_assigned_date_touser2){
      this.service_data.assigned_date_touser2 = this.new_assigned_date_touser2;
    }
    if(this.new_other_assigned_date_toitocivil){
      this.service_data.other_assigned_date_toitocivil = this.new_other_assigned_date_toitocivil;
    }
    if(this.new_other_assigned_date_toitoelec){
      this.service_data.other_assigned_date_toitoelec = this.new_other_assigned_date_toitoelec;
    }
    if(this.new_reception_crodate){
      this.service_data.reception_crodate = this.new_reception_crodate;
    }
    if(this.new_checked_crodate){
      this.service_data.checked_crodate = this.new_checked_crodate;
    }

    if(this.new_send_edpdate){
      this.service_data.send_edpdate = this.new_send_edpdate;
    }
    if(this.new_accept_edpdate){
      this.service_data.accept_edpdate = this.new_accept_edpdate;
    }
    if(this.new_reject_edpdate){
      this.service_data.reject_edpdate = this.new_reject_edpdate;
    }

    let obj = Object.assign(this.service_data);
    //console.log(obj);
    this._project.updateService(this.token.token, this.service_data, this.project_id, this.data.service_id);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    //console.log('La página se va a cerrar');
    this.subscription.unsubscribe();
  }


  loadInfo(){
    this.subscription = this._regionService.getRegion(this.token.token, this.identity.country).subscribe(
    response => {
       if(response.status == 'success'){                  
              this.regiones = response.datos.region;
              //console.log(this.regiones);
              //console.log(this.regiones.length);
            }else{
              this.regiones = null;
            }
     });
  }

  
  loadProjectServiceCategorie(id:number){
    this.projectservicecategorie = null;    
    this.subscription = this._project.getProjectServiceCategorie(this.token.token, id).subscribe(
    response => {
              if(!response){
                return;
              }
              if(response.status == 'success'){                  
                this.projectservicecategorie = response.datos;
                //console.log(this.projectservicecategorie);
              }
              });
  }



  loadProjectServiceType(id:number){
    this.projectservicetype = null;    
    this.subscription = this._project.getProjectServiceType(this.token.token, id).subscribe(
    response => {
              if(!response){
                return;
              }
              if(response.status == 'success'){                  
                this.projectservicetype = response.datos;
                //console.log(this.projectservicetype.length);
                //console.log(this.projectservicetype);
              }
              });        

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


  onSelectRegion(regionid:number) {      
    if(regionid > 0){
      this.comunas = [];
      this.subscription = this._regionService.getProvincia(this.token.token, regionid).subscribe(
       response => {
             if(!response){
               return;
             }
             if(response.status == 'success'){  
               this.provincias = response.datos.provincia;
               //console.log(this.provincias);
             }
             }); 
     }else{
       this.provincias = [];
     }
  }

  onSelectProvincia(provinciaid:number) {
    if(provinciaid > 0){
      this.subscription = this._regionService.getComuna(this.token.token, provinciaid).subscribe(
       response => {
             if(!response){
               return;
             }
             if(response.status == 'success'){  
               this.comunas = response.datos.comuna;
               //console.log(this.comunas);
             }
             }); 
     }else{
       this.comunas = [];
     }
  }

  public searchCustomer(termino: string){          
    this.termino = termino;
    //console.log(this.termino);
    if(this.termino.length > 0){
      this.isLoading = true;
      this.subscription = this._customer.getCustomer(this.token.token, this.termino, this.project_id).subscribe(
       response => {
             if(!response){
               this.isLoading = true
               return;
             }
             if(response.status == 'success'){                  
               this.customers = response.datos;
               this.isLoading = false             
             }
             }); 
     }else{
      this.isLoading = false;
      this.customers = [];
     }
  }

  onChange(event:any, id: number) {
    this.label = event.checked;
   
    if(this.label == true){
      const tag = 1;
      this._project.status(this.token.token, this.project_id, this.data.service_id, id, tag);
      this.snackBar.open('Se ha activado el Proyecto.', 'Destacada', {duration: 2000,});             
    }
    
    if(this.label == false){       
      const tag = 0;
      this._project.status(this.token.token, this.project_id, this.data.service_id, id, tag);
      this.snackBar.open('Se ha desactivado el Proyecto.', '', {duration: 2000,});             
    }           
  }


}
