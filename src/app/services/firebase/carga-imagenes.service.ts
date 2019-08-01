import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore,  AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

//MODELS
import { FileItem, Item } from '../../models/types';

import { Observable } from 'rxjs';
import { image } from 'html2canvas/dist/types/css/types/image';



@Injectable()
export class CargaImagenesService {


  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  private itemDoc: AngularFirestoreDocument<Item>;
  item: Observable<Item>;


 // private CARPETA_IMAGENES = 'img';

  constructor(
    private afs: AngularFirestore
    ) { }

  cargarImagenesFirebase( imagenes: FileItem[], carpeta_archivo: string, created: any , extra?) {
    const storageRef = firebase.storage().ref();
    for ( const item of imagenes ) {
      item.estaSubiendo = true;
      if ( item.progreso >= 100 ) {
        continue;
      }

      //console.log(item);
      const uploadTask: firebase.storage.UploadTask =
                  storageRef.child(`${ carpeta_archivo }/${ item.nombreArchivo }`)
                            .put( item.archivo );

      uploadTask.on( 'state_changed',
        (snapshot: firebase.storage.UploadTaskSnapshot) => {

          const count = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (count < 99) {
            item.progreso = Math.round(count);
          }

          if (count > 99 && count < 100) {
            item.progreso = 99;
          }

          if (count === 100) {
            item.progreso = 100;
          }

          //console.log('PROGESOO:   ' + item.progreso );
        }, (error) => {
          console.error('Error al subir');
        }, () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            // console.log('File available at', downloadURL);
            item.url = downloadURL;
            item.estaSubiendo = false;
            item.created = created;
            // tslint:disable-next-line:max-line-length

            if (extra) {
              // tslint:disable-next-line:max-line-length
              this.guardarImagenExtra({ nombre: item.nombreArchivo, type: item.type, url: item.url, created: item.created, id_case: extra }, carpeta_archivo );
            } else {
              this.guardarImagen({ nombre: item.nombreArchivo, type: item.type, url: item.url, created: item.created  }, carpeta_archivo);
            }

          });
        }
      );

    }

  }


  cargarImagenesProjectFirebase( imagenes: FileItem[], carpeta_archivo: string, source: string, data:any, created: any , extra: any, uid: any):  Promise<any> {
    const storageRef = firebase.storage().ref();
    let files = [];

    return new Promise((resolve, reject) => {
      if (!imagenes) reject('Sin Imagenes');
      if (carpeta_archivo == '') reject('Sin Rute');

        for ( const item of imagenes ) {
          item.estaSubiendo = true;
          if ( item.progreso >= 100 ) {
            continue;
          }
    
          //console.log(item);
          const uploadTask: firebase.storage.UploadTask =
                      storageRef.child(`${ carpeta_archivo }/${ item.nombreArchivo }`)
                                .put( item.archivo );
    
          uploadTask.on( 'state_changed', (snapshot: firebase.storage.UploadTaskSnapshot) => {
              const count = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              if (count < 99) {
                item.progreso = Math.round(count);
              }
              if (count > 99 && count < 100) {
                item.progreso = 99;
              }
              if (count === 100) {
                item.progreso = 100;
              }
              //console.log('PROGESOO:   ' + item.progreso );
            },(error) => {
              console.error('Error al subir');
              item.status = 'Error';
              files.push(item);
              if(files.length == imagenes.length){
                resolve(files);
              }        
            }, () => {
              // Handle successful uploads on complete
              uploadTask.snapshot.ref.getDownloadURL()
              .then((downloadURL) => {
                item.url = downloadURL;
                item.estaSubiendo = false;
                item.created = created;
                item.status = 'Success';
                files.push(item);
                this.guardarImagenProjectExtra({ nombre: item.nombreArchivo, type: item.type, url: item.url, created: item.created, id: extra, uid:uid }, carpeta_archivo, source, data );
                if(files.length == imagenes.length){
                  resolve(files);
                }        
              });
            }
          );
        }
    });

    /*
    return new Promise((resolve, reject) => {
      if (!imagenes)
          reject('Sin Imagenes');
      if (carpeta_archivo == '')
          reject('Sin Rute');
      
      resolve(

      );    
    });*/



  }



  cargarImagenesProjectServiceFirebase( imagenes: FileItem[], carpeta_archivo: string, data:any, created: any , extra: any, uid: any) {
    const storageRef = firebase.storage().ref();
    for ( const item of imagenes ) {
      item.estaSubiendo = true;
      if ( item.progreso >= 100 ) {
        continue;
      }

      //console.log(item);
      const uploadTask: firebase.storage.UploadTask =
                  storageRef.child(`${ carpeta_archivo }/${ item.nombreArchivo }`)
                            .put( item.archivo );

      uploadTask.on( 'state_changed',
        (snapshot: firebase.storage.UploadTaskSnapshot) => {

          const count = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (count < 99) {
            item.progreso = Math.round(count);
          }

          if (count > 99 && count < 100) {
            item.progreso = 99;
          }

          if (count === 100) {
            item.progreso = 100;
          }

          //console.log('PROGESOO:   ' + item.progreso );
        }, (error) => {
          console.error('Error al subir');
        }, () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            // console.log('File available at', downloadURL);
            item.url = downloadURL;
            item.estaSubiendo = false;
            item.created = created;
            this.guardarImagenProjectServiceExtra({ nombre: item.nombreArchivo, type: item.type, url: item.url, created: item.created, id: extra, uid: uid }, carpeta_archivo );

          });
        }
      );

    }

  }


  private guardarImagenExtra( imagen: { nombre: string, type: string, url: string, created: any, id_case: any },  path: string ) {

    //console.log(path);
    this.afs.collection(`${ path }`).add( imagen );

  }

  private guardarImagenProjectExtra( imagen: { nombre: string, type: string, url: string, created: any, id: any, uid: any },  path: string, source:string, data:any ) {

    //console.log(path);
    const that = this;
    this.afs.collection(`${ path }`).add( imagen )
    .then(function(docRef) {      
      if (docRef) {        
        let obj = {
          nombre: imagen.nombre,
          type: imagen.type, 
          url:  imagen.url, 
          created: imagen.created, 
          id: imagen.id,
          iddocfile: docRef.id,
          ref: path,
          data: data,
          uid: imagen.uid
        }
        that.afs.collection(`${ source }`).add( obj )
        .then(function(docColRef) {
          that.afs.collection(`${ path }`).doc(docRef.id).update({iddoccol : docColRef.id})
        }
        );    
      }
      
    });

  }


  private guardarImagenProjectServiceExtra( imagen: { nombre: string, type: string, url: string, created: any, id: any, uid:any },  path: string ) {

    this.afs.collection(`${ path }`).add( imagen );

  }


  private guardarImagen( imagen: { nombre: string, type: string, url: string, created: any },  path: string) {
    // this.itemDoc = this.db.doc(`${ path }/${ item.id }`);

    /*
    this.afs.collection(`${ path }/`).get().subscribe((querySnapshot) => {
    querySnapshot.forEach((doc) => {

        console.log(doc.id, " => ", doc.data());
    });
    });*/


    //console.log(path);
    this.afs.collection<Item>(path, ref => ref.where('nombre', '==', imagen.nombre).limit(1))
    .get()
    .subscribe((data) => { if (data.size > 0) {
          //console.log(data);
          data.forEach((doc) => {
                //console.log(doc.id);
                //console.log(doc.id);
                this.afs.collection(`${ path }`).doc(doc.id).set(imagen);
              }
            );
          } else {
          this.afs.collection(`${ path }`).add( imagen );
          }

        }
      );

  } 

}
