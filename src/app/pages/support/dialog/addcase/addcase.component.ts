import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { UserService, CargaImagenesService } from 'src/app/services/service.index';
import { STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { FileItem } from 'src/app/models/types';

// FIREBASE
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, of, Subject, concat } from 'rxjs';
import { FormGroup, Validators, FormControl} from '@angular/forms';

import swal from 'sweetalert';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AngularFireUploadTask } from 'angularfire2/storage';

import * as _moment from 'moment';
import { AngularFireAuth } from 'angularfire2/auth';

//MODEL
import { UserFirebase } from '../../../../models/types';

//MOMENT
const moment = _moment;

@Component({
  selector: 'app-addcase',
  templateUrl: './addcase.component.html',
  styleUrls: ['./addcase.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})

export class AddcaseComponent implements OnInit {

  identity: any;
  isLoading = false;
  forma: FormGroup;
  userLoading = false;
  userinput = new Subject<string>();
  file: FileItem[] = [];
  archivos: FileItem[] = [];
  type: any;
  selectstatus: {id: any; name: any};
  userFirebase: UserFirebase;

  public CARPETA_ARCHIVOS = '';

  Url: string;
  // Main task
  task: AngularFireUploadTask;
  // Progress monitoring
  percentage: Observable<number>;
  snapshot: Observable<any>;

  public departamento$: Observable<any[]>;
  private departamentosCollection: AngularFirestoreCollection<any>;

  public users$: Observable<any[]>;
  private usersCollection: AngularFirestoreCollection<any>;

  public tipo$: Observable<any[]>;
  private tipoCollection: AngularFirestoreCollection<any>;

  public categoria$: Observable<any[]>;
  private categoriaCollection: AngularFirestoreCollection<any>;

  constructor(
    private _afs: AngularFirestore,
    public _cargaImagenes: CargaImagenesService,
    public _userService: UserService,
    public dialogRef: MatDialogRef<AddcaseComponent>,
    private firebaseAuth: AngularFireAuth,
    private toasterService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 

    this.identity = this._userService.getIdentity();
    this.firebaseAuth.authState.subscribe(
      (auth) => {
        if(auth){
          this.userFirebase = auth;
        }
    });
  }

  ngOnInit() {

    this.forma = new FormGroup({
      departamento: new FormControl (null, [Validators.required]),
      tipo: new FormControl ('', [Validators.required]),
      categoria: new FormControl ('', [Validators.required]),
      etiquetado: new FormControl (null),
      asunto: new FormControl (null, [Validators.required, Validators.minLength(1)]),
      descripcion: new FormControl (null, [Validators.required, Validators.minLength(1)])
    });

    this.forma.setValue({
      'departamento': '',
      'tipo': '',
      'categoria': '',
      'etiquetado': '',
      'asunto': '',
      'descripcion': ''
    });

    this.getRouteFirebase();
    this.loadusers();

  }

  public loadusers() {

    this.users$ = concat(
      of(null), // default items
      this.userinput.pipe(
         debounceTime(200),
         distinctUntilChanged(),
         tap(() => this.userLoading = true),
         switchMap(term => this.getListuser(term).pipe(
             catchError(() => of(null)), // empty list on error
             tap(() => this.userLoading = false)
         ))
      )
    );

  }



  public getListuser(term: string) {

    this.usersCollection = this._afs.collection('users', ref => ref.where('country', 'array-contains', this.identity.country).where('email', '>=', term));
    return this.usersCollection.snapshotChanges().pipe(
              map(actions => {
                return actions.map(a => {
                  const data = a.payload.doc.data();
                  const id = a.payload.doc.id;
                  return { id, ...data };
                });
              })
            );
  }

  selectChangedepto(value) {

    if (value) {
      this.tipo$ = null;
      this.categoria$ = null;
      this.selectstatus  = null;
      this.forma.controls['tipo'].setValue('');
      this.forma.controls['categoria'].setValue('');

      this.tipoCollection = this._afs.collection('supporttype', ref => ref.where('depto_id', '==', value.id) );
      this.tipo$ = this.tipoCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );

    } else {
      this.tipo$ = null;
      this.categoria$ = null;
      this.selectstatus = null;
      this.forma.controls['tipo'].setValue('');
      this.forma.controls['categoria'].setValue('');
    }

  }

  selectChangetype(value) {

    if (value) {
      this.categoriaCollection = this._afs.collection('supportcategory', ref => ref.where('type_id', '==', value.id));
      this.categoria$ = this.categoriaCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );


      this._afs.collection('supportstatus' , ref => ref.where('stype_id', '==', value.id).orderBy('order_by', 'asc').limit(1))
      .get()
      .subscribe((data: any) => { if (data.size > 0) {
          data.forEach((doc) => {
            const estatus = doc.data();
            estatus.id = doc.id;
            this.selectstatus = estatus;
              }
            );
          }
        }
      );
    } else {
      this.categoria$ = null;
      this.selectstatus = null;
      this.forma.controls['categoria'].setValue('');
    }


  }

  startUpload(event) {

    const filevalidation = event.target.files;

    if (filevalidation && filevalidation.length > 0 && filevalidation.length <= 3) {
    } else {

      this.archivos = [];

      if (filevalidation && filevalidation.length > 3) {
        this.toasterService.warning('Error: Supero limite de 3 archivos', 'Error', {enableHtml: true, closeButton: true, timeOut: 6000 });
      }

    }

  }

  removeFile(index: number): void {

    if (index >= 0) {
      this.archivos.splice(index, 1);
    }
    if (this.archivos.length === 0) {
      this.archivos = [];
    }

  }

  getRouteFirebase() {

    this.departamentosCollection = this._afs.collection('countries/' + this.identity.country + '/departments');
    this.departamento$ = this.departamentosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

  }

  generatorcasenumber() {
    const random = Math.floor((Math.random() * 100) + 1);
    return moment(new Date()).format('YYYYMMDDHHmmss') + '' + random;
  }

  confirmAdd() {

    const numbercase = this.generatorcasenumber();
    const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    this.CARPETA_ARCHIVOS = 'supportcase/';

    if (this.forma.invalid) {
      swal('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
      return;
    }

    const array_users: [] = this.forma.value.etiquetado;
    const array_usersNew: Array<Object> = [];

    for (let ii = 0; ii < array_users.length; ii++) {
      // const obj: Object = {id: array_users[ii]['id']}; // , email: array_users[ii]['email']
      array_usersNew.push(array_users[ii]['id']);
    }

    const that = this;

    this._afs.collection('supportcase').add({
      ncase: parseInt(numbercase, 0),
      asunto: this.forma.value.asunto,
      description: this.forma.value.descripcion,
      create_to: this.userFirebase.uid,
      create_at: date,
      depto_id: this.forma.value.departamento.id,
      depto_desc: this.forma.value.departamento.name,
      type_id: this.forma.value.tipo.id,
      type_desc: this.forma.value.tipo.name,
      status_id: this.selectstatus.id,
      status_desc: this.selectstatus.name,
      category_id: this.forma.value.categoria.id,
      category_desc: this.forma.value.categoria.name,
      etiquetados: array_usersNew
    })
    .then(function(docRef) {
        console.log('Document written with ID: ', docRef.id);

        if (that.archivos.length > 0) {
          that.toasterService.success('Caso registrado, Cerrar al finalizar carga de archivos', 'Exito', {timeOut: 8000});
          that.CARPETA_ARCHIVOS =  that.CARPETA_ARCHIVOS + docRef.id + '/caseFiles';
          that._cargaImagenes.cargarImagenesFirebase( that.archivos,  that.CARPETA_ARCHIVOS, date);
          that.forma.reset();
          that.tipo$ = null;
          that.categoria$ = null;
          that.selectstatus = null;
        } else {
          that.onNoClick();
          swal('Caso registrado', '', 'success');
        }

    })
    .catch(function(error) {
        console.error('Error adding document: ', error);
    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

