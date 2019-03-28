import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

//MODELS
import { Comuna } from '../../../models/Comuna';
import { Customer } from '../../../models/Customer';
import { ProjectServiceCategorie } from '../../../models/ProjectServiceCategorie';
import { ProjectServiceType } from '../../../models/ProjectServiceType';
import { Provincia } from '../../../models/Provincia';
import { Region } from '../../../models/Region';
import { Service } from '../../../models/service';
import { User } from '../../../models/User';

//SERVICES
import { CountriesService } from '../../../services/countries.service';
import { OrderserviceService } from '../../../services/orderservice.service';
import { ProjectsService } from '../../../services/projects.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-addservice',
  templateUrl: './addservice.component.html',
  styleUrls: ['./addservice.component.css']  
})
export class AddServiceComponent implements OnInit {
  public title: string = 'Agregar Proyecto';
  public comunas: Comuna[] = [];
  public customers: Customer [] = [];  
  public en: any;
  public identity: any;
  public isLoading:boolean = false;
  public loading: boolean = false;
  public project: string;
  public projectservicecategorie: ProjectServiceCategorie[] = [];
  public projectservicetype: ProjectServiceType[] = [];
  public provincias: Provincia[] = [];
  public regiones: Region[] = [];
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
    public dialogRef: MatDialogRef<AddServiceComponent>,      
    @Inject(MAT_DIALOG_DATA) public data: Service
  ) 
  { 
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
    if(this.data.project_id > 0){
      this.loadInfo();
      this.loadProjectServiceType();
      this.loadProjectServiceCategorie();
      this.loadUserProject();
      this._project.getProject(this.token.token, this.data.project_id).then(
        (res:any) => {
          {
            res.subscribe(
              (some) => 
              {
                if(some.datos){                      
                  this.project = some.datos.project_name
                  this.loading = false;
                }else{
                }
              },
              (error) => { 
              this.loading = false;
              console.log(<any>error);
              }  
              )
        }

        });   
    }
  }

  ngOnDestroy() {
    //console.log('La página se va a cerrar');
    this.subscription.unsubscribe();
  }


  public confirmAdd(form:NgForm): void {
    var addform = form;
    if(this.user_informador){
      this.data.user_informador = this.user_informador.id;
    }
    if(this.user_responsable){
      this.data.user_responsable = this.user_responsable.id;
    }
    if(this.user_itocivil_assigned_to){
      this.data.user_itocivil_assigned_to = this.user_itocivil_assigned_to.id;
    }
    if(this.user_itoelec_assigned_to){
      this.data.user_itoelec_assigned_to = this.user_itoelec_assigned_to.id;
    }

    //let obj = Object.assign(this.data);
    //console.log(obj);

    this._project.addService(this.token.token, this.data, this.data.project_id);

  }


  onNoClick(): void {
    this.dialogRef.close();
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

  
  loadProjectServiceCategorie(){
    this.projectservicecategorie = null;    
    this.subscription = this._project.getProjectServiceCategorie(this.token.token, this.data.project_id).subscribe(
    response => {
              if(!response){
                return;
              }
              if(response.status == 'success'){                  
                this.projectservicecategorie = response.datos;
                //console.log(this.projectservicecategorie.length);
              }
              });
  }



  loadProjectServiceType(){
    this.projectservicetype = null;    
    this.subscription = this._project.getProjectServiceType(this.token.token, this.data.project_id).subscribe(
    response => {
              if(!response){
                return;
              }
              if(response.status == 'success'){                  
                this.projectservicetype = response.datos;
                //console.log(this.projectservicetype.length);
              }
              });        

  }



 loadUserProject(){
    this.subscription = this._project.getUserProject(this.token.token, this.data.project_id, 7).subscribe(
    response => {
              if(!response){
                return;
              }
              if(response.status == 'success'){    
                this.users = response.datos;
              }
              });        

    this.subscription = this._project.getUserProject(this.token.token, this.data.project_id, 4).subscribe(
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
               //console.log(this.provincias.length);
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

    if(this.termino.length > 0){
      //console.log(this.termino);
      this.isLoading = true;
      this.subscription = this._customer.getCustomer(this.token.token, this.termino, this.data.project_id).subscribe(
       response => {
             if(!response){
               this.isLoading = true
               return;
             }
             if(response.status == 'success'){                  
               this.customers = response.datos;
               this.isLoading = false             
               //console.log(response.datos);                
             }
             }); 
     }else{
      this.isLoading = false;
      this.customers = [];
     }
  }
 


}
