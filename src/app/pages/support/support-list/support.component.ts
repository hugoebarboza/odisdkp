import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UserService, SettingsService } from 'src/app/services/service.index';
import { AddcaseComponent } from '../dialog/addcase/addcase.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest, defer } from 'rxjs';
import { of } from 'rxjs/observable/of';

import { switchMap, map, tap } from 'rxjs/operators';
import { ShowcaseComponent } from '../dialog/showcase/showcase.component';
import { FormGroup} from '@angular/forms';
import * as firebase from 'firebase/app';
import { UserFirebase } from 'src/app/models/types';
import * as _moment from 'moment';

import Swal from 'sweetalert2';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreCollection, AngularFirestore} from '@angular/fire/firestore';


const moment = _moment;


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

  todo = {name: 'Todo', id: 0};
  selectedDepto = 0;
  selectedDeptoAll = 0;

  tiempopromedio = null;
  timeArray = [];

  meses = [{value: '01', mes: 'Enero'},
  {value: '02', mes: 'Febrero'},
  {value: '03', mes: 'Marzo'},
  {value: '04', mes: 'Abril'},
  {value: '05', mes: 'Mayo'},
  {value: '06', mes: 'Junio'},
  {value: '07', mes: 'Julio'},
  {value: '08', mes: 'Agosto'},
  {value: '09', mes: 'Septiembre'},
  {value: '10', mes: 'Octubre'},
  {value: '11', mes: 'Noviembre'},
  {value: '12', mes: 'Diciembre'}];

  allMeses = [];

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
  idPais = 0;
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

    const anoActual: number = Number(moment(new Date()).format('YYYY'));
    const anoMesActual: String = moment(new Date()).format('YYYY-MM');

    for (let i = 2019; i <= anoActual; i++) {
      for (let x = 0; x < this.meses.length; x++) {
        const yyyymm = i + '-' + this.meses[x]['value'];
        const mmyyyy = this.meses[x]['mes'] + ' ' + i;
        this.allMeses.push({value: yyyymm, mes: mmyyyy});
        if (yyyymm === anoMesActual) {
          // console.log(JSON.stringify(this.allMeses));
          break;
        }
      }
    }

    const date = moment(new Date()).format('YYYY-MM');
    this.selectedMes = date;
    this.startOfMonth = moment(date, 'YYYY-MM').startOf('month').format('YYYY-MM-DD HH:mm:ss');
    this.endOfMonth   = moment(date, 'YYYY-MM').endOf('month').format('YYYY-MM-DD HH:mm:ss');

    this.firebaseAuth.authState.subscribe((auth) => {
      if (auth) {

        this.userFirebase = auth;
        this.idPais = this.identity.country;

        if (this.identity.role >= 9) {
          this.tagPaisCollection = this._afs.collection('countries');
          this.tagPais$ = this.tagPaisCollection.snapshotChanges().pipe(
            map(actions => {
              return actions.map(a => {
                const data = a.payload.doc.data();
                const id: number = +a.payload.doc.id;
                return { id, ...data };
              });
            })
          );
        }

        this.getDepartamentos(this.idPais);
        this.startData();
      }

    });

  }

  startData() {

    this.supportcase = 'supportcase/' + this.idPais + '/cases';
    if (this.identity.role >= 9) { // VE TODO
      this.radioOpciones = [
        {value: 1, descripcion: 'Mís Solicitudes'},
        {value: 2, descripcion: 'Reportado'},
        {value: 3, descripcion: 'Departamento'}
      ];
      this.getdatacases();
    } else {
      this.depto = this._afs.collection('countries/' + this.idPais + '/departments',
      ref => ref.where('admins', 'array-contains', this.userFirebase.uid)).
      get().subscribe((data: any) => {
          if (data.size > 0) { // VALIDA SI ES ENCARGADO DE DEPARTEMENTO
            this.radioOpciones = [
              {value: 1, descripcion: 'Mís Solicitudes'},
              {value: 2,  descripcion: 'Reportado'},
              {value: 3, descripcion: 'Departamento'}
            ];
            this.getdatacases();
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
              this.radioOpciones = [
                {value: 1, descripcion: 'Mís Solicitudes'},
                {value: 2,  descripcion: 'Reportado'}
              ];
              this.getdatacases();
          }
        }
      );
    }
  }

  getDepartamentos(id: number, flag?: Boolean) {

    // console.log('getDepartamentos => id => ' + id);
    // console.log('getDepartamentos => flag => ' + flag);

    if (id) {

      this.idPais = id;
      this.deptosAll = this._afs.collection('countries/' + this.idPais + '/departments').get().subscribe((data: any) => {

        this.departamentos = [this.todo];
        this.allDepartamentos = [this.todo];

        if (data.size > 0) {
          let count = 1;
          data.forEach((doc) => {
                const depto = doc.data();
                depto.id = doc.id;

                this.allDepartamentos.push(depto);
                if (this.identity.role >= 9) {
                  this.departamentos.push(depto);
                }
                if (count === 1) {
                  if (this.identity.role >= 9) {
                    this.selectedDepto = 0;
                  }
                  this.selectedDeptoAll = 0;
                }
                count = count + 1;
              }
            );
        }

        if (flag !== undefined && flag) {
          // console.log('getDepartamentos => getdatacases');
          this.getdatacases();
        }

      });
    }
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


  getdatacases() {

    if (!this.userFirebase) {
      return;
    }

    if (this.query) {
      this.query.unsubscribe();
    }

    if (this.nextquery) {
      this.nextquery.unsubscribe();
    }

    this.isLoading = false;

    this.supportcase = 'supportcase/' + this.idPais + '/cases';

    this.startOfMonth = moment(this.selectedMes, 'YYYY-MM').startOf('month').format('YYYY-MM-DD HH:mm:ss');
    this.endOfMonth   = moment(this.selectedMes, 'YYYY-MM').endOf('month').format('YYYY-MM-DD HH:mm:ss');

    this.joined$  = null;

    if (this.radioselect === 1) {
      if (this.selectedDeptoAll !== 0) {
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

    if (this.radioselect === 2) {
      if (this.selectedDeptoAll !== 0) {
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

    if (this.radioselect === 3) {
      if (this.identity.role >= 9) {
        if (this.selectedDepto !== 0) {
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

    this.query = this.casosCollection.snapshotChanges().pipe(
        map(actions => {
          this.isLoading = true;
          this.datacount = actions.length;
          this.timeArray = [];
          this.tiempopromedio = null;

          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;

            const createat = moment(data.create_at).format();
            const updateat = moment(data.update_at).format();
            const duration = moment.duration(moment(updateat).diff(createat));
            const days = duration.get('days');
            const hours = duration.get('hours');
            const minutes = duration.get('minutes');
            // console.log('array => ' + (days * 24 * 60 + hours * 60 + minutes));
            this.timeArray.push(days * 24 * 60 + hours * 60 + minutes);

            return { id, ...data };
          });
        })
      ).subscribe( (collection: any[]) => {

        if (this.timeArray.length > 0) {

          let promedio = 0;

          for (let t = 0; t < this.timeArray.length; t++) {
            promedio = promedio + this.timeArray[t];
          }

          // console.log('total => ' + promedio);
          // console.log('this.timeArray.length => ' + this.timeArray.length);
          promedio = promedio / this.timeArray.length;
          // console.log('promedio => ' + promedio + 'promedio % 60 => ' + (promedio % 60));

          if (promedio > 60) {
            if ((promedio / 60) > 1 && (promedio / 60) < 24) {
              this.tiempopromedio = Math.floor(promedio / 60) + 'h ' + Math.floor(promedio % 60) + 'm';
            } else {
              // tslint:disable-next-line:max-line-length
              this.tiempopromedio = Math.floor(promedio / (60 * 24)) + 'd ' + Math.floor((promedio % (60 * 24)) / 60) + 'h ' + Math.floor(((promedio % (60 * 24)) % 60)  % 60)  + 'm';
            }
          } else {
            this.tiempopromedio = promedio + 'm';
          }

        }

        const count = Object.keys(collection).length;

        if (count === 0) {
          this.joined$  = null;
        } else {
          this.gojoin(of(collection));
        }
      }
    );

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
      Swal.fire({
        title: '¿Esta seguro?',
        text: 'Esta seguro de borrar registro de solicitud ',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      }).then( borrar => {
        if (borrar.value) {
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
                  Swal.fire('Importante', 'No se puede eliminar solicitud ya que contiene comentarios', 'error');
                } else {
                  // console.log('Document does not exist comments');
                  this._afs.collection(this.supportcase + '/' + item + '/caseFiles').get().subscribe(
                    caseFiles => {
                      if (caseFiles.size > 0) {
                        // console.log(caseFiles);

                        caseFiles.forEach((doc) => {
                          const cfiles = doc.data();
                          cfiles.id = doc.id;
                          // console.log(cfiles);
                          const storageRef = firebase.storage().ref();
                          storageRef.child(this.supportcase + '/' + item + '/caseFiles/' + cfiles.nombre).delete();
                          this._afs.doc(this.supportcase + '/' + item + '/caseFiles/' + cfiles.id).delete();
                        });

                        this._afs.collection(this.supportcase).doc(item).delete().then(function() {
                          Swal.fire('Solicitud eliminada', '', 'success');
                          that.snackBar.open('Eliminando Registro de Solicitud.', '', {duration: 2000 } );
                        }).catch(function(_error) {
                          Swal.fire('A ocurrido un error al eliminar solicitud', '', 'error');
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
                          Swal.fire('Solicitud eliminada', '', 'success');
                        }).catch(function(_error) {
                          Swal.fire('A ocurrido un error al eliminar solicitud', '', 'error');
                        });
                      }
                    }
                  );
                }
              }
            );

          }
        } else if (borrar.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelado',
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
      // let totalJoins = 0;
      // Track total num of joined doc reads


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

