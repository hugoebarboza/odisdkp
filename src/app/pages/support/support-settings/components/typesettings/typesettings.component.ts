import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { UserService } from 'src/app/services/service.index';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

import { UserFirebase } from 'src/app/models/types';

import Swal from 'sweetalert2';

// MOMENT
import * as _moment from 'moment';
const moment = _moment;

@Component({
  selector: 'app-typesettings',
  templateUrl: './typesettings.component.html',
  styleUrls: ['./typesettings.component.css']
})
export class TypesettingsComponent implements OnInit {

  @Input() id: string;

  destroy = new Subject();
  identity: any;
  userFirebase: UserFirebase;
  public tipo$: Observable<any[]>;
  private tipoCollection: AngularFirestoreCollection<any>;
  isLoading = false;
  indexitem: number;
  isLoadingDelete = false;
  isLoadingSave = false;
  editando = false;
  newtype = '';
  show = false;
  booStatus = false;
  booCategory = false;
  showstatus = false;
  showcategory = false;
  datasend: any;


  constructor(
    private _afs: AngularFirestore,
    public _userService: UserService,
    private firebaseAuth: AngularFireAuth,
  ) { }

  ngOnInit() {

    this.identity = this._userService.getIdentity();
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

    if (this.id) {
      this.tipoCollection = this._afs.collection('supporttype', ref => ref.where('depto_id', '==', this.id).orderBy('name') );
      this.tipo$ = this.tipoCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
    }
  }

  startEdit (i: number) {
    this.indexitem = i;
    this.editando = true;
  }

  close() {
    this.indexitem = -1;
  }

  borrartipo(index, data) {

    if (data && data.name && data.name.trim().length > 0) {

      Swal.fire({
        title: '¿Esta seguro?',
        text: 'Esta seguro de borrar Tipo de solicitud',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      }).then( borrar => {
        if (borrar.value) {
        if (borrar) {
        this.booStatus = false;
        this.booCategory = false;
        this.editando = false;
        this.indexitem = index;
        this.isLoadingDelete = true;

          this._afs.collection('supportcase/' + this.identity.country + '/cases', ref => ref.where('type_id', '==', data.id)).get()
          .subscribe((respons: any) => {
            if (respons.size === 0) {
              this._afs.collection('supportcategory', ref => ref.where('type_id', '==', data.id)).get()
              .subscribe((res: any) => {
                if (res.size === 0) {
                  this.booStatus = true;
                  this.validarDelete(data.id);
                } else {
                  this.isLoadingDelete = false;
                  Swal.fire('Importante', 'No se puede eliminar el "Tipo de solicitud" por que existen categorias asociadas', 'error');
                }
              });
              this._afs.collection('supportstatus', ref => ref.where('stype_id', '==', data.id)).get()
              .subscribe((res: any) => {
                if (res.size === 0) {
                  this.booCategory = true;
                  this.validarDelete(data.id);
                } else {
                  this.isLoadingDelete = false;
                  Swal.fire('Importante', 'No se puede eliminar el "Tipo de solicitud" por que existen categorias asociadas', 'error');
                }
              });
            } else {
              this.isLoadingDelete = false;
              Swal.fire('Importante', 'No se puede eliminar el "Tipo de solicitud" por que existen solicitudes asociadas', 'error');
            }
          });

        }
        } else if (borrar.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelado',
          );
        }
      });
    }

  }

  validarDelete(id) {
    if (this.booStatus && this.booCategory) {
      this._afs.doc('supporttype/' + id).delete().then(_then => {
        Swal.fire('Tipo de solicitud Eliminado', '', 'success');
        this.isLoadingDelete = false;
      }).catch(_error => {
        this.isLoadingDelete = false;
        Swal.fire('Importante', 'A ocurrido un error', 'error');
      });
    }
    this.indexitem = -1;
  }

  guardartipo(_index, data) {

    if (data && data.name && data.name.trim().length > 0) {

      this.editando = false;
      this.isLoadingSave = true;
      this._afs.doc('supporttype/' + data.id).update({name: data.name.trim() })
      .then(_res => {
        this._afs.collection('supportcase/' + this.identity.country + '/cases', ref => ref.where('type_id', '==', data.id)).get()
        .subscribe((respons: any) => {
          if (respons.size > 0) {
            respons.forEach((doc) => {
                // const info = doc.data();
                // info.id = doc.id;
                this._afs.doc('supportcase/' + this.identity.country + '/cases/' + doc.id).update({type_desc: data.name.trim()});
            });
            this.isLoadingSave = false;
          }
        });

        Swal.fire('Tipo de solicitud editado', '', 'success');

        this.indexitem = -1;
      })
      .catch(function(error) {
        this.isLoadingSave = false;
        Swal.fire('Importante', 'A ocurrido un error', 'error');
        console.error('Error updating document: ', error);
      });

    } else {
      Swal.fire('Importante', 'A ocurrido un error', 'error');
    }

  }

  addType(data) {

    const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    this._afs.collection('supporttype').add({
      name: data.name,
      depto_id: this.id,
      create_to: this.userFirebase.uid,
      create_at: date
    })
    .then(function(_docRef) {
        // console.log('Document written with ID: ', docRef.id);
        Swal.fire('Tipo de solicitud registrado', '', 'success');

    })
    .catch(function(error) {
        console.error('Error adding document: ', error);
    });

  }

}

