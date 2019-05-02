import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

//MODELS
import { 
  Comuna,
  Customer,
  Proyecto,
  Provincia,
  ProjectServiceCategorie,
  ProjectServiceType,
  Region, 
  Service, 
  User } from '../../../../models/types';


//SERVICES
import { CountriesService, OrderserviceService, ProjectsService, UserService } from '../../../../services/service.index';

@Component({
  selector: 'app-addservice',
  templateUrl: './addservice.component.html',
  styleUrls: ['./addservice.component.css']  
})
export class AddServiceComponent implements OnInit {
  title: string = 'Agregar Proyecto';
  comunas: Comuna[] = [];
  customers: Customer [] = [];  
  en: any;
  id:number;
  identity: any;
  isLoading:boolean = false;
  loading: boolean = false;
  proyectos: Array<Proyecto> = [];
  project: any;
  project_name: string;
  projectservicecategorie: ProjectServiceCategorie[] = [];
  projectservicetype: ProjectServiceType[] = [];
  provincias: Provincia[] = [];
  regiones: Region[] = [];
  termino: any;
  users: User[] = [];
  users_ito: User[] = [];
  user_informador: any;
	user_responsable:any;
	user_itocivil_assigned_to: any;
	user_itoelec_assigned_to: any;
  subscription: Subscription;
  token: any;



  constructor(
    public _customer: OrderserviceService,
    public _project: ProjectsService,
    public _regionService: CountriesService,
    public _userService: UserService,
    public dialogRef: MatDialogRef<AddServiceComponent>,      
    @Inject(MAT_DIALOG_DATA) public data: Service
  ) 
  { 
    this.loading = true;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.proyectos = this._userService.getProyectos();
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
      this.id = this.data.project_id;
      this.loadInfo();
      this.loadProjectServiceType();
      this.loadProjectServiceCategorie();
      this.loadUserProject();
      this.project = this.filter();
      this.project_name = this.project.project_name;
      this.loading = false;


      /*
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
        }); */

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

  
  filter(){
    if(this.proyectos && this.id){
      for(var i = 0; i < this.proyectos.length; i += 1){
        var result = this.proyectos[i];
        if(result.id === this.id){
            return result;
        }
      }
    }    
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
