import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NavigationStart, Router, ActivatedRoute, Params } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { Sort, MatDialog, MatPaginator, MatSort, MatSortable, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import {merge, Observable, of as observableOf,  ReplaySubject ,  Subject ,  SubscriptionLike as ISubscription } from 'rxjs';
import { asapScheduler, pipe, of, from,  interval, fromEvent } from 'rxjs';
import {catchError, scan, map, startWith, switchMap,  take, takeUntil , takeWhile, debounceTime, tap, finalize, filter} from 'rxjs/operators';
import {HttpHeaders, HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { TooltipPosition } from '@angular/material';
import { PageEvent } from '@angular/material';
import { ThemePalette } from '@angular/material/core';
import { MatSnackBar } from '@angular/material';
import { MatSelect } from '@angular/material';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';

//CDK
import { Portal, TemplatePortal } from '@angular/cdk/portal';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

//GLOBAL
import { GLOBAL } from '../../../services/global';

//SERVICES
import { CountriesService } from '../../../services/countries.service';
import { ExcelService } from '../../../services/excel.service';
import { OrderserviceService } from '../../../services/orderservice.service';
import { ProjectsService } from '../../../services/projects.service';
import { UserService } from '../../../services/user.service';
import { ZipService } from '../../../services/zip.service';

//MODELS
import { User } from '../../../models/user';
import { Proyecto } from '../../../models/proyecto';
import { Service } from '../../../models/service';
import { ServiceType } from '../../../models/ServiceType';
import { ServiceEstatus } from '../../../models/ServiceEstatus';
import { Order } from '../../../models/order';


//COMPONENTS
import { ViewOrderDetailComponent } from '../../views/vieworderdetail/vieworderdetail.component';

//DIALOG
import { AddComponent } from '../../dialog/add/add.component';
import { FileComponent } from '../../dialog/file/file.component';
import { CsvComponent } from '../../dialog/csv/csv.component';
import { DeleteComponent } from '../../dialog/delete/delete.component';
import { DownloadComponent } from '../../dialog/download/download.component';
import { EditComponent } from '../../dialog/edit/edit.component';
import { ShowComponent } from '../../dialog/show/show.component';
import { SettingsComponent } from '../../dialog/settings/settings.component';
import { ZipComponent } from '../../dialog/zip/zip.component';


//MOMENT
import * as _moment from 'moment';
const moment = _moment;

//PDF
import jsPDF from 'jspdf';
//import 'jspdf-autotable';

//TOASTER MESSAGES
import { ToastrService } from 'ngx-toastr';


interface Inspector {
  id: number;
  name: string;
}

interface Region {
  id: number;
  name: string;
  value: string;
}

interface Time {
  hour: any; 
  minute: any
}


@Component({
  selector: 'app-vieworderservice',
  templateUrl: './vieworderservice.component.html',
  styleUrls: ['./vieworderservice.component.css'],
  providers: [CountriesService, ExcelService, OrderserviceService, UserService]
})

export class VieworderserviceComponent implements OnInit, OnDestroy, OnChanges {
  public title = "Órdenes de trabajo";
  public subtitle = "Listado de órdenes de trabajo. Agregue, edite, elimine y ordene los datos de acuerdo a su preferencia.";
  public url:string;
  public identity;
  public token;
  public servicename;
  public projectname;
  public proyectos: Array<Proyecto>;
  public order: Order[] = [];
  public servicetype: ServiceType[] = [];
  public estatus: ServiceEstatus[] = [];
  private sub: any;   
  public service_id:number;
  private active: boolean = false;
  open: boolean = false;
  loading: boolean;
  label: boolean;
  row : Number;
  index: number;    
  indexitem:number;
  category_id: number;
  private project_id: number;
  order_date: string;
  required_date: string;  
  counter: any;
  count:any;
  error: string; 
  role:number; 
  public order_id: number;
  public columnselect: string[] = new Array();
  public datedesde: FormControl;
  public datehasta: FormControl;
  private subscription: ISubscription;
  private results = [];


  selectedRow : Number;
  setClickedRow : Function;

  direction: string = 'vertical'
  //TIME VALUE
  timefrom: Time = {hour: '', minute: ''};
  timeuntil: Time = {hour: '', minute: ''};
  columnTimeFromValue: FormControl;
  columnTimeUntilValue: FormControl;

  
  //FILTRADO AVANZADO
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }  
  ////////////////////////

  tipoServicio: Array<Object> = [];
  zona: Array<Object> = [];

  //SORT
  sort: Sort = {
    active: 'create_at',
    direction: 'desc',
  };


  //FILTERS
  filterValue = '';

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


  selectedColumnnEstatus = {
    fieldValue: 'orders_details.status_id',
    criteria: '',
    columnValue: ''
  };


  filtersregion = {
    fieldValue: '',
    criteria: '',
    filtervalue: ''
  };


  // MatPaginator Inputs
  pageSize = 15;
  pageSizeOptions: number[] = [15, 30, 100, 200];
  pageEvent: PageEvent;


  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionheaderaction = new FormControl(this.positionOptions[2]);
  positiondatasourceaction = new FormControl(this.positionOptions[3]);
  positionleftaction = new FormControl(this.positionOptions[4]);  
  positionrightaction = new FormControl(this.positionOptions[5]);  

/** control for the selected region for multi-selection */
  public regionMultiCtrl: FormControl = new FormControl('', Validators.required );
  public regionMultiFilterCtrl: FormControl = new FormControl('', Validators.required);  
  private region = new Array();

  
  /** list of region filtered by search keyword */
  public filteredRegion: ReplaySubject<Region[]> = new ReplaySubject<Region[]>(1);
  public filteredRegionMulti: ReplaySubject<Region[]> = new ReplaySubject<Region[]>(1);
  
/** control for the selected user for multi-selection */
  private inspector = new Array();  
  public inspectorCtrl: FormControl = new FormControl();
  public inspectorMultiFilterCtrl: FormControl = new FormControl();
  public filteredInspectorMulti: ReplaySubject<Inspector[]> = new ReplaySubject<Inspector[]>(1);

  
  private _onDestroy = new Subject<void>();
  private unsubscribe: Subject<void> = new Subject();

  columns: Array<any> = [
    { name: 'important', label: 'Destacar' },
    { name: 'order_number', label: 'N. Orden' },
    { name: 'cc_number', label: 'N. Cliente' },
    { name: 'region', label: 'Región' },
    { name: 'provincia', label: 'Provincia' },
    { name: 'direccion', label: 'Dirección' },
    { name: 'servicetype', label: 'Servicio' },
    { name: 'estatus', label: 'Estatus' },
    { name: 'user', label: 'Usuario' },
    { name: 'create_at', label: 'Creado El' },
    { name: 'actions', label: 'Acciones' }
  ];  
  

  columnsHide: Array<any> = [
    { name: 'order_number', label: 'N. Orden' },
    { name: 'cc_number', label: 'N. Cliente' },
    { name: 'estatus', label: 'Estatus' },
    { name: 'user', label: 'Usuario' },
    { name: 'create_at', label: 'Creado El' },
    { name: 'actions', label: 'Acciones' }
  ];  


  dataSourceEmpty;    
  displayedColumns: string[] = ['important', 'order_number','cc_number', 'region', 'provincia', 'comuna', 'direccion', 'servicetype', 'estatus', 'user', 'create_at', 'actions']; 
  columnsOrderToDisplay: string[] = this.columns.map(column => column.name);
  columnsOrderSettingsToDisplay: string[] = this.columns.map(column => column.name);
  //columnsOrderToDisplay: string[] = ['important', 'order_number','cc_number', 'region', 'provincia', 'comuna', 'direccion', 'servicetype', 'estatus', 'user', 'create_at', 'actions']; 
  //columnsOrderToDisplay: string[] = ['order_number','cc_number', 'region', 'provincia', 'comuna', 'direccion', 'servicetype', 'estatus', 'user', 'create_at', 'actions']; 
  //columnsOrderToDisplay: string[] = this.displayedColumns.slice();  

  data: Order[] = [];
  dataSource: MatTableDataSource<Order[]>;  
  exportDataSource: MatTableDataSource<Order[]>;  
  selection = new SelectionModel<Order[]>(true, []);

  isLoadingResults = true;
  isRateLimitReached = false;
  nametable: string;
  resultsLength = 0;
  pageIndex:number;
  public show:boolean = false;
  public showtemplate:boolean = false;
  public showcell:boolean = true;
  public buttonName:any = 'Show';
  private alive = true;



  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;
  @Output() ServicioSeleccionado: EventEmitter<string>;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild('multiSelect') multiSelect: MatSelect;
  @Input() id : number;

  //CDK PORTAL
  @ViewChild('myTemplate') myTemplate: TemplatePortal<any>;
  @ViewChild('myTemplate2') myTemplate2: TemplatePortal<any>;
  public _portal: Portal<any>;
  public _home:Portal<any>;

  constructor(  
    private _route: ActivatedRoute,
    private _router: Router,        
    private _userService: UserService,    
    private _proyectoService: UserService,
    private _orderService: OrderserviceService,
    private _proyecto: ProjectsService,
    public dialog: MatDialog,
    public dataService: OrderserviceService,
    private http: HttpClient,
    public snackBar: MatSnackBar,
    private _regionService: CountriesService,
    private excelService:ExcelService,
    private toasterService: ToastrService,
    private bottomSheet: MatBottomSheet,
    public zipService: ZipService,


  ) 
  
  { 
    this.url = GLOBAL.url;
    this.loading = true;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.proyectos = this._proyectoService.getProyectos();
    this._userService.handleAuthentication(this.identity, this.token);
    this.ServicioSeleccionado = new EventEmitter(); 
    this.dataSource = new MatTableDataSource();
    this.error = '';
    this.role = 5; //USUARIOS INSPECTORES
    this.open = false;

    this.setClickedRow = function(index, orderid){
            this.selectedRow = index;
            this.order_id = orderid;
            //console.log(this.orderid);
    }    

  }

  hoverIn(index){
    this.indexitem = index;
  }

  hoverOut(index){
    this.indexitem = -1;

  }


log(x) {
   //console.log(x);
  }

  onChange(event, category_id:number, orden:number) {
    this.label = event.checked;
   
    if(this.label == true){
      const tag = 1;
      this.dataService.important(this.token.token, category_id, orden, tag);
      this.snackBar.open('Se ha marcado la orden como importante.', 'Destacada', {duration: 2000,});             
    }
    
    if(this.label == false){       
      const tag = 0;
      this.dataService.important(this.token.token, category_id, orden, tag);
      this.snackBar.open('Se ha marcado la orden como no importante.', '', {duration: 2000,});             
    }           
  }



  add(indexcolumn) {
    const indexarray = this.displayedColumns.indexOf(indexcolumn);
    if (this.columnsOrderToDisplay.length) {
        if (indexarray !== -1) {
        this.columnsOrderToDisplay.splice(indexarray,0,indexcolumn);
        }        
    }    
  }

  remove(indexcolumn) {
    const indexarray = this.columnsOrderToDisplay.indexOf(indexcolumn);
    if (this.columnsOrderToDisplay.length) {
        if (indexarray !== -1) {
        this.columnsOrderToDisplay.splice(indexarray, 1);
        }        
    }    
  }



  ngOnInit() {
    //this._portal = this.myTemplate;
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.matSort;

    this.inspectorMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterInspector();
      });    

  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log('onchange order');
    this.selectedRow = -1;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;
    this._portal = this.myTemplate;
    this._home = this.myTemplate;
    this.showtemplate = false;
    this.showcell = true;
    this.loadInfo();
    this.getZona(this.id);
    this.getProject(this.id);
    this.getTipoServicio(this.id);    
    this.getEstatus(this.id);
    this.refreshTable();


    
  }


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();    
     //this.subscription.unsubscribe();     
     //this.unsubscribe.next();
     //this.unsubscribe.complete();
     //console.log("ngOnDestroy ORDER complete");
  }



  getDateFormar(date: Date) {
    const datezipdesde = new FormControl(moment(date).format('YYYY[-]MM[-]DD'));
    return datezipdesde.value;
  }



  getTipoServicio(id) {
    this.zipService.getTipoServicio(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            this.tipoServicio = some['datos'];
            // console.log(this.tipoServicio);
          },
          (error) => {
            console.log(<any>error);
          }
        );
      }
    );
  }

  getZona(id) {
    this.zipService.getZona(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            this.zona = some['datos']['zona'];
            // console.log(this.zona );
          },
          (error) => {
            console.log(<any>error);
          }
        );
      }
    );
  }


  getProject(id) {
    this._orderService.getService(this.token.token, id).subscribe(
    response => {
              if (response.status == 'success'){         
              this.project_id = response.datos['project_id'];
              if(this.project_id > 0){
                this.getUser(this.project_id);                                       
              }
              }
     });
  }


  getEstatus(id) {    
    this._orderService.getServiceEstatus(this.token.token, id).subscribe(
    response => {
              if(!response){
                return;
              }
              if(response.status == 'success'){                  
                this.estatus = response.datos;
                //console.log(this.estatus);
              }
              });        
  }


 getUser(projectid:number){
    if(projectid > 0){     
        this._proyecto.getProjectUser(this.token.token, projectid, this.role).then(
          (res: any) => 
          {
            res.subscribe(
              (some) => 
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
              (error) => { 
              this.inspector = [];
              console.log(<any>error);
              }  
              )
        })
    }
  }


  private filterInspector() {
    //console.log('filter');
    if (!this.inspector) {
      return;
    }
    // get the search keyword
    let search = this.inspectorMultiFilterCtrl.value;
    if (!search) {
      this.filteredInspectorMulti.next(this.inspector.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredInspectorMulti.next(
      this.inspector.filter(inspector => inspector.name.toLowerCase().indexOf(search) > -1)
    );
  }




  public getData(response: any){
    if(response){
        response.subscribe(
          (some) => 
          {
            if(some.datos.data){            
            this.resultsLength = some.datos.total;
            this.servicename = some.datos.data[0]['service_name'];
            this.category_id =  some.datos.data[0]['category_id'];
            this.project_id = some.datos.data[0]['project_id'];
            this.isRateLimitReached = false;          
            }else{
            this.resultsLength = 0;
            this.servicename = some.datos['service_name'];
            this.category_id =  some.datos['projects_categories_customers']['id'];
            this.project_id = some.datos['project']['id'];
            this.isRateLimitReached = true;          
            }
            this.ServicioSeleccionado.emit(this.servicename);
            this.dataSource = new MatTableDataSource(some.datos.data);
            //this.dataSource.paginator = this.paginator;
            //this.dataSource.sort = this.matSort;            
            this.isLoadingResults = false;
          },
          (error) => {                      
            this.isLoadingResults = false;
            this.isRateLimitReached = true;
            localStorage.removeItem('identity');
            localStorage.removeItem('token');
            localStorage.removeItem('proyectos');
            localStorage.removeItem('expires_at');
            this._router.navigate(["/login"]);          
            console.log(<any>error);
          });
    }else{
      return;
    }
  }

  public refreshTable() { 
    //console.log('paso refresch');   
    //this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
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
    this.show = false;  
    if(this.paginator){
      this.paginator.pageIndex = 0;      
    }else{
      this.pageIndex = 0;
    }

    
    this.dataService.getServiceOrder(
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


  onPaginateChange(event){
   //console.log(this.paginator.pageIndex);
   this.isLoadingResults = true;
   this.pageSize = event.pageSize;    
   this.getParams();
    this.dataService.getServiceOrder(
      this.filterValue, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,             
      this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta, 
      this.filtersregion.fieldValue, this.regionMultiCtrl.value,
      this.selectedColumnnUsuario.fieldValue, this.selectedColumnnUsuario.columnValue,
      this.sort.active, this.sort.direction, this.pageSize, this.paginator.pageIndex, this.id, this.token.token)
      .then(response => {this.getData(response)})
      .catch(error => {                      
            this.isLoadingResults = false;
            this.isRateLimitReached = true;
            console.log(<any>error);          
      });
  }


  applyFilter() {
    this.isLoadingResults = true;
    this.getParams();
    /*
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
       //console.log('paso111')
    }

    if(!this.regionMultiCtrl.value && !this.selectedColumnnUsuario.fieldValue && this.selectedColumnnDate.fieldValue && this.selectedColumnnDate.columnValueDesde && this.selectedColumnnDate.columnValueHasta){
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
       this.selectedColumnnUsuario.fieldValue = '';
       this.selectedColumnnUsuario.columnValue = '';
       this.datedesde = new FormControl(moment(this.selectedColumnnDate.columnValueDesde).format('YYYY[-]MM[-]DD'));
       this.datehasta = new FormControl(moment(this.selectedColumnnDate.columnValueHasta).format('YYYY[-]MM[-]DD'));
       this.selectedColumnnDate.columnValueDesde = this.datedesde.value;
       this.selectedColumnnDate.columnValueHasta = this.datehasta.value;       
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
       //console.log('paso777')
    }*/


    this.dataService.getServiceOrder(
      this.filterValue, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,             
      this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta, 
      this.filtersregion.fieldValue, this.regionMultiCtrl.value,
      this.selectedColumnnUsuario.fieldValue, this.selectedColumnnUsuario.columnValue,
      this.sort.active, this.sort.direction, this.pageSize, this.paginator.pageIndex, this.id, this.token.token)
      .then(response => {this.getData(response)})
      .catch(error => {                      
            this.isLoadingResults = false;
            this.isRateLimitReached = true;
            console.log(<any>error);          
      });
  }




 handleSortChange(sort: Sort): void {
    if (sort.active && sort.direction) {
      this.sort = sort;      
    }
    this.isLoadingResults = true;
    this.getParams();
    /*
    if(this.filterValue){
       this.selectedColumnn.fieldValue = '';
       this.selectedColumnn.columnValue = '';
       this.selectedColumnnDate.fieldValue = '';
       this.selectedColumnnDate.columnValueDesde = '';
       this.selectedColumnnDate.columnValueHasta = '';
       this.filtersregion.fieldValue = '';
       this.datedesde = new FormControl('');
       this.datehasta = new FormControl('');
       this.regionMultiCtrl = new FormControl('');
       this.selectedColumnnUsuario.fieldValue = '';
       this.selectedColumnnUsuario.columnValue = '';                  
       //console.log('paso000')      
    }

    if(this.selectedColumnn.fieldValue && this.selectedColumnn.columnValue){
       this.selectedColumnnDate.fieldValue = '';
       this.selectedColumnnDate.columnValueDesde = '';
       this.selectedColumnnDate.columnValueHasta = '';
       this.filtersregion.fieldValue = '';
       this.datedesde = new FormControl('');
       this.datehasta = new FormControl('');
       this.regionMultiCtrl = new FormControl('');
       this.selectedColumnnUsuario.fieldValue = '';
       this.selectedColumnnUsuario.columnValue = '';                  
       //console.log('paso111')
    }

    if(!this.regionMultiCtrl.value && !this.selectedColumnnUsuario.fieldValue && this.selectedColumnnDate.fieldValue && this.selectedColumnnDate.columnValueDesde && this.selectedColumnnDate.columnValueHasta){
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
       this.selectedColumnnUsuario.fieldValue = '';
       this.selectedColumnnUsuario.columnValue = '';                  
       this.datedesde = new FormControl(moment(this.selectedColumnnDate.columnValueDesde).format('YYYY[-]MM[-]DD'));
       this.datehasta = new FormControl(moment(this.selectedColumnnDate.columnValueHasta).format('YYYY[-]MM[-]DD'));
       this.selectedColumnnDate.columnValueDesde = this.datedesde.value;
       this.selectedColumnnDate.columnValueHasta = this.datehasta.value;       
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
       //console.log('paso777')
    }*/


      this.dataService.getServiceOrder(
      this.filterValue, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,             
      this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta, 
      this.filtersregion.fieldValue, this.regionMultiCtrl.value,
      this.selectedColumnnUsuario.fieldValue, this.selectedColumnnUsuario.columnValue,
      this.sort.active, this.sort.direction, this.pageSize, this.paginator.pageIndex, this.id, this.token.token)
      .then(response => {this.getData(response)})
      .catch(error => {                      
            this.isLoadingResults = false;
            this.isRateLimitReached = true;
            console.log(<any>error);          
      });
  }


  

  public loadInfo(){
    //console.log(this.identity.country);
    this._regionService.getRegion(this.token.token, this.identity.country).subscribe(
                response => {
                  //console.log(response);
                   if(response.status == 'success'){
                    for (var i=0; i<response.datos.region.length; i++){
                      const regionname = response.datos.region[i]['region_name'];
                      const regionid = response.datos.region[i]['id'];
                      this.region[i] = { name: regionname, id: regionid };
                    }
                      this.filteredRegion.next(this.region.slice());
                      this.filteredRegionMulti.next(this.region.slice());

                      // listen for search field value changes
                      this.regionMultiFilterCtrl.valueChanges
                        .pipe(takeUntil(this._onDestroy))
                        .subscribe(() => {
                          this.filterRegionMulti();
                        });

                     //console.log('paso success');
                      //this.region = response.datos.region;

                    }else{
                      this.region = null;
                         }
                    });    
  }




  toggle() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";

    this.selectedColumnn.fieldValue='';
    this.selectedColumnn.columnValue='';
    this.selectedColumnnDate.fieldValue='';
    this.selectedColumnnDate.columnValueDesde='';
    this.selectedColumnnDate.columnValueHasta='';
    this.filtersregion.fieldValue = '';
    this.regionMultiCtrl.reset();
  }

  toggleTemplate(event) {
    //this.showtemplate = !this.showtemplate;
    if(event == 0){     
      this._portal = this.myTemplate;
      this.showtemplate = false;
      this.showcell = true;
      this.columnsOrderToDisplay = this.columns.map(column => column.name);
    }
    else if (event == 1){
      this._portal = this.myTemplate2;
      this.showtemplate = true;      
      this.showcell = false;
      this.columnsOrderToDisplay = this.columnsHide.map(column => column.name);      
    }
    

  }



  addNew(id:number, category_id:number, order: Order[]) {
     const dialogRef = this.dialog.open(AddComponent, {
     height: '650px',
     width: '777px',
     disableClose: true,        
     data: { service_id: id, category_id: category_id, order: Order }
     });


     dialogRef.afterClosed().subscribe(
           result => {       
              if (result === 1) { 
              // After dialog is closed we're doing frontend updates 
              // For add we're just pushing a new row inside DataService
              //this.dataService.dataChange.value.push(this.OrderserviceService.getDialogData());  
              this.refreshTable();
              }
            });
  }
  

  startEdit(order_id: number, order_number: string, category_id:number, customer_id: number, cc_number: string, servicetype_id: number, status_id: number, assigned_to:number, order_date: string, required_date: string, vencimiento_date: string, observation: string, create_at: string) {
    let service_id = this.id;    
    //console.log(assigned_to);    
    const dialogRef = this.dialog.open(EditComponent, {
      height: '650px',
      width: '777px',
      disableClose: true,  
      data: {order_id: order_id, order_number: order_number, service_id: service_id, category_id: category_id, customer_id: customer_id, cc_number: cc_number, 
        servicetype_id: servicetype_id, status_id: status_id, 
        assigned_to: assigned_to,        
        order_date: order_date, required_date: required_date, vencimiento_date: vencimiento_date, observation: observation, create_at: create_at}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        //const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
       // this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
      }
    });
  }



  deleteItem(order_id: number, order_number: string, category_id:number, customer_id: number, cc_number: string, servicetype_id: number, status_id: number, estatus: string, order_date: string, required_date: string, observation: string, create_at: string, project_name: string, service_name: string, servicetype:string) {
    let service_id = this.id;    
    const dialogRef = this.dialog.open(DeleteComponent, {
      height: '650px',
      width: '777px',
      disableClose: true,      
      data: {order_id: order_id, order_number: order_number, service_id: service_id, category_id: category_id, customer_id: customer_id, cc_number: cc_number, servicetype_id: servicetype_id, status_id: status_id, estatus:estatus, order_date: order_date, required_date: required_date, observation: observation, create_at: create_at, project_name: project_name, service_name: service_name, servicetype:servicetype}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        //const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // for delete we use splice in order to remove single object from DataService
        //this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
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





private filterRegionMulti() {
    if (!this.region) {
      return;
    }
    // get the search keyword
    let search = this.regionMultiFilterCtrl.value;
    if (!search) {
      this.filteredRegionMulti.next(this.region.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredRegionMulti.next(
      this.region.filter(region => region.name.toLowerCase().indexOf(search) > -1)
    );
  }


  settings(columns:string) {
    //let dysplaycolumns = columns;    
    //console.log(dysplaycolumns); 

    const dialogRef = this.dialog.open(SettingsComponent, {
      height: '650px',
      width: '777px',            
      //data: {dysplaycolumns: columns}
      data: {columnsOrderToDisplay: columns}
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      //console.log('paso');
      //console.log(this.columnsToDisplay);
      this.columnselect = result;      
      for (var i=0; i<this.columnselect.length; i++){
            if(this.columnselect[i]['checked']===false){
              this.remove(this.columnselect[i]['label']);
            }
            if(this.columnselect[i]['checked']===true){
              const validate = this.columnsOrderToDisplay.indexOf(this.columnselect[i]['label']);
              if(validate === -1){
                //console.log(this.columnselect[i]['label']);
                this.add(this.columnselect[i]['label']);
              }
              //console.log(validate);
              //this.add(this.columnselect[i]['label']);
              //console.log(this.columnselect[i]['label']);              
            }

            //const index:number = this.columnselect[i];
            //this.remove(this.columnselect[i]);
       }

        // When using an edit things are little different, firstly we find record inside DataService by id
        //const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
       // this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        //this.refreshTable();
      }
    });
  }


  publish(columns:string) {
    const dialogRef = this.dialog.open(FileComponent, {
      height: '700px',
      width: '777px',
      disableClose: true,                 
      data: { project: this.project_id,
              servicio: this.id,
              tiposervicio: this.tipoServicio[0]['id'],              
              estatus: this.estatus,
              orderid: 0,              
              token: this.token.token,
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) { 

      }
    });
  }

  publishOrder(order_id: any) {
    const dialogRef = this.dialog.open(FileComponent, {
      height: '650px',
      width: '777px',
      disableClose: true,                 
      data: { project: this.project_id,
              servicio: this.id,
              tiposervicio: this.tipoServicio[0]['id'],              
              estatus: this.estatus,
              orderid: order_id,
              token: this.token.token,
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) { 

      }
    });
  }


  openDialog(): void {

    const dialogRef = this.dialog.open(ZipComponent, {
      width: '350px', 
      disableClose: true,                 
      data: { zona: this.zona,
              tiposervicio: this.tipoServicio,
              date: null,
              dateend: null,
              selectedValueservicio: null,
              selectedValuezona: null,
            }

    });
    dialogRef.afterClosed().subscribe(result => {

      if (result !== undefined) {
        //console.log(result);

        let link = 'http://gasco.ocachile.cl/gasco/ocaglobalzip/zip.php?tiposervicio=' +
                    result['selectedValueservicio'] + '&startdate=' +
                    this.getDateFormar(result['date']) + '&enddate=';

        if (result['dateend'] !== null) {
          link = link + this.getDateFormar(result['dateend']);
        } else {
          link = link + this.getDateFormar(result['date']);
        }

        if (result['selectedValuezona'] !== null) {
        link = link + '&zona=' + result['selectedValuezona'];
        }
        window.open(link, '_blank');
      }

    });
  }


  openDialogCsv(): void {

    const dialogRef = this.dialog.open(CsvComponent, {
      width: '450px',
      height: '750px',
      disableClose: true,                          
      data: { project: this.project_id,
              servicio: this.id,
              estatus: this.estatus,
              token: this.token.token,
              tiposervicio: this.tipoServicio,
              date: null,
              dateend: null,
              selectedValueservicio: null,
              selectedValuezona: null,
            }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) { 

      }
    });
  }


 

  resetRegionFilters() {
    this.regionMultiCtrl.reset();
  }  


  resetFilters() {
    this.filterValue = '';
    this.selectedColumnn.fieldValue = '';
    this.selectedColumnn.columnValue = '';
    this.selectedColumnnDate.fieldValue = '';
    this.selectedColumnnDate.columnValueDesde = '';
    this.selectedColumnnDate.columnValueHasta = '';
    this.selectedColumnnUsuario.fieldValue = '';
    this.selectedColumnnUsuario.columnValue = '';
    this.filtersregion.fieldValue = '';
    this.regionMultiCtrl.reset();
    this.active = false;
    this.step = 0;
  }


 ExportTOExcel():void {
    this.excelService.exportAsExcelFile(this.dataSource.data, 'Ordenes');
  }


 ExportTOExcelClient($event):void {
   //console.log($event);
    var arraydata = new Array();
    var arrayexcel = new Array();
    var orderatributovalue = [];
    var arraydata = [];
    var valuearrayexcel = "";
    var pattern = /(\w+)\s+(\w+)/;

    this.isLoadingResults = true;

    if(!this.selectedColumnnEstatus.columnValue){
      this.selectedColumnnEstatus.fieldValue = '';
      this.selectedColumnnEstatus.columnValue = '';
    }else{
      this.selectedColumnnEstatus.fieldValue = 'orders_details.status_id'
    }


    
    if(this.filterValue){
       this.selectedColumnn.fieldValue = '';
       this.selectedColumnn.columnValue = '';
       this.selectedColumnnDate.fieldValue = '';
       this.selectedColumnnDate.columnValueDesde = '';
       this.selectedColumnnDate.columnValueHasta = '';
       this.filtersregion.fieldValue = '';
       this.datedesde = new FormControl('');
       this.datehasta = new FormControl('');
       this.regionMultiCtrl = new FormControl('');
       //console.log('paso000')    
    }

    if(this.selectedColumnn.fieldValue && this.selectedColumnn.columnValue){
       this.selectedColumnnDate.fieldValue = '';
       this.selectedColumnnDate.columnValueDesde = '';
       this.selectedColumnnDate.columnValueHasta = '';
       this.filtersregion.fieldValue = '';
       this.datedesde = new FormControl('');
       this.datehasta = new FormControl('');
       this.regionMultiCtrl = new FormControl('');
       //console.log('paso111')
    }

    if(!this.regionMultiCtrl.value && this.selectedColumnnDate.fieldValue && this.selectedColumnnDate.columnValueDesde && this.selectedColumnnDate.columnValueHasta){
       this.selectedColumnn.fieldValue = '';
       this.selectedColumnn.columnValue = '';
       this.filtersregion.fieldValue = '';
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
       this.datedesde = new FormControl('');
       this.datehasta = new FormControl('');
       this.filtersregion.fieldValue= 'regions.region_name';
      // console.log('paso333') 
    }

    if(this.regionMultiCtrl.value && this.selectedColumnnDate.fieldValue && this.selectedColumnnDate.columnValueDesde && this.selectedColumnnDate.columnValueHasta){
       this.selectedColumnn.fieldValue = '';
       this.selectedColumnn.columnValue = '';
       this.datedesde = new FormControl(moment(this.selectedColumnnDate.columnValueDesde).format('YYYY[-]MM[-]DD'));
       this.datehasta = new FormControl(moment(this.selectedColumnnDate.columnValueHasta).format('YYYY[-]MM[-]DD'));
       this.selectedColumnnDate.columnValueDesde = this.datedesde.value;
       this.selectedColumnnDate.columnValueHasta = this.datehasta.value;       
       this.filtersregion.fieldValue = 'regions.region_name';
       //console.log('paso444') 
    }

    if(this.timefrom !=null && this.timeuntil !=null){
        this.columnTimeFromValue = new FormControl(moment(this.timefrom, 'H:mm:ss').format('LTS'));
        this.columnTimeUntilValue = new FormControl(moment(this.timeuntil, 'H:mm:ss').format('LTS'));
        var newtimefrom = moment(this.columnTimeFromValue.value, "h:mm:ss A").format("HH:mm:ss");   
        var newtimeuntil = moment(this.columnTimeUntilValue.value, "h:mm:ss A").format("HH:mm:ss");
    }else{
        var newtimefrom = "";
        var newtimeuntil = "";
    }      


    this.dataService.getProjectShareOrder(      
      this.filterValue, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,             
      this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta, 
      this.filtersregion.fieldValue, this.regionMultiCtrl.value,
      this.selectedColumnnUsuario.fieldValue, this.selectedColumnnUsuario.columnValue,
      this.selectedColumnnEstatus.fieldValue, this.selectedColumnnEstatus.columnValue,
      newtimefrom, newtimeuntil,
      this.sort.active, this.sort.direction, this.pageSize, this.paginator.pageIndex, this.project_id, this.id, this.token.token).then(
      (res: any) => 
      {
        res.subscribe(
          (some) => 
          { 
            if(some.datos){
             //console.log(some.datos);
            this.exportDataSource = new MatTableDataSource(some.datos);
            this.isLoadingResults = false;
            this.isRateLimitReached = false;
            //console.log('paso ExportTOExcelClient');
            //console.log(this.exportDataSource.data);
            //console.log(this.exportDataSource.data.length);

                for (var i=0; i<this.exportDataSource.data.length; i++){
                  var bandera: boolean = false;
                  for (var j=0; j<arraydata.length; j++){
                    if(arraydata[j] == this.exportDataSource.data[i]['servicetype_id']){
                      //console.log(j);
                      //console.log(this.exportDataSource.data[i]['servicetype_id']);
                      bandera = true;
                    }                    

                  }

                  if(bandera == false){
                    arraydata.push(this.exportDataSource.data[i]['servicetype_id']);
                  }
                }

                //console.log(arraydata);

                for (var i=0; i<arraydata.length; i++){//FIRSTFOR
                  var banderatitulo: boolean = true;
                  for (var j=0; j<this.exportDataSource.data.length; j++){//SECONDFORD
                    if(arraydata[i] == this.exportDataSource.data[j]['servicetype_id']){ //FIRST IF                                           
                      if(Object.keys(this.exportDataSource.data[j]['atributo_share']).length > 0 && banderatitulo == true){
                        //console.log(this.exportDataSource.data[j]['atributo_share']);
                        if(this.exportDataSource.data[j]['name_table'] == 'address'){
                           //arrayexcel[0] = ['ID ORDEN', 'NUMERO DE ORDEN', 'CREADO POR', 'EDITADO POR', 'ASIGNADO A', 'SERVICIO', 'TIPO DE SERVICIO', 'ESTATUS' ,'OBSERVACIONES', 'NUMERO DE CLIENTE', 'DIRECCIÓN', 'COMUNA', 'CALLE', 'NUMERO', 'BLOCK', 'DEPTO', 'TARIFA', 'CONSTANTE', 'GIRO', 'SECTOR','ZONA','MERCADO','FECHA CREACIÓN','FECHA DE ACTUALIZACIÓN'];
                           valuearrayexcel = valuearrayexcel + "ID ORDEN;NUMERO DE ORDEN;CREADO POR;EDITADO POR;ASIGNADO A;SERVICIO;TIPO DE SERVICIO;ESTATUS;OBSERVACIONES;NUMERO DE CLIENTE;UBICACIÓN;PATIO;ESPIGA;POSICION;COMUNA;CALLE;NUMERO;BLOCK;DEPTO;TARIFA;CONSTANTE;GIRO;SECTOR;ZONA;MERCADO;FECHA CREACIÓN;FECHA DE ACTUALIZACIÓN;";
                        }
                        for(let key in this.exportDataSource.data[j]['atributo_share']){
                          let newarray = this.exportDataSource.data[j]['atributo_share'][key];
                          if(newarray['type']  !== 'label'){    
                             valuearrayexcel = valuearrayexcel+newarray['descripcion']+';';
                             //arrayexcel[0].splice(arrayexcel[0].length+1,0,newarray['descripcion']);
                          }
                        }
                        banderatitulo = false;
                        valuearrayexcel = valuearrayexcel +'\n';
                      }else{
                        if(Object.keys(this.exportDataSource.data[j]['atributo_share']).length == 0 && banderatitulo == true){
                          //console.log('paso atyributo share');
                          valuearrayexcel = valuearrayexcel + "ID ORDEN;NUMERO DE ORDEN;CREADO POR;EDITADO POR;ASIGNADO A;SERVICIO;TIPO DE SERVICIO;ESTATUS;OBSERVACIONES;NUMERO DE CLIENTE;UBICACIÓN;PATIO;ESPIGA;POSICION;COMUNA;CALLE;NUMERO;BLOCK;DEPTO;TARIFA;CONSTANTE;GIRO;SECTOR;ZONA;MERCADO;FECHA CREACIÓN;FECHA DE ACTUALIZACIÓN;" + '\n';
                          banderatitulo = false;
                        }

                      }
                        if(this.exportDataSource.data[j]['name_table'] == 'address'){
                          var ubicacion = this.exportDataSource.data[j]['direccion'];
                        }
                        if(this.exportDataSource.data[j]['name_table'] == 'vehiculos'){
                          var ubicacion = this.exportDataSource.data[j]['patio']+'-'+this.exportDataSource.data[j]['espiga']+'-'+this.exportDataSource.data[j]['posicion'];
                        }

                        valuearrayexcel = valuearrayexcel + this.exportDataSource.data[j]['order_id'] +';'+ this.exportDataSource.data[j]['order_number']+';'+this.exportDataSource.data[j]['user']+';'+this.exportDataSource.data[j]['userupdate']
                                              +';'+this.exportDataSource.data[j]['userassigned']+';'+this.exportDataSource.data[j]['service_name']+';'+this.exportDataSource.data[j]['servicetype']+';'+this.exportDataSource.data[j]['estatus']+';'+this.exportDataSource.data[j]['observation']+';'+this.exportDataSource.data[j]['cc_number']+';'+ubicacion
                                              +';'+this.exportDataSource.data[j]['patio']+';'+this.exportDataSource.data[j]['espiga']+';'+this.exportDataSource.data[j]['posicion']+';'+this.exportDataSource.data[j]['comuna']+';'+this.exportDataSource.data[j]['calle']+';'+this.exportDataSource.data[j]['numero']+';'+this.exportDataSource.data[j]['block']+';'+this.exportDataSource.data[j]['depto']+';'+this.exportDataSource.data[j]['tarifa']+';'+this.exportDataSource.data[j]['constante']
                                              +';'+this.exportDataSource.data[j]['giro']+';'+this.exportDataSource.data[j]['sector']+';'+this.exportDataSource.data[j]['zona']+';'+this.exportDataSource.data[j]['mercado']+';'+this.exportDataSource.data[j]['create_at']+';'+this.exportDataSource.data[j]['update_at'] +';';
                        

                        if(Object.keys(this.exportDataSource.data[j]['orderatributo']).length > 0){
                        for (var keyatributovalue in this.exportDataSource.data[j]['atributo_share']) {
                          if(this.exportDataSource.data[j]['atributo_share'][keyatributovalue] !== null){                        
                            orderatributovalue[keyatributovalue] = this.exportDataSource.data[j]['atributo_share'][keyatributovalue];
                            var banderasindato = true;
                            for(var keyorderatributovalue in this.exportDataSource.data[j]['orderatributo']){
                             if(this.exportDataSource.data[j]['orderatributo'][keyorderatributovalue]['atributo_id'] == this.exportDataSource.data[j]['atributo_share'][keyatributovalue]['id']){
                                 var ordervalue = this.exportDataSource.data[j]['orderatributo'][keyorderatributovalue]['valor'];
                                 ordervalue = ordervalue.split("\n").join(" ");
                                 ordervalue = ordervalue.split("\t").join(" ");
                                 ordervalue = ordervalue.split(";").join(" ");
                                 //ordervalue = ordervalue.replace(pattern,' ');
                                 //ordervalue = ordervalue.replace('\t',' ');                            
                                 //ordervalue = ordervalue.replace(';',' ');
                                 valuearrayexcel = valuearrayexcel + ordervalue + ';';
                                 banderasindato = false;
                             }
                             if(this.exportDataSource.data[j]['atributo_share'][keyatributovalue]['type'] == 'label'){
                                banderasindato = false;
                             }
                            }
                            if(banderasindato == true){
                              valuearrayexcel = valuearrayexcel + 'S/N ; '; 
                            }

                          }
                        }

                        valuearrayexcel = valuearrayexcel + '\n';


                        }else{
                           valuearrayexcel = valuearrayexcel +'\n';
                        }

                    }//END FIRST IF
                    

                  }//END SECOND FOR                
                  

                }//END //FIRSTFOR
            //console.log(valuearrayexcel);
            if($event==1){
              valuearrayexcel = valuearrayexcel.toUpperCase();
            }

            //const csv_type = 'text/csv;charset=windows-1252;';
            //const csv_type = "application/octet-stream";
            //const csv_type = 'text/csv;';
            //const csv_type = 'text/csv;charset=ISO-8859-1;';
            //const FILE_TYPE = "text/csv;charset=utf-8;";
            const FILE_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;";
            const FILE_EXTENSION = '.csv';
            const fileName = "Ordenes";
            //------------------------------------------------------------------------------         
            //var uint8array = new TextEncoder().encode(valuearrayexcel);
            //var csvContentEncoded = new TextDecoder('windows-1252').decode(uint8array);
            //var blob = new Blob([uint8array], {type: csv_type});
            //FileSaver.saveAs(blob, "Ordenes.csv");
            //------------------------------------------------------------------------------
            var blob = new Blob([valuearrayexcel], {type: FILE_TYPE});
            FileSaver.saveAs(blob, fileName + '_export_' + new Date().getTime() + FILE_EXTENSION);
            //------------------------------------------------------------------------------         
            /*
            const worksheet: XLSX.WorkSheet = XLSX.utils.sheet_to_json(valuearrayexcel);
            const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const data: Blob = new Blob([excelBuffer], {type: FILE_TYPE});
            FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + FILE_EXTENSION);
            */

            }else{
            this.isLoadingResults = false;
            this.isRateLimitReached = false;
            //console.log('noo paso ExportTOExcelClient');
            }
          },
          (error) => {                      
            this.isLoadingResults = false;
            this.isRateLimitReached = false; //YA QUE EL API DEVUELVE 401 CUANDO NO EXISTEN DATOS
            this.error = 'No se encontraron registros que coincidan con su búsqueda';            
            this.toasterService.error('Error: '+this.error, '', {timeOut: 6000,});
            console.log(<any>error);
          }  
          )
    })   

    //this.excelService.exportAsExcelFile(this.exportDataSource.data, 'Ordenes');
  }



  public downloadPDF(){

  var doc = new jsPDF('l');
  var totalPagesExp = "{total_pages_count_string}";
  var rows: Order[]=[];
  var projectname = '';
  var servicename = '';
  var base64Img = null;
  var array = new Array();
  var date= new Date().getDate();
  var month= new Date().getMonth();
  var year= new Date().getFullYear();
  var today = date+"/"+month+"/"+year;
  var i=0;

  var columns = [
      {title: "N. Orden", dataKey: "order_number"},
      {title: "N. Cliente", dataKey: "cc_number"},
      {title: "Región", dataKey: "region"},     
      {title: "Comuna", dataKey: "comuna"},     
      {title: "T. Servicio", dataKey: "servicetype"},     
      {title: "Estatus", dataKey: "estatus"},           
      {title: "Creada Por", dataKey: "user"},
      {title: "Creada El", dataKey: "create_at"},
      {title: "Editada Por", dataKey: "userupdate"},
      {title: "Editada El", dataKey: "update_at"},

  ];

   for (var propiedad in this.dataSource.data) {
      array.push(this.dataSource.data[propiedad]);      
      rows[i] = array[i];
      projectname = array[i]['project_name'];
      servicename = array[i]['service_name'];
      i = i+1;
    }
  //console.log(array);

/*
  for (var i=0; i<array.length; i++){
    rows[i] = array[i];
    projectname = array[i]['project_name'];
    servicename = array[i]['service_name'];
  }

*/
    doc.autoTable(columns, rows, {
        startY: 30,        
        margin: {horizontal: 4},
        styles: {columnWidth: 'wrap'},
        columnStyles: {text: {columnWidth: 'auto'}},           
      addPageContent: function(data) {
        //HEADER
        var project = "Proyecto: " + projectname;
        var service = "Servicio: " + servicename; 
        doc.setFontSize(10);      
        doc.text(7, 7, project);
        doc.text(7, 12, service);
        //doc.text(7, 27, title);
        //HEADER IMAGE
        imgToBase64('assets/img/logoocalistadopng.png', function(base64) {
             base64Img = base64; 
        });        

        if (base64Img) {
            doc.addImage(base64Img, 'PNG', 0, 0, 10, 10);
        }
        // FOOTER
        var str = "Page " + data.pageCount;
        var todaypdf = "Fecha Impresión: " + today;
        var title = "Reporte: Listado de Órdenes";
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
            //str = str + " of " + totalPagesExp;
            str = str ;
            todaypdf = todaypdf;
            title = title;
        }
        doc.setFontSize(10);
        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        doc.text(title, data.settings.margin.left, pageHeight  - 17);        
        doc.text(todaypdf, data.settings.margin.left, pageHeight  - 12);        
        doc.text(str, data.settings.margin.left, pageHeight  - 7);        
      }

    });

    doc.save('Ordenes.pdf');    
  }




}



function imgToBase64(src, callback) {

    var outputFormat = src.substr(-3) === 'png' ? 'image/png' : 'image/jpeg';
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {

    var canv = document.createElement('canvas');
    var ctx = canv.getContext('2d');
    var dataURL;
    canv.height = 60;
    canv.width = 100;
    ctx.drawImage(canv, 10, 10);
    dataURL = canv.toDataURL(outputFormat);
    callback(dataURL);
    };
    img.src = src;
    if (img.complete || img.complete === undefined) {
        img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        img.src = src;
    }
}


