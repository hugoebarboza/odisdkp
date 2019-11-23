import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { FileItem } from 'src/app/models/types';
import { Observable, Subject, defer } from 'rxjs';
import { FormGroup, Validators, FormControl} from '@angular/forms';
import { switchMap, map, combineLatest } from 'rxjs/operators';

// FIREBASE
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireUploadTask } from 'angularfire2/storage';


import Swal from 'sweetalert2';

import { ToastrService } from 'ngx-toastr';

import * as _moment from 'moment';

// MODEL
import { UserFirebase } from 'src/app/models/types';

// MOMENT
const moment = _moment;

// SERVICES
import { CargaImagenesService, CdfService, UserService } from 'src/app/services/service.index';

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
  ncase: any;
  urgencia: any;
  type: any;
  selectstatus: {id: any; name: any; label: any};
  token: any;
  userFirebase: UserFirebase;
  arrayResponsables = [];

  public CARPETA_ARCHIVOS = '';

  Url: string;
  // Main task
  task: AngularFireUploadTask;
  // Progress monitoring
  percentage: Observable<number>;
  snapshot: Observable<any>;

  supportcase = '';
  showlist = false;
  booReport = false;

  idPais = null;

  public departamento$: Observable<any[]>;
  private departamentosCollection: AngularFirestoreCollection<any>;

  public users$: Observable<any[]>;
  // private usersCollection: AngularFirestoreCollection<any>;

  public tagImportant$: Observable<any[]>;
  private tagImportantCollection: AngularFirestoreCollection<any>;

  public tagPais$: Observable<any[]>;
  private tagPaisCollection: AngularFirestoreCollection<any>;

  public tipo$: Observable<any[]>;
  private tipoCollection: AngularFirestoreCollection<any>;

  public categoria$: Observable<any[]>;
  private categoriaCollection: AngularFirestoreCollection<any>;

  limitDay = 0;
  day = 0;
  nota = null;
  categoriaPlazo = null;

  public  categoriaDocumentos$: Observable<any[]>;
  private categoriaDocCollection: AngularFirestoreCollection<any>;

  constructor(
    private _afs: AngularFirestore,
    private _cdf: CdfService,
    public _cargaImagenes: CargaImagenesService,
    public _userService: UserService,
    public dialogRef: MatDialogRef<AddcaseComponent>,
    private firebaseAuth: AngularFireAuth,
    private toasterService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.firebaseAuth.authState.subscribe(
      (auth) => {
        if (auth) {
          this.userFirebase = auth;
          this.getUserReport(this.userFirebase.uid);
        }
    });
  }

  ngOnInit() {

    const date = moment(new Date()).format('DD');
    this.day = parseInt(date, 0);

    this.idPais = this.identity.country + '';

    this.forma = new FormGroup({
      departamento: new FormControl (null, [Validators.required]),
      tipo: new FormControl ('', [Validators.required]),
      categoria: new FormControl ('', [Validators.required]),
      etiquetado: new FormControl ({value: [], disabled: true}),
      asunto: new FormControl (null, [Validators.required, Validators.minLength(1)]),
      descripcion: new FormControl (null, [Validators.required, Validators.minLength(1)]),
      tagImportant: new FormControl ({}),
      tagPais: new FormControl (this.idPais)
    });

    if (this.identity.role >= 8) {
      this.tagPaisCollection = this._afs.collection('countries');
      this.tagPais$ = this.tagPaisCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );

      this.supportcase = 'supportcase/' + this.idPais + '/cases';
      this.getRouteFirebase();

    } else {

      this.changepais(this.idPais);

    }

    // this.loadusers();

  }

  changepais(id) {
    if (id) {
      this.idPais = id;
      this.supportcase = 'supportcase/' + this.idPais + '/cases';
      this.selectChangedepto(null);
      this.forma.controls['departamento'].setValue('');
      this.getRouteFirebase();
    }
  }

  /**
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

    if (term == null) {
      this.userLoading = false;
      return new Observable;
    }

    // tslint:disable-next-line:max-line-length
    this.usersCollection = this._afs.collection('users', ref => ref.where('country', '==', this.idPais).where('email', '>=', term));
    return this.usersCollection.snapshotChanges().pipe(
              map(actions => {
                return actions.map(a => {
                  const data = a.payload.doc.data();
                  const id = a.payload.doc.id;
                  return { id, ...data };
                });
              })
            );
  }*/

  selectChangedepto(value) {

    if (value) {

      if (value.day && value.note && value.day > 0) {
        if (this.day >= value.day) {
          this.nota = value.note;
        }
      } else if (value.day && value.note && value.day === 0) {
        this.nota = value.note;
      } else {
        this.nota = null;
      }

      this.tipo$ = null;
      this.categoria$ = null;
      this.categoriaDocumentos$ = null;
      this.selectstatus  = null;
      this.forma.controls['tipo'].setValue('');
      this.forma.controls['categoria'].setValue('');

      this.tipoCollection = this._afs.collection('supporttype', ref => ref.where('depto_id', '==', value.id).orderBy('name'));
      this.tipo$ = this.tipoCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );

      this._afs.doc('countries/' + this.idPais + '/departments/' + value.id).get()
      .subscribe(async res => {
        if (res.exists) {
          this.arrayResponsables = [];
          if (res.data().admins && res.data().admins.length > 0) {
            this.arrayResponsables = await this.getUserResponsables(res.data().admins);
          }
         } else {
          this.categoria$ = null;
          this.categoriaDocumentos$ = null;
          this.selectstatus  = null;
          this.forma.controls['categoria'].setValue('');
          this.arrayResponsables = [];
         }
      });

    } else {

      this.arrayResponsables = [];
      this.tipo$ = null;
      this.categoria$ = null;
      this.categoriaDocumentos$ = null;
      this.selectstatus = null;
      this.forma.controls['tipo'].setValue('');
      this.forma.controls['categoria'].setValue('');
    }

  }

  getUserReport(id: any) {

    this._afs.doc('users/' + id).get()
    .subscribe(async res => {
      if (res.exists) {
        const data: any = res.data();
        console.log('Inicio');
        console.log(data.report);
        if (data.report) {
          const report: any = data.report;
          const response: any = await this.getUserResponsables(report);
          console.log('response');
          console.log(response);
          console.log('FIN');

          if (response && response.length > 0) {
            this.booReport = true;
            this.forma.controls['etiquetado'].setValue(response);
          }
        }
        }
    });

  }

  async getUserResponsables(uidArray: Array<String>) {

    const arr: any = [];
    for (let i = 0; i < uidArray.length; i++) {
      const user: any = await this.getuser(uidArray[i]);
      if (user && user.exists) {
        console.log('user');
        console.log(user.data());
        arr.push(user.data());
       }
    }
    console.log('return arr');
    return arr;

  }

  async getuser(uid: String) {
     return await this._afs.doc('users/' + uid).get().toPromise().then();
  }


  selectChangetype(value) {

    if (value) {
      this.categoriaDocumentos$ = null;
      this.categoria$ = null;
      this.categoriaPlazo = null;
      this.forma.controls['categoria'].setValue('');

      this.categoriaCollection = this._afs.collection('supportcategory', ref => ref.where('type_id', '==', value.id).orderBy('name'));
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
      this.categoriaDocumentos$ = null;
      this.categoriaPlazo = null;
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

  selectChangeCategoria(value) {

    if (value && value.plazo) {
      this.categoriaPlazo = value.plazo;
    } else {
      this.categoriaPlazo = null;
    }

    this.categoriaDocCollection = this._afs.collection('supportcategory/' + value.id + '/documentos', ref => ref.orderBy('name'));
      this.categoriaDocumentos$ = this.categoriaDocCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
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

  getRouteFirebase() {

    this.departamentosCollection = this._afs.collection('countries/' + this.idPais + '/departments', ref => ref.orderBy('name', 'asc'));
    this.departamento$ = this.departamentosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

    // const that = this;
    // tslint:disable-next-line:max-line-length
    this.tagImportantCollection = this._afs.collection('supportImportant/' + this.idPais + '/tag', ref => ref.orderBy('order_by', 'asc'));
    this.tagImportant$ = this.tagImportantCollection.snapshotChanges().pipe(
      map(actions => {
        let count = 1;
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          if (count === 1 ) {
            this.forma.controls.tagImportant.setValue({ id, ...data });
          }
          count = count + 1;
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
    this.ncase = numbercase;
    const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    this.CARPETA_ARCHIVOS = this.supportcase;

    if (this.forma.invalid) {
      Swal.fire('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
      return;
    }

    /**
    const array_users: [] = this.forma.value.etiquetado;
    const array_usersNew: Array<Object> = [];
    const array_usersInfo = [];

    console.log(array_users);

    for (let ii = 0; ii < array_users.length; ii++) {
      // const obj: Object = {id: array_users[ii]['id']}; // , email: array_users[ii]['email']
      array_usersNew.push(array_users[ii]['id']);
      array_usersInfo.push(array_users[ii]);
    }
    */

   const arrayEtiquetados = [];
   const arrayReportar: [] = this.forma.getRawValue().etiquetado;
   console.log(this.forma.value);
   console.log('arrayReportar');
   console.log(arrayReportar);

   for (let i = 0; i < arrayReportar.length; i++) {
    arrayEtiquetados.push(arrayReportar[i]['uid']);
    console.log(arrayReportar[i]);
   }

   console.log(arrayEtiquetados);

    let important = '';
    let important_id = '';

    if (this.forma.value.tagImportant) {
      important = this.forma.value.tagImportant.name;
      important_id = this.forma.value.tagImportant.id;
      this.urgencia = this.forma.value.tagImportant.name;
    }

    const that = this;

    const indexasunto = this.forma.value.asunto.toLowerCase();

    this._afs.collection(this.supportcase).add({
      ncase: parseInt(numbercase, 0),
      asunto: this.forma.value.asunto,
      description: this.forma.value.descripcion,
      create_to: this.userFirebase.uid,
      create_at: date,
      update_at: date,
      depto_id: this.forma.value.departamento.id,
      depto_desc: this.forma.value.departamento.name,
      type_id: this.forma.value.tipo.id,
      type_desc: this.forma.value.tipo.name,
      status_id: this.selectstatus.id,
      status_desc: this.selectstatus.name,
      label: this.selectstatus.label,
      category_id: this.forma.value.categoria.id,
      category_desc: this.forma.value.categoria.name,
      important: important,
      important_id: important_id,
      etiquetados: arrayEtiquetados,
      asuntoIndex: indexasunto.split(' ')
    })
    .then(function(docRef) {
        // console.log('Document written with ID: ', docRef.id);

        if (that.archivos.length > 0) {
          that.toasterService.success('Solicitud registrada, Cerrar al finalizar carga de archivos', 'Exito', {timeOut: 8000});
          that.CARPETA_ARCHIVOS =  that.CARPETA_ARCHIVOS + '/' + docRef.id + '/caseFiles';
          that._cargaImagenes.cargarImagenesFirebase( that.archivos,  that.CARPETA_ARCHIVOS, date);
          // that.forma.reset();
          that.tipo$ = null;
          that.categoria$ = null;
          that.selectstatus = null;
        }

        that.onNoClick();
        Swal.fire('Solicitud registrada', '', 'success');


        if (arrayReportar && arrayReportar.length > 0 && docRef) {
          arrayReportar.forEach(res => {
            console.log('PASOOOOOO -> ');
            console.log(res);
            that.sendCdfTag(res, docRef, 'Etiquetado(a) en');
          });
        }

        if (that.arrayResponsables && that.arrayResponsables.length > 0 && docRef) {
          that.arrayResponsables.forEach(res => {
            that.sendCdfTag(res, docRef, 'Nueva solicitud');
          });
        }

        if (that.userFirebase && docRef) {
          // console.log(that.userFirebase);
          that.sendCdfUser(that.userFirebase, docRef, 'Nueva solicitud');
        }

    })
    .catch(function(error) {
        console.error('Error adding document: ', error);
    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }




  sendCdfTag(data, element, content) {
    if (!data) {
      return;
    }

    // console.log(data);

    console.log(content);

    // tslint:disable-next-line:max-line-length
    const body = content + '. El número de solicitud es #' + this.ncase + '. Asunto: ' + this.forma.value.asunto + ', con Descripción: ' + this.forma.value.descripcion + ' y Prioridad: ' + this.urgencia;
    const created = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    if (data && this.userFirebase.uid) {

        const notification = {
          userId: this.userFirebase.uid,
          userIdTo: data.uid,
          title: 'Nueva solicitud',
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



          this._cdf.httpEmailToSupport(this.token.token, data.email, this.userFirebase.email, 'OCA GLOBAL - Nueva solicitud #' + this.ncase, created, body).subscribe(
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


  sendCdfUser(data, element, _content) {
    if (!data) {
      return;
    }

    // console.log(data);

    // tslint:disable-next-line:max-line-length
    const body = 'El número de solicitud es #' + this.ncase + '. Asunto: ' + this.forma.value.asunto + ', con Descripción: ' + this.forma.value.descripcion + ' y Prioridad: ' + this.urgencia;
    const created = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    if (data && this.userFirebase.uid) {
        const notification = {
          userId: this.userFirebase.uid,
          userIdTo: this.userFirebase.uid,
          title: 'Nueva solicitud',
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


          this._cdf.httpEmailFromOrigin(this.token.token, this.userFirebase.email, this.userFirebase.email, 'OCA GLOBAL - Nueva solicitud #' + this.ncase, created, body)
          .subscribe(
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
