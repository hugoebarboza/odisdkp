import { Component, OnInit, Input, EventEmitter, SimpleChanges, OnChanges, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { defer, combineLatest, Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { tap, switchMap, map } from 'rxjs/operators';


declare var swal: any;

//FIREBASE
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
//import { AngularFireAuth } from 'angularfire2/auth';
//import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';


//DIALOG
import { EditServiceComponent } from '../../../components/shared/shared.index';
import { ShowcustomerComponent } from '../../../components/dialog/showcustomer/showcustomer.component';
import { StatusComponent } from '../../../pages/orderservice/components/dialog/status/status.component';
import { AddColorComponent } from '../../../pages/orderservice/components/dialog/add-color/add-color.component';
import { AddConstanteComponent } from   '../../../pages/orderservice/components/dialog/add-constante/add-constante.component';
import { AddGiroComponent } from '../../../pages/orderservice/components/dialog/add-giro/add-giro.component';
import { AddMarcaComponent } from '../../../pages/orderservice/components/dialog/add-marca/add-marca.component';
import { AddMercadoComponent } from '../../../pages/orderservice/components/dialog/add-mercado/add-mercado.component';
import { AddModeloComponent } from '../../../pages/orderservice/components/dialog/add-modelo/add-modelo.component';
import { AddSectorComponent } from '../../../pages/orderservice/components/dialog/add-sector/add-sector.component';
import { AddServiceTypeComponent } from '../../../pages/orderservice/components/dialog/add-service-type/add-service-type.component';
import { AddServiceTypeValueComponent } from '../../../pages/orderservice/components/dialog/add-service-type-value/add-service-type-value.component';
import { AddServiceValueComponent } from '../../../pages/orderservice/components/dialog/add-service-value/add-service-value.component';
import { AddTarifaComponent } from '../../../pages/orderservice/components/dialog/add-tarifa/add-tarifa.component';
import { AddZonaComponent } from '../../../pages/orderservice/components/dialog/add-zona/add-zona.component';


//MATERIAL
import { MatDialog, MatSnackBar } from '@angular/material';

//MODELS
import { 
  Comuna,
  Customer,
  FileItem,
  Provincia,
  ProjectServiceCategorie,
  ProjectServiceType,
  Region, 
  Service, 
  User, 
  UserFirebase} from '../../../models/types';

//MOMENT
import * as _moment from 'moment';
const moment = _moment;


//SERVICES
import { CargaImagenesService, CdfService, CountriesService, OrderserviceService, ProjectsService, ZipService, UserService } from '../../../services/service.index';

//UTILITY
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';


export interface Item { id: any, comment: string; created: any, identity: string}

export interface Users {
  id: any;
  name: string;
  surname: string;
  email: string;
}

@Component({
  selector: 'app-viewprojectdetail',
  templateUrl: './viewprojectdetail.component.html',
  styleUrls: ['./viewprojectdetail.component.css']
})
export class ViewProjectDetailComponent implements OnInit, OnDestroy, OnChanges {

  @Output() TiposServicio: EventEmitter<any>;
  @Output() Users: EventEmitter<any>;

  @ViewChild( CdkVirtualScrollViewport,  { static: false } ) viewport: CdkVirtualScrollViewport;
  
  archivos: FileItem[] = [];
  public cc_id:number;
  public category_id:number;
  CARPETA_ARCHIVOS:string = '';
  public comunas: Comuna[] = [];
  public country_id: number;
  comentarios$: Observable<any[]>;
  private comentariosCollection: AngularFirestoreCollection<any>;
  public created: FormControl;
  public customer: Customer[] = [];
  public descriptionidUx: string = ''
  formComentar: FormGroup;
  public idUx: any;
  public identity: any;
  public isRateLimitReached = true;
  public isLoadingResults = false;
  public items: Observable<Item[]>;
  private itemsCollection: AngularFirestoreCollection<Item>;
  destinatario = [];
  private path = '';
  newpath: string;
  public project: string;
  public project_id: number;
  project_type: number;
  public projectservicecategorie: ProjectServiceCategorie[] = [];
  public projectservicetype: ProjectServiceType[] = [];
  public provincias: Provincia[] = [];
  public projectContent: Item[];
  public regiones: Region[] = [];  
  public row: any = {expand: false};
  public route: string = '';
  role:number = 0;
  public service_id: number;
  public services: Service;
  public service_detail: Service;
  public service_data: Service;
  public servicename: string;
  public subscription: Subscription;
  tipoServicio = [];
  private token: any;
  public toggleContent: boolean = false;
  public toggleContentMain: boolean = false;
  public users: User[] = [];
  public users_ito: User[] = [];
  userFirebase: UserFirebase;
  

  /*
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
  };*/  


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
    public _cargaImagenes: CargaImagenesService,
    private _cdf: CdfService,
    private _dataService: OrderserviceService,
    private _project: ProjectsService,
    public _regionService: CountriesService,
    public _userService: UserService,
    private firebaseAuth: AngularFireAuth,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private toasterService: ToastrService,
    public zipService: ZipService,
  ) { 
    this.created =  new FormControl(moment().format('YYYY[-]MM[-]DD HH:mm:ss'));
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.TiposServicio = new EventEmitter();
    this.Users = new EventEmitter();
    this.role = 5; //USUARIOS INSPECTORES
    

    this.firebaseAuth.authState.subscribe(
      (auth) => {
        if(auth){
          this.userFirebase = auth;
          //console.log(this.userFirebase);
        }
    });

  }

  ngOnInit() {
  
  }

  ngOnDestroy() {
  }

  
  ngOnChanges(_changes: SimpleChanges) {

    this.newpath = 'allfiles/projects/';

    this.formComentar = new FormGroup({
      comentario: new FormControl ('', [Validators.required]),
    });

    this.formComentar.setValue({
      'comentario': ''
    });

    if(this.token.token != null && this.id > 0){
      this.isRateLimitReached = false;
      this.service_id = this.id;
       this.loadInfo();
       this.getTipoServicio(this.id);
    }else{
       this.isRateLimitReached = true;        
    }


  }

  collectionJoinUser(document, path:string): Observable<any> {
    return this.comentarios$ = document.pipe(
      leftJoin(this._afs, 'create_to', 'users', 0, '', '', 'usercomment'),
      leftJoin(this._afs, 'id', path + 'files', 1, 'id', '==', 'adjuntos')
    );
  }


	enableDiv(row:any){
    this.row.expand = !this.row.expand;
    this.models[row].expand = !this.models[row].expand;
 }

 getRouteFirebase(id:number){
    
  if (this.id > 0 && id > 0){
    this.path = 'comments/'+id+'/'+this.service_id;
    this.route = this.path;

    this.itemsCollection = this._afs.collection<Item>(this.path, ref => ref.orderBy('created','desc'));      
    this.items = this.itemsCollection.valueChanges();
    
  }        
}

getTipoServicio(id:number) {
  this.tipoServicio = [];
  this.zipService.getTipoServicio(id, this.token.token).then(
    (res: any) => {
      res.subscribe(
        (some: any) => {
          this.tipoServicio = some['datos'];
          if(this.tipoServicio.length > 0){
            this.TiposServicio.emit(this.tipoServicio);
          }
          //console.log(this.tipoServicio);
          //console.log(this.tipoServicio.length);
        },
        (error: any) => {
          console.log(<any>error);
        }
      );
    }
  );
}

/*
addComment(value:any) { 
  
  //value = `${value}`;
  //value = String(value).replace(/(\n)/gm,' ');
  value = value.replace(/[\s\n]/g,' ');

  const docid = this._afs.createId();
  this.idUx = docid;
  this.snackBar.open('Guardadon Registro de Trabajo.', '', {duration: 2000,});
  this.itemsCollection.doc(docid).set(
    {
      id: docid,
      comment: value,
      created: this.created.value,
      identity: this.identity.name + ' ' + this.identity.surname
    }      
  );


  if(this.destinatario.length > 0)  {
    //SEND CDF MESSAGING AND NOTIFICATION
    this.sendCdf(this.destinatario, value);
  }


  if(this.toggleContent){
    this.toggleContent=false;
  }
  if(this.toggleContentMain){
    this.toggleContentMain=false;
  }   
}*/

loadcomentario(path:string){
    //SELECT DE COMMENTS FIREBASE
    this.comentariosCollection = this._afs.collection(path + 'comments', ref => ref.orderBy('create_at', 'desc'));
    this.comentariosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    ).subscribe( (collection: any[]) => {
        const count = Object.keys(collection).length;        
        if (count === 0) {
          this.comentarios$ = null;
        } else {
            this.collectionJoinUser(of(collection), path);          
        }
      }
    );


}


addComentario() {

  if(!this.newpath){
    return;
  }

  const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

  this.CARPETA_ARCHIVOS = this.newpath;

  if (this.formComentar.invalid ) {
    swal('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
    return;
  }

  const that = this;
  this._afs.collection(this.newpath + 'comments').add({
    create_to: this.userFirebase.uid,
    create_at: date,
    comentario: this.formComentar.value.comentario
  })
  .then(function(docRef) {

    //const comment = that.formComentar.value.comentario;
    if (that.archivos.length > 0) {
      that.toasterService.success('Solicitud actualizada, Cerrar al finalizar carga de archivos', 'Exito', {timeOut: 8000});
      const storage = that.newpath + 'files';
      that._cargaImagenes.cargarImagenesProjectServiceFirebase( that.archivos, storage, {}, date, docRef.id, that.userFirebase.uid);
    }

    that.formComentar.reset();
    //that.toggleContent = false;

  })
  .catch(function(error) {
      console.error('Error adding document: ', error);
  });
}



sendCdf(data, message){
  if(!data){
    return;
  }

  const body = 'Registro de trabajo en Proyecto: '+this.project+', Servicio: '+this.servicename+', con el siguiente Comentario: ' + message;
  
  if(this.destinatario.length > 0 && this.userFirebase.uid){
    for (let d of data) {
      
      const notification = {
        userId: this.userFirebase.uid,
        userIdTo: d.id,			
        title: 'Registro de Trabajo',
        message: body,
        create_at: this.created.value,
        status: '1',
        idUx: this.idUx,
        descriptionidUx: 'collection',
        routeidUx: `${this.route}`
      };  

      
      this._cdf.fcmsend(this.token.token, notification).subscribe(
        response => {        
          if(!response){
          return false;        
          }
          if(response.status == 200){ 
            //console.log(response);
          }
        },
          error => {
          console.log(<any>error);
          }   
        );			
          


        const msg = {
          toEmail: d.email,
          fromTo: this.userFirebase.email,
          subject: 'OCA GLOBAL - Nueva notificación',
          message: `<strong>Hola ${d.name} ${d.surname}. <hr> <div>&nbsp;</div> Tiene una nueva notificación, enviada a las ${this.created.value} por ${this.userFirebase.email}</strong><div>&nbsp;</div> <div> ${body}</div>`,
        };

        this._cdf.httpEmail(this.token.token, msg).subscribe(
          response => {        
            if(!response){
            return false;        
            }
            if(response.status == 200){ 
              //console.log(response);
            }
          },
            error => {
            console.log(<any>error);
            }   
          );			
          

      
    }
  
  }

}

deleteCommentDatabase(item: any) {    
  
  swal({
    title: '¿Esta seguro?',
    text: 'Esta seguro de borrar registro de trabajo ' + item.comment,
    icon: 'warning',
    buttons: true,
    dangerMode: true,
  })
  .then( borrar => {
    if(borrar){
      this.itemsCollection.doc(item.id).delete();
      this.snackBar.open('Eliminando Registro de Trabajo.', '', {duration: 2000,});  
      if(this.toggleContent){
        this.toggleContent=false;
      }    
    }
  });
}  


  public loadInfo(){
    this.isLoadingResults = true;
    this._dataService.getService(this.token.token, this.id).subscribe(
                response => 
                      {
                        if(response.status == 'success'){                          
                          this.services = response.datos;
                          this.project = response.datos.project.project_name;
                          this.project_type = response.datos.project.project_type;
                          this.project_id = Number (response.datos.project.id);
                          this.country_id = Number (response.datos.project.country_id);
                          this.servicename = String (response.datos.service_name);
                          if(this.project_id >0){
                            this.getRouteFirebase(this.project_id);
                            this.newpath = this.newpath + this.project_id + '/' + this.id + '/';
                            //console.log(this.newpath);
                            this.loadcomentario(this.newpath);
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
      this.subscription = this._project.getUserProject(this.token.token, id, 8).subscribe(
      response => {
                if(!response){
                  return;
                }
                if(response.status == 'success'){    
                  this.users = response.datos;
                  if(this.users.length > 0){
                    this.Users.emit(this.users);
                  }
                  //console.log(this.users);
                }
                });        
  
      this.subscription = this._project.getUserProject(this.token.token, id, 8).subscribe(
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
  

    constante(id: number) {
      const dialogRef = this.dialog.open(AddConstanteComponent, {
        width: '777px',
        disableClose: true,  
        data: {
          project_id: this.project_id,
          service_id: id
        }
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


    giro(id: number) {
      const dialogRef = this.dialog.open(AddGiroComponent, {
        width: '777px',
        disableClose: true,  
        data: {
          project_id: this.project_id,
          service_id: id
        }
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


    mercado(id: number) {
      const dialogRef = this.dialog.open(AddMercadoComponent, {
        width: '777px',
        disableClose: true,  
        data: {
          project_id: this.project_id,
          service_id: id
        }
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


    sector(id: number) {
      const dialogRef = this.dialog.open(AddSectorComponent, {
        width: '777px',
        disableClose: true,  
        data: {
          project_id: this.project_id,
          service_id: id
        }
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


    tarifa(id: number) {
      const dialogRef = this.dialog.open(AddTarifaComponent, {
        width: '777px',
        disableClose: true,  
        data: {
          project_id: this.project_id,
          service_id: id
        }
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


    zona(id: number) {
      const dialogRef = this.dialog.open(AddZonaComponent, {
        width: '777px',
        disableClose: true,  
        data: {
          project_id: this.project_id,
          service_id: id
        }
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


    servicevalue(id: number) {
      const dialogRef = this.dialog.open(AddServiceValueComponent, {
        width: '777px',
        disableClose: true,  
        data: {
          project_id: this.project_id,
          service_id: id
        }
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


    servicetypevalue(id: number, servicetype_id:number) {
      //console.log(id);
      //console.log(servicetype_id);

      const dialogRef = this.dialog.open(AddServiceTypeValueComponent, {
        width: '777px',
        disableClose: true,  
        data: {
          project_id: this.project_id,
          service_id: id,
          servicetype_id: servicetype_id
        }
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


    status(id: number) {
      const dialogRef = this.dialog.open(StatusComponent, {
        width: '1000px',
        disableClose: true,  
        data: {
          project_id: this.project_id,
          service_id: id
        }
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


    servicetype(id: number) {
      const dialogRef = this.dialog.open(AddServiceTypeComponent, {
        width: '1000px',
        disableClose: true,  
        data: {
          project_id: this.project_id,
          service_id: id
        }
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


    color(id: number) {
      const dialogRef = this.dialog.open(AddColorComponent, {
        width: '777px',
        disableClose: true,  
        data: {
          project_id: this.project_id,
          service_id: id
        }
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

    marca(id: number) {
      const dialogRef = this.dialog.open(AddMarcaComponent, {
        width: '777px',
        disableClose: true,  
        data: {
          project_id: this.project_id,
          service_id: id
        }
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


    modelo(id: number) {
      const dialogRef = this.dialog.open(AddModeloComponent, {
        width: '777px',
        disableClose: true,  
        data: {
          project_id: this.project_id,
          service_id: id
        }
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


    taguser(data){
      if(data.length == 0){
        data = '';
        return;
      }

      if(data.length > 0){
        this.destinatario = data;
        //console.log(this.destinatario);
      }
    }


    toggle() {
      this.toggleContent = !this.toggleContent;
      this.projectContent = null;
    }
  
    togglemain() {
      this.toggleContentMain = !this.toggleContentMain;
      this.projectContent = null;
    }
      


    removeFile(index: number): void {
      if (index >= 0) {
        this.archivos.splice(index, 1);
      }
      if (this.archivos.length === 0) {
        this.archivos = [];
      }
    }
  
  
    selectFiles(event) {
  
      const filevalidation = event.target.files;
      if (filevalidation && filevalidation.length > 0 && filevalidation.length <= 7) {
      } else {
        this.archivos = [];
        if (filevalidation && filevalidation.length > 7) {
          this.toasterService.warning('Error: Supero limite de 7 archivos', 'Error', {enableHtml: true, closeButton: true, timeOut: 6000 });
        }
      }
  
    }

}


export const leftJoin = (
  afs: AngularFirestore,
  field,
  collection,
  type: number,
  where: string,
  condition,
  nameObject
  ) => {
  return source =>
    defer(() => {

      // Operator state
      let collectionData;

      // Track total num of joined doc reads
      // let totalJoins = 0;

      return source.pipe(
        switchMap(data => {
          // Clear mapping on each emitted val ;
          // Save the parent data state
          collectionData = data as any[];

          const reads$ = [];
          for (const doc of collectionData) {

            // Push doc read to Array
            if (doc[field]) {
              // Perform query on join key, with optional limit
              // const q = ref => ref.where(field, '==', doc[field]).limit(limit);

              if (type === 0) {
                reads$.push(afs.doc(collection + '/' + doc[field]).valueChanges());
              }

              if (type === 1) {
                // tslint:disable-next-line:max-line-length
                reads$.push(afs.collection(collection, ref => ref.where( where, condition, doc[field])).valueChanges());
              }

            } else {
              reads$.push(of([]));
            }
          }

          return combineLatest(reads$);
        }),
        map(joins => {
          return collectionData.map((v: any, i: any) => {
            // totalJoins += joins[i].length;
            return { ...v, [nameObject]: joins[i] || null };
          });
        }),
        tap(_final => {
            // console.log( `Queried ${(final as any).length}, Joined ${totalJoins} docs`);
          // totalJoins = 0;
        })
      );
    });
};