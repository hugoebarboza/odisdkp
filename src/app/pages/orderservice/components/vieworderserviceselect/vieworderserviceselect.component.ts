import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, Validators} from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, Sort } from '@angular/material';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subscription } from 'rxjs/Subscription';

//SERVICES
import { CountriesService, ExcelService, OrderserviceService, ProjectsService, UserService, ZipService } from '../../../../services/service.index';


//MODELS
import { Order, Proyecto, ServiceType, ServiceEstatus } from '../../../../models/types';


//MOMENT
import * as _moment from 'moment';
import { Router } from '@angular/router';
const moment = _moment;


interface Inspector {
  id: number;
  name: string;
}

interface Region {
  id: number;
  name: string;
  value: string;
}


@Component({  
  selector: 'app-vieworderserviceselect',
  templateUrl: './vieworderserviceselect.component.html',
  styleUrls: ['./vieworderserviceselect.component.css']
})
export class ViewOrderServiceSelectComponent implements OnInit,  OnDestroy {

  category_id: number;
  date = new FormControl(moment(new Date()).format('YYYY[-]MM[-]DD'));
  datedesde: FormControl;
  datehasta: FormControl;
  datasourceLength: number = 0;
  dataSource: MatTableDataSource<Order[]>;
  filteredRegion: ReplaySubject<Region[]> = new ReplaySubject<Region[]>(1);
  filteredInspectorMulti: ReplaySubject<Inspector[]> = new ReplaySubject<Inspector[]>(1);
  filteredRegionMulti: ReplaySubject<Region[]> = new ReplaySubject<Region[]>(1);
  filterValue = '';
  debouncedInputValue = this.filterValue;
  identity: any;
  inspectorCtrl: FormControl = new FormControl();
  inspectorMultiFilterCtrl: FormControl = new FormControl();
  inspector = new Array();
  indexitem:number;
  isLoadingResults:boolean = true;
  isRateLimitReached:boolean = false;
  isactiveSearch: boolean = false;
  _onDestroy = new Subject<void>();
  order_id: number;
  pageIndex:number;
  pageSizeOptions: number[] = [15, 30, 100, 200];
  pageSize:number = 15;
  project_id: number;
  region = new Array();
  role:number;
  searchDecouncer$: Subject<string> = new Subject();
  selectedRow : Number;
  show:boolean = false;
  showcell:boolean = true;
  subscription: Subscription;
  selection = new SelectionModel<Order[]>(true, []);
  select: number= 0;
  selectedEntry;
  resultsLength:number = 0;
  regionMultiCtrl: FormControl = new FormControl('', Validators.required );
  regionMultiFilterCtrl: FormControl = new FormControl('', Validators.required);  
  termino: string = '';
  title:string = "Seleccione Incidencias";
  token:any;

  filtersregion = {
    fieldValue: '',
    criteria: '',
    filtervalue: ''
  };


  selectedColumnn = {
    fieldValue: 'orders.create_at',
    criteria: '',
    columnValue: ''
  };

  selectedColumnnDate = {
    fieldValue: 'orders.create_at',
    criteria: '',
    columnValueDesde: this.date.value,
    columnValueHasta: this.date.value
  };


  selectedColumnnUsuario = {
    fieldValue: '',
    criteria: '',
    columnValue: ''
  };

  sort: Sort = {
    active: 'create_at',
    direction: 'desc',
  };


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
  


  @Input() id : number;
  @Input() view : number;
  @Output() portalevent: EventEmitter<number>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  columnsSelect: Array<any> = [
    { name: 'select', label: 'Select' },
    { name: 'order_number', label: 'N. Orden' },
    { name: 'cc_number', label: 'N. Cliente' },
    { name: 'orderdetail_direccion', label: 'Realizado En' },
    { name: 'direccion', label: 'Ubicación' },
    { name: 'servicetype', label: 'Servicio' },
    { name: 'user', label: 'Informador' },
    { name: 'create_at', label: 'Creado El' },
    { name: 'userassigned', label: 'Responsable' },
    { name: 'time', label: 'T. Ejecución' },
    { name: 'update_at', label: 'T. Atención' },
    { name: 'estatus', label: 'Estatus' },
  ];  

  selectoptions: Array<any> = [
    { id: 1, label: 'Seleccione Incidencias' },
    { id: 2, label: 'Seleccione Operación' },
    { id: 3, label: 'Confirmación' },
  ];  

  columnsOrderToDisplay: string[] = this.columnsSelect.map(column => column.name);  
  columnsSelectToDisplay: string[] = this.selectoptions.map(column => column);  


  constructor(
    private _router: Router,
    private _orderService: OrderserviceService,
    private _proyecto: ProjectsService,
    private _regionService: CountriesService,
    public _userService: UserService,
  ) { 
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();    
    this.portalevent = new EventEmitter();
    this.role = 5; //USUARIOS INSPECTORES
    this.dataSource = new MatTableDataSource();
    this.select = 1;
    console.log(this.columnsSelectToDisplay);
  }

  ngOnInit() {
    //console.log('on init');
    //VALORES POR DEFECTO DE FILTRO AVANZADO
    this.selectedColumnnDate.fieldValue = 'orders.create_at';
    this.selectedColumnn.fieldValue = 'orders.create_at';
    this.selectedColumnnDate.columnValueDesde = this.date.value;
    this.selectedColumnnDate.columnValueHasta = this.date.value;

    this.selectedRow = -1;
    this.order_id = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;
    this.showcell = true;
    this.isactiveSearch = false;
    this.datasourceLength = 0;
    this.loadInfo();
    this.getProject(this.id);
    //this.getTipoServicio(this.id);    
    //this.getEstatus(this.id);
    this.refreshTable();

    this.setupSearchDebouncer();
    this.inspectorMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterInspector();
      });    
  }

  onSelectionChange(entry) {
    this.selectedEntry = Object.assign({}, this.selectedEntry, entry);
    console.log(this.selectedEntry);
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    console.log('paso');
    if (this.selection.isEmpty()) { return false; }
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
    //console.log(this.selection);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    console.log('paso222');    
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));    

    //console.log(this.selection);
  }  


  hoverIn(index:number){
    this.indexitem = index;
  }

  hoverOut(index:number){
    this.indexitem = -1;

  }


  public refreshTable() { 
    this.termino = '';
    this.selectedRow = -1;
    this.order_id = 0;
    this.regionMultiCtrl.reset();
    this.inspectorMultiFilterCtrl.reset();
    this.inspectorCtrl = new FormControl('');
    this.filterValue = '';
    this.selectedColumnn.columnValue = '';
    this.selectedColumnn.fieldValue = '';
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

  public getData(response: any){
    if(response){
        response.subscribe(
          (some: any) => 
          {
            if(some.datos.data){  
            this.resultsLength = some.datos.total;
            this.category_id =  some.datos.data[0]['category_id'];
            this.project_id = some.datos.data[0]['project_id'];
            this.isRateLimitReached = false;
            }else{
            this.resultsLength = 0;
            this.category_id =  some.datos['projects_categories_customers']['id'];
            this.project_id = some.datos['project']['id'];
            this.isRateLimitReached = true;          
            }
            this.dataSource = new MatTableDataSource(some.datos.data);            
            if(this.dataSource && this.dataSource.data.length > this.datasourceLength){
              this.datasourceLength = this.dataSource.data.length;
              this.isactiveSearch = true;
              
            }
            //console.log(this.dataSource.data.length);
            //this.dataSource.paginator = this.paginator;
            //this.dataSource.sort = this.matSort;            
            this.isLoadingResults = false;
          },
          (error) => {                      
            this.isLoadingResults = false;
            this.isRateLimitReached = true;
            this._userService.logout();
            this._router.navigate(["/login"]);          
            console.log(<any>error);
          });
    }else{
      return;
    }    
  }



  ngOnDestroy() {
    //console.log('La página se va a cerrar');
    
    this._onDestroy.next();
    this._onDestroy.complete();
    if(this.subscription){
    this.subscription.unsubscribe();
    }
    console.log("ngOnDestroy ORDER complete");
  }  



  applyFilter() {
    if(this.filterValue.length > 0 && this.filterValue.trim() !== '' && this.termino !== this.filterValue){
      this.isLoadingResults = true;
      this.getParams();
      this.termino = this.filterValue;
      this.searchDecouncer$.next(this.filterValue);
    }
  }


  private setupSearchDebouncer(): void {
    this.searchDecouncer$.pipe(
      debounceTime(3000),
      distinctUntilChanged(),
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


  handleSortChange(sort: Sort): void {
    if (sort.active && sort.direction) {
      this.sort = sort;      
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

  resetRegionFilters() {
    this.regionMultiCtrl.reset();
  }  



  search() {
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
    }

    
    
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
 



  toggle(e:any) {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    this.selectedColumnn.fieldValue='';
    this.selectedColumnn.columnValue='';
    this.selectedColumnnDate.fieldValue='';
    this.selectedColumnnDate.columnValueDesde='';
    this.selectedColumnnDate.columnValueHasta='';
    this.filtersregion.fieldValue = '';
    this.regionMultiCtrl.reset();
    e.stopPropagation();
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


}
