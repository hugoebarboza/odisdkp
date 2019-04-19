import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormControl  } from '@angular/forms';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

//SERVICES
import { OrderserviceService, UserService } from '../../../services/service.index';

//MODELS
import { Order } from '../../../models/types';

//SLIDE COMPONENT
import { Options } from 'ng5-slider';

//MOMENT
//MOMENT
import * as _moment from 'moment';
const moment = _moment;

export interface Item { id: any, comment: string; created: any, identity: string}

@Component({
  selector: 'app-vieworderdetail',
  templateUrl: './vieworderdetail.component.html',
  styleUrls: ['./vieworderdetail.component.css']
})



export class ViewOrderDetailComponent implements OnInit, OnDestroy, OnChanges {

  public show:boolean = false;
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
  toggleContent: boolean = false;
  projectid:number;
  created: FormControl;
  private itemsCollection: AngularFirestoreCollection<Item>;
  private itemDoc: AngularFirestoreDocument<Item>;
  items: Observable<Item[]>;

  models: any[] = [
        {id:0, name:'Detalles', description:'Detalles de OT', expand: true},
        {id:1, name:'Usuarios', description:'Usuarios de OT', expand: true},
        {id:2, name:'Descripción', description:'Descripcion de OT', expand: true},
        {id:3, name:'Fechas', description:'Fechas de OT', expand: true},
        {id:4, name:'Actividad', description:'Actividad de OT', expand: true},
        {id:5, name:'Tiempos Atención', description:'Tiempo de OT', expand: true}
  ];

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Escriba aqui...',
    translate: 'no',
    uploadUrl: 'v1/images', // if needed
    customClasses: [ // optional
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };  

	row: any = {expand: false};

  @Input() orderid : number;

  constructor(
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

  ngOnChanges(changes: SimpleChanges) {
    if(this.token.token != null && this.orderid > 0){
       this.loadData();    
    }else{
       this.isRateLimitReached = true;        
    } 

    //console.log(this.orderid);
  }

  ngOnDestroy() {
  }


	enableDiv(row:any){
	   this.row.expand = !this.row.expand;
	   this.models[row].expand = !this.models[row].expand;
	}

  loadData(){
    this.isLoadingResults = true;
    this._orderService.getOrderDetail(this.orderid, this.token.token)
      .then(response => {
        this.getData(response)
      })
      .catch(error => {                      
            this.isLoadingResults = false;
            this.isRateLimitReached = true;
            console.log(<any>error);          
      });    
  }


  getData(response: any){
    if(response){
        response.subscribe(
          (some:any) => 
          {           
            if(some.datos){
            this.data = some.datos;
            this.projectid = this.data[0]['project_id'];
            this.isRateLimitReached = false;          
            this.isLoadingResults = false;
            //Determinar ruta de Firebase
            this.getRouteFirebase(this.projectid)
            //Determinar tiempo transcurrido
            if(this.data[0].create_at && this.data[0].update_at){
              this.getSpentTime();
            }

            }else{
            this.isRateLimitReached = true;          
            }
          },
          (error) => {                      
            console.log(<any>error);
          });
    }else{
      return;
    }
  }


  getSpentTime(){
      let createat = moment(this.data[0].create_at); //todays date
      let updateat = moment(this.data[0].update_at); // another date
      let duration = moment.duration(updateat.diff(createat));
      let timeminutes = duration.asMinutes();
      let timehours = duration.asHours();
      this.spenttimeminutes = timeminutes;
      this.spenttimehours = timehours;
      this.minValue = moment(this.data[0].create_at).format("YYYY-MM-DD HH:mm:ss");
      this.maxValue = moment(this.data[0].update_at).format("YYYY-MM-DD HH:mm:ss");
      //this.minValue = moment(this.data[0].create_at).format("HH:mm:ss");
      //this.maxValue = moment(this.data[0].update_at).format("HH:mm:ss");

    /*
                  let one_day=1000*60*60*24;
              let date1 = new Date(this.data[0].create_at).getTime();
              let date2 = new Date(this.data[0].update_at).getTime();
              let time = date2 - date1;  //msec
              let hoursDiff = time / (3600 * 1000);
              console.log(date1);
              console.log(date2);
              console.log(hoursDiff);
              console.log(hoursDiff/one_day);

    */

  }

  getRouteFirebase(id:number){
    
    if (this.orderid > 0 && id > 0){
      this.path = 'comments/'+id+'/'+this.orderid;
      this.itemsCollection = this._afs.collection<Item>(this.path, ref => ref.orderBy('created','desc'));      
      this.items = this.itemsCollection.valueChanges();
    }        
  }

  addComment(value:any) { 
    const docid = this._afs.createId();
    this.itemsCollection.doc(docid).set(
      {
        id: docid,
        comment: value,
        created: this.created.value,
        identity: this.identity.name + ' ' + this.identity.surname
      }      
    );
    if(this.toggleContent){
      this.toggleContent=false;
    }   
  }

  deleteCommentDatabase(value$: any) {    
    this.itemsCollection.doc(value$).delete();
    if(this.toggleContent){
      this.toggleContent=false;
    }   
  }  

  toggle() {
    this.toggleContent = !this.toggleContent;
    this.orderContent = null;
  }

}
