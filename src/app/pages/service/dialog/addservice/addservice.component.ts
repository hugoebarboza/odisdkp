import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireAuth } from 'angularfire2/auth';

import swal from 'sweetalert';

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
  User, 
  UserFirebase} from '../../../../models/types';

//MOMENT
import * as _moment from 'moment';
const moment = _moment;

//SERVICES
import { CdfService, CountriesService, OrderserviceService, ProjectsService, UserService } from '../../../../services/service.index';




@Component({
  selector: 'app-addservice',
  templateUrl: './addservice.component.html',
  styleUrls: ['./addservice.component.css']  
})
export class AddServiceComponent implements OnInit, OnDestroy {
  title: string = 'Agregar Proyecto';
  comunas: Comuna[] = [];
  customers: Customer [] = [];
  created: FormControl;
  destinatario = [];
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
  route: string = '';
  termino: any;
  users: User[] = [];
  users_ito: User[] = [];
  user_informador: any;
	user_responsable:any;
	user_itocivil_assigned_to: any;
	user_itoelec_assigned_to: any;
  subscription: Subscription;
  token: any;
  userFirebase: UserFirebase;



  constructor(
    private _cdf: CdfService,
    public _customer: OrderserviceService,
    public _project: ProjectsService,
    public _regionService: CountriesService,
    private _route: Router,
    public _userService: UserService,
    public dialogRef: MatDialogRef<AddServiceComponent>,
    private firebaseAuth: AngularFireAuth,  
    @Inject(MAT_DIALOG_DATA) public data: Service,
  ) 
  { 
    this.created =  new FormControl(moment().format('YYYY[-]MM[-]DD HH:mm:ss'));
    this.loading = true;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.proyectos = this._userService.getProyectos();
    this.route = this._route.url.split("?")[0];
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

    this.firebaseAuth.authState.subscribe(
      (auth) => {
        if(auth){
          this.userFirebase = auth;
        }
    });
      

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
    }
  }

  ngOnDestroy() {
    //console.log('La página se va a cerrar');
    if(this.subscription){
      this.subscription.unsubscribe();
    }

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

    this._project.addService(this.token.token, this.data, this.data.project_id).subscribe(
			(data:any) => { 

				if(data.status === 'success'){
          swal('Proyecto creado exitosamente con ID: ', data.lastInsertedId +'.', 'success' );
          if(this.destinatario.length > 0)  {
            //SEND CDF MESSAGING AND NOTIFICATION
            this.sendCdf(this.destinatario);
          }                
				}else{
					swal('No fue posible procesar su solicitud', data.message, 'error');
				}

				},
				(err: HttpErrorResponse) => {	
				swal('No fue posible procesar su solicitud', err.error.message, 'error');
				});

  }


  sendCdf(data){
    if(!data){
      return;
    }
  
    const body = 'Creación de Servicio en Proyecto: '+this.project_name+', con Num. OT: ' + this.data.order_number + ', y descripción: '+ this.data.service_name;
    
    if(this.destinatario.length > 0 && this.userFirebase.uid){
      for (let d of data) {
        
        const notification = {
          userId: this.userFirebase.uid,
          userIdTo: d.id,			
          title: 'Nuevo Servicio',
          message: body,
          create_at: this.created.value,
          status: '1',
          idUx: this.data.order_number,
          descriptionidUx: 'bd',
          routeidUx: `${this.route}`
        };  
  
        
        this._cdf.fcmsend(this.token.token, notification).subscribe(
          response => {        
            if(!response){
            return false;        
            }
            if(response.status == 200){ 
              //console.log(response);
            }
          },
            error => {
            console.log(<any>error);
            }   
          );			
            
  
  
          const msg = {
            toEmail: d.email,
            fromTo: this.userFirebase.email,
            subject: 'OCA GLOBAL - Nueva notificación',
            message: `<strong>Hola ${d.name} ${d.surname}. <hr> <div>&nbsp;</div> Tiene una nueva notificación, enviada a las ${this.created.value} por ${this.userFirebase.email}</strong><div>&nbsp;</div> <div> ${body}</div>`,
          };
  
          this._cdf.httpEmail(this.token.token, msg).subscribe(
            response => {        
              if(!response){
              return false;        
              }
              if(response.status == 200){ 
                //console.log(response);
              }
            },
              error => {
              //console.log(<any>error);
              }   
            );			                    
      }
    
    }
  
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
    this.subscription = this._project.getUserProject(this.token.token, this.data.project_id, 8).subscribe(
    response => {
              if(!response){
                return;
              }
              if(response.status == 'success'){    
                this.users = response.datos;
              }
              });        

    this.subscription = this._project.getUserProject(this.token.token, this.data.project_id, 7).subscribe(
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

  taguser(data){
    if(data.length == 0){
      data = '';
      return;
    }

    if(data.length > 0){
      this.destinatario = data;
      //console.log(this.destinatario);
    }
  }

 


}
