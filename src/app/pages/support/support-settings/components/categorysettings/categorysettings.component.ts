import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import * as _moment from 'moment';
import { UserService } from 'src/app/services/service.index';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserFirebase } from 'src/app/models/types';
import { FormGroup, Validators, FormControl } from '@angular/forms';

declare var swal: any;

// MOMENT
const moment = _moment;

@Component({
  selector: 'app-categorysettings',
  templateUrl: './categorysettings.component.html',
  styleUrls: ['./categorysettings.component.css']
})
export class CategorysettingsComponent implements OnInit, OnChanges {

  @Input() data: any;
  identity: any;
  userFirebase: UserFirebase;

  public categoria$: Observable<any[]>;
  private categoriaCollection: AngularFirestoreCollection<any>;
  isLoading: boolean = false;
  indexitem: number;
  isLoadingDelete: boolean = false;
  isLoadingSave: boolean = false;
  editando: boolean = false;
  forma: FormGroup;
  show:boolean = false;

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
      plazo: new FormControl (null)
    });

    this.forma.setValue({
      'name': '',
      'plazo': '',
    });

    this.identity = this._userService.getIdentity();
    this.firebaseAuth.authState.subscribe(
      (auth) => {
        if (auth) {
          this.userFirebase = auth;
        }
    });

    if (this.data) {
      this.categoriaCollection = this._afs.collection('supportcategory', ref => ref.where('type_id', '==', this.data.id).orderBy('name') );
      this.categoria$ = this.categoriaCollection.snapshotChanges().pipe(
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

  guardarcategoria(index, data) {

    if (data && data.name && data.name.trim().length > 0) {

      this.editando = false;
      this.isLoadingSave = true;

      if (!data.plazo || (data.plazo && data.plazo.trim().length === 0)) {
        data.plazo = '';
      }

      this._afs.doc('supportcategory/' + data.id).update({name: data.name.trim(), plazo: data.plazo})
      .then(res => {
        this._afs.collection('supportcase/' + this.identity.country + '/cases', ref => ref.where('category_id', '==', data.id)).get()
        .subscribe((respons: any) => {
          if (respons.size > 0) {
            respons.forEach((doc) => {
                // const info = doc.data();
                // info.id = doc.id;
                this._afs.doc('supportcase/' + this.identity.country + '/cases/' + doc.id).update({category_desc: data.name.trim()});
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

  borrarcategoria (index, data) {
    if (data && data.name && data.name.trim().length > 0) {

      swal({
        title: '¿Esta seguro?',
        text: 'Esta seguro de borrar la categoria',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then( borrar => {
        if (borrar) {
        this.editando = false;
        this.indexitem = index;
        this.isLoadingDelete = true;

          this._afs.collection('supportcase/' + this.identity.country + '/cases', ref => ref.where('category_id', '==', data.id)).get()
          .subscribe((respons: any) => {
            if (respons.size === 0) {

              this._afs.doc('supportcategory/' + data.id).delete().then(then => {
                swal('Categoria Eliminada', '', 'success');
                this.isLoadingDelete = false;
              }).catch(error => {
                this.isLoadingDelete = false;
                swal('Importante', 'A ocurrido un error', 'error');
              });
            } else {
              this.isLoadingDelete = false;
              swal('Importante', 'No se puede eliminar el "Categoria" por que existen solicitudes asociadas', 'error');
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

  addCategoria(data) {

    const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    this._afs.collection('supportcategory').add({
      name: data.name.trim(),
      type_id: this.data.id,
      create_to: this.userFirebase.uid,
      create_at: date,
      plazo: data.plazo.trim()
    })
    .then(function(docRef) {
        // console.log('Document written with ID: ', docRef.id);
        swal('Categoria registrada', '', 'success');

    })
    .catch(function(error) {
        console.error('Error adding document: ', error);
    });

  }

}

