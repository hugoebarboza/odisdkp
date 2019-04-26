import { Component, OnInit, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormControl  } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';

//FIREBASE
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

//DIALOG
import { EditServiceComponent } from '../../../pages/service/dialog/editservice/editservice.component';
import { ShowcustomerComponent } from '../../../components/dialog/showcustomer/showcustomer.component';

//MATERIAL
import { MatDialog, MatSnackBar } from '@angular/material';

//MODELS
import { 
  Comuna,
  Customer,
  Provincia,
  ProjectServiceCategorie,
  ProjectServiceType,
  Region, 
  Service, 
  User } from '../../../models/types';

//MOMENT
import * as _moment from 'moment';
const moment = _moment;


//SERVICES
import { CountriesService, OrderserviceService, ProjectsService, UserService } from '../../../services/service.index';


export interface Item { id: any, comment: string; created: any, identity: string}


@Component({
  selector: 'app-viewprojectdetail',
  templateUrl: './viewprojectdetail.component.html',
  styleUrls: ['./viewprojectdetail.component.css']
})
export class ViewProjectDetailComponent implements OnInit, OnDestroy, OnChanges {
  
  public cc_id:number;
  public category_id:number;
  public comunas: Comuna[] = [];
  public country_id: number;
  public created: FormControl;
  public customer: Customer[] = [];
  public identity: any;
  public isRateLimitReached = true;
  public isLoadingResults = false;
  public items: Observable<Item[]>;
  private itemsCollection: AngularFirestoreCollection<Item>;
  private path = '';
  public project: string;
  public project_id: number;
  public projectservicecategorie: ProjectServiceCategorie[] = [];
  public projectservicetype: ProjectServiceType[] = [];
  public provincias: Provincia[] = [];
  public projectContent: Item[];
  public regiones: Region[] = [];  
  public row: any = {expand: false};
  public service_id: number;
  public services: Service;
  public service_detail: Service;
  public service_data: Service;
  public servicename: string;
  public subscription: Subscription;
  private token: any;
  public toggleContent: boolean = false;
  public toggleContentMain: boolean = false;
  public users: User[] = [];
  public users_ito: User[] = [];
  

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Escriba aqui...',
    translate: 'no',
    uploadUrl: 'v1/images', // if needed
    customClasses: [ // optional
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };  


  models: any[] = [
    {id:0, name:'General', description:'Información General del Proyecto', expand: false},
    {id:1, name:'Usuarios', description:'Usuarios de Proyecto', expand: false},
    {id:5, name:'Administrativo', description:'Administrativo de Proyecto', expand: false},
    {id:3, name:'Fechas', description:'Fechas de Proyecto', expand: false},
    {id:4, name:'Detalles', description:'Descripción de Proyecto', expand: false},
    {id:2, name:'Dirección', description:'Ubicación de Proyecto', expand: false}  
  ];
  

  @Input() id : number;

  constructor(
    private _afs: AngularFirestore,
    private _dataService: OrderserviceService,
    private _project: ProjectsService,
    public _regionService: CountriesService,
    public _userService: UserService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,  
  ) { 
    this.created =  new FormControl(moment().format('YYYY[-]MM[-]DD HH:MM:SS'));
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  
  ngOnChanges(changes: SimpleChanges) {
    if(this.token.token != null && this.id > 0){
      this.isRateLimitReached = false;
      this.service_id = this.id;
       this.loadInfo();    
    }else{
       this.isRateLimitReached = true;        
    } 
  }

	enableDiv(row:any){
    this.row.expand = !this.row.expand;
    this.models[row].expand = !this.models[row].expand;
 }

 getRouteFirebase(id:number){
    
  if (this.id > 0 && id > 0){
    this.path = 'comments/'+id+'/'+this.service_id;
    this.itemsCollection = this._afs.collection<Item>(this.path, ref => ref.orderBy('created','desc'));      
    this.items = this.itemsCollection.valueChanges();
    
  }        
}

addComment(value:any) { 
  const docid = this._afs.createId();
  this.snackBar.open('Guardadon Registro de Trabajo.', '', {duration: 2000,});
  this.itemsCollection.doc(docid).set(
    {
      id: docid,
      comment: value,
      created: this.created.value,
      identity: this.identity.name + ' ' + this.identity.surname
    }      
  );
  if(this.toggleContent){
    this.toggleContent=false;
  }   
  if(this.toggleContentMain){
    this.toggleContentMain=false;
  }   

}

deleteCommentDatabase(value$: any) {    
  this.itemsCollection.doc(value$).delete();
  this.snackBar.open('Eliminando Registro de Trabajo.', '', {duration: 2000,});
  if(this.toggleContent){
    this.toggleContent=false;
  }   
}  


  public loadInfo(){
    this.isLoadingResults = true;
    this._dataService.getService(this.token.token, this.id).subscribe(
                response => 
                      {
                        if(response.status == 'success'){
                          this.services = response.datos;
                          this.project = response.datos.project.project_name;
                          this.project_id = Number (response.datos.project.id);
                          this.country_id = Number (response.datos.project.country_id);
                          this.servicename = String (response.datos.service_name);
                          if(this.project_id >0){
                            this.getRouteFirebase(this.project_id);
                          }
                          

                          if(this.services['servicedetail'][0]){
                            this.service_detail = response.datos.servicedetail;
                            this.service_data = response.datos.servicedetail[0];
                            if(this.service_data.region_id > 0){
                              this.loadRegion();
                              this.onSelectRegion(this.service_data.region_id);
                            }
                            if(this.service_data.provincia_id > 0){
                              this.onSelectProvincia(this.service_data.provincia_id);
                            }
                            if(this.service_data.category_id > 0){
                              this.category_id = this.service_data.category_id;
                            }

                          }else{
                            this.service_detail = response.datos.servicedetail;
                            this.service_data = response.datos.servicedetail[0];
                          }
                          this.customer = response.customer;
                          if(this.customer && this.customer.length > 0){
                            this.cc_id = this.customer[0]['cc_id'];
                          }
                          if(this.project_id >0){
                          this.loadProjectServiceType(this.project_id);
                          this.loadProjectServiceCategorie(this.project_id);
                          this.loadUserProject(this.project_id);
                          }                
                          this.isLoadingResults = false;
                        }else{
                        this.country_id = 0;
                        this.isLoadingResults = false;
                        }
                    },
                    (error) => {
                      this.isLoadingResults = false;
                      //localStorage.removeItem('identity');
                      //localStorage.removeItem('token');
                      //localStorage.removeItem('proyectos');
                      //localStorage.removeItem('expires_at');
                      //this._router.navigate(["/login"]);          
                      console.log(<any>error);
                    }  
                    );    
    }   

    loadProjectServiceCategorie(id:number){
      this.projectservicecategorie = null;    
      this.subscription = this._project.getProjectServiceCategorie(this.token.token, id).subscribe(
      response => {
                if(!response){
                  return;
                }
                if(response.status == 'success'){                  
                  this.projectservicecategorie = response.datos;
                  //console.log(this.projectservicecategorie);
                }
                });
    }

    
    loadProjectServiceType(id:number){
      this.projectservicetype = null;    
      this.subscription = this._project.getProjectServiceType(this.token.token, id).subscribe(
      response => {
                if(!response){
                  return;
                }
                if(response.status == 'success'){                  
                  this.projectservicetype = response.datos;
                  //console.log(this.projectservicetype.length);
                  //console.log(this.projectservicetype);
                }
                });        
  
    }

    loadUserProject(id:number){
      this.subscription = this._project.getUserProject(this.token.token, id, 7).subscribe(
      response => {
                if(!response){
                  return;
                }
                if(response.status == 'success'){    
                  this.users = response.datos;
                }
                });        
  
      this.subscription = this._project.getUserProject(this.token.token, id, 4).subscribe(
      response => {
                if(!response){
                  return;
                }
                if(response.status == 'success'){    
                  this.users_ito = response.datos;
                }
                });        
  
     }
  
  
    loadRegion(){
      this.subscription = this._regionService.getRegion(this.token.token, this.identity.country).subscribe(
      response => {
         if(response.status == 'success'){                  
                this.regiones = response.datos.region;
                //console.log(this.regiones);
                //console.log(this.regiones.length);
              }else{
                this.regiones = null;
              }
       });
    }
  
    onSelectRegion(regionid:number) {      
      if(regionid > 0){
        this.comunas = [];
        this.subscription = this._regionService.getProvincia(this.token.token, regionid).subscribe(
         response => {
               if(!response){
                 return;
               }
               if(response.status == 'success'){  
                 this.provincias = response.datos.provincia;
                 //console.log(this.provincias);
               }
               }); 
       }else{
         this.provincias = [];
       }
    }
  
    onSelectProvincia(provinciaid:number) {
      if(provinciaid > 0){
        this.subscription = this._regionService.getComuna(this.token.token, provinciaid).subscribe(
         response => {
               if(!response){
                 return;
               }
               if(response.status == 'success'){  
                 this.comunas = response.datos.comuna;
                 //console.log(this.comunas);
               }
               }); 
       }else{
         this.comunas = [];
       }
    }   
    
    showItem(id:number, cc_id: number, cc_number: string, category_id:number) {
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
        }
      });
    }
  

    toggle() {
      this.toggleContent = !this.toggleContent;
      this.projectContent = null;
    }
  
    togglemain() {
      this.toggleContentMain = !this.toggleContentMain;
      this.projectContent = null;
    }
      

}
