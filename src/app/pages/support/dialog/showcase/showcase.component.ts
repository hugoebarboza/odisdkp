import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { UserService, CargaImagenesService } from 'src/app/services/service.index';
import { ToastrService } from 'ngx-toastr';
import { Proyecto, FileItem } from 'src/app/models/types';
import { defer, combineLatest, Observable, Subject, of, concat } from 'rxjs';
import { distinctUntilChanged, tap, switchMap, catchError, debounceTime, map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import * as _moment from 'moment';
const moment = _moment;

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.css']
})

export class ShowcaseComponent implements OnInit {

  @ViewChild( CdkVirtualScrollViewport,  { static: false } ) viewport: CdkVirtualScrollViewport;

  identity: any;
  proyectos: Array<Proyecto> = [];
  userinput = new Subject<string>();
  isLoading = false;
  userLoading = false;
  totalRegistros = 0;
  page = 1;
  pageSize = 2;
  limit = 2;
  resultCount = 0;
  title = 'Soporte';
  countEtiq = false;

  formComentar: FormGroup;

  // FILE

  file: FileItem[] = [];
  archivos: FileItem[] = [];
  archivosTem: Array<number> = [];

  public CARPETA_ARCHIVOS = '';


  infocaso$: any;

  public caso$: Observable<any>;

  public estatus$: Observable<any[]>;

  public documentos$: Observable<any[]>;
  private documentosCollection: AngularFirestoreCollection<any>;

  public users$: Observable<any[]>;
  private usersCollection: AngularFirestoreCollection<any>;

  private comentariosCollection: AngularFirestoreCollection<any>;

  public comentarios$: Observable<any[]>;

  constructor(
    private _afs: AngularFirestore,
    public _userService: UserService,
    private toasterService: ToastrService,
    public _cargaImagenes: CargaImagenesService,
    public dialogRef: MatDialogRef<ShowcaseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.identity = this._userService.getIdentity();
      this.proyectos = this._userService.getProyectos();
      this.page = 1;
      this.pageSize = 2;
     }

  ngOnInit() {

    this.formComentar = new FormGroup({
      comentario: new FormControl ('', [Validators.required]),
    });

    this.formComentar.setValue({
      'comentario': ''
    });

    this.documentosCollection = this._afs.collection('supportcase/' + this.data.id + '/caseFiles');
    this.documentos$ = this.documentosCollection.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      });

    /*
    this.casosDocument = this._afs.doc('supportcase/' + this.data.id);
    this.casosDocument.valueChanges().subscribe( (document: any) => {
        const count = Object.keys(document).length;
        if (count === 0) {
          this.infocaso$ = null;
        } else {
          document.to = this.getUserInfo(document.to);
          this.collectionJoin(Observable.of(document));
        }
      }
    );/*/

    this._afs.doc('supportcase/' + this.data.id).get().subscribe(
      res => {
        if (res.exists) {
            const docData = res.data();
            docData.etiquetados = this.getUserInfo(docData.etiquetados);
            this.collectionJoin(Observable.of(docData));
            // Do something with doc data
         } else {
          this.infocaso$ = null;
          console.log('Document does not exist');
         }
      }
    );


    // tslint:disable-next-line:max-line-length
    this.comentariosCollection = this._afs.collection('supportcase/' + this.data.id + '/comments', ref => ref.orderBy('create_at', 'desc'));
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

    this.loadusers();

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

  etiquetadosChanged(event) {

    const arr: any = [];
    for (let i = 0; i < event.length; i++) {
        arr.push(event[i]._id);
    }
    this._afs.doc('supportcase/' + this.data.id).update({etiquetados: arr});

  }

  removeFile(index: number): void {

    if (index >= 0) {
      this.archivos.splice(index, 1);
    }
    if (this.archivos.length === 0) {
      this.archivos = [];
    }

  }

  /*
  removeAllFile(index: number): void {

    if (this.archivosTem.length > 0) {
      let bandera = false;

      for (let i = 0; i < this.archivosTem.length; i++) {
        if (this.archivosTem[i] === index) {
            bandera = true;
        }
      }

      if (!bandera) {
        this.archivosTem.push(index);
        if (this.archivosTem.length === this.archivos.length) {
            this.archivos = [];
        }
      }
    } else {
      this.archivosTem.push(index);
      if (this.archivosTem.length === this.archivos.length) {
          this.archivos = [];
      }
    }

  }*/

  getUserInfo(to): Array<any> {

    const arr: any = [];
    for (let ii = 0; ii < to.length; ii++) {
      this.documentJoin(Observable.of({id: to[ii]})).subscribe(res => {
        console.log(res);
        arr.push(res.etiquetado);
      });
    }
    return arr;
  }

  documentJoin(document): Observable<any> {
    return document.pipe(
      docJoin(this._afs, { id: 'users'},  2, '', '', 'etiquetado'),
    );
  }

  loadusers() {

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

  getListuser(term: string) {

    this.usersCollection = this._afs.collection('users', ref => ref.where('email', '>=', term));
    return this.usersCollection.snapshotChanges().pipe(
              map(actions => {
                return actions.map(a => {
                  const data = a.payload.doc.data();
                  const _id = a.payload.doc.id;
                  return { _id, ...data };
                });
              })
    );

  }

  collectionJoin(document): Observable<any> {
    return this.infocaso$ = document.pipe(
      docJoin(this._afs, { create_to: 'users'},  0, '', '', 'create_to'),
      // docJoin(this._afs, { depto_id: 'countries/' + 1 + '/departments'},  0, '', '', 'depto_id'),
      // docJoin(this._afs, { type_id: 'supporttype'},  0, '', '', 'typeselect'),
      // docJoin(this._afs, { category_id: 'supportcategory'},  0, '', '', 'category_id'),
      docJoin(this._afs, { type_id: 'supportstatus'} , 1, 'stype_id', '==', 'supportstatus'),
    );
  }


  collectionJoinUser(document): Observable<any> {
    return this.comentarios$ = document.pipe(
      leftJoin(this._afs, 'create_to', 'users', 0, '', '', 'usercomment'),
      leftJoin(this._afs, 'id', 'supportcase/' + this.data.id + '/commentsFiles', 1, 'id_case', '==', 'adjuntos')
    );
  }

  ngChangeEstatus(value) {
    console.log(value);
    this._afs.doc('supportcase/' + this.data.id).update({status_id: value._iddoc, status_desc: value.name});
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addComentario() {

    const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    this.CARPETA_ARCHIVOS = 'supportcase/';

    if (this.formComentar.invalid ) {
      swal('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
      return;
    }

    const that = this;

    this._afs.collection('supportcase/' + this.data.id + '/comments').add({
      create_to: 'jZFGCO1vsjSvkXb6GJQG',
      create_at: date,
      comentario: this.formComentar.value.comentario
    })
    .then(function(docRef) {
        // console.log('Document written with ID: ', docRef.id);
        if (that.archivos.length > 0) {
          that.toasterService.success('Caso registrado, Cerrar al finalizar carga de archivos', 'Exito', {timeOut: 8000});
          that.CARPETA_ARCHIVOS =  that.CARPETA_ARCHIVOS + that.data.id + '/commentsFiles';
          that._cargaImagenes.cargarImagenesFirebase( that.archivos,  that.CARPETA_ARCHIVOS, date, docRef.id);
          that.formComentar.reset();
        } else {
          that.formComentar.reset();
          // that.onNoClick();
          // swal('Comentado registrado', '', 'success');
        }

    })
    .catch(function(error) {
        console.error('Error adding document: ', error);
    });

  }

}

/**
export interface Caso {
  id: any;
  depto_id: any;
  type_id: any;
  category_id: any;
  topic_id: string;
  description_id: string;
  to_id: any;
  departamento: any;
  tipo: any;
  create_to: any;
}

export interface Estatus {
  id: any;
  name: string;
}

export interface Users {
  id: any;
  name: string;
  surname: string;
  email: string;
}

export interface Comentarios {
  id: any;
  create_to: any;
  create_at: string;
  comentario: string;
  adjuntos: any;
}

export interface Departamento {
  _id: string;
  nombre: string;
  created: string;
  type: string;
  url: string;
}

export interface Tipo {
  _id: string;
  name: string;
}

export interface Documentos {
  _id: string;
  name: string;
}
*/
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

export const docJoin = (
  afs: AngularFirestore,
  paths: { [key: string]: string },
  type: number,
  where: string,
  condition,
  nameObject
) => {
  return source =>
    defer(() => {
      let parent;
      const keys = Object.keys(paths);
      let _id = '';

      return source.pipe(
        switchMap(data => {
          // Save the parent data state
          parent = data;
          // Map each path to an Observable
          const docs$ = keys.map(k => {
            const fullPath = `${paths[k]}/${parent[k]}`;
            _id = parent[k];

            if (type === 0 || type === 2) {
              return afs.doc(fullPath).valueChanges();
            }

            if (type === 1) {
              // tslint:disable-next-line:max-line-length
              return afs.collection(`${paths[k]}`, ref => ref.where( where, condition, `${parent[k]}`)).snapshotChanges().pipe(
                map(actions => {
                  return actions.map(a => {
                    const datos = a.payload.doc.data();
                    const _iddoc = a.payload.doc.id;
                    return { _iddoc, ...datos };
                  });
                })
                );
            }

          });

          // return combineLatest, it waits for all reads to finish
          return combineLatest(docs$);
        }),
        map(arr => {

          // We now have all the associated douments
          // Reduce them to a single object based on the parent's keys
          const joins = keys.reduce((acc, cur, idx) => {
            if (type === 0) {
              arr[idx] = Object.assign(arr[idx], {'_id': _id});
            }
            // cur nombre valor entrada que tiene ID
            return { ...acc, [nameObject]: arr[idx] };

          }, {});

          // Return the parent doc with the joined objects
          return { ...parent, ...joins };
        })
      );
    });
};
