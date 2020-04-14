import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { UserService, CargaImagenesService, CdfService } from 'src/app/services/service.index';
import { ToastrService } from 'ngx-toastr';
import { FileItem, UserFirebase } from 'src/app/models/types';
import { defer, combineLatest, Observable, Subject, concat } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { distinctUntilChanged, tap, switchMap, catchError, debounceTime, map, takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import * as _moment from 'moment';
const moment = _moment;

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.css']
})

export class ShowcaseComponent implements OnInit {

  @ViewChild( CdkVirtualScrollViewport,  { static: false } ) viewport: CdkVirtualScrollViewport;

  datacase: any;
  destroy = new Subject();
  identity: any;
  array_usersInfo = [];
  userinput = new Subject<string>();
  isLoading = true;
  userLoading = false;
  totalRegistros = 0;
  page = 1;
  pageSize = 2;
  limit = 2;
  resultCount = 0;
  title = 'Soporte';
  token: any;
  countEtiq = false;

  formComentar: FormGroup;
  userFirebase: UserFirebase;

  checkedToggle = false;

  // FILE

  file: FileItem[] = [];
  archivos: FileItem[] = [];
  archivosTem: Array<number> = [];

  arrayResponsables = [];

  public CARPETA_ARCHIVOS = '';


  infocaso$: any;
  supportcase = 'supportcase';

  public caso$: Observable<any>;

  public estatus$: Observable<any[]>;

  public documentos$: Observable<any[]>;
  private documentosCollection: AngularFirestoreCollection<any>;

  public users$: Observable<any[]>;
  private usersCollection: AngularFirestoreCollection<any>;

  public comentarios$: Observable<any[]>;
  private comentariosCollection: AngularFirestoreCollection<any>;

  public actividad$: Observable<any[]>;
  public actividadCollection: AngularFirestoreCollection<any>;

  public arrayEtiquetados = [];
  public arrayEtiquetadosDefault = [];

  constructor(
    private _afs: AngularFirestore,
    private _cdf: CdfService,
    public _cargaImagenes: CargaImagenesService,
    public _userService: UserService,
    private firebaseAuth: AngularFireAuth,
    private toasterService: ToastrService,
    public dialogRef: MatDialogRef<ShowcaseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.supportcase = this.supportcase + '/' + this.data.pais + '/cases';
      this.page = 1;
      this.pageSize = 2;

      this.firebaseAuth.authState
      .pipe(
        takeUntil(this.destroy),
      )
      .subscribe(
        (auth) => {
          if (auth) {
            this.userFirebase = auth;
          }
      });
     }

  ngOnInit() {

    if (this.data) {

      this.formComentar = new FormGroup({
        comentario: new FormControl ('', [Validators.required]),
      });

      this.formComentar.setValue({
        'comentario': ''
      });

      // console.log(this.data.id);

      this.documentosCollection = this._afs.collection(this.supportcase + '/' + this.data.id + '/caseFiles');
      this.documentos$ = this.documentosCollection.snapshotChanges()
        .map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        });


      this._afs.doc(this.supportcase + '/' + this.data.id).get().subscribe(
        res => {
          if (res.exists) {
            this.arrayEtiquetados = [];
            this.arrayEtiquetadosDefault = [];
            this.datacase = res.data();
            const docData = res.data();
            // console.log(docData.etiquetados);
            // console.log(this.datacase);
            // docData.etiquetados = this.getUserInfo(docData.etiquetados);
            if (docData.etiquetados) {
              docData.etiquetados = this.getUserInfo(docData.etiquetados);
            }
            this.collectionJoin(of(docData));
            // Do something with doc data
           } else {
            this.infocaso$ = null;
            console.log('Document does not exist');
           }
        }
      );

      this._afs.doc('countries/' + this.data.pais + '/departments/' + this.data.depto_id).get()
        .subscribe(res => {
          if (res.exists) {
            this.arrayResponsables = [];
            // res.data();
            // console.log(res.data());
            if (res.data().admins && res.data().admins.length > 0) {
              // console.log(res.data().admins);
              this.arrayResponsables = this.getUserResponsables(res.data().admins);
            }
           } else {
            this.arrayResponsables = [];
            console.log('Document does not exist');
           }
        });


      // tslint:disable-next-line:max-line-length
      this.comentariosCollection = this._afs.collection(this.supportcase + '/' + this.data.id + '/comments', ref => ref.orderBy('create_at', 'desc'));
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
            this.collectionJoinUser(of(collection));
          }
        }
      );

      // tslint:disable-next-line:max-line-length
      this.actividadCollection = this._afs.collection(this.supportcase + '/' + this.data.id + '/activity', ref => ref.orderBy('create_at', 'desc'));
      this.actividadCollection.snapshotChanges().pipe(
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
            this.actividad$ = null;
          } else {
            this.collectionJoinUserActivity(of(collection));
          }
        }
      );

      this.loadusers();

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

  onChangeToggle(ob: MatSlideToggleChange) {
    // console.log(ob.checked);
    this.checkedToggle = ob.checked;

  }

  etiquetadosChanged(number) {

    const that = this;

    if (number === 0) {
      this.arrayEtiquetados = this.arrayEtiquetadosDefault;
      this.checkedToggle = false;
      return;
    }

    let cc = '';
    const arr: any = [];

    for (let i = 0; i < this.arrayEtiquetados.length; i++) {
        arr.push(this.arrayEtiquetados[i].uid);
        cc = cc +  this.arrayEtiquetados[i].email + '; ';
    }

    if (arr) {
      this.array_usersInfo = this.arrayEtiquetados.filter(value =>
        !this.arrayEtiquetadosDefault.some(element =>
          element.uid === value.uid
        )
      );
    }

    this.arrayEtiquetadosDefault = this.arrayEtiquetados;
    this.checkedToggle = false;

    const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    if (arr.length > 0) {
      this._afs.collection(this.supportcase + '/' + this.data.id + '/activity').add({
        create_to: this.userFirebase.uid,
        create_at: date,
        comentario: 'Actualizó etiquetados a ' + cc
      });
    } else {
      this._afs.collection(this.supportcase + '/' + this.data.id + '/activity').add({
        create_to: this.userFirebase.uid,
        create_at: date,
        comentario: 'Elimino etiquetados'
      });
    }

    this._afs.doc(this.supportcase + '/' + this.data.id).update({update_at: date});
    this._afs.doc(this.supportcase + '/' + this.data.id).update({etiquetados: arr})
    .then(function(_docRef) {
       if (that.array_usersInfo && that.array_usersInfo.length > 0) {
        that.array_usersInfo.forEach(res => {
          // console.log(element);
          that.sendCdfTag(res, that.data, 'Etiquetado(a) en');
        });
      }
    })
    .catch(function(error) {
      console.error('Error updating document: ', error);
    });
  }

  removeFile(index: number): void {

    if (index >= 0) {
      this.archivos.splice(index, 1);
    }
    if (this.archivos.length === 0) {
      this.archivos = [];
    }

  }

  getUserResponsables(to): Array<any> {

    const arr: any = [];
    for (let ii = 0; ii < to.length; ii++) {

      this._afs.doc('users/' + to[ii]).get()
      .subscribe(res => {
        if (res.exists) {
          // console.log(res.data());
          arr.push(res.data());
         }
      });
    }
    return arr;
  }

  getUserInfo(to): Array<any> {

    const arr: any = [];
    for (let ii = 0; ii < to.length; ii++) {
      this.documentJoin(of({id: to[ii]})).subscribe(res => {
        res.etiquetado.disabled = true;
        // console.log(res);
        this.arrayEtiquetadosDefault.push(res.etiquetado);
        this.arrayEtiquetados.push(res.etiquetado);
        arr.push(res.etiquetado);
      });
    }
    return arr;

  }

  documentJoin(document): Observable<any> {
    //  console.log(document);
    return document.pipe(
      docJoin(this._afs, { id: 'users'},  2, '', '', 'etiquetado', '', ''),
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

    if (term == null) {
      this.userLoading = false;
      return new Observable;
    }


    this.usersCollection = this._afs.collection('users', ref => ref.where('email', '>=', term));
    return this.usersCollection.snapshotChanges().pipe(
              map(actions => {
                return actions.map(a => {
                  const data = a.payload.doc.data();
                  const _id = a.payload.doc.id;

                  for (let i = 0; i < this.arrayEtiquetadosDefault.length; i++) {
                    if (this.arrayEtiquetadosDefault[i]['uid'] === _id ) {
                      data.disabled = true;
                    }
                  }
                  return { _id, ...data };
                });
              })
    );

  }

  collectionJoin(document): Observable<any> {
    this.isLoading = false;
    return this.infocaso$ = document.pipe(
      docJoin(this._afs, { create_to: 'users'},  0, '', '', 'create_to', '', ''),
      // docJoin(this._afs, { depto_id: 'countries/' + 1 + '/departments'},  0, '', '', 'depto_id'),
      // docJoin(this._afs, { type_id: 'supporttype'},  0, '', '', 'typeselect'),
      // docJoin(this._afs, { category_id: 'supportcategory'},  0, '', '', 'category_id'),
      docJoin(this._afs, { type_id: 'supportstatus'} , 3, 'stype_id', '==', 'supportstatus', 'order_by', 'asc'),
    );
  }

  collectionJoinUserActivity(document): Observable<any> {
    return this.actividad$ = document.pipe(
      leftJoin(this._afs, 'create_to', 'users', 0, '', '', 'usercomment'),
      leftJoin(this._afs, 'id', this.supportcase + '/' + this.data.id + '/commentsFiles', 1, 'id_case', '==', 'adjuntos')
    );
  }

  collectionJoinUser(document): Observable<any> {
    return this.comentarios$ = document.pipe(
      leftJoin(this._afs, 'create_to', 'users', 0, '', '', 'usercomment'),
      leftJoin(this._afs, 'id', this.supportcase + '/' + this.data.id + '/commentsFiles', 1, 'id_case', '==', 'adjuntos')
    );
  }

  ngChangeEstatus(value) {
   // console.log(value);
    const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    this._afs.doc(this.supportcase + '/' + this.data.id).update({update_at: date});
    this._afs.doc(this.supportcase + '/' + this.data.id).update({status_id: value._iddoc, status_desc: value.name, label: value.label});
    this._afs.collection(this.supportcase + '/' + this.data.id + '/activity').add({
      create_to: this.userFirebase.uid,
      create_at: date,
      comentario: 'Actualizó estado a ' + value.name
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addComentario() {

    const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    this.CARPETA_ARCHIVOS = this.supportcase + '/';

    if (this.formComentar.invalid ) {
      Swal.fire('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
      return;
    }

    const that = this;
    this._afs.doc(this.supportcase + '/' + this.data.id).update({update_at: date});
    this._afs.collection(this.supportcase + '/' + this.data.id + '/comments').add({
      create_to: this.userFirebase.uid,
      create_at: date,
      comentario: this.formComentar.value.comentario
    })
    .then(function(docRef) {

      const comment = that.formComentar.value.comentario;

        if (that.arrayEtiquetadosDefault && that.arrayEtiquetadosDefault.length > 0 && docRef) {
          that.arrayEtiquetadosDefault.forEach(res => {
            that.sendCdfUser(res, docRef, 'Comentario ', comment);
          });
        }

        if (that.arrayResponsables && that.arrayResponsables.length > 0 && docRef) {
          that.arrayResponsables.forEach(res => {
            that.sendCdfUser(res, docRef, 'Comentario ', comment);
          });
        }

        if (that.datacase) {

          that._afs.doc('users/' + that.datacase.create_to).get().subscribe(
            res => {
              if (res.exists) {
                  that.sendCdfUserOrigin(res.data(), docRef, 'Comentario ', comment);
               }
            }
          );

        }

        // console.log('Document written with ID: ', docRef.id);
        if (that.archivos.length > 0) {
          that.toasterService.success('Solicitud actualizada, Cerrar al finalizar carga de archivos', 'Exito', {timeOut: 8000});
          that.CARPETA_ARCHIVOS =  that.CARPETA_ARCHIVOS + that.data.id + '/commentsFiles';
          that._cargaImagenes.cargarImagenesFirebase( that.archivos,  that.CARPETA_ARCHIVOS, date, docRef.id);
        }

        that.formComentar.reset();

    })
    .catch(function(error) {
        console.error('Error adding document: ', error);
    });


  }

  sendCdfTag(data, element, content) {
    if (!data) {
      return;
    }
    // tslint:disable-next-line:max-line-length
    const body = content + ' solicitud #' + this.datacase.ncase + ', Asunto: ' + this.datacase.asunto + ', con Descripción: ' + this.datacase.description + ' y Prioridad: ' + this.datacase.important;
    const created = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    if (data && this.userFirebase.uid) {

        const notification = {
          userId: this.userFirebase.uid,
          userIdTo: data.uid,
          title: 'Etiquetado en solicitud',
          message: body,
          create_at: created,
          status: '1',
          idUx: element.id,
          descriptionidUx: 'cases',
          routeidUx: `${this.supportcase}`
        };

        this._cdf.fcmsend(this.token.token, notification).subscribe(
          response => {
            if (!response) {
            return false;
            }
            if (response.status === 200) {
              // console.log(response);
            }
          },
            error => {
            console.log(<any>error);
            }
          );

          const msg = {
            toEmail: data.email,
            fromTo: this.userFirebase.email,
            subject: 'OCA GLOBAL - Etiquetado en solicitud #' + this.datacase.ncase,
            // tslint:disable-next-line:max-line-length
            message: `<strong>Hola ${data.name} ${data.surname}. <hr> <div>&nbsp;</div> Ha sido etiquetado en solicitud, enviada a las ${created} por ${this.userFirebase.email}</strong><div>&nbsp;</div> <div> ${body}</div>`,
          };

          this._cdf.httpEmail(this.token.token, msg).subscribe(
            response => {
              if (!response) {
              return false;
              }
              if (response.status === 200) {
                // console.log(response);
              }
            },
              error => {
              console.log(<any>error);
              }
            );
      }

    }

    sendCdfUser(data, element, _content, comment) {
      if (!data) {
        return;
      }

      // console.log(element);
      // console.log(data);
      // tslint:disable-next-line:max-line-length
      const body = 'Comentario solicitud #' + this.datacase.ncase + ', Asunto: ' + this.datacase.asunto + ', y Comentario: ' + comment ;
      const created = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

      if (data && this.userFirebase.uid) {

          const notification = {
            userId: this.userFirebase.uid,
            userIdTo: data.uid,
            title: 'Comentario solicitud',
            message: body,
            create_at: created,
            status: '1',
            idUx: element.id,
            descriptionidUx: 'cases',
            routeidUx: `${this.supportcase}`
          };

          this._cdf.fcmsend(this.token.token, notification).subscribe(
            response => {
              if (!response) {
              return false;
              }
              if (response.status === 200) {
                // console.log(response);
              }
            },
              error => {
              console.log(<any>error);
              }
            );


            this._cdf.httpEmailCommentToSupport(this.token.token, data.email, this.userFirebase.email, 'OCA GLOBAL - Comentario solicitud #' + this.datacase.ncase, created, body).subscribe(
              response => {
                if (!response) {
                return false;
                }
                if (response.status === 200) {
                  // console.log(response);
                }
              },
                error => {
                console.log(<any>error);
                }
              );

        }

      }

      sendCdfUserOrigin(data, element, _content, comment) {
        if (!data) {
          return;
        }
        // console.log(element);
        // console.log(data);
        // tslint:disable-next-line:max-line-length
        const body =  'Solicitud #' + this.datacase.ncase + ', Asunto: ' + this.datacase.asunto + ', con Descripción: ' + this.datacase.description + ' y Prioridad: ' + this.datacase.important;
        const bodycomment = 'Comentario solicitud #' + this.datacase.ncase + ', y Comentario: ' + comment ;
        const created = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

        if (data && this.userFirebase.uid) {

          const notification = {
              userId: this.userFirebase.uid,
              userIdTo: data.uid,
              title: 'Comentario solicitud',
              message: body,
              create_at: created,
              status: '1',
              idUx: element.id,
              descriptionidUx: 'cases',
              routeidUx: `${this.supportcase}`
            };

            this._cdf.fcmsend(this.token.token, notification).subscribe(
              response => {
                if (!response) {
                return false;
                }
                if (response.status === 200) {
                  // console.log(response);
                }
              },
                error => {
                console.log(<any>error);
                }
              );

              this._cdf.httpEmailCommentFromOrigin(this.token.token, data.email, this.userFirebase.email, 'OCA GLOBAL - Comentario solicitud #' + this.datacase.ncase, this.datacase.create_at, created, body, bodycomment).subscribe(
                response => {
                  if (!response) {
                  return false;
                  }
                  if (response.status === 200) {
                    // console.log(response);
                  }
                },
                  error => {
                  console.log(<any>error);
                  }
                );
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
      // let totalJoins: number;

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

export const docJoin = (
  afs: AngularFirestore,
  paths: { [key: string]: string },
  type: number,
  where: string,
  condition,
  nameObject,
  order_by,
  direction
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
                    return { _iddoc, ...datos as {}};
                  });
                })
                );
            }

            if (type === 3) {
              // tslint:disable-next-line:max-line-length
              return afs.collection(`${paths[k]}`, ref => ref.where( where, condition, `${parent[k]}`).orderBy(order_by, direction)).snapshotChanges().pipe(
                map(actions => {
                  return actions.map(a => {
                    const datos = a.payload.doc.data();
                    const _iddoc = a.payload.doc.id;
                    return { _iddoc, ...datos as {}};
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
          const joins = keys.reduce((acc, _cur, idx) => {
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
