import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { saveAs } from 'file-saver';

//MODELS
import { Item } from '../models/item';

import * as firebase from 'firebase/app';
import { AngularFirestore,  AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';

@Injectable({
  providedIn: 'root'
})
export class ItemFirebaseService {


  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  private itemDoc: AngularFirestoreDocument<Item>;
  item: Observable<Item>;
  downloadURL: any;
  file: any;

  editState: boolean = false;

  constructor(
    private afs: AngularFirestore,
    public _http: HttpClient,

  	) { 
  }

  getItems(path:any){

    this.itemsCollection = this.afs.collection<Item>(path, ref => ref.orderBy('nombre','asc'));
    
    this.items = this.itemsCollection.auditTrail().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Item;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    return this.items;
  }





  deleteDoc(path, item: Item): Observable<any> {
      this.clearState();            
      const pathReference = path+'/'+item;
          
        this.deleteFileDatabase(path, item)
          .then(() => {            
            this.deleteFileStorage(path, item);
          })
          .catch(error => console.log(error));
          
   	 return this.getItems(path);  

  }

     
  private deleteFileDatabase(path, item) {
         this.itemDoc = this.afs.doc(`${ path }/${ item.id }`);
         return this.itemDoc.delete();
  }
     
  private deleteFileStorage(path, item) {
        const storageRef = firebase.storage().ref();
        storageRef.child(`${ path }/${ item.nombre }`).delete();
  } 

  clearState(){
    this.editState = false;
  //  this.itemToEdit = null;
  }   

}
