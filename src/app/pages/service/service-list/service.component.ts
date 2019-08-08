import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnDestroy } from "@angular/core";
import { MatDialog, TooltipPosition, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs/Subscription'
import { FormControl } from '@angular/forms';


// MATERIAL
import { Portal, TemplatePortal } from '@angular/cdk/portal';

// DIALOG
import { AddDocComponent } from '../../../components/shared/dialog/add-doc/add-doc.component';
import { AddServiceComponent } from '../dialog/addservice/addservice.component';
import { CloneServiceComponent } from '../dialog/clone-service/clone-service.component';
import { CsvServiceComponent } from '../dialog/csvservice/csvservice.component';
import { DeleteServiceComponent } from '../dialog/deleteservice/deleteservice.component';
import { EditServiceComponent } from '../../../components/shared/shared.index';
import { UserComponent } from '../dialog/user/user.component';

// MODELS
import { Order, Proyecto } from '../../../models/types';

// SERVICES
import { SettingsNgxEasyTableService } from '../../../services/settings/settings-ngx-easy-table.service';
import { ProjectsService, SettingsService, UserService } from '../../../services/service.index';


/*
export const columns: Columns[] = [
  { key: 'service_name', title: 'Proyecto' },
  { key: 'order_number', title: 'N° OT' },
  { key: 'gom_number', title: 'GOM' },
  { key: 'servicecategorie_name', title: 'Tipo Proyecto' },
  { key: 'address', title: 'Dirección' },
  { key: 'gestor', title: 'Gestor' },
  { key: 'contratista', title: 'Contratista' },
  { key: 'user', title: 'Informador' },
  { key: 'create_at', title: 'Creado El' },
  { key: 'action', title: 'Opciones' },
];*/

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css'],
  providers: [SettingsNgxEasyTableService],
})

export class ServiceComponent  implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  // columns: Columns[] = [];
  configuration: any;
  datasource = new MatTableDataSource();
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['service_name', 'order_number', 'gom_number', 'servicecategorie_name', 'address', 'gestor', 'contratista', 'user', 'create_at', 'action'];

  id: number;
  identity: any;
  isRateLimitReached: boolean = false;
  isLoadingRefresh: boolean = false;
  loading: boolean = true;
  order: Order[] = [];
  portal: number=0;
  project: any;
  proyectos: Array<Proyecto> = [];
  project_name: string;
  selected: any;
  selectedRow: number = 0;
  selectedElement: number;
  services: any = [];
  subscription: Subscription;
  sub: any;
  title: string;
  token: any;
  indexitem = -1;

  levels = {
      '': 0,
      'Low': 1,
      'Medium': 2,
      'High': 3,
  };

  // CDK PORTAL
  @ViewChild('myTemplate', { static: true }) myTemplate: TemplatePortal<any>;
  @ViewChild('myTemplate2', { static: true }) myTemplate2: TemplatePortal<any>;
  public _portal: Portal<any>;
  public _home: Portal<any>;

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionheaderaction = new FormControl(this.positionOptions[2]);
  positiondatasourceaction = new FormControl(this.positionOptions[3]);
  positionleftaction = new FormControl(this.positionOptions[4]);
  positionrightaction = new FormControl(this.positionOptions[5]);

  constructor(
    public _proyectoService: ProjectsService,
    private _route: ActivatedRoute,
    public _router: Router,
    public _userService: UserService,
    public dialog: MatDialog,
    public label: SettingsService,
  ) {

    this._userService.handleAuthentication(this.identity, this.token);
    //  this.columns = columns;
    this.configuration = SettingsNgxEasyTableService.config;
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();
    this.label.getDataRoute().subscribe(data => {
      this.title = data.subtitle;
    });

    this.sub = this._route.params.subscribe(params => {
      const id = +params['id'];
      this.id = id;
      if (this.id) {
        this.loading = true;
        this.services = [];
        this.datasource = null;
        this.project = this.filter();
        if (this.project !== 'Undefined' && this.project !== null && this.project) {
          this.project_name = this.project.project_name;
          this.subscription = this._proyectoService.getProjectServiceDetail(this.token.token, this.id).subscribe(
            response => {
                if (response.status === 'success') {
                  this.services = response.datos;
                  this.datasource = new MatTableDataSource(response.datos);
                  this.datasource.paginator = this.paginator;
                  this.datasource.sort = this.sort;
                  // console.log(this.services.length)
                  this.loading = false;
                  this.isRateLimitReached = false;
                  this.ngOnInit();
                }
              },
            (error: any) => {
                this.loading = false;
                this.isRateLimitReached = true;
                this._userService.logout();
                console.log(<any>error);
              }
            );
        } else {
          this._router.navigate(['/notfound']);
        }
      }
    });
  }

  ngOnInit() {
    this.portal = 0;
    this.selectedRow = 0;
    this._portal = this.myTemplate;
    this._home = this.myTemplate;
  }

  setClickedElement(index: number) {
    this.selectedElement = index;
  }

  hoverIn(index: number) {
    this.indexitem = index;
  }

  hoverOut(index: number) {
    this.indexitem = -1;
  }

  ngOnDestroy() {
      if (this.subscription) {
      this.subscription.unsubscribe();
      // console.log("ngOnDestroy unsuscribe");
    }
  }

  addDoc(service_id:number) {
    const dialogRef = this.dialog.open(AddDocComponent, {
      width: '1000px',
      disableClose: true,                 
      data: { project_id: this.id,
              service_id: service_id
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) { 

      }
    });
  }

  


  addNew(id: number) {
    const dialogRef = this.dialog.open(AddServiceComponent, {
    width: '1000px',
    disableClose: true,
    data: { project_id: id }
    });

    dialogRef.afterClosed().subscribe(
          result => {
             if (result === 1) {
             // After dialog is closed we're doing frontend updates 
             // For add we're just pushing a new row inside DataService
             // this.dataService.dataChange.value.push(this.OrderserviceService.getDialogData());  
             this.refresh();
             }
           });
  }

  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
    if (this.datasource.paginator) {
      this.datasource.paginator.firstPage();
    }
  }

  cloneService(service_id:number) {
    const dialogRef = this.dialog.open(CloneServiceComponent, {
      width: '1000px',
      disableClose: true,                 
      data: { project_id: this.id,
              service_id: service_id
            }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) { 

      }
    });
  }

  startEdit(id: number) {
    const dialogRef = this.dialog.open(EditServiceComponent, {
      width: '1000px',
      disableClose: true,
      data: {service_id: id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        // const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
        // this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.refresh();
      }
    });
  }

  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DeleteServiceComponent, {
      width: '1000px',
      disableClose: true,
      data: {service_id: id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        // const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
        // this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.refresh();
      }
    });
  }

  /**
  onEvent(event: any) {
    // console.log(event);
    if (event.event === Event.onOrder) {
      if (event.value.key === 'level') {
        this.sortByLevel(event.value.order === 'asc');
      } else if (event.value.key === 'service_name') {
        this.sortByLastName(event.value.order === 'asc');
      }
    } else {
      this.selected = JSON.stringify(event.value.row, null, 2);
    }
  }

  onAddressSearch(value): void {
    // console.log(value);
    var results = [];
    for(var i = 0; i < this.datasource.length; i++) {
      if(this.datasource[i].servicedetail[0] && this.datasource[i].servicedetail[0].address){
        var description = this.datasource[i].servicedetail[0].address;
        //console.log(description);
      }
      if (description && description !== null){
       if (description.toLowerCase().indexOf(value) > -1){
        results.push(this.datasource[i]);
       }
      }
    }

    this.services = results;

    // this.services = this.datasource.filter((_) => _.address.toLowerCase().indexOf(value) > -1);
  }

  onServiceTypeSearch(value): void {
    var results = [];
    for(var i = 0; i < this.datasource.length; i++){
      var description = (this.datasource[i].servicecategorie_name);
      if(description !== null){
       if(description.toLowerCase().indexOf(value) > -1){
        results.push(this.datasource[i]);
       }
      }
    }

    this.services = results;

    //this.services = this.datasource.filter((_) => _.servicecategorie_name.toLowerCase().indexOf(value) > -1);
  }

  onServiceSearch(value): void {
    this.services = this.datasource.filter((_) => _.service_name.toLowerCase().indexOf(value) > -1);
  }

  onAgeSearch(value): void {
    this.services = this.datasource.filter((_) => _.age > value);
  }

  onStatusChange(value: number): void {
    if(value >= 0){
      var results = [];
      for(var i = 0; i < this.datasource.length; i++){
        var result = (this.datasource[i].status);
        if(result !== null){
         if(result == value){
          results.push(this.datasource[i]);
         }
        }
      }
      this.services = results;
    }
    //this.services = this.datasource.filter((_) => _.status === (value === 1));
  } */

  openDialogCsv(): void {
    const dialogRef = this.dialog.open(CsvServiceComponent, {
      width: '777px',
      disableClose: true,
      data: { project_id: this.id,
              token: this.token.token,
            }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {

      }
    });
  }

  openDialogUser(id: number) {
    const dialogRef = this.dialog.open(UserComponent, {
    width: '777px',
    disableClose: true,
    data: { project_id: id }
    });

    dialogRef.afterClosed().subscribe(
          result => {
             if (result === 1) {
             // After dialog is closed we're doing frontend updates
             // For add we're just pushing a new row inside DataService
             // this.dataService.dataChange.value.push(this.OrderserviceService.getDialogData());
             this.refresh();
             }
           });
  }


  refresh() {

    if (this.id) {
      this.services = [];
      this.datasource = null;
      this.isLoadingRefresh = true;
      this.subscription = this._proyectoService.getProjectServiceDetail(this.token.token, this.id).subscribe(
        response => {
            if (response.status === 'success') {
              this.services = response.datos;
              this.datasource = new MatTableDataSource(response.datos);
              this.datasource.paginator = this.paginator;
              this.datasource.sort = this.sort;
              // console.log(this.services.length)
              this.loading = false;
              this.isRateLimitReached = false;
              this.isLoadingRefresh = false;
            }
          },
        (error: any) => {
            this.loading = false;
            this.isRateLimitReached = true;
            this.isLoadingRefresh = false;
            console.log(<any>error);
          }
        );
    }
  }

  reset(): void {
    this.services = this.datasource;
  }

  setClickedRow(index: number) {
    this.selectedRow = index;
    //console.log(this.selectedRow);
  }

  /**
  sortByLastName(asc: boolean): void {

    this.datasource = [...this.datasource.sort((a, b) => {
      const nameA = a.service_name.toLowerCase().split(' ')[1];
      const nameB = b.service_name.toLowerCase().split(' ')[1];
      if (asc) {
        return nameA.localeCompare(nameB);
      }
      return nameB.localeCompare(nameA);
    })];
  }

  sortByLevel(asc: boolean): void {
    this.datasource = [...this.datasource.sort((a, b) => {
      const levelA = this.levels[a.level];
      const levelB = this.levels[b.level];
      if (levelA < levelB) {
        return asc ? -1 : 1;
      }
      if (levelA > levelB) {
        return asc ? 1 : -1;
      }
      return 0;
    })];
  }*/

  toggleTemplate(event: number) {
    // this.showtemplate = !this.showtemplate;
    if (event === 0) {
      this._portal = this.myTemplate;
      this.portal = 0;
      this.selectedRow = 0;
    }
    if (event === 1) {
      this._portal = this.myTemplate2;
      this.portal = 1;
    }
  }

  filter() {
    if (this.proyectos && this.id) {
      for (let i = 0; i < this.proyectos.length; i += 1) {
        const result = this.proyectos[i];
        if (result.id === this.id) {
            return result;
        }
      }
    }
  }

  refreshMenu(event: number) {
    if (event === 1) {
    }
  }




}
