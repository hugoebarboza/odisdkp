import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UserService, SettingsService } from 'src/app/services/service.index';
import { AddcaseComponent } from '../dialog/addcase/addcase.component';
import { MatDialog, MatTableDataSource, MatSnackBar, MatPaginator, MatSort } from '@angular/material';
import { Observable, combineLatest, defer, of, Subscription } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore} from 'angularfire2/firestore';
import { switchMap, map, tap } from 'rxjs/operators';
import { ShowcaseComponent } from '../dialog/showcase/showcase.component';
import { FormGroup} from '@angular/forms';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserFirebase } from '../../../models/types';
import * as _moment from 'moment';
const moment = _moment;
declare var swal: any;

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})

export class SupportComponent implements OnInit, OnDestroy  {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  identity: any;
  isLoading = false;
  title: string;
  joined$ = new MatTableDataSource();

  todo = {name: 'Todo', id: '0'};
  selectedDepto = '0';
  selectedDeptoAll = '0';

  allMeses = [{value: '01', mes: 'Enero 2019'},
  {value: '02', mes: 'Febrero 2019'},
  {value: '03', mes: 'Marzo 2019'},
  {value: '04', mes: 'Abril 2019'},
  {value: '05', mes: 'Mayo 2019'},
  {value: '06', mes: 'Junio 2019'},
  {value: '07', mes: 'Julio 2019'},
  {value: '08', mes: 'Agosto 2019'},
  {value: '09', mes: 'Septiembre 2019'},
  {value: '10', mes: 'Octubre 2019'},
  {value: '11', mes: 'Noviembre 2019'},
  {value: '12', mes: 'Diciembre 2019'}];

  startOfMonth = '';
  endOfMonth =  '';

  selectedMes = '';

  datacount = 0;

  userFirebase: UserFirebase;

  departamentos = [this.todo];
  allDepartamentos = [this.todo];

  radioOpciones;
  radioselect = 1;

  query: Subscription;
  nextquery: Subscription;

  depto: Subscription;
  deptosAll: Subscription;

  myFormRadio: FormGroup;

  supportcase = '';

  public casosCollection: AngularFirestoreCollection<any>;
  public casosCollectionPagination: AngularFirestoreCollection<any>;

  public tagPais$: Observable<any[]>;
  private tagPaisCollection: AngularFirestoreCollection<any>;
  idPais = null;
  // tslint:disable-next-line:max-line-length
  // displayedColumns: string[] = ['ncase', 'asunto', 'departments', 'supporttype', 'supportcategory', 'users', 'create_at', 'supportstatus', 'important', 'accions'];
  displayedColumns: string[] = ['ncase', 'asunto', 'departments', 'supporttype', 'supportcategory', 'users', 'create_at', 'countTime', 'update_at', 'supportstatus', 'important', 'accions'];

  constructor(
    private _afs: AngularFirestore,
    public _userService: UserService,
    private firebaseAuth: AngularFireAuth,
    public label: SettingsService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    this.identity = this._userService.getIdentity();
    this.label.getDataRoute().subscribe(data => {
      this.title = data.subtitle;
    });

  }

  ngOnInit() {

    const date = moment(new Date()).format('MM');
    this.selectedMes = date;
    this.startOfMonth = moment(date, 'MM').startOf('month').format('YYYY-MM-DD HH:mm:ss');
    this.endOfMonth   = moment(date, 'MM').endOf('month').format('YYYY-MM-DD HH:mm:ss');

    this.firebaseAuth.authState.subscribe((auth) => {
      if (auth) {
        this.userFirebase = auth;

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
        }

        this.idPais = this.identity.country;
        this.supportcase = 'supportcase/' + this.idPais + '/cases';
        this.startData();
      }

    });

  }

  startData() {

    this.departamentos = [this.todo];
    this.allDepartamentos = [this.todo];
     // tslint:disable-next-line:max-line-length
     this.deptosAll = this._afs.collection('countries/' + this.idPais + '/departments').
     get().subscribe((data: any) => { if (data.size > 0) {
         let count = 1;
         data.forEach((doc) => {
               const depto = doc.data();
               depto.id = doc.id;

               this.allDepartamentos.push(depto);
               if (this.identity.role === 8) {
                 this.departamentos.push(depto);
               }
               if (count === 1) {
                 if (this.identity.role === 8) {
                   this.selectedDepto = '0';
                 }
                 this.selectedDeptoAll = '0';
               } count = count + 1;
             }
           );
         }
       }
     );

     if (this.identity.role === 8 && this.identity.country === this.idPais) {
       // tslint:disable-next-line:max-line-length
       this.radioOpciones = [{value: 1, descripcion: 'Mís Solicitudes'}, {value: 2,  descripcion: 'Etiquetado'}, {value: 3, descripcion: 'Departamento'}];
       this.radioselect = 1;
       this.changeRadio(1);
     } else {
       // tslint:disable-next-line:max-line-length
       this.depto = this._afs.collection('countries/' + this.idPais + '/departments', ref => ref.where('admins', 'array-contains', this.userFirebase.uid)).
       get().subscribe((data: any) => { if (data.size > 0) {
           // tslint:disable-next-line:max-line-length
           this.radioOpciones = [{value: 1, descripcion: 'Mís Solicitudes'}, {value: 2,  descripcion: 'Etiquetado'}, {value: 3, descripcion: 'Departamento'}];
           this.radioselect = 1;
           this.changeRadio(1);
           let count = 1;
           this.departamentos = [];
           data.forEach((doc) => {
                 const depto = doc.data();
                 depto.id = doc.id;
                 if (count === 1) {
                   this.selectedDepto = depto.id;
                 }
                 count = count + 1;
                 this.departamentos.push(depto);
               }
             );
           } else {
             this.radioOpciones = [{value: 1, descripcion: 'Mís Solicitudes'}, {value: 2,  descripcion: 'Etiquetado'}];
             this.radioselect = 1;
             this.changeRadio(1);
           }
         }
       );
     }
  }


  changepais(id) {
    if (id) {
      this.idPais = id;
      this.supportcase = 'supportcase/' + this.idPais + '/cases';
      this.startData();
    }
  }

  selectChangeMes (value) {

    this.selectedMes = value.value;
    this.startOfMonth = moment(value.value, 'MM').startOf('month').format('YYYY-MM-DD HH:mm:ss');
    this.endOfMonth   = moment(value.value, 'MM').endOf('month').format('YYYY-MM-DD HH:mm:ss');

    this.changeRadio(this.radioselect);
  }

  applyFilter(filterValue: string) {
    this.joined$.filter = filterValue.trim().toLowerCase();
    if (this.joined$.paginator) {
      this.joined$.paginator.firstPage();
    }
  }

  ngOnDestroy() {

    if (this.query) {
      this.query.unsubscribe();
    }
    if (this.nextquery) {
      this.nextquery.unsubscribe();
    }
    if (this.depto) {
      this.depto.unsubscribe();
    }
    if (this.deptosAll) {
      this.deptosAll.unsubscribe();
    }

  }

  selectChangedeptoAll(value) {

    if (!value) {
      return;
    }

    if (value.id === '0') {
      this.changeRadio(this.radioselect);
      return;
    }

    if (this.query) {
      this.query.unsubscribe();
    }

    if (this.nextquery) {
      this.nextquery.unsubscribe();
    }

    this.joined$  = null;


    if (this.radioselect === 1) {
      this.casosCollection  = this._afs.collection(this.supportcase, ref => ref
      .where('create_to', '==', this.userFirebase.uid)
      .where('depto_id', '==', value.id)
      .where('create_at', '>=', this.startOfMonth)
      .where('create_at', '<=', this.endOfMonth)
      .orderBy('create_at', 'desc'));
    }

    if (this.radioselect === 2) {
      this.casosCollection  = this._afs.collection(this.supportcase, ref => ref
      .where('etiquetados', 'array-contains', this.userFirebase.uid)
      .where('depto_id', '==', value.id)
      .where('create_at', '>=', this.startOfMonth)
      .where('create_at', '<=', this.endOfMonth)
      .orderBy('create_at', 'desc'));
    }

    this.query = this.casosCollection.snapshotChanges().pipe(
      map(actions => {
        this.isLoading = true;
        this.datacount = actions.length;
        //console.log('PASO selectChangedeptoAll() ----------------------------------->');
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    ).subscribe( (collection: any[]) => {
        const count = Object.keys(collection).length;
        if (count === 0) {
          this.joined$  = null;
        } else {
          this.gojoin(Observable.of(collection));
        }
      }
    );

  }

  selectChangedepto(value) {

    if (!value) {
      return;
    }

    if (value.id === '0') {
      this.changeRadio(this.radioselect);
      return;
    }

    if (this.query) {
      this.query.unsubscribe();
    }

    if (this.nextquery) {
      this.nextquery.unsubscribe();
    }

    this.casosCollection  = this._afs.collection(this.supportcase , ref => ref
    .where('depto_id', '==', value.id)
    .where('create_at', '>=', this.startOfMonth)
    .where('create_at', '<=', this.endOfMonth)
    .orderBy('create_at', 'desc'));

    this.query = this.casosCollection.snapshotChanges().pipe(
      map(actions => {
        this.isLoading = true;
        this.datacount = actions.length;
        // console.log('PASO selectChangedepto() ----------------------------------->');
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    ).subscribe( (collection: any[]) => {
        const count = Object.keys(collection).length;
        if (count === 0) {
          this.joined$  = null;
        } else {
          this.gojoin(Observable.of(collection));
        }
      }
    );

  }

  refreshTable() {

    if (this.radioselect === 1 || this.radioselect === 2) {
      this.selectedDeptoAll = '0';
      this.changeRadio(this.radioselect);
    }

    if (this.radioselect === 3) {
      this.selectedDepto = '0';
      this.changeRadio(this.radioselect);
    }

  }

  changeRadio(value) {

    if (!this.userFirebase) {
      return;
    }

    if (this.query) {
      this.query.unsubscribe();
    }

    if (this.nextquery) {
      this.nextquery.unsubscribe();
    }

    const integer = parseInt(value, 0);

    this.joined$  = null;

    if (integer === 1) {

      if (this.selectedDeptoAll !== '0') {
        this.casosCollection = this._afs.collection(this.supportcase, ref => ref
          .where('create_to', '==', this.userFirebase.uid)
          .where('depto_id', '==', this.selectedDeptoAll)
          .where('create_at', '>=', this.startOfMonth)
          .where('create_at', '<=', this.endOfMonth)
          .orderBy('create_at', 'desc'));
      } else {
        this.casosCollection = this._afs.collection(this.supportcase, ref => ref
          .where('create_to', '==', this.userFirebase.uid)
          .where('create_at', '>=', this.startOfMonth)
          .where('create_at', '<=', this.endOfMonth)
          .orderBy('create_at', 'desc'));
      }
    }

    if (integer === 2) {
      if (this.selectedDeptoAll !== '0') {
        this.casosCollection  =  this._afs.collection(this.supportcase, ref => ref
          .where('etiquetados', 'array-contains', this.userFirebase.uid)
          .where('depto_id', '==', this.selectedDeptoAll)
          .where('create_at', '>=', this.startOfMonth)
          .where('create_at', '<=', this.endOfMonth)
          .orderBy('create_at', 'desc'));
      } else {
        this.casosCollection  =  this._afs.collection(this.supportcase, ref => ref
          .where('etiquetados', 'array-contains', this.userFirebase.uid)
          .where('create_at', '>=', this.startOfMonth)
          .where('create_at', '<=', this.endOfMonth)
          .orderBy('create_at', 'desc'));
      }
    }

    if (integer === 3) {
      if (this.identity.role === 8) {
        if (this.selectedDepto !== '0') {
          this.casosCollection  = this._afs.collection(this.supportcase, ref => ref
          .where('depto_id', '==', this.selectedDepto)
          .where('create_at', '>=', this.startOfMonth)
          .where('create_at', '<=', this.endOfMonth)
          .orderBy('create_at', 'desc'));
        } else {
          this.casosCollection  = this._afs.collection(this.supportcase, ref => ref
          .where('create_at', '>=', this.startOfMonth)
          .where('create_at', '<=', this.endOfMonth)
          .orderBy('create_at', 'desc'));
        }
      } else {
        this.casosCollection  = this._afs.collection(this.supportcase, ref => ref
        .where('depto_id', '==', this.selectedDepto)
        .where('create_at', '>=', this.startOfMonth)
        .where('create_at', '<=', this.endOfMonth)
        .orderBy('create_at', 'desc'));
      }
    }

    if (integer > 0 && integer < 4) {
      this.query = this.casosCollection.snapshotChanges().pipe(
        map(actions => {
          this.isLoading = true;
          this.datacount = actions.length;
          // console.log('PASO changeRadio() ----------------------------------->');
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      ).subscribe( (collection: any[]) => {
        const count = Object.keys(collection).length;
        if (count === 0) {
          this.joined$  = null;
        } else {
          this.gojoin(Observable.of(collection));
        }
      }
    );

    }

  }

  gojoin(collection) {
    collection.pipe(
      // leftJoin(this._afs, 'depto_id', 'countries/' + 1 + '/departments', 0, '', '', 'departments'),
      // leftJoin(this._afs, 'type_id', 'supporttype', 0, '', '', 'supporttype'),
      // leftJoin(this._afs, 'category_id', 'supportcategory', 0, '', '', 'supportcategory'),
      // leftJoin(this._afs, 'status_id', 'supportstatus', 0, '', '', 'supportstatus'),
      leftJoin(this._afs, 'create_to', 'users', 0, '', '', 'users'),
    ).subscribe(
      data => {
        this.joined$ = new MatTableDataSource(data);
        this.joined$.paginator = this.paginator;
        this.joined$.sort = this.sort;
      }
    );
  }

  deleteItem(item) {
    if (item) {

      const that = this;
      swal({
        title: '¿Esta seguro?',
        text: 'Esta seguro de borrar registro de solicitud ',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then( borrar => {
        if (borrar) {

          this._afs.collection(this.supportcase + '/' + item + '/comments').get().subscribe(
            res => {
              if (res.size > 0) {
                // console.log(res);
                this._afs.collection(this.supportcase + '/' + item + '/activity').get().subscribe(
                  activity => {
                    if (activity.size > 0) {
                      activity.forEach((doc) => {
                        this._afs.doc(this.supportcase + '/' + item + '/activity/' + doc.id).delete();
                      });
                    }
                  });
                swal('Importante', 'No se puede eliminar solicitud ya que contiene comentarios', 'error');
               } else {
                // console.log('Document does not exist comments');
                this._afs.collection(this.supportcase + '/' + item + '/caseFiles').get().subscribe(
                  caseFiles => {
                    if (caseFiles.size > 0) {
                      //console.log(caseFiles);

                      caseFiles.forEach((doc) => {
                        const cfiles = doc.data();
                        cfiles.id = doc.id;
                        //console.log(cfiles);
                        const storageRef = firebase.storage().ref();
                        storageRef.child(this.supportcase + '/' + item + '/caseFiles/' + cfiles.nombre).delete();
                        this._afs.doc(this.supportcase + '/' + item + '/caseFiles/' + cfiles.id).delete();
                      });

                      this._afs.collection(this.supportcase).doc(item).delete().then(function() {
                        swal('Solicitud eliminada', '', 'success');
                        that.snackBar.open('Eliminando Registro de Solicitud.', '', {duration: 2000 } );
                      }).catch(function(error) {
                        swal('A ocurrido un error al eliminar solicitud', '', 'error');
                      });

                      this._afs.collection(this.supportcase + '/' + item + '/activity').get().subscribe(
                        activity => {
                          if (activity.size > 0) {
                            activity.forEach((doc) => {
                              this._afs.doc(this.supportcase + '/' + item + '/activity/' + doc.id).delete();
                            });
                          }
                        });

                     } else {
                      // console.log('Document does not exist caseFiles');
                      this._afs.collection(this.supportcase).doc(item).delete().then(function() {
                        swal('Solicitud eliminada', '', 'success');
                      }).catch(function(error) {
                        swal('A ocurrido un error al eliminar solicitud', '', 'error');
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


  abrirCaso(data) {
    const dialogRef = this.dialog.open(ShowcaseComponent, {
      width: '1000px',
      disableClose: true,
      data: { id: data.id, depto_id: data.depto_id , pais: this.idPais}
      });

      dialogRef.afterClosed().subscribe(
            result => {
               if (result === 1) {
               }
             });
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
          }
        });
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
