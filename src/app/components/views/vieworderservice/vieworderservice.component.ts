import { Component, ElementRef, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Sort, MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { FormControl, Validators} from '@angular/forms';
import { TooltipPosition } from '@angular/material';
import { PageEvent } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { MatSelect } from '@angular/material';
import { debounceTime } from 'rxjs/operators/debounceTime';

//CDK
import { Portal, TemplatePortal } from '@angular/cdk/portal';

import * as FileSaver from 'file-saver';

//GLOBAL
import { GLOBAL } from '../../../services/global';

//SERVICES
import { CountriesService, ExcelService, ModalManageService, OrderserviceService, ProjectsService, UserService, ZipService } from '../../../services/service.index';


//MODELS
import { Order, ServiceType, ServiceEstatus } from '../../../models/types';


//COMPONENTS

//DIALOG
import { AddComponent } from '../../dialog/add/add.component';
import { AddDocComponent } from '../../../components/shared/dialog/add-doc/add-doc.component';
import { AddJobComponent } from '../../../pages/orderservice/components/dialog/add-job/add-job.component';
import { FileComponent } from '../../dialog/file/file.component';
import { CsvComponent } from '../../dialog/csv/csv.component';
import { DeleteComponent } from '../../dialog/delete/delete.component';
import { EditComponent } from '../../dialog/edit/edit.component';
import { SendOrderByEmailComponent } from 'src/app/pages/orderservice/components/dialog/send-order-by-email/send-order-by-email.component';
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
  
  
  //date = new FormControl(moment([2019, 3, 2]).format('YYYY[-]MM[-]DD'));  
  assigned_to:number = 0;
  fromdate = moment(Date.now() - 7 * 24 * 3600 * 1000).format('YYYY-MM-DD'); 
  date = new FormControl(moment(new Date()).format('YYYY[-]MM[-]DD'));
  durationInSeconds:number = 5;
  isMobile: string = '';
  subtitle = "Listado de órdenes de trabajo. Agregue, edite, elimine y ordene los datos de acuerdo a su preferencia.";
  columnselect: string[] = new Array();
  datedesde: FormControl;
  datehasta: FormControl;
  filterAllValue: number = 0;
  filterValue: string = '';
  formfilterValue: FormControl = new FormControl();
  debouncedInputValue = this.filterValue;
  estatus: ServiceEstatus[] = [];  
  filterChanged: Subject<any> = new Subject();
  identity: any;
  order: Order[] = [];
  order_id: number;
  projectname: string;
  private project_id: number;
  private searchDecouncer$: Subject<string> = new Subject();
  service_id:number;
  servicename: string;
  servicetypeid: number = 0;
  servicetype: ServiceType[] = [];
  selectedValueOrdeno: string;
  sub: any;
  token:any;
  termino: string = '';
  oken: any;
  url:string;


  portal:number=0;
  open: boolean = false;
  loading: boolean;
  isactiveSearch: boolean = false;
  datasourceLength: number = 0;
  label: boolean;
  row : Number;
  index: number;    
  indexitem:number;
  category_id: number;
  order_date: string;
  required_date: string;  
  counter: any;
  count:any;
  error: string; 
  role:number; 


  selectedRow : Number;

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



  selectedColumnn = {
    fieldValue: 'orders.create_at',
    criteria: '',
    columnValue: ''
  };



  selectedColumnnDate = {
    fieldValue: 'orders.create_at',
    criteria: '',
    columnValueFrom: this.fromdate,
    columnValueDesde: this.date.value,
    columnValueHasta: this.date.value
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

 selectedColumnnZona = {
    fieldValue: 'ma_zona.id',
    criteria: '',
    columnValue: 0
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

  columns: Array<any> = [
    { name: 'important', label: 'Destacar' },
    { name: 'order_number', label: 'N. Orden' },
    { name: 'cc_number', label: 'N. Cliente' },
    { name: 'orderdetail_direccion', label: 'Realizado En' },
    { name: 'direccion', label: 'Ubicación' },
    { name: 'servicetype', label: 'Servicio' },
    { name: 'user', label: 'Informador' },
    { name: 'create_at', label: 'Creado El' },
    { name: 'userassigned', label: 'Responsable' },
    { name: 'time', label: 'T. Ejecución' },
    { name: 'atentiontime', label: 'T. Atención' },
    { name: 'estatus', label: 'Estatus' },
    { name: 'actions', label: 'Acciones' }
  ];  
  

  columnsHide: Array<any> = [
    { name: 'order_number', label: 'N. Orden' },
    { name: 'cc_number', label: 'N. Cliente' },
    { name: 'user', label: 'Informador' },
    { name: 'create_at', label: 'Creado El' },
    { name: 'estatus', label: 'Estatus' },
    { name: 'actions', label: 'Acciones' }
  ];  




  dataSourceEmpty: any;    
  displayedColumns: string[] = ['important', 'order_number','cc_number', 'region', 'provincia', 'comuna', 'direccion', 'servicetype', 'user', 'userupdate', 'userassigned', 'create_at', 'update_at', 'time','atentiontime', 'estatus', 'actions']; 
  columnsOrderToDisplay: string[] = this.columns.map(column => column.name);
  columnsOrderSettingsToDisplay: string[] = this.columns.map(column => column.name);
  //columnsOrderToDisplay: string[] = ['important', 'order_number','cc_number', 'region', 'provincia', 'comuna', 'direccion', 'servicetype', 'estatus', 'user', 'create_at', 'actions']; 
  //columnsOrderToDisplay: string[] = ['order_number','cc_number', 'region', 'provincia', 'comuna', 'direccion', 'servicetype', 'estatus', 'user', 'create_at', 'actions']; 
  //columnsOrderToDisplay: string[] = this.displayedColumns.slice();  

  data: Order[] = [];
  dataSource: MatTableDataSource<Order[]>;
  exportDataSource: MatTableDataSource<Order[]>;  

  isLoadingResults = true;
  isRateLimitReached = false;
  nametable: string;
  resultsLength:number = 0;
  pageIndex:number;
  public show:boolean = false;
  public showcell:boolean = true;
  public buttonName:any = 'Show';


  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) matSort: MatSort;
  @Output() ServicioSeleccionado: EventEmitter<string>;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  @Input() id : number;

  //CDK PORTAL
  @ViewChild('myTemplate', { static: true }) myTemplate: TemplatePortal<any>;
  @ViewChild('myTemplate2', { static: true }) myTemplate2: TemplatePortal<any>;
  @ViewChild('myTemplate3', { static: true }) myTemplate3: TemplatePortal<any>;
  @ViewChild('myTemplate4', { static: true }) myTemplate4: TemplatePortal<any>;
  public _portal: Portal<any>;
  public _home:Portal<any>;


  subscription: Subscription;

  constructor(
    public _modalManage: ModalManageService,
    private _regionService: CountriesService,
    private _orderService: OrderserviceService,
    private _proyecto: ProjectsService,
    public _userService: UserService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,    
    private excelService:ExcelService,
    private toasterService: ToastrService,
    public zipService: ZipService,
  ) 
  
  { 
    this.url = GLOBAL.url;
    this.loading = true;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this._userService.handleAuthentication(this.identity, this.token);
    this.ServicioSeleccionado = new EventEmitter(); 
    this.dataSource = new MatTableDataSource();
    this.error = '';
    this.role = 5; //USUARIOS INSPECTORES
    this.open = false;    
  }

  hoverIn(index:number){
    this.indexitem = index;
  }

  hoverOut(_index:number){
    this.indexitem = -1;

  }


  log(_x) {
   //console.log(x);
  }


  onChangeIcon(checked:boolean, category_id:number, orden:number) {

    this.label = checked;

    if(this.label == true){
      const tag = 1;
      this._orderService.important(this.token.token, category_id, orden, tag);
      this.snackBar.open('Se ha marcado la orden como importante.', 'Destacada', {duration: 2000,});
    }

    if(this.label == false){
      const tag = 0;
      this._orderService.important(this.token.token, category_id, orden, tag);
      this.snackBar.open('Se ha marcado la orden como no importante.', '', {duration: 2000,});
    }

  }  

  /*
  onChange(event:any, category_id:number, orden:number) {
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
  }*/





  add(indexcolumn:any) {
    const indexarray = this.displayedColumns.indexOf(indexcolumn);
    if (this.columnsOrderToDisplay.length) {
        if (indexarray !== -1) {
        this.columnsOrderToDisplay.splice(indexarray,0,indexcolumn);
        }        
    }    
  }

  remove(indexcolumn:any) {
    const indexarray = this.columnsOrderToDisplay.indexOf(indexcolumn);
    if (this.columnsOrderToDisplay.length) {
        if (indexarray !== -1) {
        this.columnsOrderToDisplay.splice(indexarray, 1);
        }        
    }    
  }

  setClickedRow(index:number, orderid:number){
    this.selectedRow = index;
    this.order_id = orderid;
  }
  
  showModal(id: number){
    //console.log(id);
    if(id > 0){
      this._modalManage.showModal(id);
      this.assigned_to = id;  
    }else{
      return;
    }
    //console.log(this.assigned_to);
  }

  ngOnInit() {
    //VALORES POR DEFECTO DE FILTRO AVANZADO
    this.selectedColumnnDate.fieldValue = 'orders.create_at';
    this.selectedColumnn.fieldValue = 'orders.create_at';
    

    //this._portal = this.myTemplate;
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.matSort;
    this.setupSearchDebouncer();
    this.inspectorMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterInspector();
      });    
  }


  ngOnChanges(_changes: SimpleChanges) {
    //console.log(this.selectedColumnnDate);
    //console.log('paso');
    this.portal = 0;
    this.selectedRow = -1;
    this.order_id = 0;
    this.filterAllValue = 0;
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;
    this._portal = this.myTemplate;
    this._home = this.myTemplate;
    this.showcell = true;
    this.isactiveSearch = false;
    this.datasourceLength = 0;
    this.filterValue = '';
    this.termino = '';    
    this.loadInfo();
    this.getZona(this.id);
    this.getProject(this.id);
    this.getTipoServicio(this.id);    
    this.getEstatus(this.id);
    this.refreshTable();    
  }


  ngOnDestroy() {
    //console.log('La página se va a cerrar');
    this._onDestroy.next();
    this._onDestroy.complete();
    if(this.subscription){
    this.subscription.unsubscribe();
    }
     //this.subscription.unsubscribe();     
     //this.unsubscribe.next();
     //this.unsubscribe.complete();
     //console.log("ngOnDestroy ORDER complete");
  }



  getDateFormar(date: Date) {
    const datezipdesde = new FormControl(moment(date).format('YYYY[-]MM[-]DD'));
    return datezipdesde.value;
  }



  getTipoServicio(id:number) {
    this.zipService.getTipoServicio(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some: any) => {
            this.tipoServicio = some['datos'];
            // console.log(this.tipoServicio);
          },
          (error: any) => {
            console.log(<any>error);
          }
        );
      }
    );
  }

  getZona(id:number) {
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


  getProject(id:number) {
   this.subscription = this._orderService.getService(this.token.token, id).subscribe(
    response => {
              if (response.status == 'success'){         
              this.project_id = response.datos['project_id'];
              if(this.project_id > 0){
                this.getUser(this.project_id);                                       
              }
              }
     });
  }


  getEstatus(id:number) {    
   this.subscription = this._orderService.getServiceEstatus(this.token.token, id).subscribe(
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
          (some: any) => 
          {
            //console.log(some);
            if(some.status == 'success'){
              if(some.datos && some.datos.data){
                //console.log(some.datos.data);
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
                if(this.dataSource && this.dataSource.data.length > this.datasourceLength){
                  this.datasourceLength = this.dataSource.data.length;
                  this.isactiveSearch = true;
                  
                }
            }
            this.isLoadingResults = false;
          },
          (error :any) => {                      
            this.isLoadingResults = false;
            this.isRateLimitReached = true;
            this._userService.logout();
            //this._router.navigate(["/login"]);          
            console.log(<any>error);
          });
    }else{
      return;
    }    
  }


  public refreshTable() { 
    //console.log('paso refresch');
    //this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.termino = '';
    this.selectedRow = -1;
    this.order_id = 0;
    this.regionMultiCtrl.reset();
    this.inspectorMultiFilterCtrl.reset();
    this.inspectorCtrl = new FormControl('');
    this.filterValue = '';
    this.selectedColumnn.columnValue = '';
    this.selectedColumnn.fieldValue = '';
    this.selectedColumnnDate.fieldValue = 'orders.create_at';
    this.selectedColumnnDate.columnValueDesde = this.fromdate;
    this.selectedColumnnDate.columnValueHasta = this.date.value;
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

    
    this._orderService.getServiceOrder(
      this.filterValue, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,             
      this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta, 
      this.filtersregion.fieldValue, this.regionMultiCtrl.value,
      this.selectedColumnnUsuario.fieldValue, this.selectedColumnnUsuario.columnValue,
      this.sort.active, this.sort.direction, this.pageSize, this.pageIndex, this.id, this.token.token)
      .then(response => {
        //console.log(response);
        this.getData(response);
        this.snackBar.open('Órdenes de Trabajo de los últimos 7 días.', 'Información', {duration: this.durationInSeconds * 1500,});
      }
      )
      .catch(error => {                      
            this.isLoadingResults = false;
            this.isRateLimitReached = true;
            console.log(<any>error);          
      });
  }


  getParams(){

    //console.log('get params');
  
    this.isLoadingResults = true;

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
      //console.log('paso111')      
   }


    if(this.filterAllValue == 0 && (!this.selectedColumnnDate.fieldValue || !this.selectedColumnnDate.columnValueDesde || !this.selectedColumnnDate.columnValueHasta)){
      this.fromdate = moment(Date.now() - 7 * 24 * 3600 * 1000).format('YYYY-MM-DD'); 
      this.date = new FormControl(moment(new Date()).format('YYYY[-]MM[-]DD'));    
      this.selectedColumnnDate.fieldValue = 'orders.create_at';
      this.selectedColumnnDate.columnValueDesde = this.fromdate;
      this.selectedColumnnDate.columnValueHasta = this.date.value;
      //console.log('paso000')
    }

    if(this.filterAllValue == 1 && (!this.selectedColumnnDate.fieldValue || !this.selectedColumnnDate.columnValueDesde || !this.selectedColumnnDate.columnValueHasta)){
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
      //console.log('paso111')      
   }


    if(this.selectedColumnn.fieldValue && this.selectedColumnn.columnValue && !this.selectedColumnnDate.fieldValue){
       this.selectedColumnnDate.fieldValue = '';
       this.selectedColumnnDate.columnValueDesde = '';
       this.selectedColumnnDate.columnValueHasta = '';
       this.filtersregion.fieldValue = '';
       this.selectedColumnnUsuario.fieldValue = '';
       this.selectedColumnnUsuario.columnValue = '';              
       //this.datedesde = new FormControl('');
       //this.datehasta = new FormControl('');
       this.regionMultiCtrl = new FormControl('');
       //console.log('paso111')
    }

    if(!this.regionMultiCtrl.value && !this.selectedColumnnUsuario.fieldValue && this.selectedColumnnDate.fieldValue && this.selectedColumnnDate.columnValueDesde && this.selectedColumnnDate.columnValueHasta){
       //this.selectedColumnn.fieldValue = '';
       //this.selectedColumnn.columnValue = '';
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
       //console.log('paso555')
    }


    //console.log(this.selectedColumnnDate.fieldValue)
    //console.log(this.selectedColumnnDate.columnValueDesde)
    //console.log(this.selectedColumnnDate.columnValueHasta)

    
  }


  

  onPaginateChange(event){
   //console.log(this.paginator.pageIndex);
   this.isLoadingResults = true;
   this.pageSize = event.pageSize;    
   this.getParams();
    this._orderService.getServiceOrder(
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


  search() {
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

    if(this.selectedColumnn.fieldValue && this.selectedColumnn.columnValue && !this.selectedColumnnDate.fieldValue){
       this.selectedColumnnDate.fieldValue = '';
       this.selectedColumnnDate.columnValueDesde = '';
       this.selectedColumnnDate.columnValueHasta = '';
       this.filtersregion.fieldValue = '';
       this.selectedColumnnUsuario.fieldValue = '';
       this.selectedColumnnUsuario.columnValue = '';              
       //this.datedesde = new FormControl('');
       //this.datehasta = new FormControl('');
       this.regionMultiCtrl = new FormControl('');
       //console.log('paso111')
    }

    if(!this.regionMultiCtrl.value && !this.selectedColumnnUsuario.fieldValue && this.selectedColumnnDate.fieldValue && this.selectedColumnnDate.columnValueDesde && this.selectedColumnnDate.columnValueHasta){
       //this.selectedColumnn.fieldValue = '';
       //this.selectedColumnn.columnValue = '';
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
       //console.log('paso555')
    }*/

    this._orderService.getServiceOrder(
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
    this.filterValue = this.filterValue.trim();
    if(this.filterValue.length > 1 && this.filterValue.trim() !== '' && this.termino !== this.filterValue){
      this.isLoadingResults = true;
      this.getParams();
      this.termino = this.filterValue.trim();
      this.searchDecouncer$.next(this.filterValue.trim());
    }

  }


  private setupSearchDebouncer(): void {
    this.searchDecouncer$.pipe(
      debounceTime(3000),
    ).subscribe((term: string) => {
      // Remember value after debouncing
      this.debouncedInputValue = term;
      this._orderService.getServiceOrder(
        this.filterValue, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,             
        this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta, 
        this.filtersregion.fieldValue, this.regionMultiCtrl.value,
        this.selectedColumnnUsuario.fieldValue, this.selectedColumnnUsuario.columnValue,
        this.sort.active, this.sort.direction, this.pageSize, this.paginator.pageIndex, this.id, this.token.token)
        .then(response => {
          //this.termino = '';
          this.getData(response);
          //console.log(<any>response);
        })
        .catch(error => {                      
              this.isLoadingResults = false;
              this.isRateLimitReached = true;
              console.log(<any>error);          
        });
      // Do the actual search
    });    
  }
  


 handleSortChange(sort: Sort): void {

    if (sort.active && sort.direction) {
      this.sort = sort;
      this.selectedColumnn.fieldValue = '';
      //this.selectedColumnnDate.fieldValue = '';
      //this.selectedColumnnDate.columnValueDesde = '';
      //this.selectedColumnnDate.columnValueHasta = '';  
    }
    this.isLoadingResults = true;
    this.getParams();

    this._orderService.getServiceOrder(
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
   this.subscription = this._regionService.getRegion(this.token.token, this.identity.country).subscribe(
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
    this.filterAllValue = 0;
    this.regionMultiCtrl.reset();
  }

  toggleTemplate(event:number) {
    //this.showtemplate = !this.showtemplate;
    if(event == 0){     
      this._portal = this.myTemplate;
      this.showcell = true;
      this.portal = 0;
      this.columnsOrderToDisplay = this.columns.map(column => column.name);
    }
    if (event == 1){
      this._portal = this.myTemplate2;
      this.showcell = false;
      this.portal = 1;
      this.columnsOrderToDisplay = this.columnsHide.map(column => column.name);      
    }
    
    if (event == 2){
      this._portal = this.myTemplate3;
      this.showcell = false;
      this.portal = 2;
    }

    if (event == 3){
      this._portal = this.myTemplate4;
      this.showcell = false;
      this.portal = 2;
    }
  }



  addNew(id:number, category_id:number, _order: Order[]) {
     const dialogRef = this.dialog.open(AddComponent, {
     width: '1000px',
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
  

  startEdit(order_id: number, order_number: string, category_id:number, customer_id: number, cc_number: string, servicetype_id: number, status_id: number, assigned_to:number, order_date: string, required_date: string, vencimiento_date: string, leido_por:string, observation: string, create_at: string) {
    let service_id = this.id;    
    //console.log(assigned_to);    
    const dialogRef = this.dialog.open(EditComponent, {
      width: '1000px',
      disableClose: true,  
      data: {order_id: order_id, order_number: order_number, service_id: service_id, category_id: category_id, customer_id: customer_id, cc_number: cc_number, 
        servicetype_id: servicetype_id, status_id: status_id, 
        assigned_to: assigned_to,        
        order_date: order_date, required_date: required_date, vencimiento_date: vencimiento_date, leido_por:leido_por, observation: observation, create_at: create_at}
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
      width: '1000px',
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
      width: '1000px',
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

  addDoc() {
    const dialogRef = this.dialog.open(AddDocComponent, {
      width: '1000px',
      disableClose: true,                 
      data: { project_id: this.project_id,
              service_id: this.id
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) { 

      }
    });
  }



  addJob(order_id: any, order_number: any, estatus: any, servicetype_id:number) {
    const dialogRef = this.dialog.open(AddJobComponent, {
      width: '1000px',
      disableClose: true,                 
      data: { project: this.project_id,
              service_id: this.id,
              tiposervicio: servicetype_id,              
              orderid: order_id,
              order_number: order_number,
              estatus: estatus
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) { 

      }
    });
  }



  publish(_columns:string) {
    const dialogRef = this.dialog.open(FileComponent, {
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
    this.dialog.open(ZipComponent, {
      width: '350px',
      disableClose: true,
      data: {
              createEdit: 'create_at',
              date: null,
              dateend: null,
              id_region: 0,
              id_provincia: 0,
              id_comuna: 0,
              project_id: this.project_id,
              selectedValueservicio: null,
              selectedValuezona: null,
              tiposervicio: this.tipoServicio,
              zona: this.zona
            }

    });
  }

  
  openDialogCsv(): void {

    const dialogRef = this.dialog.open(CsvComponent, {
      width: '777px',
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
    this.step = 0;
  }


  SendOrderByEmail(order_id: any, order_number: any, estatus: any, servicetype_id:number) {
    const dialogRef = this.dialog.open(SendOrderByEmailComponent, {
      width: '1000px',
      disableClose: true,                 
      data: { project: this.project_id,
              service_id: this.id,
              tiposervicio: servicetype_id,              
              orderid: order_id,
              order_number: order_number,
              estatus: estatus
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) { 

      }
    });
  }


 ExportTOExcel():void {
    this.excelService.exportAsExcelFile(this.dataSource.data, 'Ordenes');
  }

  ExportTOExcelDate($event):void {
   //console.log($event);
   var arraydata = new Array();
   // var orderatributovalue = [];
   var arraydata = [];
   var valuearrayexcel = "";
   // var pattern = /(\w+)\s+(\w+)/;
   var newtimefrom = '';
   var newtimeuntil = '';


   this.isLoadingResults = true;
   this.regionMultiCtrl.reset();
   this.selectedColumnnDate.fieldValue = 'orders.create_at';
   this.selectedColumnn.fieldValue = 'orders.create_at';
   this.selectedColumnnDate.columnValueDesde = this.date.value;
   this.selectedColumnnDate.columnValueHasta = this.date.value;



   if(!this.selectedColumnnEstatus.columnValue){
     this.selectedColumnnEstatus.fieldValue = '';
     this.selectedColumnnEstatus.columnValue = '';
   }else{
     this.selectedColumnnEstatus.fieldValue = 'orders_details.status_id'
   }

   if(!this.selectedColumnnUsuario.fieldValue){
     this.selectedColumnnUsuario.fieldValue = '';
     this.selectedColumnnUsuario.columnValue = '';
   }



   if(!this.regionMultiCtrl.value && this.selectedColumnnDate.fieldValue && this.selectedColumnnDate.columnValueDesde && this.selectedColumnnDate.columnValueHasta){
      this.selectedColumnn.fieldValue = '';
      this.selectedColumnn.columnValue = '';
      this.filtersregion.fieldValue = '';
      this.datedesde = new FormControl(moment(this.selectedColumnnDate.columnValueDesde).format('YYYY[-]MM[-]DD'));
      this.datehasta = new FormControl(moment(this.selectedColumnnDate.columnValueHasta).format('YYYY[-]MM[-]DD'));
      this.selectedColumnnDate.columnValueDesde = this.datedesde.value;
      this.selectedColumnnDate.columnValueHasta = this.datehasta.value;
   }




   this._orderService.getProjectShareOrder(      
     this.filterValue, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,             
     this.selectedColumnnDate.fieldValue, this.date.value, this.date.value, 
     this.filtersregion.fieldValue, this.regionMultiCtrl.value,
     this.selectedColumnnUsuario.fieldValue, this.selectedColumnnUsuario.columnValue,
     this.selectedColumnnEstatus.fieldValue, this.selectedColumnnEstatus.columnValue,
     newtimefrom, newtimeuntil,
     this.selectedColumnnZona.columnValue,
     this.servicetypeid,
     this.sort.active, this.sort.direction, 0, 0, this.project_id, this.id, this.token.token, $event).then(
     (res: any) => 
     {
        res.subscribe(
         (some) => 
         { 
           if(some.datos){
           this.exportDataSource = new MatTableDataSource(some.datos);
           
           if(!this.exportDataSource.data.length){
             this.exportDataSource = new MatTableDataSource(some.datos.data);
           }
           
             if(this.exportDataSource.data.length && this.exportDataSource.data.length > 0){
               for (var i=0; i<this.exportDataSource.data.length; i++){
                 var bandera: boolean = false;
                 for (var j=0; j<arraydata.length; j++){
                   if(arraydata[j] == this.exportDataSource.data[i]['servicetype_id']){
                     //console.log(this.exportDataSource.data[i]['servicetype_id']);
                     bandera = true;
                   }                    

                 }
                 if(bandera == false){
                   arraydata.push(this.exportDataSource.data[i]['servicetype_id']);
                 }
               }
             }
           



             if($event == 3){
               for (var i=0; i<arraydata.length; i++){//FIRSTFOR
                 var banderatitulo: boolean = true;
                 for (var j=0; j<this.exportDataSource.data.length; j++){//SECONDFORD
                   if(arraydata[i] == this.exportDataSource.data[j]['servicetype_id']){ //FIRST IF    
                     if(this.exportDataSource.data[j]['atributo_share'] && Object.keys(this.exportDataSource.data[j]['atributo_share']).length > 0 && banderatitulo == true){
                       if(this.exportDataSource.data[j]['name_table'] == 'address'){
                          valuearrayexcel = valuearrayexcel + "ID ORDEN;NUMERO DE ORDEN;IMAGEN;CREADO POR;EDITADO POR;ASIGNADO A;SERVICIO;TIPO DE SERVICIO;ESTATUS;LEIDOPOR;OBSERVACIONES;NUMERO DE CLIENTE;UBICACIÓN;RUTA;COMUNA;CALLE;NUMERO;BLOCK;DEPTO;TRANSFORMADOR;MEDIDOR;TARIFA;CONSTANTE;GIRO;SECTOR;ZONA;MERCADO;FECHA CREACIÓN;FECHA DE ACTUALIZACIÓN;";
                       }else{
                          valuearrayexcel = valuearrayexcel + "ID ORDEN;NUMERO DE ORDEN;IMAGEN;CREADO POR;EDITADO POR;ASIGNADO A;SERVICIO;TIPO DE SERVICIO;ESTATUS;OBSERVACIONES;NUMERO DE CLIENTE;REALIZADOEN;UBICACIÓN;MARCAVEHICULO;MODELOVEHICULO;COLORVEHICULO;DESCRIPCIONVEHICULO;OTROCOLORVEHICULO;PATIO;ESPIGA;POSICION;FECHA CREACIÓN;FECHA DE ACTUALIZACIÓN;";                          
                       }


                       banderatitulo = false;
                       valuearrayexcel = valuearrayexcel +'\n';

                     }else{
                       if(!this.exportDataSource.data[j]['atributo_share'] && banderatitulo == true && this.exportDataSource.data[j]['name_table'] == 'vehiculos'){
                         valuearrayexcel = valuearrayexcel + "ID ORDEN;NUMERO DE ORDEN;IMAGEN;CREADO POR;EDITADO POR;ASIGNADO A;SERVICIO;TIPO DE SERVICIO;ESTATUS;OBSERVACIONES;NUMERO DE CLIENTE;REALIZADOEN;UBICACIÓN;MARCAVEHICULO;MODELOVEHICULO;COLORVEHICULO;DESCRIPCIONVEHICULO;OTROCOLORVEHICULO;PATIO;ESPIGA;POSICION;FECHA CREACIÓN;FECHA DE ACTUALIZACIÓN;" + '\n';
                         banderatitulo = false;
                       }else{
                         if(!this.exportDataSource.data[j]['atributo_share'] && banderatitulo == true && this.exportDataSource.data[j]['name_table'] == 'address'){
                         valuearrayexcel = valuearrayexcel + "ID ORDEN;NUMERO DE ORDEN;IMAGEN;CREADO POR;EDITADO POR;ASIGNADO A;SERVICIO;TIPO DE SERVICIO;ESTATUS;LEIDOPOR;OBSERVACIONES;NUMERO DE CLIENTE;UBICACIÓN;RUTA;COMUNA;CALLE;NUMERO;BLOCK;DEPTO;TRANSFORMADOR;MEDIDOR;TARIFA;CONSTANTE;GIRO;SECTOR;ZONA;MERCADO;FECHA CREACIÓN;FECHA DE ACTUALIZACIÓN;" + '\n';
                         banderatitulo = false;
                         }
                       }
                     }
                       if(this.exportDataSource.data[j]['name_table'] == 'address'){
                         var ubicacion = this.exportDataSource.data[j]['direccion'];
                       }
                       if(this.exportDataSource.data[j]['name_table'] == 'vehiculos'){
                         var ubicacion = this.exportDataSource.data[j]['patio']+'-'+this.exportDataSource.data[j]['espiga']+'-'+this.exportDataSource.data[j]['posicion'];
                       }

                       if(this.exportDataSource.data[j]['name_table'] == 'vehiculos'){
                       valuearrayexcel = valuearrayexcel + this.exportDataSource.data[j]['order_id'] +';'+ this.exportDataSource.data[j]['order_number']+';'+this.exportDataSource.data[j]['imagen']+';'+this.exportDataSource.data[j]['user']+';'+this.exportDataSource.data[j]['userupdate']
                                             +';'+this.exportDataSource.data[j]['userassigned']+';'+this.exportDataSource.data[j]['service_name']+';'+this.exportDataSource.data[j]['servicetype']+';'+this.exportDataSource.data[j]['estatus']+';';
                                             
                                             var obs = String(this.exportDataSource.data[j]['observation']).replace(/(\r\n|\n|\r)/gm,' ');

                                             valuearrayexcel = valuearrayexcel+obs+';'+this.exportDataSource.data[j]['cc_number']+';'+this.exportDataSource.data[j]['orderdetail_direccion']+';'+ubicacion
                                                                                         
                                             +';'+this.exportDataSource.data[j]['marca']+';'+this.exportDataSource.data[j]['modelo']+';'+this.exportDataSource.data[j]['color']+';'+this.exportDataSource.data[j]['description']+';'+this.exportDataSource.data[j]['secondcolor']
                                             +';'+this.exportDataSource.data[j]['patio']+';'+this.exportDataSource.data[j]['espiga']+';'+this.exportDataSource.data[j]['posicion']
                                             +';'+this.exportDataSource.data[j]['create_at']+';'+this.exportDataSource.data[j]['update_at'] +';';
                       }else{
                         valuearrayexcel = valuearrayexcel + this.exportDataSource.data[j]['order_id'] +';'+ this.exportDataSource.data[j]['order_number']+';'+this.exportDataSource.data[j]['imagen']+';'+this.exportDataSource.data[j]['user']+';'+this.exportDataSource.data[j]['userupdate']
                         +';'+this.exportDataSource.data[j]['userassigned']+';'+this.exportDataSource.data[j]['service_name']+';'+this.exportDataSource.data[j]['servicetype']+';'+this.exportDataSource.data[j]['estatus']
                         +';'+this.exportDataSource.data[j]['leido_por']+';';

                         var obs = String(this.exportDataSource.data[j]['observation']).replace(/(\r\n|\n|\r)/gm,' ');
                                                  
                         valuearrayexcel = valuearrayexcel+obs+';'+ ';'+this.exportDataSource.data[j]['cc_number']+';'+ubicacion                                  
                         +';'+this.exportDataSource.data[j]['ruta']+';'+this.exportDataSource.data[j]['comuna']+';'+this.exportDataSource.data[j]['calle']+';'+this.exportDataSource.data[j]['numero']+';'+this.exportDataSource.data[j]['block']+';'+this.exportDataSource.data[j]['depto']
                         +';'+this.exportDataSource.data[j]['transformador']+';'+this.exportDataSource.data[j]['medidor']+';'+this.exportDataSource.data[j]['tarifa']+';'+this.exportDataSource.data[j]['constante']
                         +';'+this.exportDataSource.data[j]['giro']+';'+this.exportDataSource.data[j]['sector']+';'+this.exportDataSource.data[j]['zona']+';'+this.exportDataSource.data[j]['mercado']                          
                         +';'+this.exportDataSource.data[j]['create_at']+';'+this.exportDataSource.data[j]['update_at'] +';';
                       }                      
                       
                       valuearrayexcel = valuearrayexcel + '\n';



                   }//END FIRST IF                    
                 }//END SECOND FOR                                 
               }//END //FIRSTFOR
             }


           const FILE_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;";
           const FILE_EXTENSION = '.csv';
           const fileName = "Ordenes";
           
           var blob = new Blob([valuearrayexcel], {type: FILE_TYPE});
           FileSaver.saveAs(blob, fileName + '_export_' + new Date().getTime() + FILE_EXTENSION);
           this.isLoadingResults = false;
           }else{
           this.isLoadingResults = false;
           }
         },
         (_error) => {            
           this.isLoadingResults = false;
           this.error = 'No se encontraron actividades en el día.';            
           this.toasterService.error('Error: '+this.error, '', {timeOut: 6000,});
           //console.log(<any>error);
         }  
         )
   })   

  }


 ExportTOExcelClient($event):void {
    //console.log($event);

    var arraydata = new Array();
    // var arrayexcel = new Array();
    var orderatributovalue = [];
    var arraydata = [];
    var valuearrayexcel = "";
    // var pattern = /(\w+)\s+(\w+)/;

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


    this._orderService.getProjectShareOrder(      
      this.filterValue, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,             
      this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta, 
      this.filtersregion.fieldValue, this.regionMultiCtrl.value,
      this.selectedColumnnUsuario.fieldValue, this.selectedColumnnUsuario.columnValue,
      this.selectedColumnnEstatus.fieldValue, this.selectedColumnnEstatus.columnValue,
      newtimefrom, newtimeuntil,
      this.selectedColumnnZona.columnValue,
      this.servicetypeid,
      this.sort.active, this.sort.direction, this.pageSize, this.paginator.pageIndex, this.project_id, this.id, this.token.token, $event).then(
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
                                              +';'+this.exportDataSource.data[j]['userassigned']+';'+this.exportDataSource.data[j]['service_name']+';'+this.exportDataSource.data[j]['servicetype']+';'+this.exportDataSource.data[j]['estatus'];

                                              var obs = String(this.exportDataSource.data[j]['observation']).replace(/(\r\n|\n|\r)/gm,' ');

                                              valuearrayexcel = valuearrayexcel+obs+';'+this.exportDataSource.data[j]['cc_number']+';'+ubicacion
                                              
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
  // var totalPagesExp = "{total_pages_count_string}";
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


