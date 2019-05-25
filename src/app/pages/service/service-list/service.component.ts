import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnDestroy } from "@angular/core";
import { MatDialog, TooltipPosition } from '@angular/material';
import { Subscription } from 'rxjs/Subscription'
import { FormControl } from '@angular/forms';

//NGX TABLE
import { Event } from 'ngx-easy-table';
import { Columns } from 'ngx-easy-table';


//MATERIAL
import { Portal, TemplatePortal } from '@angular/cdk/portal';

//DIALOG
//import { AddUserServiceComponent } from '../components/adduserservice/adduserservice.component';
import { AddServiceComponent } from '../dialog/addservice/addservice.component';
import { CsvServiceComponent } from '../dialog/csvservice/csvservice.component';
//import { EditServiceComponent } from '../dialog/editservice/editservice.component';
import { EditServiceComponent } from '../../../components/shared/shared.index';
import { DeleteServiceComponent } from '../dialog/deleteservice/deleteservice.component';
import { UserComponent } from '../dialog/user/user.component';

//MODELS
import { Order, Proyecto } from '../../../models/types';


//SERVICES
import { SettingsNgxEasyTableService } from '../../../services/settings/settings-ngx-easy-table.service';
import { ProjectsService, SettingsService, UserService } from '../../../services/service.index';





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
];


@Component({  
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css'],
  providers: [SettingsNgxEasyTableService],
})
export class ServiceComponent  implements OnInit, OnDestroy {
    
  columns: Columns[] = [];
  configuration: any;
  datasource:any = [];
  id:number;
  identity:any;
  isRateLimitReached: boolean = false;
  isLoadingRefresh: boolean = false;
  loading: boolean = true;
  order: Order[] = [];
  portal:number=0;
  project: any;
  proyectos: Array<Proyecto> = [];
  project_name: string;
  selected: any;
  selectedRow: number = 0;
  services: any = [];
  subscription: Subscription;
  sub: any;
  title: string;
  token:any;


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

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positiondatasourceaction = new FormControl(this.positionOptions[3]);
  positionleftaction = new FormControl(this.positionOptions[4]);


  constructor(	
    public _proyectoService: ProjectsService,    
    private _route: ActivatedRoute,
    public _router: Router,
    public _userService: UserService,
    public dialog: MatDialog,
    public label: SettingsService
  ) 
  { 	  
    this._userService.handleAuthentication(this.identity, this.token);    
    this.columns = columns;
    this.configuration = SettingsNgxEasyTableService.config;
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();
    this.label.getDataRoute().subscribe(data => {
      this.title = data.subtitle;
    });

    this.sub = this._route.params.subscribe(params => { 
      let id = +params['id'];            
      this.id = id;
      if(this.id){
        this.loading = true;         
        this.services = [];
        this.datasource = [];  
        this.project = this.filter();
        if (this.project != "Undefined" && this.project !== null && this.project){
          this.project_name = this.project.project_name;
          this.subscription = this._proyectoService.getProjectServiceDetail(this.token.token, this.id).subscribe(
            response => {
                if (response.status == 'success'){
                  this.services = response.datos;
                  this.datasource = response.datos;
                  //console.log(this.services.length)
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
        }else{
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



  ngOnDestroy(){
		if(this.subscription){
			this.subscription.unsubscribe();
			//console.log("ngOnDestroy unsuscribe");
		}
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

  openDialogUser(id:number) {
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
             //this.dataService.dataChange.value.push(this.OrderserviceService.getDialogData());  
             this.refresh();
             }
           });
  }


  refresh(){

    if(this.id){
      this.services = [];
      this.datasource = [];  
      this.isLoadingRefresh = true;
      this.subscription = this._proyectoService.getProjectServiceDetail(this.token.token, this.id).subscribe(
        response => {
            if (response.status == 'success'){
              this.services = response.datos;
              this.datasource = response.datos;
              //console.log(this.datasource);
              //console.log(this.services.length)
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

  filter(){
    if(this.proyectos && this.id){
      for(var i = 0; i < this.proyectos.length; i += 1){
        var result = this.proyectos[i];
        if(result.id === this.id){
            return result;
        }
      }
    }    
  }


  refreshMenu(event:number){
		if(event == 1){
		}
	}




}
