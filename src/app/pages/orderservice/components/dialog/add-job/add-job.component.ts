import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/Subscription';
import { defer, combineLatest, Observable, of } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
import swal from 'sweetalert';

//FIREBASE
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

//MODELS
import { FileItem, Proyecto, Service, User, UserFirebase } from 'src/app/models/types';

//SERVICES
import { CargaImagenesService, CdfService, OrderserviceService, UserService, ZipService } from 'src/app/services/service.index';


import * as _moment from 'moment';



const moment = _moment;



@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.css']
})
export class AddJobComponent implements OnInit, OnDestroy {

  archivos: FileItem[] = [];
  CARPETA_ARCHIVOS:string = '';
  comentarios$: Observable<any[]>;
  private comentariosCollection: AngularFirestoreCollection<any>;
  destinatarios = [];

  kpi:number = 0;
  serviceid:number = 0;
  servicetype_id:number = 0;
  
  listimageorder = [];
  imageRows = [];
  emailaddress: string = '';
  emailbody:string ='';
  emailcompany: string = '';
  emaildescription:string ='';
  emailorder_number: string = '';
  emailpila = [];
  emailfiles = [];
  emailimages = [];

  formJob: FormGroup;
  items: FormArray;

  formComentar: FormGroup;
  id:number;
  identity: any;
  isLoading: boolean = true;
  project: any;
  project_id: number
  proyectos: Array<Proyecto> = [];
  services: Service;
  service: any;
  service_type: any;
  subscription: Subscription;
  path = 'allfiles/projects/';
  source = 'allfiles/projects/';
  tipoServicio: any;
  title:string = "Registrar trabajo";
  token: any;
  toggleContent: boolean = false;
  user_informador: User;
	user_responsable:User;
	user_itocivil_assigned_to: User;
  user_itoelec_assigned_to: User;
  user_responsable_obra: User;
  userFirebase: UserFirebase;
  email_responsable_obra: string;



  constructor(
    private _afs: AngularFirestore,
    public _cargaImagenes: CargaImagenesService,
    private _cdf: CdfService,
    public _userService: UserService,
    public dataservice: OrderserviceService,
    public dialogRef: MatDialogRef<AddJobComponent>,
    private firebaseAuth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private toasterService: ToastrService,
    public zipService: ZipService,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { 
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.proyectos = this._userService.getProyectos();
    this.path = this.path + this.data.project + '/' + this.data.service_id + '/' + this.data.tiposervicio + '/' + this.data.orderid + '/';
    this.source = this.source + this.data.project + '/' + this.data.service_id + '/files';
    this.servicetype_id = this.data.tiposervicio;
    this.serviceid = this.data.service_id;
    //console.log(this.data);
    //console.log(this.path);
    this.firebaseAuth.authState.subscribe(
      (auth) => {
        if (auth) {
          this.userFirebase = auth;
        }
    });

  }


  ngOnInit() {
    if(this.data.project > 0){
      this.project_id = this.data.project;
      this.id = this.data.service_id;
      this.project = this.filter();
      this.service = this.filterService();
      if(this.id){
        this.getTipoServicio(this.id);
      }
      this.isLoading = false;

      this.formComentar = new FormGroup({
        comentario: new FormControl ('', [Validators.required]),
        observacion: new FormControl ('', ),
      });
  
      this.formComentar.setValue({
        'comentario': '',
        'observacion': ''
      });  

      this.formJob = this.formBuilder.group({
        items: this.formBuilder.array([ this.createItem() ])
      });      
    }

    if(this.data.orderid){
      this.getListImage();
    }


    if(this.data.service_id > 0){
      //console.log(this.data.service_id);
      this.subscription = this.dataservice.getService(this.token.token, this.data.service_id).subscribe(
        response => {
                  if(!response){
                    return;
                  }
                  if(response.status == 'success'){
                    //console.log(response.datos);
                    this.services = response.datos;
                    this.kpi = response.datos.kpi;
                    console.log(this.kpi);
                    if(this.services && this.services['servicedetail'][0] && this.services['servicedetail'][0].user_informador){                      
                      this.subscription = this._userService.getUserInfo(this.token.token, this.services['servicedetail'][0].user_informador).subscribe(
                        response => {
                          if(!response){
                            return;
                          }
                          if(response.status == 'success'){
                            this.user_informador = response.data[0];
                            //console.log(this.user_informador);
                          }
                        }
                      )
                    }


                    if(this.services && this.services['servicedetail'][0] && this.services['servicedetail'][0].user_responsable){                      
                      this.subscription = this._userService.getUserInfo(this.token.token, this.services['servicedetail'][0].user_responsable).subscribe(
                        response => {
                          if(!response){
                            return;
                          }
                          if(response.status == 'success'){
                            this.user_responsable = response.data[0];
                            //console.log(this.user_responsable);
                          }
                        }
                      )
                    }


                    if(this.services && this.services['servicedetail'][0] && this.services['servicedetail'][0].user_itocivil_assigned_to){
                      this.subscription = this._userService.getUserInfo(this.token.token, this.services['servicedetail'][0].user_itocivil_assigned_to).subscribe(
                        response => {
                          if(!response){
                            return;
                          }
                          if(response.status == 'success'){
                            this.user_itocivil_assigned_to = response.data[0];
                          }
                        }
                      )
                    }

                    if(this.services && this.services['servicedetail'][0] && this.services['servicedetail'][0].user_itoelec_assigned_to){
                      this.subscription = this._userService.getUserInfo(this.token.token, this.services['servicedetail'][0].user_itoelec_assigned_to).subscribe(
                        response => {
                          if(!response){
                            return;
                          }
                          if(response.status == 'success'){
                            this.user_itoelec_assigned_to = response.data[0];
                          }
                        }
                      )
                    }

                    if(this.services && this.services['servicedetail'][0] && this.services['servicedetail'][0].responsable_obra){
                      this.user_responsable_obra = this.services['servicedetail'][0].responsable_obra;
                    }

                    if(this.services && this.services['servicedetail'][0] && this.services['servicedetail'][0].responsable_email){
                      this.email_responsable_obra = this.services['servicedetail'][0].responsable_email;
                    }
                  }
       });
    }

    


    //SELECT DE COMMENTS FIREBASE
    this.comentariosCollection = this._afs.collection(this.path + 'comments', ref => ref.orderBy('create_at', 'desc'));
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
          this.collectionJoinUser(Observable.of(collection));
        }
      }
    );

  }



  addComentario(event:number) {


    //console.log(this.formJob.controls.items.controls);

    if(this.formJob.controls.items){
      this.formJob.controls.items['controls'].forEach(res => {
        if(res.value.name !== ''){
          this.emailpila.push(res.value);
        }
        
      });  
    }

    const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    this.CARPETA_ARCHIVOS = this.path;

    if (this.formComentar.invalid ) {
      swal('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
      return;
    }


    const that = this;
    this._afs.collection(this.path + 'comments').add({
      create_to: this.userFirebase.uid,
      create_at: date,
      comentario: this.formComentar.value.comentario,
      observacion: this.formComentar.value.observacion,
      pila: this.emailpila
    })
    .then(function(docRef) {      
      if (that.archivos.length > 0) {
        that.toasterService.success('Solicitud actualizada, Cerrar al finalizar carga de archivos', 'Exito', {timeOut: 8000});
        const storage = that.path + 'commentsFiles';
        that._cargaImagenes.cargarImagenesProjectFirebase( that.archivos, storage, that.source, that.data, date, docRef.id, that.userFirebase.uid )
        .then(
          response => {
            that.emailfiles = response;
            that.archivos = [];
            if(event == 1){
              that.afterAddComentario();
            }            
            that.formComentar.reset();   
            that.toggleContent = false;
            that.resetForm();
          }
        )
        .catch(
          error => {
            console.log(<any>error);          
          }          
        );
      }else{
        if(event == 1){
          that.afterAddComentario();
        }
        that.formComentar.reset();   
        that.toggleContent = false;
        that.resetForm();  
      }      

    })
    .catch(function(error) {
        console.error('Error adding document: ', error);
    });
  }


  private afterAddComentario(){
    if (!this.data || !this.services || !this.formComentar) {
      //console.log('paso return');
      return;
    }


    if(this.user_informador && this.user_informador.email){
      this.destinatarios.push(this.user_informador.email);
    }

    if(this.user_responsable && this.user_responsable.email){
      this.destinatarios.push(this.user_responsable.email);
    }

    if(this.user_itocivil_assigned_to && this.user_itocivil_assigned_to.email){
      this.destinatarios.push(this.user_itocivil_assigned_to.email);
    }


    if(this.user_itoelec_assigned_to && this.user_itoelec_assigned_to.email){
      this.destinatarios.push(this.user_itoelec_assigned_to.email);
    }


    if(this.user_responsable_obra && this.email_responsable_obra){
      this.destinatarios.push(this.email_responsable_obra);
    }

    
    if(this.project.project_name){
      //this.emailbody = 'Nombre del Proyecto: ' + this.project.project_name;
    }

    if(this.service.service_name){
      //this.emailbody = this.emailbody + ' / ' + this.service.service_name + '.';
    }
    
    if(this.service.service_name){
      //this.emailbody = this.emailbody + ' Tipo de Servicio: (' + this.service_type.name + ')';
    }

    
    this.emailbody = this.formComentar.value.comentario;
    
    if(this.services['servicedetail'][0] !== undefined && this.services['servicedetail'][0].address){
      this.emailaddress = this.services['servicedetail'][0].address;
    }

    if(this.services['servicedetail'][0] !== undefined && this.services['servicedetail'][0].contratista){
      this.emailcompany = this.services['servicedetail'][0].contratista;
    }

    if(this.services['servicedetail'][0] !== undefined && this.services['servicedetail'][0].description){
      this.emaildescription = this.services['servicedetail'][0].description;
    }
    

    if(this.services['servicedetail'][0] !== undefined && this.services['servicedetail'][0].order_number){
      this.emailorder_number = this.services['servicedetail'][0].order_number;      
    }

    //console.log(this.destinatarios);
    //console.log(this.emailbody);
    //console.log(this.emailaddress);
    //console.log(this.emailcompany);
    //console.log(this.emaildescription);
    //console.log(this.emailorder_number);
    //console.log(this.formComentar.value.comentario);
    //console.log(this.formComentar.value.observacion);

    if (this.data && this.userFirebase.uid && this.destinatarios.length > 0) {
      this.destinatarios.forEach(res => {
        this.sendCdfUser(res, this.emailbody);
      });
    }
  }


  addItem(): void {
    this.items = this.formJob.get('items') as FormArray;
    this.items.push(this.createItem());
  }


  createItem(): FormGroup {
    return this.formBuilder.group({
      name: '',
      description: '',
    });
  }

  getControls(frmGrp: FormGroup, key: string) {
    return (<FormArray>frmGrp.controls[key]).controls;
  }


  public getListImage(){     
    this.subscription = this.dataservice.getImageOrder(this.token.token, this.data.orderid).subscribe(
    response => {        
      if(!response){
        return;        
      }
        if(response.status == 'success'){ 
          this.listimageorder = response.datos;
          //console.log(this.listimageorder);
          if(this.listimageorder.length>0){
            //this.getSplitArray(this.listimageorder, 2);
          }
        }
    },
        error => {
        console.log(<any>error);
        }   
    );
  }


  public getSplitArray (list, columns) {
    let array = list;
    if (array.length <= columns) {
      array.length = 2;
    };

       var rowsNum = Math.ceil(array.length / columns);
       var rowsArray = new Array(rowsNum);

       for (var i = 0; i < rowsNum; i++) {
           var columnsArray = new Array(columns);
           for (var j = 0; j < columns; j++) {
               var index = i * columns + j;

               if (index < array.length) {
                   columnsArray[j] = array[index];                   
               } else {
                   break;
               }
           }
           rowsArray[i] = columnsArray;
       }
       this.imageRows = rowsArray
       console.log(this.imageRows)
   }    


  sendCdfUser(to:string, body: string){

    if(!to || !body){
      return;
    }

    //console.log(to);
    //console.log(this.data);
    //return;

    const created = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const project = {
      address: this.emailaddress,
      company : this.emailcompany,
      comentario: this.formComentar.value.comentario,
      name: this.project.project_name,      
      observacion: this.formComentar.value.observacion,
      description : this.emaildescription, 
      order_number: this.emailorder_number,
      service_name: this.service.service_name,
      service_type_name: this.service_type.name,
      id : this.id,
      orderid: this.data.orderid,
      pila: this.emailpila,
      file: this.emailfiles,
      image: this.listimageorder
    };


    if (to && body && project && this.emailfiles.length > 0){
      const asunto = 'OCA GLOBAL - Registro de Trabajo en Proyecto: ' + ' ' + this.service.service_name + '. OT: ' + this.data.order_number;
      this._cdf.httpEmailAddCommentFile(this.token.token, to, this.userFirebase.email, asunto, created, body, project ).subscribe(
        response => {
          if (!response) {
            this.emailfiles = [];
            this.destinatarios = [];
          return false;
          }
          if (response.status === 200) {
            this.emailfiles = [];
            this.destinatarios = [];
            //console.log(response);
          }
        },
          error => {
            this.emailfiles = [];
            this.destinatarios = [];
            console.log(<any>error);
          }
        );
    }


    if (to && body && project && this.emailfiles.length == 0){
      const asunto = 'OCA GLOBAL - Registro de Trabajo en Proyecto: ' + ' ' + this.service.service_name + '. OT: ' + this.data.order_number;
      this._cdf.httpEmailAddComment(this.token.token, to, this.userFirebase.email, asunto, created, body, project ).subscribe(
        response => {
          if (!response) {
            this.destinatarios = [];
            return false;
          }
          if (response.status === 200) {
            this.destinatarios = [];
            //console.log(response);
          }
        },
          error => {
            this.destinatarios = [];
            console.log(<any>error);
          }
        );
    }
  }  

  toggle() {
    this.toggleContent = !this.toggleContent;
  }

  resetValue(){
    this.listimageorder = [];
    this.imageRows = [];
    this.emailaddress = '';
    this.emailbody ='';
    this.emailcompany = '';
    this.emaildescription ='';
    this.emailorder_number = '';
    this.emailpila = [];
    this.emailfiles = [];
    this.emailimages = [];
  
  }

  resetForm(){
    //this.formJob.reset();
    this.emailpila = [];
    this.formJob = this.formBuilder.group({
      items: this.formBuilder.array([ this.createItem() ])
    });
  }


  collectionJoinUser(document): Observable<any> {
    return this.comentarios$ = document.pipe(
      leftJoin(this._afs, 'create_to', 'users', 0, '', '', 'usercomment'),
      leftJoin(this._afs, 'id', this.path + 'commentsFiles', 1, 'id', '==', 'adjuntos')
    );
  }



  ngOnDestroy() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    
  }





  filter(){
    if(this.proyectos && this.project_id){
      for(var i = 0; i < this.proyectos.length; i += 1){
        var result = this.proyectos[i];
        if(result.id === this.project_id){
            return result;
        }
      }
    }    
  }

  filterService(){
    if(this.project.service && this.id){
      for(var i = 0; i < this.project.service.length; i += 1){
        var result = this.project.service[i];
        if(result.id === this.id){
            return result;
        }
      }
    }    
  }

  filterServiceType(){
    if(this.tipoServicio && this.data.tiposervicio){
      //console.log(this.tipoServicio);
      //console.log(this.data.tiposervicio);
      for(var i = 0; i < this.tipoServicio.length; i += 1){
        var result = this.tipoServicio[i];
        if(result.id === this.data.tiposervicio){
            return result;
        }
      }
    }    
  }


  getTipoServicio(id:number) {
    this.zipService.getTipoServicio(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some: any) => {
            this.tipoServicio = some['datos'];
            if(this.tipoServicio){
              this.service_type = this.filterServiceType()
              //console.log(this.service_type);
            }      
          },
          (error: any) => {
            console.log(<any>error);
          }
        );
      }
    );
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



  onNoClick(): void {
    this.dialogRef.close();
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
      let totalJoins = 0;

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
            totalJoins += joins[i].length;
            return { ...v, [nameObject]: joins[i] || null };
          });
        }),
        tap(final => {
            // console.log( `Queried ${(final as any).length}, Joined ${totalJoins} docs`);
          totalJoins = 0;
        })
      );
    });
};