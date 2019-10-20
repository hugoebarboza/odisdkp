import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import * as _moment from 'moment';
import { UserService } from 'src/app/services/service.index';


import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

import { UserFirebase } from 'src/app/models/types';
import { FormGroup, Validators, FormControl } from '@angular/forms';

declare var swal: any;

// MOMENT
const moment = _moment;

@Component({
  selector: 'app-statussettings',
  templateUrl: './statussettings.component.html',
  styleUrls: ['./statussettings.component.css']
})
export class StatussettingsComponent implements OnInit, OnChanges {

  @Input() data: any;
  identity: any;
  userFirebase: UserFirebase;

  public estatus$: Observable<any[]>;
  private estatusCollection: AngularFirestoreCollection<any>;
  isLoading: boolean = false;
  indexitem: number;
  isLoadingDelete: boolean = false;
  isLoadingSave: boolean = false;
  editando: boolean = false;
  show:boolean = false;
  forma: FormGroup;
  constructor(
    private _afs: AngularFirestore,
    public _userService: UserService,
    private firebaseAuth: AngularFireAuth,
  ) { }

  ngOnInit() {

  }


  ngOnChanges() {

    this.forma = new FormGroup({
      name: new FormControl (null, [Validators.required, Validators.minLength(1)]),
      label: new FormControl ('0', [Validators.required]),
      order_by: new FormControl (null, [Validators.required, Validators.minLength(1)])
    });

    this.forma.setValue({
      'name': null,
      'label': '0',
      'order_by': null
    });

    this.identity = this._userService.getIdentity();
    this.firebaseAuth.authState.subscribe(
      (auth) => {
        if (auth) {
          this.userFirebase = auth;
        }
    });

    if (this.data) {
      this.estatusCollection = this._afs.collection('supportstatus', ref => ref
      .where('stype_id', '==', this.data.id).orderBy('order_by', 'asc'));
      this.estatus$ = this.estatusCollection.snapshotChanges().pipe(
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


  guardarestatus(_index, data) {

    let order_by: number = parseInt(data.order_by, 0);

    if (isNaN(order_by) || order_by < 0) {
      order_by = 0;
    }

    if (data && data.name && data.name.trim().length > 0) {

      this.editando = false;
      this.isLoadingSave = true;

      this._afs.doc('supportstatus/' + data.id).update({name: data.name.trim(), order_by: order_by, label: data.label})
      .then(_res => {
        this._afs.collection('supportcase/' + this.identity.country + '/cases', ref => ref.where('status_id', '==', data.id)).get()
        .subscribe((respons: any) => {
          if (respons.size > 0) {
            respons.forEach((doc) => {
                // const info = doc.data();
                // info.id = doc.id;
                //this._afs.doc('supportcase/' + this.identity.country + '/cases/' + doc.id).update({status_desc: data.name.trim()});
                this._afs.doc('supportcase/' + this.identity.country + '/cases/' + doc.id).update({status_desc: data.name.trim(), label: data.label});
            });
            this.isLoadingSave = false;
          }
        });

        swal('Categoria editada', '', 'success');

        this.indexitem = -1;
      })
      .catch(function(error) {
        this.isLoadingSave = false;
        swal('Importante', 'A ocurrido un error', 'error');
        console.error('Error updating document: ', error);
      });

    } else {
      swal('Importante', 'A ocurrido un error', 'error');
    }


  }

  borrarestatus (index, data) {

    if (data && data.name && data.name.trim().length > 0) {

      swal({
        title: '¿Esta seguro?',
        text: 'Esta seguro de borrar el estatus',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then( borrar => {
        if (borrar) {
        this.editando = false;
        this.indexitem = index;
        this.isLoadingDelete = true;

          this._afs.collection('supportcase/' + this.identity.country + '/cases', ref => ref.where('status_id', '==', data.id)).get()
          .subscribe((respons: any) => {
            if (respons.size === 0) {

              this._afs.doc('supportstatus/' + data.id).delete().then(_then => {
                swal('Estatus Eliminado', '', 'success');
                this.isLoadingDelete = false;
              }).catch(_error => {
                this.isLoadingDelete = false;
                swal('Importante', 'A ocurrido un error', 'error');
              });
            } else {
              this.isLoadingDelete = false;
              swal('Importante', 'No se puede eliminar el "Estatus" por que existen solicitudes asociadas', 'error');
            }
          });

        }

      });
    }

  }

  startEdit (i: number) {
    this.indexitem = i;
    this.editando = true;
  }

  close() {
    this.indexitem = -1;
  }


  addEstatus(data) {

    const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    this._afs.collection('supportstatus').add({
      name: data.name.trim(),
      label: data.label,
      order_by: data.order_by,
      stype_id: this.data.id,
      create_to: this.userFirebase.uid,
      create_at: date
    })
    .then(function(_docRef) {
        // console.log('Document written with ID: ', docRef.id);
        swal('Estatus registrado', '', 'success');

    })
    .catch(function(error) {
        console.error('Error adding document: ', error);
    });

  }

}

