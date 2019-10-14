import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
//import { AngularFirestore } from 'angularfire2/firestore';
import { FormControl} from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material';

//FIREBASE
//import { AngularFireAuth } from 'angularfire2/auth';
//import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';


//MOMENT
import * as _moment from 'moment';
const moment = _moment;

//MODELS
import { Item, UserFirebase } from 'src/app/models/types';


//SERVICES
import { UserService } from 'src/app/services/service.index';




@Component({
  selector: 'app-upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.css']
})
export class UploadTaskComponent implements OnInit {

  @Input() file: File;
  @Input() project_id : number;
  @Input() service_id : number;


  CARPETA_ARCHIVOS: any;
  created: any;
  error:string;
  identity: any;
  type:any;
  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: any;
  profileUrl: any;
  Url: string;
  userFirebase: UserFirebase;


  constructor(
    private _userService: UserService,
    private afs: AngularFirestore,
    private firebaseAuth: AngularFireAuth,
    private storage: AngularFireStorage, 
    // private db: AngularFirestore, 
    private toasterService: ToastrService, 
    public snackBar: MatSnackBar,
    ) 
    { 
      this.created =  new FormControl(moment().format('YYYY[-]MM[-]DD HH:MM'));
      this.identity = this._userService.getIdentity();
      this.error = 'Archivo no valido.';

      this.firebaseAuth.authState.subscribe(
        (auth) => {
          if(auth){
            this.userFirebase = auth;
          }
      });
  
    }

  ngOnInit() {
    this.startUpload();
  }


  startUpload() {
    // The File object
    this.type = this.file.type.split('/')[1];
    //console.log(this.file);
    if (this._isValidFile(this.file)) {      
      const path = 'allfiles/projects/' + this.project_id + '/' + this.service_id + '/files'+`/${this.file.name}`;
      this.CARPETA_ARCHIVOS = 'allfiles/projects/' + this.project_id + '/' + this.service_id + '/files';
      const ref = this.storage.ref(path);
      // The main task
      this.task = this.storage.upload(path, this.file)    
      // Progress monitoring
      this.percentage = this.task.percentageChanges();
      this.snapshot   = this.task.snapshotChanges()

      this.task.snapshotChanges().pipe(
        finalize( async() => 
          { 
              this.downloadURL = await ref.getDownloadURL().toPromise();
              this.snackBar.open('Guardadon documentos.', '', {duration: 2000,});            
              this.guardarImagen({ nombre: this.file.name, type: this.type, url: this.downloadURL, created:this.created.value,  uid: this.userFirebase.uid }, this.CARPETA_ARCHIVOS );
          }
          )
      )
      .subscribe()

    }else{
      this.toasterService.warning('Error: '+this.error, 'Error', {enableHtml: true,closeButton: true, timeOut: 6000 });
      return;
    }
     
  }

  private guardarImagen( imagen: { nombre: string, type: string, url: any, created: any, uid:string },  path: string ) {

   
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


  private _isValidFile( tipoArchivo: File ): boolean {
    //console.log(tipoArchivo);
    if ( tipoArchivo.type === '' || tipoArchivo.type === undefined ) {
      const type = tipoArchivo.name.split('.')[1];
      
      if ( type === 'dwg' || tipoArchivo.type === "dwg" ) {
        this.type = 'dwg';
        return true;
      }

      if ( type === 'xls' || tipoArchivo.type === "xls" ) {
        this.type = 'xls';
        return true;
      }


      if ( type === 'xlsx' || tipoArchivo.type === "xlsx" ) {
        this.type = 'xlsx';
        return true;
      }


      if ( type === 'doc' || tipoArchivo.type === "doc" ) {
        this.type = 'doc';
        return true;
      }

      if ( type === 'docx' || tipoArchivo.type === "docx" ) {
        this.type = 'docx';
        return true;
      }


      return false;  
    }

    if(tipoArchivo.type.startsWith('image')){
      this.type = tipoArchivo.type;
      return true;
    }

    if(tipoArchivo.type.startsWith('pdf')){
      this.type = tipoArchivo.type;
      return true;
    }


    if(tipoArchivo.type.startsWith('application/pdf')){
      this.type = tipoArchivo.type;
      return true;
    }

    if(tipoArchivo.type.startsWith('application/x-rar-compressed')){
      this.type = tipoArchivo.type;
      return true;
    }

    if(tipoArchivo.type.startsWith('application/x-zip-compressed')){
      this.type = tipoArchivo.type;
      return true;
    }

    if(tipoArchivo.type.startsWith('application/vnd.ms-excel')){
      this.type = tipoArchivo.type;
      return true;
    }

    if(tipoArchivo.type.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')){
      this.type = tipoArchivo.type;
      return true;
    }

    if(tipoArchivo.type.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')){
      this.type = tipoArchivo.type;
      return true;
    }

    if(tipoArchivo.type.startsWith('application/x-zip-compressed')){
      this.type = tipoArchivo.type;
      return true;
    }

    if(tipoArchivo.type.startsWith('application/msword')){
      this.type = tipoArchivo.type;
      return true;
    }
      
    if(tipoArchivo.type.startsWith('video')){
      this.type = tipoArchivo.type;
      return true;
    }
        
    //return ( tipoArchivo === '' || tipoArchivo === undefined ) ? false : tipoArchivo.startsWith('image');
  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes
  }


  /*
  startUpload() {

    // The storage path
    const path = `test/${Date.now()}_${this.file.name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, this.file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot   = this.task.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
      finalize( async() =>  {
        this.downloadURL = await ref.getDownloadURL().toPromise();

        this.db.collection('files').add( { downloadURL: this.downloadURL, path });
      }),
    );
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }*/

}