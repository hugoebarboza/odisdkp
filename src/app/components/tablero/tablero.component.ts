import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnDestroy, OnChanges, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription, ReplaySubject } from 'rxjs';
import { Sort, MatPaginator, TooltipPosition, MatDialog, PageEvent } from '@angular/material';


//SERVICES
import { OrderserviceService, ProjectsService, UserService } from '../../services/service.index';

//MODELS
import { Order, ServiceEstatus } from '../../models/types';

//DIALOG
import { ShowComponent } from '../dialog/show/show.component';

//MOMENT
import * as _moment from 'moment';
const moment = _moment;



interface Inspector {
  id: number;
  name: string;
}

interface Estatus {
  id: number;
  name: string;
  value: number;
}

@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.css']
})
export class TableroComponent implements OnInit, OnDestroy, OnChanges {

  title = "Tablero de Inspecciones";
  subtitle = "Listado de Inspecciones";
  
  category_id: number;
  /*
  count: Object = [{
    id: 0,
    value: 0
  }];*/
  bootstrapClass: string = null;
  count: Array<Object> = [];
  datedesde: FormControl;
  datehasta: FormControl;
  error: string; 
  estatus: ServiceEstatus[] = [];
  filterValue = '';
  inspector: Inspector[] = [];    
  identity: any;
  isLoadingResults = true;
  isRateLimitReached = false;
  pageIndex:number;
  project_id: number;
  resultsLength = 0;
  role:number;
  servicename: string;
  subscription: Subscription;
  token: any;
  terms="";  

  public inspectorCtrl: FormControl = new FormControl();
  public inspectorMultiFilterCtrl: FormControl = new FormControl();
  public filteredInspectorMulti: ReplaySubject<Inspector[]> = new ReplaySubject<Inspector[]>(1);
  public regionMultiCtrl: FormControl = new FormControl('', Validators.required );

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionheaderaction = new FormControl(this.positionOptions[2]);
  positiondatasourceaction = new FormControl(this.positionOptions[3]);
  positionleftaction = new FormControl(this.positionOptions[4]);  
  positionrightaction = new FormControl(this.positionOptions[5]);  

  
  filtersregion = {
    fieldValue: '',
    criteria: '',
    filtervalue: ''
  };
  
  selectedColumnn = {
    fieldValue: '',
    criteria: '',
    columnValue: ''
  };

  selectedColumnnDate = {
    fieldValue: '',
    criteria: '',
    columnValueDesde: '',
    columnValueHasta: ''
  };

  selectedColumnnUsuario = {
    fieldValue: '',
    criteria: '',
    columnValue: ''
  };

  sort: Sort = {
    active: '',
    direction: '',
  };

  // MatPaginator Inputs
  pageSize = 15;
  pageSizeOptions: number[] = [15, 30, 100, 200];
  pageEvent: PageEvent;  

  @Input() id : number;
  @Input() view : number;
  @Output() portalevent: EventEmitter<number>;
  @Output() ServicioSeleccionado: EventEmitter<string>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public datasource: Order[];


  constructor(
    public dialog: MatDialog,
    private _orderService: OrderserviceService,
    private _proyecto: ProjectsService,
    public _userService: UserService,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this._userService.handleAuthentication(this.identity, this.token);
    this.portalevent = new EventEmitter();
    this.ServicioSeleccionado = new EventEmitter(); 
    this.error = '';
    this.role = 5; //USUARIOS INSPECTORES

   }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.terms = '';
    this.isLoadingResults = true;
    this.isRateLimitReached = false;
    this.getEstatus(this.id);
    this.getProject(this.id);
    this.refreshTable();
  }

  ngOnDestroy() {
    //console.log('La página se va a cerrar');
    this.subscription.unsubscribe();
  }


  public getData(response: any){
    if(response){
        response.subscribe(
          (some: any) => 
          {
            if(some.datos.data){    
            //console.log(some.datos);
            this.resultsLength = some.datos.total;
            this.servicename = some.datos.data[0]['service_name'];
            this.category_id =  some.datos.data[0]['category_id'];
            this.project_id = some.datos.data[0]['project_id'];
            this.isRateLimitReached = false;          
            this.datasource = some.datos.data;
            }else{
            this.resultsLength = 0;
            this.servicename = some.datos['service_name'];
            this.category_id =  some.datos['projects_categories_customers']['id'];
            this.project_id = some.datos['project']['id'];
            this.isRateLimitReached = true;          
            }
            this.ServicioSeleccionado.emit(this.servicename);
            if(this.datasource.length > 0 && this.estatus.length > 0){
              this.getCountData(this.datasource, this.estatus);
            }
            //console.log(this.datasource.length);
            //console.log(this.datasource);
            this.isLoadingResults = false;
          },
          (error:any) => {                      
            this.isLoadingResults = false;
            this.isRateLimitReached = true;
            console.log(<any>error);
          });
    }else{
      return;
    }
  }

  public getCountData(data: any, estatus:any){    
    for (var i=0; i<this.estatus.length; i++){
      let value = 0;
      for (var x=0; x<this.datasource.length; x++){
        if(this.estatus[i]['id'] == this.datasource[x]['status_id']) {
          value = value + 1
      }
    }
      this.count.push({id: this.estatus[i]['id'], value: value});
    }
    //console.log(this.count);

  }


  public refreshTable() { 
    this.regionMultiCtrl.reset();
    this.inspectorMultiFilterCtrl.reset();
    this.inspectorCtrl = new FormControl('');
    this.filterValue = '';
    this.selectedColumnn.fieldValue = '';
    this.selectedColumnn.columnValue = '';
    this.selectedColumnnDate.fieldValue = '';
    this.selectedColumnnDate.columnValueDesde = '';
    this.selectedColumnnDate.columnValueHasta = '';
    this.filtersregion.fieldValue ='';
    this.selectedColumnnUsuario.fieldValue = '';
    this.selectedColumnnUsuario.columnValue = '';    
    this.pageSize = 15;
    this.isLoadingResults = true;
    this.sort.active = 'create_at';
    this.sort.direction = 'desc';  

    if(this.paginator){
      this.paginator.pageIndex = 0;      
    }else{
      this.pageIndex = 0;
    }

    
    this._orderService.getServiceOrder(
      this.filterValue, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,             
      this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta, 
      this.filtersregion.fieldValue, this.regionMultiCtrl.value,
      this.selectedColumnnUsuario.fieldValue, this.selectedColumnnUsuario.columnValue,
      this.sort.active, this.sort.direction, this.pageSize, this.pageIndex, this.id, this.token.token)
      .then(response => {this.getData(response)})
      .catch(error => {                      
            this.isLoadingResults = false;
            this.isRateLimitReached = true;
            console.log(<any>error);          
      });
  }


  onPaginateChange(event){
    this.isLoadingResults = true;
    //this.pageSize = this.pageSize + 15;
    /*
    if(this.paginator){
      this.paginator.pageIndex = 0;      
    }else{
      this.pageIndex = 0;
    }*/
   
    this.pageSize = event.pageSize;    
    this.getParams();
    this._orderService.getServiceOrder(
      this.filterValue, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,             
      this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta, 
      this.filtersregion.fieldValue, this.regionMultiCtrl.value,
      this.selectedColumnnUsuario.fieldValue, this.selectedColumnnUsuario.columnValue,
      this.sort.active, this.sort.direction, this.pageSize, this.pageIndex, this.id, this.token.token)
      .then(response => {this.getData(response)})
      .catch(error => {                      
             this.isLoadingResults = false;
             this.isRateLimitReached = true;
             console.log(<any>error);          
       });
   }
 

 

   getParams(){
  
    if(this.filterValue){
       this.selectedColumnn.fieldValue = '';
       this.selectedColumnn.columnValue = '';
       this.selectedColumnnDate.fieldValue = '';
       this.selectedColumnnDate.columnValueDesde = '';
       this.selectedColumnnDate.columnValueHasta = '';
       this.filtersregion.fieldValue = '';
       this.selectedColumnnUsuario.fieldValue = '';
       this.selectedColumnnUsuario.columnValue = '';    
       this.datedesde = new FormControl('');
       this.datehasta = new FormControl('');
       this.regionMultiCtrl = new FormControl('');
       this.inspectorCtrl = new FormControl('');
       //console.log('paso000')      
    }

    if(this.selectedColumnn.fieldValue && this.selectedColumnn.columnValue){
       this.selectedColumnnDate.fieldValue = '';
       this.selectedColumnnDate.columnValueDesde = '';
       this.selectedColumnnDate.columnValueHasta = '';
       this.filtersregion.fieldValue = '';
       this.selectedColumnnUsuario.fieldValue = '';
       this.selectedColumnnUsuario.columnValue = '';           
       this.datedesde = new FormControl('');
       this.datehasta = new FormControl('');
       this.regionMultiCtrl = new FormControl('');
       this.inspectorCtrl = new FormControl('');
       //console.log('paso111')
    }

    if(!this.regionMultiCtrl.value && !this.selectedColumnnUsuario.fieldValue && !this.selectedColumnnUsuario.columnValue && this.selectedColumnnDate.fieldValue && this.selectedColumnnDate.columnValueDesde && this.selectedColumnnDate.columnValueHasta){
       this.selectedColumnn.fieldValue = '';
       this.selectedColumnn.columnValue = '';
       this.filtersregion.fieldValue = '';
       this.selectedColumnnUsuario.fieldValue = '';
       this.selectedColumnnUsuario.columnValue = '';                  
       this.datedesde = new FormControl(moment(this.selectedColumnnDate.columnValueDesde).format('YYYY[-]MM[-]DD'));
       this.datehasta = new FormControl(moment(this.selectedColumnnDate.columnValueHasta).format('YYYY[-]MM[-]DD'));
       this.selectedColumnnDate.columnValueDesde = this.datedesde.value;
       this.selectedColumnnDate.columnValueHasta = this.datehasta.value;
       //console.log('paso222')
    }

    if(this.regionMultiCtrl.value && (!this.selectedColumnnDate.fieldValue || !this.selectedColumnnDate.columnValueDesde || !this.selectedColumnnDate.columnValueHasta)){
       this.selectedColumnn.fieldValue = '';
       this.selectedColumnn.columnValue = '';
       this.selectedColumnnDate.fieldValue = '';       
       this.selectedColumnnDate.columnValueDesde = '';
       this.selectedColumnnDate.columnValueHasta = '';
       this.selectedColumnnUsuario.fieldValue = '';
       this.selectedColumnnUsuario.columnValue = '';                  
       this.datedesde = new FormControl('');
       this.datehasta = new FormControl('');
       this.filtersregion.fieldValue= 'regions.region_name';
       //console.log('paso333') 
    }

    if(this.regionMultiCtrl.value && this.selectedColumnnDate.fieldValue && this.selectedColumnnDate.columnValueDesde && this.selectedColumnnDate.columnValueHasta){
       this.selectedColumnn.fieldValue = '';
       this.selectedColumnn.columnValue = '';
       this.datedesde = new FormControl(moment(this.selectedColumnnDate.columnValueDesde).format('YYYY[-]MM[-]DD'));
       this.datehasta = new FormControl(moment(this.selectedColumnnDate.columnValueHasta).format('YYYY[-]MM[-]DD'));
       this.selectedColumnnDate.columnValueDesde = this.datedesde.value;
       this.selectedColumnnDate.columnValueHasta = this.datehasta.value;
       this.selectedColumnnUsuario.fieldValue = '';
       this.selectedColumnnUsuario.columnValue = '';           
       this.filtersregion.fieldValue = 'regions.region_name';
       //console.log('paso444') 
    }

    if(!this.regionMultiCtrl.value && this.selectedColumnnUsuario.fieldValue && this.selectedColumnnUsuario.columnValue && this.selectedColumnnDate.fieldValue && this.selectedColumnnDate.columnValueDesde && this.selectedColumnnDate.columnValueHasta){
       this.selectedColumnn.fieldValue = '';
       this.selectedColumnn.columnValue = '';
       this.filtersregion.fieldValue = '';
       this.datedesde = new FormControl(moment(this.selectedColumnnDate.columnValueDesde).format('YYYY[-]MM[-]DD'));
       this.datehasta = new FormControl(moment(this.selectedColumnnDate.columnValueHasta).format('YYYY[-]MM[-]DD'));
       this.selectedColumnnDate.columnValueDesde = this.datedesde.value;
       this.selectedColumnnDate.columnValueHasta = this.datehasta.value;
       //console.log('paso555')
    }    

    if(!this.regionMultiCtrl.value && this.selectedColumnnUsuario.fieldValue && this.selectedColumnnUsuario.columnValue && (!this.selectedColumnnDate.fieldValue || !this.selectedColumnnDate.columnValueDesde || !this.selectedColumnnDate.columnValueHasta)){
       this.selectedColumnn.fieldValue = '';
       this.selectedColumnn.columnValue = '';
       this.filtersregion.fieldValue = '';
       this.selectedColumnnDate.fieldValue = '';       
       this.selectedColumnnDate.columnValueDesde = '';
       this.selectedColumnnDate.columnValueHasta = '';
       this.selectedColumnnUsuario.fieldValue = '';
       this.selectedColumnnUsuario.columnValue = '';                  
       this.datedesde = new FormControl('');
       this.datehasta = new FormControl('');
       //console.log('777')
    }    

  }



  getEstatus(id:number) {    
    this.subscription = this._orderService.getServiceEstatus(this.token.token, id).subscribe(
     response => {
               if(!response){
                 return;
               }
               if(response.status == 'success'){                  
                 this.estatus = response.datos;
                 console.log(this.estatus.length);                 
                 if(this.estatus.length == 1){
                  this.bootstrapClass = 'col-md-12';
                 }
                 if(this.estatus.length == 2){
                  this.bootstrapClass = 'col-md-6';
                 }
                 if(this.estatus.length == 3){
                  this.bootstrapClass = 'col-md-4';
                 }
                 if(this.estatus.length == 4){
                  this.bootstrapClass = 'col-md-2';
                 }                 
               }
               });        
   }
 
   getProject(id:number) {
    this.subscription = this._orderService.getService(this.token.token, id).subscribe(
     response => {
               if (response.status == 'success'){      
               //console.log(response);
               this.project_id = response.datos['project_id'];
               this.servicename = response.datos['service_name'];
               this.ServicioSeleccionado.emit(this.servicename);
               //console.log(this.servicename);
               if(this.project_id > 0){
                 this.getUser(this.project_id);                                       
               }
               }
      });
   }

   getUser(projectid:number){
    if(projectid > 0){     
        this._proyecto.getProjectUser(this.token.token, projectid, this.role).then(
          (res: any) => 
          {
            res.subscribe(
              (some: any) => 
              {
                if(some.datos){
                  this.inspector = some.datos;
                  for (var i=0; i<this.inspector.length; i++){
                    const userid = this.inspector[i]['id'];
                    const username = this.inspector[i]['usuario'];
                    this.inspector[i] = { name: username, id: userid };
                  }
                  //console.log(this.inspector);
                  this.filteredInspectorMulti.next(this.inspector.slice());                  
                }else{
                }
              },
              (error: any) => { 
              this.inspector = [];
              console.log(<any>error);
              }  
              )
        })
    }
  }


  toggleTemplate(event:number) {
    //this.showtemplate = !this.showtemplate;
    if(event == 0){     
      this.view = 0;
      this.portalevent.emit(this.view);
    }
    if (event == 1){
      this.view = 1;
      this.portalevent.emit(this.view);
    }
    
    if (event == 2){
      this.view = 2;
      this.portalevent.emit(this.view);      
    }
  }


  showItem(order_id: number, order_number: string, category_id:number, customer_id: number, cc_number: string, servicetype_id: number, status_id: number, estatus: string, order_date: string, required_date: string, vencimiento_date: string, observation: string, create_at: string, usercreate:string, project_name: string, service_name: string, servicetype:string, update_at: string, userupdate:string, region:string, provincia:string, comuna:string, direccion:string) {
    let service_id = this.id;    
    const dialogRef = this.dialog.open(ShowComponent, {
      height: '768px',
      width: '1024px',
      disableClose: true,
      data: {order_id: order_id, order_number: order_number, service_id: service_id, 
        category_id: category_id, customer_id: customer_id, cc_number: cc_number, 
        servicetype_id: servicetype_id, status_id: status_id, estatus:estatus, 
        order_date: order_date, required_date: required_date, vencimiento_date: vencimiento_date, observation: observation, 
        create_at: create_at, usercreate: usercreate, update_at: update_at, userupdate: userupdate, 
        project_name: project_name, service_name: service_name, servicetype:servicetype,
        region:region, provincia:provincia, comuna:comuna, direccion:direccion}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {

        //const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // for delete we use splice in order to remove single object from DataService
        //this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
        //this.refreshTable();
      }
    });
  }



}
