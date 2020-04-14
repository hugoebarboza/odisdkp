import { Component, OnInit } from '@angular/core';


import { UserService, SettingsService } from 'src/app/services/service.index';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

import { Observable, concat, of, Subject } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, tap, switchMap, catchError, takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserFirebase } from 'src/app/models/types';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-support-users',
  templateUrl: './supportusers.component.html',
  styleUrls: ['./supportusers.component.css']
})
export class SupportUsersComponent implements OnInit {

  destroy = new Subject();
  isLoading = true;
  identity: any;
  title: string;
  countuser: 0;
  indexitem: number;

  userLoading = false;
  userArray = [];

  userinput = new Subject<string>();

  public listusers$: Observable<any[]>;
  private listusersCollection: AngularFirestoreCollection<any>;

  public users$: Observable<any[]>;
  private usersCollection: AngularFirestoreCollection<any>;

  forma: FormGroup;
  userFirebase: UserFirebase;

  constructor(
      private _afs: AngularFirestore,
      public _userService: UserService,
      private firebaseAuth: AngularFireAuth,
      public label: SettingsService
    ) {
      this.identity = this._userService.getIdentity();
      this.label.getDataRoute().subscribe(data => {
      this.title = data.subtitle;
      this.firebaseAuth.authState
      .pipe(
        takeUntil(this.destroy),
      )
      .subscribe(
        (auth) => {
          if (auth) {
            this.userFirebase = auth;
            this.getUserReport(this.userFirebase.uid);
          }
      });
    }); }

  ngOnInit() {

    this.forma = new FormGroup({
      etiquetado: new FormControl ([] , [Validators.required]),
    });

    this.loadusers();

    /*
    this._afs.collection('users').get().subscribe((respons: any) => {
      if (respons.size > 0) {
        respons.forEach((doc) => {
          const cityRef = this._afs.collection('users').doc(doc.id);
          return cityRef.update({
              country: 1
          });
        });
      }
    });*/


  }

  getUserReport (uid: String) {
    this.listusersCollection = this._afs.collection('users', ref => ref
    .where('country', '==', this.identity.country)
    .where('report', 'array-contains', uid)
    .orderBy('name', 'asc'));

    this.listusers$ =  this.listusersCollection.snapshotChanges().pipe(
              map(actions => {
                this.countuser = 0;
                return actions.map(a => {
                  const data = a.payload.doc.data();
                  const id = a.payload.doc.id;
                  this.countuser++;
                  // console.log(id, ...data);
                  return { id, ...data };
                });
              })
            );
  }


  startEdit(usuario: any) {

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta a punto de remover a ' + usuario.name + ' ' + usuario.surname,
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    })
    .then( borrar => {
      if (borrar.value) {
        if (borrar) {

          if (usuario && usuario.report) {
            const report: any = usuario.report;

            const arr: any = [];

            for (let i = 0; i < report.length; i++) {
              if (report[i] !== this.userFirebase.uid) {
                arr.push(report[i]);
              }
            }

            this._afs.doc('users/' + usuario.uid).update({report: arr})
            .then(function(_docRef) {
              Swal.fire('Importante', 'Usuario ' + usuario.name + ' ' + usuario.surname + ' fue removido del listado de personal', 'success');
            })
            .catch(function(error) {
              console.error('Error updating document: ', error);
            });
          }
        }

      } else if (borrar.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
        );
      }
    });

  }


  confirmAdd() {

    if (this.forma.invalid) {
      Swal.fire('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
      return;
    }

    const etiquetado: any = this.forma.value['etiquetado'];

    if (etiquetado) {
      if (etiquetado.role && etiquetado.role >= this.identity.role) {
        Swal.fire('Importante', 'No se permite seleccionar un usuario con el mismo perfil', 'error');
      } else {
        if (etiquetado.report && etiquetado.report.length > 0) {

          const newreport = etiquetado.report;
          newreport.push(this.userFirebase.uid);

          const that = this;
          this._afs.doc('users/' + etiquetado.uid).update({report: newreport})
            .then(function(_docRef) {
              Swal.fire('Importante', 'Usuario ' + etiquetado.name + ' ' + etiquetado.surname + ' fue agregado al listado de personal', 'success');
              that.forma.reset();
            })
            .catch(function(error) {
              console.error('Error updating document: ', error);
            });

        } else {

          const that = this;
          this._afs.doc('users/' + etiquetado.uid).update({report: [this.userFirebase.uid]})
            .then(function(_docRef) {
              Swal.fire('Importante', 'Usuario ' + etiquetado.name + ' ' + etiquetado.surname + ' fue agregado al listado de personal', 'success');
              that.forma.reset();
            })
            .catch(function(error) {
              console.error('Error updating document: ', error);
            });
        }
      }
    }

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

  /*
  searchCustomer(term: string) {
    console.log(term);

    this.users$ = this.getListuser(term);
  }*/

  getListuser(term: string): Observable<any> {

    if (term == null) {
      this.userLoading = false;
      return new Observable;
    }

    // tslint:disable-next-line:max-line-length
    this.usersCollection = this._afs.collection('users', ref => ref
    .where('country', '==', this.identity.country)
    .where('email', '>=', term));
    return this.usersCollection.snapshotChanges().pipe(
              map(actions => {
                return actions.map(a => {
                  const data = a.payload.doc.data();
                  // const id = a.payload.doc.id;
                  return { ...data };
                });
              })
            );
  }

}
