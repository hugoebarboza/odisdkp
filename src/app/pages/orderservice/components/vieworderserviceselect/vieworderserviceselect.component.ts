import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, Validators, FormGroup} from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, Sort } from '@angular/material';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subscription } from 'rxjs/Subscription';


// MODELS
import { Order, ServiceEstatus } from 'src/app/models/types';


// MOMENT
import * as _moment from 'moment';
const moment = _moment;

// SERVICES
import { CountriesService, OrderserviceService, ProjectsService, UserService } from 'src/app/services/service.index';

import Swal from 'sweetalert2';


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
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./vieworderserviceselect.component.css']
})
export class ViewOrderServiceSelectComponent implements OnInit,  OnDestroy {

  @Input() id: number;
  @Input() view: number;
  @Output() portalevent: EventEmitter<number>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) matSort: MatSort;


  category_id: number;
  date = new FormControl(moment(new Date()).format('YYYY[-]MM[-]DD'));
  datedesde: FormControl;
  datehasta: FormControl;
  datasourceLength = 0;
  dataSource: MatTableDataSource<Order[]>;
  es: any;
  filteredRegion: ReplaySubject<Region[]> = new ReplaySubject<Region[]>(1);
  filteredInspectorMulti: ReplaySubject<Inspector[]> = new ReplaySubject<Inspector[]>(1);
  filteredRegionMulti: ReplaySubject<Region[]> = new ReplaySubject<Region[]>(1);
  filterValue = '';
  form: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  form4: FormGroup;
  form5: FormGroup;
  debouncedInputValue = this.filterValue;
  identity: any;
  inspectorCtrl: FormControl = new FormControl();
  inspectorMultiFilterCtrl: FormControl = new FormControl();
  inspector = new Array();
  indexitem: number;
  isLoadingResults = true;
  isRateLimitReached = false;
  isactiveSearch = false;
  _onDestroy = new Subject<void>();
  order_id: number;
  pageIndex: number;
  pageSizeOptions: number[] = [15, 30, 100, 200];
  pageSize = 15;
  paramset = '';
  paramvalue: any;
  project_id: number;
  region = new Array();
  role: number;
  searchDecouncer$: Subject<string> = new Subject();
  selectedRow: Number;
  show = false;
  showcell = true;
  subscription: Subscription;
  selection = new SelectionModel<Order[]>(true, []);
  select = 0;
  selectedEntry;
  serviceestatus: ServiceEstatus[] = [];
  resultsLength = 0;
  regionMultiCtrl: FormControl = new FormControl('', Validators.required );
  regionMultiFilterCtrl: FormControl = new FormControl('', Validators.required);
  termino = '';

  token: any;

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


// FILTRADO AVANZADO
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

// tslint:disable-next-line:member-ordering
selectedColumnnEstatus = {
  fieldValue: 'orders_details.status_id',
  criteria: '',
  columnValue: ''
};




  // tslint:disable-next-line:member-ordering
  columnsSelect: Array<any> = [ { name: 'select', label: 'Select' }, { name: 'order_number', label: 'N. Orden' }, { name: 'cc_number', label: 'N. Cliente' },
    { name: 'direccion', label: 'Ubicación' }, { name: 'servicetype', label: 'Servicio' }, { name: 'user', label: 'Informador' }, { name: 'create_at', label: 'Creado El' },
    { name: 'userassigned', label: 'Responsable' }, { name: 'estatus', label: 'Estatus' },
  ];

  // tslint:disable-next-line:member-ordering
  selectoptions: Array<any> = [
    { id: 1, label: 'Seleccione Incidencias' },
    { id: 2, label: 'Seleccione Operación' },
    { id: 3, label: 'Confirmación' },
  ];

  // tslint:disable-next-line:member-ordering
  columnsOrderToDisplay: string[] = this.columnsSelect.map(column => column.name);
  // tslint:disable-next-line:member-ordering
  columnsSelectToDisplay: string[] = this.selectoptions.map(column => column);


  constructor(
    private cd: ChangeDetectorRef,
    public dataService: OrderserviceService,
    private _orderService: OrderserviceService,
    private _proyecto: ProjectsService,
    private _regionService: CountriesService,
    public _userService: UserService,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.portalevent = new EventEmitter();
    this.role = 5;
    this.dataSource = new MatTableDataSource();
    this.select = 1;

    this.form = new FormGroup({
      action: new FormControl ({value: '1', disabled: false}, )
    });

    this.form2 = new FormGroup({
      action2: new FormControl ({value: '', disabled: true}, )
    });

    this.form3 = new FormGroup({
      action3: new FormControl ({value: '', disabled: true}, )
    });

    this.form4 = new FormGroup({
      action4: new FormControl ({value: '', disabled: true}, )
    });

    this.form5 = new FormGroup({
      action5: new FormControl ({value: '', disabled: true}, ),
      estatus: new FormControl ({value: 0, disabled: true}, [Validators.required, Validators.minLength(1)]),
      asignado: new FormControl ({value: 0, disabled: true}, [Validators.required, Validators.minLength(1)]),
      vencimiento: new FormControl ({value: '0000-00-00 00:00:00', disabled: true}, [Validators.required]),
    });


  }


  public firstStep() {

    this.form2 = new FormGroup({
      action2: new FormControl ({value: '2', disabled: false}, )
    });

    this.form4 = new FormGroup({
      action4: new FormControl ({value: '', disabled: false}, )
    });


  }

  secondStep() {

    this.getServiceEstatus();

    this.form3 = new FormGroup({
      action3: new FormControl ({value: '3', disabled: false}, )
    });

    this.form5 = new FormGroup({
      action5: new FormControl ({value: '', disabled: false}, ),
      estatus: new FormControl ({value: 0, disabled: false}, [Validators.required, Validators.minLength(1)]),
      asignado: new FormControl ({value: 0, disabled: false}, [Validators.required, Validators.minLength(1)]),
      vencimiento: new FormControl ({value: '0000-00-00 00:00:00', disabled: false}, [Validators.required]),

    });
  }


  commit() {

    if (!this.form4.value || this.form4.value <= 0) {
      return;
    }

    if (!this.selection.selected) {
      Swal.fire('Solicitud no procesada', 'No existen órdenes seleccionadas', 'error');
      return;
    }

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta a punto de cambiar las órdenes seleccionadas ',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    })

    .then( commit => {
      if (commit.value) {
        if (commit) {


          if (this.selection.selected) {
            if (this.form5.value) {
              // tslint:disable-next-line:triple-equals
              if (this.form5.value.action5 == 1 && this.form5.value.estatus > 0) {
                this.paramset = 'status_id';
                this.paramvalue = this.form5.value.estatus;
              }
              // tslint:disable-next-line:triple-equals
              if (this.form5.value.action5 == 2 && this.form5.value.asignado > 0) {
                this.paramset = 'assigned_to';
                this.paramvalue = this.form5.value.asignado;
              }
              // tslint:disable-next-line:triple-equals
              if (this.form5.value.action5 == 3 && this.form5.value.vencimiento) {
                this.paramset = 'vencimiento_date';
                this.paramvalue = this.form5.value.vencimiento;
              }
            }

            // tslint:disable-next-line:triple-equals
            if (this.selection.selected && this.id && this.paramset && this.paramvalue && this.form4.value.action4 == 1) {
              this.isLoadingResults = true;
              this.subscription = this.dataService.updateMass(this.token.token, this.selection.selected, this.id, this.paramset, this.paramvalue)
              .subscribe( response => {
                if (!response) {
                  this.isLoadingResults = false;
                  return;
                }
                if (response.status === 'success') {
                  this.isLoadingResults = false;
                  Swal.fire('Órdenes actualizadas', 'exitosamente', 'success' );
                } else {
                  this.isLoadingResults = false;
                  Swal.fire('Importante', response.message, 'error');
                }
                this.cd.markForCheck();
              },
                error => {
                  this.isLoadingResults = false;
                  Swal.fire('Importante', error, 'error');
                }
              );
              this.cd.markForCheck();
            }

            // tslint:disable-next-line:triple-equals
            if (this.selection.selected && this.id && this.form4.value.action4 == 2) {
              this.isLoadingResults = true;
              this.subscription = this.dataService.deleteMass(this.token.token, this.selection.selected, this.id)
              .subscribe( response => {
                if (!response) {
                  this.isLoadingResults = false;
                  return;
                }
                if (response.status === 'success') {
                  this.isLoadingResults = false;
                  Swal.fire('Órdenes eliminadas', 'exitosamente', 'success' );
                } else {
                  this.isLoadingResults = false;
                  Swal.fire('Importante', response.message, 'error');
                }
                this.cd.markForCheck();
              },
                error => {
                  this.isLoadingResults = false;
                  Swal.fire('Importante', error, 'error');
                }
              );
              this.cd.markForCheck();
            }



          }
        }
      } else if (commit.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
        );
      }
    });

    this.cd.markForCheck();

  }

  cancel() {
    this.form2.setValue({
      'action2': {value: '', disabled: true},
    });

    this.form3.setValue({
      'action3': {value: '', disabled: true},
    });

    this.form4.setValue({
      'action4': {value: '', disabled: true},
    });

    this.form5.setValue({
      'action5': {value: '', disabled: true},
      'estatus': {value: 0, disabled: true},
      'asignado': {value: 0, disabled: true},
      'vencimiento': {value: '0000-00-00 00:00:00', disabled: true},
    });

    this.cd.markForCheck();

  }


  ngOnInit() {

    this.es = {
      firstDayOfWeek: 1,
      dayNames: [ 'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado' ],
      dayNamesShort: [ 'dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb' ],
      dayNamesMin: [ 'D', 'L', 'M', 'X', 'J', 'V', 'S' ],
      monthNames: [ 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre' ],
      monthNamesShort: [ 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic' ],
      today: 'Hoy',
      clear: 'Borrar'
  };

    // console.log('on init');
    // VALORES POR DEFECTO DE FILTRO AVANZADO

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
    this.refreshTable();

    this.setupSearchDebouncer();
    this.inspectorMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterInspector();
        this.cd.markForCheck();
      });

      this.cd.markForCheck();
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (this.selection.isEmpty()) {
      return false;
    }
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    // console.log(this.selection.selected.length);
    // console.log(this.selection.selected);
    this.cd.markForCheck();
    return numSelected === numRows;
  }


  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
        // console.log(this.selection);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
  if (!row) {
    return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  hoverIn(index: number) {
    this.indexitem = index;
  }

  hoverOut(_index: number) {
    this.indexitem = -1;

  }

  getServiceEstatus() {
    this.dataService.getServiceEstatus(this.token, this.id)
    .pipe(takeUntil(this._onDestroy))
    .subscribe(
    response => {
              if (!response) {
                return;
              }
              if (response.status === 'success') {
                this.serviceestatus = response.datos;
              }
              });
    this.cd.markForCheck();
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
    this.filtersregion.fieldValue = '';
    this.selectedColumnnUsuario.fieldValue = '';
    this.selectedColumnnUsuario.columnValue = '';
    this.pageSize = 15;
    this.isLoadingResults = true;
    this.sort.active = 'create_at';
    this.sort.direction = 'desc';
    this.show = false;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    } else {
      this.pageIndex = 0;
    }


    this._orderService.getServiceOrder(
      this.filterValue, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,
      this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta,
      this.filtersregion.fieldValue, this.regionMultiCtrl.value,
      this.selectedColumnnUsuario.fieldValue, this.selectedColumnnUsuario.columnValue,
      this.sort.active, this.sort.direction, this.pageSize, this.pageIndex, this.id, this.token.token)
      .then(response => { this.getData(response); })
      .catch(error => {
            this.isLoadingResults = false;
            this.isRateLimitReached = true;
            console.log(<any>error);
      });
      this.cd.markForCheck();
  }

  public getData(response: any) {
    if (response && response.status === 'success') {
      if (response.datos.data) {
      this.resultsLength = response.datos.total;
      this.category_id =  response.datos.data[0]['category_id'];
      this.project_id = response.datos.data[0]['project_id'];
      this.isRateLimitReached = false;
      } else {
      this.resultsLength = 0;
      this.category_id =  response.datos['projects_categories_customers']['id'];
      this.project_id = response.datos['project']['id'];
      this.isRateLimitReached = true;
      }
      this.dataSource = new MatTableDataSource(response.datos.data);
      if (this.dataSource && this.dataSource.data.length > this.datasourceLength) {
        this.datasourceLength = this.dataSource.data.length;
        this.isactiveSearch = true;
      }
      this.isLoadingResults = false;
    } else {
      return;
    }
    this.cd.markForCheck();
  }



  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }



  applyFilter() {
    if (this.filterValue.length > 0 && this.filterValue.trim() !== '' && this.termino !== this.filterValue) {
      this.isLoadingResults = true;
      this.getParams();
      this.termino = this.filterValue;
      this.searchDecouncer$.next(this.filterValue);
    }
    this.cd.markForCheck();
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

        })
        .catch(error => {
              this.isLoadingResults = false;
              this.isRateLimitReached = true;
              console.log(<any>error);
        });
      // Do the actual search
      this.cd.markForCheck();
    });
    this.cd.markForCheck();
  }


  private filterInspector() {

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


  public loadInfo() {

   this.subscription = this._regionService.getRegion(this.token.token, this.identity.country).subscribe(
                response => {

                   if (response.status === 'success') {
                    for (let i = 0; i < response.datos.region.length; i++) {
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

                    } else {
                      this.region = null;
                         }
                    });
  }



  getProject(id: number) {
    this.subscription = this._orderService.getService(this.token.token, id).subscribe(
     response => {
               if (response.status === 'success') {
               this.project_id = response.datos['project_id'];
               if (this.project_id > 0) {
                 this.getUser(this.project_id);
               }
               }
      });
   }

   getUser(projectid: number) {
    if (projectid > 0) {
        this._proyecto.getProjectUser(this.token.token, projectid, this.role).then(
          (res: any) => {
            res.subscribe(
              (some) => {
                if (some.datos) {
                  this.inspector = some.datos;
                  for (let i = 0; i < this.inspector.length; i++) {
                    const userid = this.inspector[i]['id'];
                    const username = this.inspector[i]['usuario'];
                    this.inspector[i] = { name: username, id: userid };
                  }
                  this.filteredInspectorMulti.next(this.inspector.slice());
                } else {
                }
              },
              (error) => {
              this.inspector = [];
              console.log(<any>error);
              }
              );
        });
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



  getParams() {

    this.isLoadingResults = true;

    if (this.filterValue) {
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
    }

    if (this.selectedColumnn.fieldValue && this.selectedColumnn.columnValue && !this.selectedColumnnDate.fieldValue) {
       this.selectedColumnnDate.fieldValue = '';
       this.selectedColumnnDate.columnValueDesde = '';
       this.selectedColumnnDate.columnValueHasta = '';
       this.filtersregion.fieldValue = '';
       this.selectedColumnnUsuario.fieldValue = '';
       this.selectedColumnnUsuario.columnValue = '';
       this.regionMultiCtrl = new FormControl('');
    }

    if (!this.regionMultiCtrl.value && !this.selectedColumnnUsuario.fieldValue && this.selectedColumnnDate.fieldValue && this.selectedColumnnDate.columnValueDesde && this.selectedColumnnDate.columnValueHasta) {
       this.filtersregion.fieldValue = '';
       this.selectedColumnnUsuario.fieldValue = '';
       this.selectedColumnnUsuario.columnValue = '';
       this.datedesde = new FormControl(moment(this.selectedColumnnDate.columnValueDesde).format('YYYY[-]MM[-]DD'));
       this.datehasta = new FormControl(moment(this.selectedColumnnDate.columnValueHasta).format('YYYY[-]MM[-]DD'));
       this.selectedColumnnDate.columnValueDesde = this.datedesde.value;
       this.selectedColumnnDate.columnValueHasta = this.datehasta.value;

    }

    if (this.regionMultiCtrl.value && (!this.selectedColumnnDate.fieldValue || !this.selectedColumnnDate.columnValueDesde || !this.selectedColumnnDate.columnValueHasta)) {
       this.selectedColumnn.fieldValue = '';
       this.selectedColumnn.columnValue = '';
       this.selectedColumnnDate.fieldValue = '';
       this.selectedColumnnDate.columnValueDesde = '';
       this.selectedColumnnDate.columnValueHasta = '';
       this.selectedColumnnUsuario.fieldValue = '';
       this.selectedColumnnUsuario.columnValue = '';
       this.datedesde = new FormControl('');
       this.datehasta = new FormControl('');
       this.filtersregion.fieldValue = 'regions.region_name';
    }

    if (this.regionMultiCtrl.value && this.selectedColumnnDate.fieldValue && this.selectedColumnnDate.columnValueDesde && this.selectedColumnnDate.columnValueHasta) {
       this.selectedColumnn.fieldValue = '';
       this.selectedColumnn.columnValue = '';
       this.selectedColumnnUsuario.fieldValue = '';
       this.selectedColumnnUsuario.columnValue = '';
       this.datedesde = new FormControl(moment(this.selectedColumnnDate.columnValueDesde).format('YYYY[-]MM[-]DD'));
       this.datehasta = new FormControl(moment(this.selectedColumnnDate.columnValueHasta).format('YYYY[-]MM[-]DD'));
       this.selectedColumnnDate.columnValueDesde = this.datedesde.value;
       this.selectedColumnnDate.columnValueHasta = this.datehasta.value;
       this.filtersregion.fieldValue = 'regions.region_name';
    }

    if (!this.regionMultiCtrl.value && this.selectedColumnnUsuario.fieldValue && this.selectedColumnnUsuario.columnValue && this.selectedColumnnDate.fieldValue && this.selectedColumnnDate.columnValueDesde && this.selectedColumnnDate.columnValueHasta) {
       this.selectedColumnn.fieldValue = '';
       this.selectedColumnn.columnValue = '';
       this.filtersregion.fieldValue = '';
       this.datedesde = new FormControl(moment(this.selectedColumnnDate.columnValueDesde).format('YYYY[-]MM[-]DD'));
       this.datehasta = new FormControl(moment(this.selectedColumnnDate.columnValueHasta).format('YYYY[-]MM[-]DD'));
       this.selectedColumnnDate.columnValueDesde = this.datedesde.value;
       this.selectedColumnnDate.columnValueHasta = this.datehasta.value;
    }
    this.cd.markForCheck();
  }


  handleSortChange(sort: Sort): void {
    if (sort.active && sort.direction) {
      this.sort = sort;
    }

    this.getParams();

    this._orderService.getServiceOrder(
    this.filterValue, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,
    this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta,
    this.filtersregion.fieldValue, this.regionMultiCtrl.value,
    this.selectedColumnnUsuario.fieldValue, this.selectedColumnnUsuario.columnValue,
    this.sort.active, this.sort.direction, this.pageSize, this.paginator.pageIndex, this.id, this.token.token)
    .then(response => {this.getData(response); })
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
    this.getParams();
    this._orderService.getServiceOrder(
      this.filterValue, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,
      this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta,
      this.filtersregion.fieldValue, this.regionMultiCtrl.value,
      this.selectedColumnnUsuario.fieldValue, this.selectedColumnnUsuario.columnValue,
      this.sort.active, this.sort.direction, this.pageSize, this.paginator.pageIndex, this.id, this.token.token)
      .then(response => {this.getData(response); })
      .catch(error => {
            this.isLoadingResults = false;
            this.isRateLimitReached = true;
            console.log(<any>error);
      });
      this.cd.markForCheck();
  }



  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    this.getParams();
     this._orderService.getServiceOrder(
       this.filterValue, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,
       this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta,
       this.filtersregion.fieldValue, this.regionMultiCtrl.value,
       this.selectedColumnnUsuario.fieldValue, this.selectedColumnnUsuario.columnValue,
       this.sort.active, this.sort.direction, this.pageSize, this.paginator.pageIndex, this.id, this.token.token)
       .then(response => { this.getData(response); } )
       .catch(error => {
             this.isLoadingResults = false;
             this.isRateLimitReached = true;
             console.log(<any>error);
       });
       this.cd.markForCheck();
   }




  toggle(e: any) {
    this.show = !this.show;
    // CHANGE THE NAME OF THE BUTTON.
    this.selectedColumnn.fieldValue = '';
    this.selectedColumnn.columnValue = '';
    this.selectedColumnnDate.fieldValue = '';
    this.selectedColumnnDate.columnValueDesde = '';
    this.selectedColumnnDate.columnValueHasta = '';
    this.filtersregion.fieldValue = '';
    this.regionMultiCtrl.reset();
    e.stopPropagation();
    this.cd.markForCheck();
  }


  toggleTemplate(event: number) {

    if (event === 0) {
      this.view = 0;
      this.portalevent.emit(this.view);
    }
    if (event === 1) {
      this.view = 1;
      this.portalevent.emit(this.view);
    }

    if (event === 2) {
      this.view = 2;
      this.portalevent.emit(this.view);
    }
    this.cd.markForCheck();
  }


}
