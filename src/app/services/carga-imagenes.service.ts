import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import { AngularFirestore,  AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';


//MODELS
import { FileItem } from '../models/file-item';

//MODELS
import { Item } from '../models/item';


import { Observable } from 'rxjs';



@Injectable()
export class CargaImagenesService {


  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  private itemDoc: AngularFirestoreDocument<Item>;
  item: Observable<Item>;


 //private CARPETA_IMAGENES = 'img';

  constructor( 
    private afs: AngularFirestore
    ) { }


  cargarImagenesFirebase( imagenes: FileItem[], carpeta_archivo: string, created: any ) {
    const storageRef = firebase.storage().ref();
    for ( const item of imagenes ) {
      item.estaSubiendo = true;
      if ( item.progreso >= 100 ) {
        continue;
      }

      
      const uploadTask: firebase.storage.UploadTask =
                  storageRef.child(`${ carpeta_archivo }/${ item.nombreArchivo }`)
                            .put( item.archivo );

      uploadTask.on( 'state_changed',
        (snapshot: firebase.storage.UploadTaskSnapshot) => {
          item.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        }, (error) => {
          console.error("Error al subir");
        }, () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            //console.log('File available at', downloadURL);
            item.url = downloadURL;
            item.estaSubiendo = false;
            item.created = created;
            this.guardarImagen({ nombre: item.nombreArchivo, type: item.type, url: item.url, created:item.created  }, carpeta_archivo );
          });
        }
      );


    }

  }


  private guardarImagen( imagen: { nombre: string, type: string, url: string, created: any },  path: string ) {
    //this.itemDoc = this.db.doc(`${ path }/${ item.id }`);

    /*
    this.afs.collection(`${ path }/`).get().subscribe((querySnapshot) => {
    querySnapshot.forEach((doc) => {

        console.log(doc.id, " => ", doc.data());
    });
    });*/

    this.afs.collection<Item>(path, ref => ref.where('nombre', '==', imagen.nombre).limit(1))
    .get()
    .subscribe((data) => 
        { if(data.size > 0) 
          {            
          data.forEach((doc) =>
              {                
                this.afs.collection(`/${ path }`).doc(doc.id).set(imagen);
              }
            );               
          }else{
          this.afs.collection(`/${ path }`).add( imagen );
          }

        }
      );

  }

}
