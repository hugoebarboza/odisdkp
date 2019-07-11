import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';
import { FormControl} from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material';

//MOMENT
import * as _moment from 'moment';
const moment = _moment;

//MODELS
import { Item } from 'src/app/models/types';


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


  constructor(
    private _userService: UserService,
    private afs: AngularFirestore,
    private storage: AngularFireStorage, 
    private db: AngularFirestore, 
    private toasterService: ToastrService, 
    public snackBar: MatSnackBar,
    ) 
    { 
      this.created =  new FormControl(moment().format('YYYY[-]MM[-]DD HH:MM'));
      this.identity = this._userService.getIdentity();
      this.error = 'Archivo no valido.';
    }

  ngOnInit() {
    this.startUpload();
  }


  startUpload() {
    // The File object
    this.type = this.file.type.split('/')[1];
  
    // Client-side validation example
    if (this.file.type.split('/')[1] !== 'pdf' && this.file.type.split('/')[0] !== 'image') { 
      //console.error('unsupported file type :( ')
      this.toasterService.warning('Error: '+this.error, 'Error', {enableHtml: true,closeButton: true, timeOut: 6000 });
      return;
    }
    // The storage path
    
    //const path = 'allfiles/projects/' + this.project_id + '/' + this.service_id + '/files';
    const path = 'allfiles/projects/' + this.project_id + '/' + this.service_id + '/files'+`/${this.file.name}`;
    this.CARPETA_ARCHIVOS = 'allfiles/projects/' + this.project_id + '/' + this.service_id + '/files';
    const ref = this.storage.ref(path);    

    // Totally optional metadata
    //const customMetadata = { app: 'Inspecciones OCA' };

    // The main task
    this.task = this.storage.upload(path, this.file)
    

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot   = this.task.snapshotChanges()

    this.task.snapshotChanges().pipe(
      finalize( async() => 
        { 
            this.downloadURL = await ref.getDownloadURL().toPromise();
            //this.downloadURL = fileRef.getDownloadURL();
            this.snackBar.open('Guardadon documentos.', '', {duration: 2000,});            
            this.guardarImagen({ nombre: this.file.name, type: this.type, url: this.downloadURL, created:this.created.value,  identity: this.identity.name + ' ' + this.identity.surname }, this.CARPETA_ARCHIVOS );

            /*this.profileUrl = ref.getDownloadURL().subscribe(url => { 
            this.Url = url; // for ts
            if(this.Url){
              this.guardarImagen({ nombre: this.file.name, type: this.type, url: this.Url, created:this.created.value,  identity: this.identity.name + ' ' + this.identity.surname }, this.CARPETA_ARCHIVOS );
            }  
            })*/
        }
        )
    )
    .subscribe()

    // The file's download URL
    //this.downloadURL = this.task.downloadURL(); 
  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes
  }


  private guardarImagen( imagen: { nombre: string, type: string, url: any, created: any, identity:string },  path: string ) {

   
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