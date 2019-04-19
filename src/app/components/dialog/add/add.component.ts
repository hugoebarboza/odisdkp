import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators, NgForm, } from '@angular/forms';
import { Subscription } from 'rxjs';


//MOMENT
import * as _moment from 'moment';
const moment = _moment;


//SERVICES
import { OrderserviceService, ProjectsService, UserService } from '../../../services/service.index';

//MODELS
import { Order, Service, ServiceType, ServiceEstatus, User } from '../../../models/types';

interface ObjectServiceType {
      id: number;
      name: string;
}


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})

export class AddComponent implements OnInit, OnDestroy {
  public title: string;
  public identity: any;
  public token: any;
  public services: Service[] = [];
  public project: string;  
  public servicetype: ServiceType[] = [];
  public users: User[] = [];
  //private sub: any;  
  public arrayservicetype: ObjectServiceType[] = [];
  public termino: string;  
  public results: Object = [];
  public serviceestatus: ServiceEstatus[] = [];
  public show:boolean = false;
  public showdate:boolean = false;

  myDate: any;
  service_name:string;
  isLoading = false;
  loading: boolean;
  isOrderLoading: boolean;
  category_id: number;
  id:number;
  project_id:number;
  atributo = new Array();
  day = new Date().getDate();
  month = new Date().getMonth();
  year = new Date().getFullYear();
  hour = new Date().getHours();
  minutes = new Date().getMinutes();
  seconds = new Date().getSeconds();
  date = new FormControl(new Date());
  selectedUsers: any;

  serializedDate = new FormControl((new Date()).toISOString());
  en: any;



  subscription: Subscription;

 constructor(
  private _route: ActivatedRoute,
  private _router: Router,           
 	public dialogRef: MatDialogRef<AddComponent>,
  public dataService: OrderserviceService, 
  private _userService: UserService,
  private _orderService: OrderserviceService,
  private _projectService: ProjectsService,
  @Inject(MAT_DIALOG_DATA) public data: Order

 ) 
 
 { 
  this.title = "Agregar Orden";
  this.identity = this._userService.getIdentity();
  this.token = this._userService.getToken();

 }

   ngOnInit() {
     //console.log(this.data);
     //this.data.['order_date'] = "0000-00-00";     
     this.category_id = this.data['category_id'];
     this.loadService();     
     this.loadServiceType();
     this.loadServiceEstatus();
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

  ngOnDestroy() {
    //console.log('La página se va a cerrar');
    this.subscription.unsubscribe();
  }


  submit() {
  // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onGenerarOrder() {
  const order =this.identity.sub+''+this.day+''+this.month+''+this.year+''+this.hour+''+this.minutes+''+this.seconds+''+Math.round(Math.random()*100+1);
  this.data.order_number = order;
  }


  public confirmAdd(form:NgForm): void {

    var myArray = [];
    var pila = [];
    var addform = form;    
    var j = 0;
    myArray = addform.value;

    if(this.selectedUsers){
      this.data.assigned_to = this.selectedUsers.id;

    }



    for (var i=0; i<this.atributo.length; i++){
       if (myArray.hasOwnProperty(this.atributo[i]['id'])) { 
             if(this.atributo[i]['type'] !== 'label'){
               if( (!myArray[this.atributo[i]['id']]) || (myArray[this.atributo[i]['id']] == null)  || (typeof myArray[this.atributo[i]['id']] == 'undefined') || (myArray[this.atributo[i]['id']] == "") || (myArray[this.atributo[i]['id']] == " "))
               {
               pila[j] = { id: this.atributo[i]['id'], value: "S/N" };                 
               j++;
               }else{
                 if(this.atributo[i]['type'] == 'date'){
                  let newDate = moment(myArray[this.atributo[i]['id']], 'DD/MM/YYYY');
                  let day = newDate.date() ;
                  let month = newDate.month()+1;
                  let year = newDate.year();
                  let date =  day+'/'+month+'/'+year;
                  myArray[this.atributo[i]['id']] = date;
                 }
               pila[j] = { id: this.atributo[i]['id'], value: myArray[this.atributo[i]['id']] };
               j++;
               }
             }
               
          }
          else {
              //console.log(this.atributo[i]['id']); // toString or something else
          }      
         
    }
    let obj1 = {pila: pila };
    let obj = Object.assign(this.data, obj1);    
    this.dataService.add(this.token.token, obj, this.category_id);
    //this.dataService.add(this.token.token, this.data, this.category_id);
  }


  public loadService(){      
    this.servicetype = null;
    this.subscription = this._orderService.getService(this.token.token, this.data['service_id']).subscribe(
    response => {
              if(!response){
                return;
              }
              if(response.status == 'success'){    
                this.services = response.datos; 
                this.service_name = this.services['service_name'];
                this.project = this.services['project']['project_name'];
                this.project_id = this.services['project']['id'];
                 if(this.project_id >0){
                   this.loadUserProject(this.project_id);
                 }

              }
              });        
    }


  public loadServiceType(){  
    this.servicetype = null;    
    this.subscription = this._orderService.getServiceType(this.token.token, this.data['service_id']).subscribe(
    response => {
              if(!response){
                return;
              }
              if(response.status == 'success'){                  
                this.servicetype = response.datos;
                //console.log(this.servicetype);
              }
              });        
    }

   public loadUserProject(id: number){
    this.subscription = this._projectService.getUserProject(this.token.token, id, 6).subscribe(
    response => {
              if(!response){
                return;
              }
              if(response.status == 'success'){    
                this.users = response.datos;
              }
              });        

   }

   public searchCustomer(termino: string){          
     this.termino = termino;
     if(this.termino.length > 0){       
       this.isLoading = true;
     }else{
       this.isLoading = false;
     }
     if(this.termino.length > 1){       

       this.subscription = this._orderService.getCustomer(this.token.token, this.termino, this.category_id).subscribe(
        response => {
              if(!response){
                this.isLoading = true
                return;
              }
              if(response.status == 'success'){                  
                this.results = response.datos;
                this.isLoading = false             
                //console.log(response.datos);                
              }
              }); 
      }else{
        this.results = null;
      }
   }

  public loadAtributo(event: any){
    if(event > 0) {
    this.show = true;
    this.isOrderLoading = true;
    this.subscription = this._orderService.getAtributoServiceType(this.token.token, event).subscribe(
    response => {
      //console.log(response);
              if(!response){
                this.isOrderLoading = false;
                return;
              }
              if(response.status == 'success'){    
                 this.atributo = response.datos;
                 this.isOrderLoading = false;
                 //console.log(this.atributo);
              }
              },
          error => {
          this.isOrderLoading = false;
          console.log(<any>error);
          });        
    }

  }

  public loadServiceEstatus(){  

    this.subscription = this._orderService.getServiceEstatus(this.token.token, this.data['service_id']).subscribe(
    response => {
              if(!response){
                return;
              }
              if(response.status == 'success'){                  
                this.serviceestatus = response.datos;
                if(this.serviceestatus.length > 0) {
                  this.data.status_id = this.serviceestatus.slice(-1)[0].id;
                }
              }
              });        
    }


  toggle() {
    this.show = !this.show;
    if(this.show){
      //this.getOrderAtributo();   
    }
  } 

  toggledate() {
    this.showdate = !this.showdate;
  } 

  displayFn(value: any) {
    if (value) { 
      //this.valid = true;
      //this.selected = value;
      //console.log(this.selected);
      //console.log(this.selected.length);
      //return this.selected; 
    }
  }
}