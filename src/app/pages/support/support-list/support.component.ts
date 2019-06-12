import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Proyecto } from 'src/app/models/types';
import { UserService } from 'src/app/services/service.index';
import { AddcaseComponent } from '../dialog/addcase/addcase.component';
import { MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Observable, combineLatest, defer, of, fromEvent } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore} from 'angularfire2/firestore';
import { switchMap, map, tap, debounceTime } from 'rxjs/operators';
import { ShowcaseComponent } from '../dialog/showcase/showcase.component';
import { FormGroup} from '@angular/forms';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserFirebase } from '../../../models/types';

declare var swal: any;

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

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})

export class SupportComponent implements OnInit, AfterViewInit   {

  @ViewChild('asuntoinput', { static: false }) asuntoinput: ElementRef;
  @ViewChild('numbercaseinput', { static: false }) numbercaseinput: ElementRef;
  @ViewChild('statusinput', { static: false }) statusinput: ElementRef;

  identity: any;
  proyectos: Array<Proyecto> = [];
  isLoading = false;
  page = 1;
  pageSize = 2;
  limit = 2;
  resultCount = 0;
  title = 'Soporte';
  joined$: any;
  that = this;
  lastdate = null;
  selectedDepto = '';
  userFirebase: UserFirebase;

  departamentos = [];
  radioOpciones;
  radioselect = 1;

  where;
  condition;
  _id;
  myFormRadio: FormGroup;

  public casosCollection: AngularFirestoreCollection<any>;
  public casosCollectionPagination: AngularFirestoreCollection<any>;

  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['ncase', 'asunto', 'departments', 'supporttype', 'supportcategory', 'users', 'create_at', 'supportstatus', 'accions'];
  dataSource = new MatTableDataSource();

  constructor(
    private _afs: AngularFirestore,
    public _userService: UserService,
    private firebaseAuth: AngularFireAuth,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.page = 1;
    this.pageSize = 2;

  
   }

  ngAfterViewInit() {

    fromEvent(this.asuntoinput.nativeElement, 'keyup')
      .pipe(
        map((k: any) => k.target.value),
        debounceTime(300),
      ).subscribe(val => {
      console.log(val);
      if (val !== '') {
        this.isLoading = false;
        this.statusinput.nativeElement.value = '';
        this.numbercaseinput.nativeElement.value = '';
        this.getCasesStatus(val, 'asunto');
      }
    });

    fromEvent(this.numbercaseinput.nativeElement, 'keyup')
      .pipe(
        map((k: any) => k.target.value),
        debounceTime(300),
      ).subscribe(val => {
      console.log(val);
      if (val !== '') {
        this.isLoading = false;
        this.asuntoinput.nativeElement.value = '';
        this.statusinput.nativeElement.value = '';
        this.getCasesStatus(parseInt(val, 0), 'ncase');
      }
    });

    fromEvent(this.statusinput.nativeElement, 'keyup')
      .pipe(
        map((k: any) => k.target.value),
        debounceTime(300),
      ).subscribe(val => {
        console.log(val);
        if (val !== '') {
          this.isLoading = false;
          this.asuntoinput.nativeElement.value = '';
          this.numbercaseinput.nativeElement.value = '';
          this.getCasesStatus(val, 'status_desc');
        }
    });

  }

  getCasesStatus(term: any, value: string) {

    this.joined$ = null;

    if(!this.userFirebase){
      return;
    }

    if (this.radioselect === 1) {
      // tslint:disable-next-line:max-line-length
      this.casosCollection = this._afs.collection('supportcase', ref => ref.where('create_to', '==', this.userFirebase.uid).where(value, '>=', term)
      .orderBy(value, 'desc').orderBy('create_at', 'desc').limit(this.limit));
      this.where = 'create_to';
      this.condition = '==';
      this._id =  this.userFirebase.uid;
    }

    if (this.radioselect === 2) {
      // tslint:disable-next-line:max-line-length
      this.casosCollection  =  this._afs.collection('supportcase', ref => ref.where('etiquetados', 'array-contains', this.userFirebase.uid).where(value, '>=', term)
      .orderBy(value, 'desc').orderBy('create_at', 'desc').limit(this.limit));
      this.where = 'etiquetados';
      this.condition = 'array-contains';
      this._id = this.userFirebase.uid;
    }

    if (this.radioselect === 3) {
      // tslint:disable-next-line:max-line-length
      this.casosCollection  = this._afs.collection('supportcase', ref => ref.where('depto_id', '==', this.selectedDepto).where(value, '>=', term)
      .orderBy(value, 'desc').orderBy('create_at', 'desc').limit(this.limit));
      this.where = 'depto_id';
      this.condition = '==';
      this._id = this.selectedDepto;
    }

    if (this.radioselect > 0 && this.radioselect < 4) {
      this.casosCollection.snapshotChanges().pipe(
        map(actions => {
          this.isLoading = true;
          this.resultCount = actions.length;
          let count = 0;
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            count = count + 1;
            if (count === actions.length) {
              this.lastdate = data.create_at;
              this._afs.collection('supportcase', ref => ref.where(this.where, this.condition, this. _id).where(value, '>=', term)
              .orderBy(value, 'desc').orderBy('create_at', 'desc').endBefore('create_at', this.lastdate).limit(this.limit)).valueChanges()
               .subscribe((next: any) => {
                 if (next.length === 0) {
                    console.log('Siquiente Bloqueado x.x');
                     this.resultCount = 0;
                   }
                 }
               );
            }
            return { id, ...data };
          });
        })
      ).subscribe( (collection: any[]) => {
          const count = Object.keys(collection).length;
          if (count === 0) {
            this.joined$ = null;
          } else {
            this.gojoin(Observable.of(collection));
          }
        }
      );
    }
  }

  ngOnInit() {

    this.firebaseAuth.authState.subscribe(
      (auth) => {
        if(auth){
          this.userFirebase = auth;
          this._afs.collection('countries/'+this.identity.country+'/departments', ref => ref.where('admins', 'array-contains', this.userFirebase.uid)).
          get().subscribe((data: any) => { if (data.size > 0) {
            // tslint:disable-next-line:max-line-length
            this.radioOpciones = [{value: 1, descripcion: 'Mís Casos'}, {value: 2,  descripcion: 'Etiquetado'}, {value: 3, descripcion: 'Departamento'}];
            this.radioselect = 1;
            this.changeRadio(1);
            let count = 1;
            data.forEach((doc) => {
                  const depto = doc.data();
                  depto.id = doc.id;
                  if (count === 1) {
                    this.selectedDepto = depto.id;
                  }
                  count = count + 1;
                  this.departamentos.push(depto);
                  console.log(depto);
                }
              );
            } else {
              this.radioOpciones = [{value: 1, descripcion: 'Mís Casos'}, {value: 2,  descripcion: 'Etiquetado'}];
              this.radioselect = 1;
              this.changeRadio(1);
            }
          }
        );
      
        }
    });



    

  }

  selectChangedepto(value) {

    if (!value) {
      return;
    }

    this.statusinput.nativeElement.value = '';
    this.numbercaseinput.nativeElement.value = '';
    this.asuntoinput.nativeElement.value = '';

    this.casosCollection  = this._afs.collection('supportcase', ref => ref.where('depto_id', '==', value.id)
    .orderBy('create_at', 'desc').limit(this.limit));
    this.where = 'depto_id';
    this.condition = '==';
    this._id = value.id;

    this.casosCollection.snapshotChanges().pipe(
      map(actions => {
        this.isLoading = true;
        this.resultCount = actions.length;
        let count = 0;
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          count = count + 1;
          if (count === actions.length) {
            this.lastdate = data.create_at;
            this._afs.collection('supportcase', ref => ref.where(this.where, this.condition, this. _id)
             .orderBy('create_at', 'desc').startAfter(this.lastdate ).limit(this.limit)).valueChanges()
             .subscribe((next: any) => {
               if (next.length === 0) {
                console.log('Siquiente Bloqueado x.x');
                   this.resultCount = 0;
                 }
               }
             );
          }
          return { id, ...data };
        });
      })
    ).subscribe( (collection: any[]) => {
        const count = Object.keys(collection).length;
        if (count === 0) {
          this.joined$ = null;
        } else {
          this.gojoin(Observable.of(collection));
        }
      }
    );
  }

  changeRadio(value) {

    if(!this.userFirebase){
      return;
    }


    this.statusinput.nativeElement.value = '';
    this.numbercaseinput.nativeElement.value = '';
    this.asuntoinput.nativeElement.value = '';

    const integer = parseInt(value, 0);
    this.condition = integer;

    this.joined$ = null;

    if (integer === 1) {
      this.casosCollection = this._afs.collection('supportcase', ref => ref.where('create_to', '==', this.userFirebase.uid)
      .orderBy('create_at', 'desc').limit(this.limit));
      this.where = 'create_to';
      this.condition = '==';
      this._id = this.userFirebase.uid;
    }

    if (integer === 2) {
      this.casosCollection  =  this._afs.collection('supportcase', ref => ref.where('etiquetados', 'array-contains', this.userFirebase.uid)
      .orderBy('create_at', 'desc').limit(this.limit));
      this.where = 'etiquetados';
      this.condition = 'array-contains';
      this._id = this.userFirebase.uid;
    }

    if (integer === 3) {
      this.casosCollection  = this._afs.collection('supportcase', ref => ref.where('depto_id', '==', this.selectedDepto)
      .orderBy('create_at', 'desc').limit(this.limit));
      this.where = 'depto_id';
      this.condition = '==';
      this._id = this.selectedDepto;
    }

    if (integer > 0 && integer < 4) {
      this.casosCollection.snapshotChanges().pipe(
        map(actions => {
          this.isLoading = true;
          this.resultCount = actions.length;
          let count = 0;
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            count = count + 1;
            if (count === actions.length) {
              this.lastdate = data.create_at;
              this._afs.collection('supportcase', ref => ref.where(this.where, this.condition, this. _id)
               .orderBy('create_at', 'desc').startAfter(this.lastdate ).limit(this.limit)).valueChanges()
               .subscribe((next: any) => {
                 if (next.length === 0) {
                  console.log('Siquiente Bloqueado x.x');
                     this.resultCount = 0;
                   }
                 }
               );
            }
            return { id, ...data };
          });
        })
      ).subscribe( (collection: any[]) => {
          const count = Object.keys(collection).length;
          if (count === 0) {
            this.joined$ = null;
          } else {
            this.gojoin(Observable.of(collection));
          }
        }
      );
    }

  }

  gojoin(collection) { // : Observable<any>
    this.joined$ = collection.pipe(
      // leftJoin(this._afs, 'depto_id', 'countries/' + 1 + '/departments', 0, '', '', 'departments'),
      // leftJoin(this._afs, 'type_id', 'supporttype', 0, '', '', 'supporttype'),
      // leftJoin(this._afs, 'category_id', 'supportcategory', 0, '', '', 'supportcategory'),
      // leftJoin(this._afs, 'status_id', 'supportstatus', 0, '', '', 'supportstatus'),
      leftJoin(this._afs, 'create_to', 'users', 0, '', '', 'users'),
    );
  }

  deleteItem(item) {
    if (item) {

      const that = this;
      swal({
        title: '¿Esta seguro?',
        text: 'Esta seguro de borrar registro de caso ',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then( borrar => {
        if (borrar) {

          this._afs.collection('supportcase/' + item + '/comments').get().subscribe(
            res => {
              if (res.size > 0) {
                console.log(res);
                swal('Importante', 'No se puede eliminar caso ya que contiene comentarios', 'error');
               } else {
                console.log('Document does not exist comments');
                this._afs.collection('supportcase/' + item + '/caseFiles').get().subscribe(
                  caseFiles => {
                    if (caseFiles.size > 0) {
                      console.log(caseFiles);

                      caseFiles.forEach((doc) => {
                        const cfiles = doc.data();
                        cfiles.id = doc.id;
                        console.log(cfiles);
                        const storageRef = firebase.storage().ref();
                        storageRef.child('supportcase/' + item + '/caseFiles/' + cfiles.nombre).delete();
                        this._afs.doc('supportcase/' + item + '/caseFiles/' + cfiles.id).delete();
                      });

                      this._afs.collection('supportcase').doc(item).delete().then(function() {
                        that.snackBar.open('Eliminando Registro de Caso.', '', {duration: 2000 } );
                      }).catch(function(error) {
                        that.snackBar.open('A ocurrido un error al eliminar caso', '', {duration: 2000 });
                      });

                     } else {
                      console.log('Document does not exist caseFiles');
                      this._afs.collection('supportcase').doc(item).delete().then(function() {
                        that.snackBar.open('Eliminando Registro de Caso.', '', {duration: 2000 } );
                      }).catch(function(error) {
                        that.snackBar.open('A ocurrido un error al eliminar caso', '', {duration: 2000 });
                      });
                     }
                  }
                );
               }
            }
          );

        }
      });

    }

  }

  /**
   *
   *
   * this._afs.collection('supportcase').doc(item).delete().then(function() {
                  const storageRef = firebase.storage().ref();
                  storageRef.child('supportcase/' + item).delete();
                  that.snackBar.open('Eliminando Registro de Caso.', '', {duration: 2000 } );
                }).catch(function(error) {
                  that.snackBar.open('A ocurrido un error al eliminar caso', '', {duration: 2000 });
                });
   */

  abrirCaso(id: string) {
    const dialogRef = this.dialog.open(ShowcaseComponent, {
      width: '1000px',
      disableClose: true,
      data: { id: id }
      });

      dialogRef.afterClosed().subscribe(
            result => {
               if (result === 1) {
               // After dialog is closed we're doing frontend updates
               // For add we're just pushing a new row inside DataService
               // this.dataService.dataChange.value.push(this.OrderserviceService.getDialogData());
               // this.refresh();
               }
             });
  }

  paginate( valor: number, increment: number ) {

    const desde = this.pageSize + valor;

    if ( desde <= 0 ) {
      this.pageSize = 2;
      this.page = 1;
      return;
    }

    this.isLoading = false;
    this.pageSize += valor;
    this.page += increment;

    const estatus = this.statusinput.nativeElement.value;
    const numbercase = this.numbercaseinput.nativeElement.value;
    const asunto =  this.asuntoinput.nativeElement.value;

    let value;
    let term;

    if (estatus.length > 0 || numbercase.length > 0 || asunto.length > 0) {

      if (estatus.length > 0) {
        value = 'status_desc';
        term = estatus;
      }
      if (numbercase.length > 0) {
        value = 'ncase';
        term = numbercase;
      }
      if (asunto.length > 0) {
        value = 'asunto';
        term = asunto;
      }
    }

    if (increment > 0) {
      console.log('Siguiente: ' + this.lastdate);

      if (value && term) {
        // tslint:disable-next-line:max-line-length
        this.casosCollection = this._afs.collection('supportcase', ref => ref.where('create_to', '==', this.userFirebase.uid).where(value, '>=', term)
          .orderBy(value, 'desc').orderBy('create_at', 'desc').startAfter(this.lastdate).limit(this.limit));
      } else {
        this.casosCollection = this._afs.collection('supportcase', ref => ref.where(this.where, this.condition, this._id)
        .orderBy('create_at', 'desc').startAfter(this.lastdate).limit(this.limit));
      }

    } else {
      console.log('Anterior: ' + this.lastdate);

      if (value && term) {
        // tslint:disable-next-line:max-line-length
        this.casosCollection = this._afs.collection('supportcase', ref => ref.where(this.where, this.condition, this._id).where(value, '>=', term)
        .orderBy(value, 'desc').orderBy('create_at', 'desc').limit(this.limit));
      } else {
        this.casosCollection = this._afs.collection('supportcase', ref => ref.where(this.where, this.condition, this._id)
        .orderBy('create_at', 'desc').limit(this.limit));
      }

    }

    this.casosCollection.snapshotChanges().pipe(
      map(actions => {
        this.isLoading = true;
        this.resultCount = actions.length;
        let count = 0;
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            count = count + 1;
            if (count === actions.length) {
              this.lastdate = data.create_at;
              console.log(data.asunto);
              console.log(this.lastdate);
              if (increment > 0) {

                if (value && term) {
                  this._afs.collection('supportcase', ref => ref.where(this.where, this.condition, this. _id).where(value, '>=', term)
                    .orderBy(value, 'desc').orderBy('create_at', 'desc').endBefore('create_at', this.lastdate).limit(this.limit))
                    .valueChanges()
                    .subscribe((next: any) => {
                     if (next.length === 0) {
                        console.log('Siquiente Bloqueado x.x');
                         this.resultCount = 0;
                       }
                     }
                   );
                } else {
                  this._afs.collection('supportcase', ref => ref.where(this.where, this.condition, this. _id)
                  .orderBy('create_at', 'desc').startAfter(this.lastdate).limit(this.limit)).valueChanges()
                  .subscribe((next: any) => {
                    if (next.length === 0) {
                    console.log('Siquiente Bloqueado x.x');
                        this.resultCount = 0;
                      }
                    }
                  );
                }
              }
            }
            return { id, ...data };
          });
      })
    ).subscribe( (collection: any[]) => {
        const count = Object.keys(collection).length;
        if (count === 0) {
          this.joined$ = null;
        } else {
          this.gojoin(Observable.of(collection));
        }
      }
    );

  }

  addNew() {
    const dialogRef = this.dialog.open(AddcaseComponent, {
    width: '1000px',
    disableClose: true,
    data: { }
    });

    dialogRef.afterClosed().subscribe(
      result => {
          if (result === 1) {
          // After dialog is closed we're doing frontend updates
          // For add we're just pushing a new row inside DataService
          // this.dataService.dataChange.value.push(this.OrderserviceService.getDialogData());
          // this.refresh();
          }
        });
  }

}
