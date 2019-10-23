import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

// FIREBASE
import { AngularFireAuth } from '@angular/fire/auth';

// MODELS
import {
  Comuna,
  Customer,
  Provincia,
  ProjectServiceCategorie,
  ProjectServiceType,
  Region,
  Service,
  User,
  UserFirebase} from '../../../../models/types';

// MOMENT
import * as _moment from 'moment';
const moment = _moment;


// SERVICES
import { CdfService, CountriesService, OrderserviceService, ProjectsService, UserService } from '../../../../services/service.index';


@Component({
  selector: 'app-editservice',
  templateUrl: './editservice.component.html',
  styleUrls: ['./editservice.component.css']
})
export class EditServiceComponent implements OnInit, OnDestroy {
  public title = 'Editar';
  public comunas: Comuna[] = [];
  public customers: Customer [] = [];
  created: FormControl;
  destinatario = [];

  destinatarios = [];
  public en: any;
  emailbody = '';
  emailprojectservicetype: any;
  emailcomuna: any;
  emailuser: any;


  public identity: any;
  public isLoading = false;
  public label: boolean;
  public loading = true;

  /** 
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
  */
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
  service_kpi: number;
  lectura_modulo: number;
  public termino: any;
  public users: User[] = [];
  public users_ito: User[] = [];
  public user_informador: any;
	public user_responsable:any;
	public user_itocivil_assigned_to: any;
	public user_itoelec_assigned_to: any;
  public subscription: Subscription;
  route: string = '';
  public token: any;
  userFirebase: UserFirebase;

  constructor(
    private _cdf: CdfService,
    public _customer: OrderserviceService,
    public _project: ProjectsService,
    public _regionService: CountriesService,
    private _route: Router,
    public _userService: UserService,
    public dialogRef: MatDialogRef<EditServiceComponent>,
    private firebaseAuth: AngularFireAuth,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.created =  new FormControl(moment().format('YYYY[-]MM[-]DD HH:mm:ss'));
    this.identity = this._userService.getIdentity();
    this.loading = true;
    this.route = this._route.url.split("?")[0];
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
    if(this.data.service_id > 0){
      //console.log(this.data);
      this.subscription = this._customer.getService(this.token.token, this.data.service_id).subscribe(
        response => {
                  if(!response){
                    this.loading = false;
                    return;
                  }

                  console.log(response);
                  if(response.status == 'success'){
                    this.services = response.datos;
                    this.project = this.services['project']['project_name'];
                    this.project_id = this.services['project']['id'];
                    this.service_name = this.services['service_name'];
                    this.service_kpi = this.services['kpi'];
                    this.lectura_modulo = this.services['lectura'];
                    //console.log(this.service_kpi);
                    if(this.services['servicedetail'][0]){
                      this.service_detail = response.datos.servicedetail;                      
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

  confirmEdit(_form: NgForm): void {
    if(this.services.service_name){
      this.service_data.service_name = this.services.service_name;
    }
    /*
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
    } */


    //let obj = Object.assign(this.service_data);
    //console.log(obj);

    //console.log(this.service_data);
    //return;

    this._project.updateService(this.token.token, this.service_data, this.project_id, this.data.service_id).subscribe(
      (data:any) => { 
        if(data.status === 'success'){
          Swal.fire('Proyecto actualizado exitosamente ', '', 'success' );
          this.afterEditService();
          if(this.destinatario.length > 0)  {
            //SEND CDF MESSAGING AND NOTIFICATION
            this.sendCdf(this.destinatario);
          }                
        }else{
          Swal.fire('No fue posible procesar su solicitud', '', 'error');
        }				  
          },
          (err: HttpErrorResponse) => {	
        Swal.fire('No fue posible procesar su solicitud', err.error.message, 'error');
        });
  }


  private afterEditService(){
    if (!this.service_data) {
      return;
    }

    this.emailprojectservicetype = this.filterProjectservicetype();
    this.emailcomuna = this.filterComuna();


    if(this.service_data.user_informador){
      this.emailuser = null;
      this.emailuser = this.filterUser(this.service_data.user_informador);
      if(this.emailuser !== null){
        this.destinatarios.push(this.emailuser.email);
      }
      
    }

    if(this.service_data.user_responsable){
      this.emailuser = null;
      this.emailuser = this.filterUser(this.service_data.user_responsable);
      if(this.emailuser !== null){
        this.destinatarios.push(this.emailuser.email);
      }      
    }

    if(this.service_data.user_itocivil_assigned_to ){
      this.emailuser = null;
      this.emailuser = this.filterUser(this.service_data.user_itocivil_assigned_to);
      if(this.emailuser !== null){
        this.destinatarios.push(this.emailuser.email);
      }      
    }


    if(this.service_data.user_itoelec_assigned_to ){
      this.emailuser = null;
      this.emailuser = this.filterUser(this.service_data.user_itoelec_assigned_to);
      if(this.emailuser !== null){
        this.destinatarios.push(this.emailuser.email);
      }      
    }


    if(this.service_data && this.service_data.responsable_email){      
        this.destinatarios.push(this.service_data.responsable_email);
    }

    if(this.emailprojectservicetype.descripcion){
      this.emailbody = 'El Tipo de Proyecto es (' + this.emailprojectservicetype.descripcion + ').';
    }

    if(this.emailcomuna.commune_name){
      this.emailbody = this.emailbody + ' Comuna: (' + this.emailcomuna.commune_name + ').';
    }
    
    if(this.service_data.contratista){
      this.emailbody = this.emailbody + ' Contratista: (' + this.service_data.contratista + ')';
    }
    

    if (this.service_data && this.userFirebase.uid && this.destinatarios.length > 0) {
      this.destinatarios.forEach(res => {
        this.sendCdfUser(res, this.emailbody);
        //that.sendCdfTag(res, docRef, 'Nueva solicitud');
      });
    }
  }

  sendCdfUser(to:string, body: string){
    const created = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const project = { 
      numot : this.service_data.order_number,
      description : this.service_data.service_name, 
      lastInsertedId : this.data.service_id
    };

    if (to && body && project && project.lastInsertedId > 0){
      this._cdf.httpEmailEditService(this.token.token, to, this.userFirebase.email, 'OCA GLOBAL - Gestión de Proyecto', created, body, project ).subscribe(
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


  sendCdf(data){
    if(!data){
      return;
    }
  
    const body = 'Edición de Servicio en Proyecto: '+this.project+', con Num. OT: ' + this.service_data.order_number + ', y descripción: '+ this.services.service_name;
    
    if(this.destinatario.length > 0 && this.userFirebase.uid){
      for (let d of data) {
        
        const notification = {
          userId: this.userFirebase.uid,
          userIdTo: d.id,			
          title: 'Edición de Servicio',
          message: body,
          create_at: this.created.value,
          status: '1',
          idUx: this.service_data.order_number,
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

  ngOnDestroy() {
    //console.log('La página se va a cerrar');
    if(this.subscription){
      this.subscription.unsubscribe();
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
    this.subscription = this._project.getUserProject(this.token.token, id, 8).subscribe(
    response => {
              if(!response){
                return;
              }
              if(response.status == 'success'){    
                this.users = response.datos;
              }
              });

    this.subscription = this._project.getUserProject(this.token.token, id, 8).subscribe(
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


  onChangeKpi(event:any) {
   
    if(event.checked == true){
      const tag = 1;
      this._project.statusKpi(this.token.token, this.project_id, this.data.service_id, tag);
      this.snackBar.open('Se ha activado el Kpi en Proyecto.', 'Destacada', {duration: 2000,});             
    }
    
    if(event.checked == false){       
      const tag = 0;
      this._project.statusKpi(this.token.token, this.project_id, this.data.service_id, tag);
      this.snackBar.open('Se ha desactivado el Kpi en Proyecto.', '', {duration: 2000,});             
    }           
  }

  onChangeLectura(event: any) {

    if (event.checked === true) {
      const tag = 1;
      this._project.lectura(this.token.token, this.project_id, this.data.service_id, tag);
      this.snackBar.open('Se ha activado el Modulo de lectura en Proyecto.', 'Destacada', {duration: 2000,});
    }

    if (event.checked === false) {
      const tag = 0;
      this._project.lectura(this.token.token, this.project_id, this.data.service_id, tag);
      this.snackBar.open('Se ha desactivado el Modulo de lectura en Proyecto.', '', {duration: 2000,});
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
    if(this.projectservicetype && this.service_data.type_id){
      for(var i = 0; i < this.projectservicetype.length; i += 1){
        var result = this.projectservicetype[i];
        if(result.id === this.service_data.type_id){
            return result;
        }
      }
    }    
  }

  filterComuna(){
    if(this.comunas && this.service_data.comuna_id){
      for(var i = 0; i < this.comunas.length; i += 1){
        var result = this.comunas[i];
        if(result.id === this.service_data.comuna_id){
            return result;
        }
      }
    }    
  }

  filterUser(id: number){
    if(this.users && id){
      for(var i = 0; i < this.users.length; i += 1){
        var result = this.users[i];
        if(result.id === id){
            return result;
        }
      }
    }    
  }


}
