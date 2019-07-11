import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators, FormGroup, } from '@angular/forms';
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
import { CargaImagenesService, OrderserviceService, UserService, ZipService } from 'src/app/services/service.index';


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
    public _userService: UserService,
    public dataservice: OrderserviceService,
    public dialogRef: MatDialogRef<AddJobComponent>,
    private firebaseAuth: AngularFireAuth,
    private toasterService: ToastrService,
    public zipService: ZipService,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { 
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.proyectos = this._userService.getProyectos();
    this.path = this.path + this.data.project + '/' + this.data.service_id + '/' + this.data.tiposervicio + '/' + this.data.orderid + '/';
    this.source = this.source + this.data.project + '/' + this.data.service_id + '/files';
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
      });
  
      this.formComentar.setValue({
        'comentario': ''
      });  
    }

    if(this.data.service_id > 0){
      //console.log(this.data.service_id);
      this.subscription = this.dataservice.getService(this.token.token, this.data.service_id).subscribe(
        response => {
                  if(!response){
                    return;
                  }
                  if(response.status == 'success'){
                    this.services = response.datos;
                    if(this.services && this.services['servicedetail'][0] && this.services['servicedetail'][0].user_informador){                      
                      this.subscription = this._userService.getUserInfo(this.token.token, this.services['servicedetail'][0].user_informador).subscribe(
                        response => {
                          if(!response){
                            return;
                          }
                          if(response.status == 'success'){
                            this.user_informador = response.data[0];
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



  addComentario() {


    const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    this.CARPETA_ARCHIVOS = this.path;

    if (this.formComentar.invalid ) {
      swal('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
      return;
    }

    const that = this;
    //this._afs.doc(this.path).update({update_at: date});
    this._afs.collection(this.path + 'comments').add({
      create_to: this.userFirebase.uid,
      create_at: date,
      comentario: this.formComentar.value.comentario
    })
    .then(function(docRef) {

      //const comment = that.formComentar.value.comentario;
      if (that.archivos.length > 0) {
        that.toasterService.success('Solicitud actualizada, Cerrar al finalizar carga de archivos', 'Exito', {timeOut: 8000});
        const storage = that.path + 'commentsFiles';
        that._cargaImagenes.cargarImagenesProjectFirebase( that.archivos, storage, that.source, that.data, date, docRef.id);
      }

      that.formComentar.reset();

    })
    .catch(function(error) {
        console.error('Error adding document: ', error);
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
    if (filevalidation && filevalidation.length > 0 && filevalidation.length <= 3) {
    } else {
      this.archivos = [];
      if (filevalidation && filevalidation.length > 3) {
        this.toasterService.warning('Error: Supero limite de 3 archivos', 'Error', {enableHtml: true, closeButton: true, timeOut: 6000 });
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