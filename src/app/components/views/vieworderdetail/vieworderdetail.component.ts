import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl  } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';

// SERVICES
import { OrderserviceService, UserService } from 'src/app/services/service.index';

// MODELS
import { Order } from 'src/app/models/types';

// SLIDE COMPONENT
import { Options } from 'ng5-slider';

// MOMENT
import * as _moment from 'moment';
const moment = _moment;

export interface Item { id: any; comment: string; created: any; identity: string; }

@Component({
  selector: 'app-vieworderdetail',
  templateUrl: './vieworderdetail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./vieworderdetail.component.css']
})



export class ViewOrderDetailComponent implements OnInit, OnDestroy, OnChanges {

  public show = false;
  public identity: any;
  private token: any;
  private path = '';
  data: Order[] = [];
  isLoadingResults = false;
  isRateLimitReached = false;
  spenttimeminutes: any;
  spenttimehours: any;
  minValue: any;
  maxValue: any;
  options: Options;
  orderContent: Item[];
  toggleContent = false;
  projectid: number;
  created: FormControl;
  private itemsCollection: AngularFirestoreCollection<Item>;
  // private itemDoc: AngularFirestoreDocument<Item>;
  items: Observable<Item[]>;

  models: any[] = [
        {id: 0, name: 'Detalles', description: 'Detalles de OT', expand: true},
        {id: 1, name: 'Usuarios', description: 'Usuarios de OT', expand: true},
        {id: 2, name: 'Descripción', description: 'Descripcion de OT', expand: true},
        {id: 3, name: 'Fechas', description: 'Fechas de OT', expand: true},
        {id: 4, name: 'Actividad', description: 'Actividad de OT', expand: true},
        {id: 5, name: 'Tiempos Atención', description: 'Tiempo de OT', expand: true}
  ];

  row: any = {expand: false};

  @Input() orderid: number;

  constructor(
    private cd: ChangeDetectorRef,
    private _afs: AngularFirestore,
    private _orderService: OrderserviceService,
    private _userService: UserService,

    ) {
    this.created =  new FormControl(moment().format('YYYY[-]MM[-]DD HH:MM:SS'));
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
  }

  ngOnChanges(_changes: SimpleChanges) {
    if (this.token.token != null && this.orderid > 0) {
       this.loadData();
    } else {
       this.isRateLimitReached = true;
    }
    this.cd.markForCheck();
  }

  ngOnDestroy() {
  }


  enableDiv(row: any) {
     this.row.expand = !this.row.expand;
     this.models[row].expand = !this.models[row].expand;
  }

  loadData() {
    this.isLoadingResults = true;
    this._orderService.getOrderDetail(this.orderid, this.token.token)
      .then(response => {
        this.getData(response);
      })
      .catch(error => {
            this.isLoadingResults = false;
            this.isRateLimitReached = true;
            console.log(<any>error);
      });
      this.cd.markForCheck();
  }


  getData(response: any) {
    if (response) {
        response.subscribe(
          (some: any) => {
            if (some.datos) {
            this.data = some.datos;
            this.projectid = this.data[0]['project_id'];
            this.isRateLimitReached = false;
            this.isLoadingResults = false;
            this.getRouteFirebase(this.projectid);
            if (this.data[0].create_at && this.data[0].update_at) {
              this.getSpentTime();
            }

            } else {
            this.isRateLimitReached = true;
            }
          },
          (error) => {
            console.log(<any>error);
          });
    } else {
      return;
    }
    this.cd.markForCheck();
  }


  getSpentTime() {
      const createat = moment(this.data[0].create_at); // todays date
      const updateat = moment(this.data[0].update_at); // another date
      const duration = moment.duration(updateat.diff(createat));
      const timeminutes = duration.asMinutes();
      const timehours = duration.asHours();
      this.spenttimeminutes = timeminutes;
      this.spenttimehours = timehours;
      this.minValue = moment(this.data[0].create_at).format('YYYY-MM-DD HH:mm:ss');
      this.maxValue = moment(this.data[0].update_at).format('YYYY-MM-DD HH:mm:ss');
  }

  getRouteFirebase(id: number) {

    if (this.orderid > 0 && id > 0) {
      this.path = 'comments/' + id + '/' + this.orderid;
      this.itemsCollection = this._afs.collection<Item>(this.path, ref => ref.orderBy('created', 'desc'));
      this.items = this.itemsCollection.valueChanges();
    }
    this.cd.markForCheck();
  }

  addComment(value: any) {
    const docid = this._afs.createId();
    this.itemsCollection.doc(docid).set(
      {
        id: docid,
        comment: value,
        created: this.created.value,
        identity: this.identity.name + ' ' + this.identity.surname
      }
    );
    if (this.toggleContent) {
      this.toggleContent = false;
    }
    this.cd.markForCheck();
  }

  deleteCommentDatabase(value$: any) {
    this.itemsCollection.doc(value$).delete();
    if (this.toggleContent) {
      this.toggleContent = false;
    }
    this.cd.markForCheck();
  }

  toggle() {
    this.toggleContent = !this.toggleContent;
    this.orderContent = null;
    this.cd.markForCheck();
  }

}
