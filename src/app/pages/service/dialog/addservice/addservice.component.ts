import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs/Subscription';


import { AngularFireAuth } from '@angular/fire/auth';

import Swal from 'sweetalert2';

// MODELS
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
  UserFirebase} from 'src/app/models/types';

//MOMENT
import * as _moment from 'moment';
const moment = _moment;

//SERVICES
import { CdfService, CountriesService, OrderserviceService, ProjectsService, UserService } from 'src/app/services/service.index';

//REDUX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { LoginAction } from 'src/app/contador.actions';




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
  destinatarios = [];
  en: any;

  lastInsertedId:number;
  emailbody:string ='';
  emailprojectservicetype:any;
  emailcomuna:any;
  

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
    private store: Store<AppState>,
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


  public confirmAdd(_form: NgForm): void {

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

    //console.log(this.data);
    //return;    

    this._project.addService(this.token.token, this.data, this.data.project_id).subscribe(
			(data:any) => { 

				if(data.status === 'success'){
          Swal.fire('Proyecto creado exitosamente con ID: ', data.lastInsertedId +'.', 'success' );
          this.lastInsertedId = data.lastInsertedId;
          this.afterAddService();
          this.refresh();
          if(this.destinatario.length > 0)  {
            //SEND CDF MESSAGING AND NOTIFICATION
            this.sendCdf(this.destinatario);
          }                
				}else{
					Swal.fire('No fue posible procesar su solicitud', data.message, 'error');
				}

				},
				(err: HttpErrorResponse) => {	
				Swal.fire('No fue posible procesar su solicitud', err.error.message, 'error');
				});

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


  private afterAddService(){
    if (!this.data) {
      return;
    }

    this.emailprojectservicetype = this.filterProjectservicetype();
    this.emailcomuna = this.filterComuna();

    if(this.user_informador && this.user_informador.email){
      this.destinatarios.push(this.user_informador.email);
    }

    if(this.user_responsable && this.user_responsable.email){
      this.destinatarios.push(this.user_responsable.email);
    }

    if(this.user_itocivil_assigned_to && this.user_itocivil_assigned_to.email){
      this.destinatarios.push(this.user_itocivil_assigned_to.email);
    }


    if(this.user_itoelec_assigned_to && this.user_itoelec_assigned_to.email){
      this.destinatarios.push(this.user_itoelec_assigned_to.email);
    }


    if(this.data && this.data.responsable_email){
      this.destinatarios.push(this.data.responsable_email);
    }

    //console.log(this.destinatarios);
    //this.data.contratista
    //console.log(this.emailprojectservicetype.descripcion);
    //console.log(this.emailcomuna.commune_name);
    //console.log(this.emailbody);
    //console.log(created);

    
    if(this.emailprojectservicetype.descripcion){
      this.emailbody = 'El Tipo de Proyecto es (' + this.emailprojectservicetype.descripcion + ').';
    }

    if(this.emailcomuna.commune_name){
      this.emailbody = this.emailbody + ' Comuna: (' + this.emailcomuna.commune_name + ').';
    }
    
    if(this.data.contratista){
      this.emailbody = this.emailbody + ' Contratista: (' + this.data.contratista + ')';
    }
    

    if (this.data && this.userFirebase.uid && this.destinatarios.length > 0) {
      this.destinatarios.forEach(res => {
        this.sendCdfUser(res, this.emailbody);
        //that.sendCdfTag(res, docRef, 'Nueva solicitud');
      });
    }
  }


  sendCdfUser(to:string, body: string){

    //console.log(to);
    //console.log(this.data);
    //return;

    const created = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const project = { 
      numot : this.data.order_number,
      description : this.data.service_name, 
      lastInsertedId : this.lastInsertedId 
    };

    if (to && body && project && project.lastInsertedId > 0){
      this._cdf.httpEmailAddService(this.token.token, to, this.userFirebase.email, 'OCA GLOBAL - Gestión de Proyecto', created, body, project ).subscribe(
        response => {
            this.destinatarios = [];
          if (!response) {
            return false;
          }
          if (response.status === 200) {
            //console.log(response);
          }
        },
          error => {
            this.destinatarios = [];
            console.log(<any>error);
          }
        );
    }

  }



  private afterRefresch(p:any, i:any): void {
    const obj: any = {project: p, identificacion: i};
    const accion = new LoginAction(obj);
    this.store.dispatch( accion );
    //console.log('redux dispacth action refresch menu')
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
              console.log(<any>error);
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
                //console.log(this.users);
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

  filterProjectservicetype(){
    if(this.projectservicetype && this.data.type_id){
      for(var i = 0; i < this.projectservicetype.length; i += 1){
        var result = this.projectservicetype[i];
        if(result.id === this.data.type_id){
            return result;
        }
      }
    }    
  }

  filterComuna(){
    if(this.comunas && this.data.comuna_id){
      for(var i = 0; i < this.comunas.length; i += 1){
        var result = this.comunas[i];
        if(result.id === this.data.comuna_id){
            return result;
        }
      }
    }    
  }

  

}
