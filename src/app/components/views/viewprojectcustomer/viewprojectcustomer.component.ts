import {Component, OnInit, OnDestroy, ViewChild, Input, ElementRef, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Sort, MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { Subject  } from 'rxjs/Subject';
import { ReplaySubject  } from 'rxjs/ReplaySubject';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material';
import { FormControl, Validators} from '@angular/forms';
import { MatSelect } from '@angular/material';
import {TooltipPosition} from '@angular/material';


import {
  Customer,
  Proyecto,
  Tarifa
  } from 'src/app/models/types';

// DIALOG
import { AddcustomerComponent } from '../../dialog/addcustomer/addcustomer.component';
import { CsvCustomerComponentComponent } from '../../dialog/csvcustomercomponent/csvcustomercomponent.component';
import { EditcustomerComponent } from '../../dialog/editcustomer/editcustomer.component';
import { DeletecustomerComponent } from '../../dialog/deletecustomer/deletecustomer.component';
import { ShowcustomerComponent } from '../../dialog/showcustomer/showcustomer.component';
import { SettingscustomerComponent } from '../../dialog/settingscustomer/settingscustomer.component';


// SERVICES
import { CountriesService, CustomerService, ExcelService, UserService } from 'src/app/services/service.index';



// MOMENT
import * as _moment from 'moment';
const moment = _moment;

interface Region {
  id: number;
  name: string;
  value: string;
}

export interface Column {
  fieldValue: string;
  viewValue: string;
  columnValue: string;
}


/**
 * @title Table retrieving data through HTTP
 */
@Component({
  selector: 'app-viewprojectcustomer',
  templateUrl: './viewprojectcustomer.component.html',
  styleUrls: ['./viewprojectcustomer.component.css']
})


export class ViewprojectcustomerComponent implements OnInit, OnDestroy, OnChanges {
  
  title: string;
  
  category_id: number;
  columnselect: string[] = new Array();
  customer: Customer[] = [];  
  datedesde: FormControl;
  datehasta: FormControl;  
  filterValue = '';
  debouncedInputValue = this.filterValue;
  fieldcritetira: string;
  loading: boolean;
  identity;
  index: number;
  indexitem:number;
  projectname;
  proyectos: Array<Proyecto>;
  subscription: ISubscription;
  searchDecouncer$: Subject<string> = new Subject();
  servicename;
  tarifas: Tarifa;
  token;   
  
  
  termino: string = '';

  //SORT
  sort: Sort = {
    active: 'create_at',
    direction: 'desc',
  };


  //FILTERS
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


  filtersregion = {
    fieldValue: '',
    criteria: '',
    filtervalue: ''
  };


  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionheaderaction = new FormControl(this.positionOptions[2]);
  positiondatasourceaction = new FormControl(this.positionOptions[3]);

/** control for the selected region for multi-selection */
  public regionMultiCtrl: FormControl = new FormControl('', Validators.required );
  public regionMultiFilterCtrl: FormControl = new FormControl('', Validators.required);  
  private region = new Array();

  
  /** list of banks filtered by search keyword */
  public filteredRegion: ReplaySubject<Region[]> = new ReplaySubject<Region[]>(1);
  public filteredRegionMulti: ReplaySubject<Region[]> = new ReplaySubject<Region[]>(1);
  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  private _onDestroy = new Subject<void>();
  // private unsubscribe= new Subject<void>();


  displayedColumns: string[] = ['cc_number', 'region', 'provincia', 'comuna', 'direccion', 'user', 'create_at', , 'userupdate', 'update_at', 'actions'];
  columnsToDisplay: string[] = ['cc_number', 'region', 'provincia', 'comuna', 'direccion', 'user', 'create_at', 'actions'];
  //columnsToDisplay: string[] = this.displayedColumns.slice(); 
  data: Customer[] = [];
  dataSource: MatTableDataSource<Customer[]>;

  nametable: string;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  public show:boolean = false;
  public buttonName:any = 'Show';

  // MatPaginator Inputs
  pageSize = 15;
  pageSizeOptions: number[] = [15, 30, 100, 200];
  pageEvent: PageEvent;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatSort, { static: true }) matSort: MatSort;
  @Output() ServicioSeleccionado: EventEmitter<string>;
  @Input() id : number;
  


  constructor(
    public _userService: UserService,
    private _proyectoService: UserService,
    private _route: ActivatedRoute,
    public dialog: MatDialog,
    private _regionService: CountriesService,
    private excelService:ExcelService,
    public dataCustomerService: CustomerService
    ) { 

    this.identity = this._userService.getIdentity();
    this.proyectos = this._proyectoService.getProyectos();
    this._userService.handleAuthentication(this.identity, this.token);
    this.token = this._userService.getToken();
    this.ServicioSeleccionado = new EventEmitter();


    this._route.params.subscribe(params => {
    let id = +params['id'];        
    this.id = id;
    if(this.id >0 && this.token.token != null){
      if (typeof this.sort !== 'undefined') {        
        //this.refreshTableCustomer();        
      }
    }    
    });

    }




  ngOnInit() {
   this.setupSearchDebouncer();
   this.loadInfo();
  }


  ngOnChanges(_changes: SimpleChanges) {
    //console.log('onchange clientes');
    this.refreshTableCustomer();
  }


  private refreshTableCustomer() {
  this.termino = '';
  this.regionMultiCtrl.reset();    
  this.filterValue = '';
  this.selectedColumnn.fieldValue = '';
  this.selectedColumnn.columnValue = '';
  this.selectedColumnnDate.fieldValue = '';
  this.selectedColumnnDate.columnValueDesde = '';
  this.selectedColumnnDate.columnValueHasta = '';
  this.filtersregion.fieldValue ='';
  this.pageSize = 15;
  this.paginator.pageIndex = 0;
  this.isLoadingResults = true;
  this.sort.active = 'create_at';
  this.sort.direction = 'desc';    


    this.dataCustomerService.getCustomerProject(
      this.filterValue, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,             
      this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta, 
      this.filtersregion.fieldValue, this.regionMultiCtrl.value,
      this.sort.active, this.sort.direction, this.pageSize, this.paginator.pageIndex, this.id, this.token.token).then(
      (res: any) => 
      {
        res.subscribe(
          (some: any) => 
          {
            if(some.datos.data){            
            this.resultsLength = some.datos.total;
            this.servicename = some.datos.data[0]['service_name'];
            this.nametable = some.datos.data[0]['name_table'];
            this.isRateLimitReached = false;          
            }else{
            this.resultsLength = 0;
            this.servicename = some.datos['service_name'];
            this.nametable = some.datos['name_table'];            
            this.isRateLimitReached = true;          
            }

            this.ServicioSeleccionado.emit(this.servicename);
            this.dataSource = new MatTableDataSource(some.datos.data);
            this.isLoadingResults = false;
            //console.log(this.dataSource);
            //this.data = some;        
            //console.log('paso refresh');
          },
          (error) => {                      
            this.isLoadingResults = false;
            this.isRateLimitReached = true;
            this._userService.logout();
            //this._router.navigate(["/login"]);          
            console.log(<any>error);
          }  
          )
    })

   }


  ngOnDestroy() {
     //this.unsubscribe.next();
     //this.unsubscribe.complete();     
     this.subscription.unsubscribe();
     //console.log("ngOnDestroy CUSTOMER complete");
  }  


  hoverIn(index){
    this.indexitem = index;
  }

  hoverOut(_index){
    this.indexitem = -1;

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
                      // load the initial regiones list
                      //this.bankMultiCtrl.setValue([this.banks[10], this.banks[11], this.banks[12]]);
                      this.filteredRegion.next(this.region.slice());
                      this.filteredRegionMulti.next(this.region.slice());

                      // listen for search field value changes
                      this.regionMultiFilterCtrl.valueChanges
                        .pipe(takeUntil(this._onDestroy))
                        .subscribe(() => {
                          this.filterRegionMulti();
                        });

                    }
                     //console.log('paso success');
                      //this.region = response.datos.region;

                    }else{
                      this.region = null;
                         }
                    });    
  }

  applyFilter() {


    if(this.filterValue.length > 0 && this.filterValue.trim() !== '' && this.termino !== this.filterValue){
    this.isLoadingResults = true;
    this.termino = this.filterValue;
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
       //console.log('paso333') 
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
    
      this.searchDecouncer$.next(this.filterValue);
    }
    
    /*
    this.dataCustomerService.getCustomerProject(
      this.filterValue, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,             
      this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta, 
      this.filtersregion.fieldValue, this.regionMultiCtrl.value,
      this.sort.active, this.sort.direction, this.pageSize, this.paginator.pageIndex, this.id, this.token.token).then(
      (res: any) => 
      {
        res.subscribe(
          (some) => 
          {
            if(some.datos.data){            
            this.resultsLength = some.datos.total;
            this.servicename = some.datos.data[0]['service_name'];
            this.nametable = some.datos.data[0]['name_table'];
            this.isRateLimitReached = false;          
            }else{
            this.resultsLength = 0;
            this.servicename = some.datos['service_name'];
            this.nametable = some.datos['name_table'];            
            this.isRateLimitReached = true;          
            }

            this.ServicioSeleccionado.emit(this.servicename);
            this.dataSource = new MatTableDataSource(some.datos.data);
            this.isLoadingResults = false;
            //console.log(some.datos.data);
            //this.data = some;        
            //console.log('paso applyFilter');
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
          }  
          )
    })*/
  } 

  private setupSearchDebouncer(): void {
    this.searchDecouncer$.pipe(
      debounceTime(3000),
      distinctUntilChanged(),
    ).subscribe((term: string) => {
      // Remember value after debouncing
      //console.log('viene');
      this.debouncedInputValue = term;
      this.dataCustomerService.getCustomerProject(
        this.filterValue, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,             
        this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta, 
        this.filtersregion.fieldValue, this.regionMultiCtrl.value,
        this.sort.active, this.sort.direction, this.pageSize, this.paginator.pageIndex, this.id, this.token.token).then(
        (res: any) => 
        {
          res.subscribe(
            (some) => 
            {
              if(some.datos.data){            
              this.resultsLength = some.datos.total;
              this.servicename = some.datos.data[0]['service_name'];
              this.nametable = some.datos.data[0]['name_table'];
              this.isRateLimitReached = false;          
              }else{
              this.resultsLength = 0;
              this.servicename = some.datos['service_name'];
              this.nametable = some.datos['name_table'];            
              this.isRateLimitReached = true;          
              }
  
              this.ServicioSeleccionado.emit(this.servicename);
              this.dataSource = new MatTableDataSource(some.datos.data);
              this.isLoadingResults = false;
              //console.log(some.datos.data);
              //this.data = some;        
              //console.log('paso applyFilter');
            },
            (error) => {                      
              this.isLoadingResults = false;
              this.isRateLimitReached = true;
              this._userService.logout();
              //this._router.navigate(["/login"]);          
              console.log(<any>error);
            }  
            )
      })
      // Do the actual search
    });    
  }


  onPaginateChange(event){
  //console.log(event.pageSize);
   this.isLoadingResults = true;
   this.pageSize = event.pageSize;    
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
       //console.log('paso333') 
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


    this.dataCustomerService.getCustomerProject(
      this.filterValue, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,             
      this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta, 
      this.filtersregion.fieldValue, this.regionMultiCtrl.value,
      this.sort.active, this.sort.direction, this.pageSize, this.paginator.pageIndex, this.id, this.token.token).then(
      (res: any) => 
      {
        res.subscribe(
          (some) => 
          {
            if(some.datos.data){            
            this.resultsLength = some.datos.total;
            this.servicename = some.datos.data[0]['service_name'];
            this.nametable = some.datos.data[0]['name_table'];
            this.isRateLimitReached = false;          
            }else{
            this.resultsLength = 0;
            this.servicename = some.datos['service_name'];
            this.nametable = some.datos['name_table'];            
            this.isRateLimitReached = true;          
            }

            this.ServicioSeleccionado.emit(this.servicename);
            this.dataSource = new MatTableDataSource(some.datos.data);
            this.isLoadingResults = false;
            //console.log(this.dataSource);
            //this.data = some;        
            //console.log('paso onPaginateChange');
          },
          (error) => {                      
            this.isLoadingResults = false;
            this.isRateLimitReached = true;
            this._userService.logout();
            //this._router.navigate(["/login"]);          
            console.log(<any>error);
          }  
          )
    })   
  }

 handleSortChange(sort: Sort): void {
    if (sort.active && sort.direction) {
      this.sort = sort;      
    }

   this.isLoadingResults = true;

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
       //console.log('paso333') 
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


    this.dataCustomerService.getCustomerProject(
      this.filterValue, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,             
      this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta, 
      this.filtersregion.fieldValue, this.regionMultiCtrl.value,
      this.sort.active, this.sort.direction, this.pageSize, this.paginator.pageIndex, this.id, this.token.token).then(
      (res: any) => 
      {
        res.subscribe(
          (some) => 
          {
            if(some.datos.data){            
            this.resultsLength = some.datos.total;
            this.servicename = some.datos.data[0]['service_name'];
            this.nametable = some.datos.data[0]['name_table'];
            this.isRateLimitReached = false;          
            }else{
            this.resultsLength = 0;
            this.servicename = some.datos['service_name'];
            this.nametable = some.datos['name_table'];            
            this.isRateLimitReached = true;          
            }

            this.ServicioSeleccionado.emit(this.servicename);
            this.dataSource = new MatTableDataSource(some.datos.data);
            this.isLoadingResults = false;
            //console.log(this.dataSource);
            //this.data = some;        
            //console.log('paso onPaginateChange');
          },
          (error) => {                      
            this.isLoadingResults = false;
            this.isRateLimitReached = true;
            this._userService.logout();
            //this._router.navigate(["/login"]);          
            console.log(<any>error);
          }  
          )
    })       

 }  


  addNew(id:number, _customer: Customer[]) {      
     const dialogRef = this.dialog.open(AddcustomerComponent, {
      width: '1000px',
       disableClose: true,
     data: { service_id: id, customer: Customer }
     });

     dialogRef.afterClosed().subscribe(
           result => {       
              if (result === 1) {
              // After dialog is closed we're doing frontend updates 
              // For add we're just pushing a new row inside DataService
              //this.dataService.dataChange.value.push(this.OrderserviceService.getDialogData());  
              this.refreshTableCustomer();
              }
            });
  }

  startEdit(id:number, cc_id: number, cc_number: string, category_id:number) {
    // let service_id = this.id;    
    //console.log(order_date); 
    const dialogRef = this.dialog.open(EditcustomerComponent, {
      width: '1000px',
      disableClose: true,
      data: {service_id: id, cc_id: cc_id, cc_number: cc_number, category_id: category_id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        //const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
       // this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.refreshTableCustomer();
      }
    });
  }


deleteItem(id:number, cc_id: number, cc_number: string, category_id:number) {
    // let service_id = this.id;    
    const dialogRef = this.dialog.open(DeletecustomerComponent, {
      width: '1000px',
      disableClose: true,  
      data: {service_id: id, cc_id: cc_id, cc_number: cc_number, category_id: category_id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {

        //console.log('paso');
        //const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // for delete we use splice in order to remove single object from DataService
        //this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTableCustomer();
      }
    });
  }


  showItem(id:number, cc_id: number, cc_number: string, category_id:number) {
    // let service_id = this.id;    
    const dialogRef = this.dialog.open(ShowcustomerComponent, {      
      width: '777px',
      disableClose: true,
      data: {service_id: id, cc_id: cc_id, cc_number: cc_number, category_id: category_id}
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

    const dialogRef = this.dialog.open(SettingscustomerComponent, {
      height: '650px',
      width: '777px',            
      //data: {dysplaycolumns: columns}
      data: {columnsToDisplay: columns}
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      this.columnselect = result;      
      for (var i=0; i<this.columnselect.length; i++){
            if(this.columnselect[i]['checked']===false){
              this.remove(this.columnselect[i]['label']);
            }
            if(this.columnselect[i]['checked']===true){
              const validate = this.columnsToDisplay.indexOf(this.columnselect[i]['label']);
              if(validate === -1){
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

  add(indexcolumn) {
    const indexarray = this.displayedColumns.indexOf(indexcolumn);
    //console.log(indexarray);
    if (this.columnsToDisplay.length) {
        if (indexarray !== -1) {
        //console.log(indexcolumn);
        //console.log(indexarray);        
        
        this.columnsToDisplay.splice(indexarray,0,indexcolumn);
        }        
    }    
  }

  remove(indexcolumn) {
    const indexarray = this.columnsToDisplay.indexOf(indexcolumn);
    if (this.columnsToDisplay.length) {
        if (indexarray !== -1) {
        this.columnsToDisplay.splice(indexarray, 1);
        }        
    }    
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
    this.filtersregion.fieldValue = '';
    this.regionMultiCtrl.reset();
  }


 ExportTOExcel():void {
    //console.log(this.dataSource);
    this.excelService.exportAsExcelFile(this.dataSource.data, 'Clientes');
  }

  openDialogCsv(): void {

    const dialogRef = this.dialog.open(CsvCustomerComponentComponent, {
      width: '777px',
      disableClose: true,                          
      data: { 
        servicio: this.id,
        token: this.token.token,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) { 

      }
    });
  }


}

