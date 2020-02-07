import { Component, OnInit, Input } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

//MODELS
import { UserFirebase } from 'src/app/models/types';

import * as _moment from 'moment';
const moment = _moment;

import { ToastrService } from 'ngx-toastr';


@Component({  
  selector: 'app-reportkpi',
  templateUrl: './reportkpi.component.html',
  styleUrls: ['./reportkpi.component.css']
})

export class ReportkpiComponent implements OnInit {

  @Input() project_id: number;
  @Input() service_id: number;
  @Input() servicetype_id: number;
  nuevoboo: boolean = false;
  userFirebase: UserFirebase;
  ruta: string;
  porcentaje = '0%';
  forma: FormGroup;
  public porcentaje$: Observable<any[]>;
  private porcentajeCollection: AngularFirestoreCollection<any>;
  startOfMonth: string;
  endOfMonth: string;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private _afs: AngularFirestore,
    private toasterService: ToastrService
  ) {
    this.firebaseAuth.authState.subscribe(
      (auth) => {
        if (auth) {
          this.userFirebase = auth;
        }
    });
  }

  ngOnInit() {
    this.startOfMonth = moment(new Date(), 'MM').startOf('month').format('YYYY-MM-DD HH:mm:ss');
    this.endOfMonth   = moment(new Date(), 'MM').endOf('month').format('YYYY-MM-DD HH:mm:ss');

    this.forma = new FormGroup({
      newporcentaje: new FormControl (null, [Validators.required])
    });
    this.ruta = 'kpi/projects/' + this.project_id + '/' + this.service_id + '/' + this.servicetype_id + '/';
    //console.log(this.ruta);
    this.mostarporcentaje();
  }


  mostarporcentaje() {

    this.porcentajeCollection = this._afs.collection(this.ruta, ref =>
      ref.orderBy('create_at', 'desc')
      .limit(1));
    this.porcentajeCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    ).subscribe( (collection: any[]) => {

        //console.log(collection);
        const count = Object.keys(collection).length;
        if (count === 0) {
        } else {
          this.porcentaje = collection[0].porcentaje + '\%';
        }
      }
    );
  }

  save(event) {
    if (this.isPositiveInteger(event.target.value)) {
      const num = event.target.value;
      if (num >= 0 && num <= 100) {
      } else {
        event.target.value = '';
      }
    } else {
      event.target.value = '';
    }

  }

  isPositiveInteger(val: any) {
    return val === '0' || ((val || 0) > 0 && val % 1 === 0);
  }

  confirmAdd(data: any) {

    const that = this;
    this._afs.collection(this.ruta, ref => ref.where('create_at', '>=', this.startOfMonth)
      .where('create_at', '<=', this.endOfMonth).limit(1))
      .get()
      .subscribe(res => {
        if (!res.empty) {
          res.docs.forEach(doc => {
            // const document = {id: doc.id};
            // console.log(doc.id);
            this._afs.doc(this.ruta +  doc.id).update({porcentaje: data.newporcentaje})
              .then(function(_docRef) {
                // console.log(docRef);
                that.toasterService.success('Pocentaje de avance registrado', 'Exito', {timeOut: 8000});
              })
              .catch(function(error) {
                console.error('Error updating document: ', error);
              });
          });

        } else {

          const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

          this._afs.collection(this.ruta).add({
            porcentaje: parseInt( data.newporcentaje, 0),
            create_to: this.userFirebase.uid,
            create_at: date,
            mes: parseInt(moment(new Date()).format('MM'), 0)
          })
          .then(function(_docRef) {
              // console.log('Document written with ID: ', docRef.id);
              that.toasterService.success('Pocentaje de avance registrado', 'Exito', {timeOut: 8000});
          })
          .catch(function(error) {
              console.error('Error adding document: ', error);
          });
        }
      });
  }

  slide(event: MatSlideToggleChange) {
    console.log(event);
    if (event.checked) {
      this.nuevoboo = true;
    } else {
      this.nuevoboo = false;
    }
  }

}
