import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { UserService } from 'src/app/services/service.index';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserFirebase } from 'src/app/models/types';
import { Observable, concat, of, Subject, defer } from 'rxjs';
import { map, distinctUntilChanged, tap, switchMap, catchError, debounceTime, combineLatest } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';


declare var swal: any;
import * as _moment from 'moment';

// MOMENT
const moment = _moment;

@Component({
  selector: 'app-supportsettings',
  templateUrl: './supportsettings.component.html',
  styleUrls: ['./supportsettings.component.css']
})
export class SupportsettingsComponent implements OnInit, OnDestroy {

  identity: any;
  isLoading = true;
  userFirebase: UserFirebase;
  forma: FormGroup;
  userLoading = false;
  indexitem: number;
  editando: boolean = false;

  arrayResponsable = [];
  userinput = new Subject<string>();
  public departamento$: any;
  private departamentosCollection: AngularFirestoreCollection<any>;

  public users$: Observable<any[]>;
  private usersCollection: AngularFirestoreCollection<any>;

  constructor(
    private _afs: AngularFirestore,
    public _userService: UserService,
    private firebaseAuth: AngularFireAuth,
  ) { }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.firebaseAuth.authState.subscribe(
      (auth) => {
        if (auth) {
          this.userFirebase = auth;
        }
    });

    this.departamentosCollection = this._afs.collection('countries/' + this.identity.country + '/departments');
    this.departamento$ = this.departamentosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          data.note_tem = data.note;
          data.day_tem = data.day;
          data.checkedToggle = false;
          data.admins = this.getUserInfo(data.admins);
          return { id, ...data };
        });
      })
    );

    this.forma = new FormGroup({
      responsable: new FormControl (null, [Validators.required, Validators.minLength(1)]),
      namedepto: new FormControl (null, [Validators.required, Validators.minLength(1)]),
      // tslint:disable-next-line:max-line-length
      notedepto: new FormControl (null, [Validators.required]),
      daydepto: new FormControl (null, [Validators.required, Validators.minLength(1)]),
    });

    this.forma.setValue({
      'responsable': '',
      'namedepto': '',
      'notedepto': '',
      'daydepto': '',
    });

    this.loadusers();

  }

  onKey(key) {

    const integer = parseInt(key, 0);

    if (isNaN(integer)) {
      this.forma.controls['daydepto'].setValue(0);
    }
    if (integer > 30) {
      this.forma.controls['daydepto'].setValue(30);
    }
    if (integer < 0) {
      this.forma.controls['daydepto'].setValue(0);
    }
  }

  startEdit (i: number) {
    this.indexitem = i;
    this.editando = true;
  }

  close() {
    this.indexitem = -1;
  }

  guardarNota(index: any, data: any) {
    this.indexitem = -1;

    let integer: number = parseInt(data.day_tem, 0);

    if (isNaN(integer) || integer < 0) {
      integer = 0;
    }

    if (integer > 30) {
      integer = 30;
    }

    this._afs.doc('countries/' + this.identity.country + '/departments/' + data.id).update({note: data.note_tem, day: integer })
      .then(function(docRef) {
        swal('Nota registrada', '', 'success');
      })
      .catch(function(error) {
        console.error('Error updating document: ', error);
      });

  }

  ngOnDestroy() {
    if (this.departamento$) {
    }
  }

  getUserInfo(to): Array<any> {
    const arr: any = [];
    for (let ii = 0; ii < to.length; ii++) {
      this._afs.doc('users/' + to[ii]).valueChanges().subscribe(res => {
        arr.push(res);
      });
    }
    return arr;
  }

  responsablesChanged(data?) {

    if (data && data.admins && data.admins.length > 0) {

      //console.log(data);
      const newadmins = [];
      for (let i = 0; i < data.admins.length; i++) {
        newadmins.push(data.admins[i]['uid']);
      }
      this._afs.doc('countries/' + this.identity.country + '/departments/' + data.id).update({admins: newadmins})
      .then(function(docRef) {
        swal('Responsables registrados', '', 'success');
      })
      .catch(function(error) {
        console.error('Error updating document: ', error);
      });
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

  getListuser(term: string) {
    if (term == null) {
      this.userLoading = false;
      return new Observable;
    }
    // tslint:disable-next-line:max-line-length
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

  borrardepto (data) {

    if (data && data.name) {

      swal({
        title: '¿Esta seguro?',
        text: 'Esta seguro de borrar el departamento',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then( borrar => {
        if (borrar) {

          this._afs.collection('supportcase/' + this.identity.country + '/cases', ref => ref.where('depto_id', '==', data.id)).get()
          .subscribe((respons: any) => {
            if (respons.size === 0) {
              this._afs.doc('countries/' + this.identity.country + '/departments/' + data.id).delete().then(then => {
                swal('Departamento Eliminado', '', 'success');
              }).catch(error => {
                swal('Importante', 'A ocurrido un error', 'error');
              });
            } else {
              swal('Importante', 'No se puede eliminar el "Departamento" por que existen solicitudes asociadas', 'error');
            }
          });

        }

      });
    }

  }


  addDepto() {

    const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    if (this.forma.invalid) {
      swal('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
      return;
    }

    const array_users: [] = this.forma.value.responsable;
    const array_usersNew: Array<Object> = [];

    for (let ii = 0; ii < array_users.length; ii++) {
      // const obj: Object = {id: array_users[ii]['id']}; // , email: array_users[ii]['email']
      array_usersNew.push(array_users[ii]['id']);
    }

    const that = this;

    this._afs.collection('countries/' + this.identity.country + '/departments').add({
      name: this.forma.value.namedepto,
      create_to: this.userFirebase.uid,
      create_at: date,
      admins: array_usersNew
    })
    .then(function(docRef) {
        // console.log('Document written with ID: ', docRef.id);
        that.forma.reset();
        swal('Departamento registrado', '', 'success');

    })
    .catch(function(error) {
        console.error('Error adding document: ', error);
    });

  }



}
