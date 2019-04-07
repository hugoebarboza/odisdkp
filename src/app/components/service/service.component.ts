import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OnDestroy } from "@angular/core";
import { MatDialog } from '@angular/material';
import { SubscriptionLike as ISubscription } from 'rxjs'

//NGX TABLE
import { Event } from 'ngx-easy-table';
import { Columns } from 'ngx-easy-table';


//MATERIAL
import { Portal, TemplatePortal } from '@angular/cdk/portal';

//DIALOG
import { AddServiceComponent } from '../dialog/addservice/addservice.component';
import { EditServiceComponent } from '../dialog/editservice/editservice.component';
import { DeleteServiceComponent } from '../dialog/deleteservice/deleteservice.component';

//MODELS
import { Proyecto } from '../../models/proyecto';
import { Order } from '../../models/order';
import { Service } from '../../models/Service';


//SERVICES
import { ProjectsService } from '../../services/projects.service';
import { SettingsNgxEasyTableService } from '../../services/settings/settings-ngx-easy-table.service';
import { UserService } from '../../services/service.index';




export const columns: Columns[] = [
  { key: 'service_name', title: 'Proyecto' },
  { key: 'order_number', title: 'N° OT' },
  { key: 'gom_number', title: 'GOM' },
  { key: 'servicecategorie_name', title: 'TIPO PROYECTO' },  
  { key: 'address', title: 'DIRECCIÓN' },
  { key: 'gestor', title: 'GESTOR' },
  { key: 'contratista', title: 'CONTRATISTA' },
  { key: 'status', title: 'Estatus' },
  { key: 'user', title: 'Informador' },
  { key: 'create_at', title: 'Creado El' },
  { key: 'action', title: 'Opciones' },
];


@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css'],
  providers: [SettingsNgxEasyTableService],
})
export class ServiceComponent  implements OnInit, OnChanges, OnDestroy {
  public title: string = 'Proyectos';
  public columns: Columns[] = [];
  public configuration: any;
  public datasource:any = [];
  public identity:any;
  public loading: boolean;
  public order: Order[] = [];
  public portal:number=0;
  public proyectos: Array<Proyecto>;  
  public project_name: string;
  public project: string;
  public isRateLimitReached: boolean = false;
  public selected: any;
  public selectedRow: number = 0;
  public services: any = [];
  //private services: Services[]=[];
  private subscription: ISubscription;
  public token:any;


  levels = {
      '': 0,
      'Low': 1,
      'Medium': 2,
      'High': 3,
  };

  //CDK PORTAL
  @ViewChild('myTemplate') myTemplate: TemplatePortal<any>;
  @ViewChild('myTemplate2') myTemplate2: TemplatePortal<any>;
  public _portal: Portal<any>;
  public _home:Portal<any>;


  @Input() id : number;

  constructor(	
    private _router: Router,        
    public _userService: UserService,  
    public _proyectoService: ProjectsService,
    public dialog: MatDialog,
  ) 
  { 	  
    this._userService.handleAuthentication(this.identity, this.token);    
    this.columns = columns;
    this.configuration = SettingsNgxEasyTableService.config;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {    
  }


  ngOnChanges(changes: SimpleChanges) {
    this.portal = 0;
    this._portal = this.myTemplate;
    this._home = this.myTemplate;
    this.selectedRow = 0;
    if(this.id){
      this.services = [];
      this.datasource = [];  
      this.loading = true;
      this.subscription = this._proyectoService.getProjectServiceDetail(this.token.token, this.id).subscribe(
        response => {
            if (response.status == 'success'){
              this.services = response.datos;
              this.datasource = response.datos;
              //console.log(this.datasource);
              //console.log(this.services.length)
              this.loading = false;
              this.isRateLimitReached = false;              
            }
          },
        (error: any) => {
            this.loading = false;
            this.isRateLimitReached = true;
            localStorage.removeItem('identity');
            localStorage.removeItem('token');
            localStorage.removeItem('proyectos');
            localStorage.removeItem('expires_at');
            this._router.navigate(["/login"]);          
            console.log(<any>error);
          }
        );
    }
  }

  ngOnDestroy(){
     this.subscription.unsubscribe();
  }

  addNew(id:number) {
    const dialogRef = this.dialog.open(AddServiceComponent, {
    width: '777px',
    disableClose: true,        
    data: { project_id: id }
    });


    dialogRef.afterClosed().subscribe(
          result => {       
             if (result === 1) { 
             // After dialog is closed we're doing frontend updates 
             // For add we're just pushing a new row inside DataService
             //this.dataService.dataChange.value.push(this.OrderserviceService.getDialogData());  
             this.refresh();
             }
           });
 }

  startEdit(id: number) {
    const dialogRef = this.dialog.open(EditServiceComponent, {
      width: '777px',
      disableClose: true,  
      data: {service_id: id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        //const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
      // this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.refresh();
      }
    });
  }

  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DeleteServiceComponent, {
      width: '777px',
      disableClose: true,  
      data: {service_id: id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        //const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
      // this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.refresh();
      }
    });
  }


  onEvent(event:any) { 
    //console.log(event);
    if (event.event === Event.onOrder) {
      if (event.value.key === 'level') {
        this.sortByLevel(event.value.order === 'asc');
      } else if (event.value.key === 'service_name') {
        this.sortByLastName(event.value.order === 'asc');
      }
    }else{
      this.selected = JSON.stringify(event.value.row, null, 2);
    }    
  }

  onAddressSearch(value): void {
    //console.log(value);
    var results = [];
    for(var i = 0; i < this.datasource.length; i++){
      if(this.datasource[i].servicedetail[0] && this.datasource[i].servicedetail[0].address){
        var description = this.datasource[i].servicedetail[0].address;
        //console.log(description);  
      }
      if(description && description !== null){
       if(description.toLowerCase().indexOf(value) > -1){
        results.push(this.datasource[i]);
       }
      }
    }

    this.services = results;

    //this.services = this.datasource.filter((_) => _.address.toLowerCase().indexOf(value) > -1);
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
  }

  openDialogCsv(): void {
    console.log('paso');
  }

  refresh(){
    if(this.id){
      this.services = [];
      this.datasource = [];  
      this.loading = true;
      this.subscription = this._proyectoService.getProjectServiceDetail(this.token.token, this.id).subscribe(
        response => {
            if (response.status == 'success'){
              this.services = response.datos;
              this.datasource = response.datos;
              //console.log(this.datasource);
              //console.log(this.services.length)
              this.loading = false;
              this.isRateLimitReached = false;
            }
          },
        (error: any) => {
            this.loading = false;
            this.isRateLimitReached = true;
            console.log(<any>error);
          }
        );
    }
  }

  reset(): void {
    this.services = this.datasource;
  }

  setClickedRow(index:number){
    this.selectedRow = index;
    //console.log(this.selectedRow);
  }

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
  }

  toggleTemplate(event:number) {
    //this.showtemplate = !this.showtemplate;
    if(event == 0){     
      this._portal = this.myTemplate;
      this.portal = 0;
      this.selectedRow = 0;
    }
    if (event == 1){
      this._portal = this.myTemplate2;
      this.portal = 1;
    }
    

  }




}
