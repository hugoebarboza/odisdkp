import { Component, OnInit, Input } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { FormControl} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';

//MATERIAL
import { MatSnackBar } from '@angular/material';

//MODELS
import { Item } from '../../models/item';

//SERVICES
import { UserService } from '../../services/user.service';

//TOASTER MESSAGES
import { ToastrService } from 'ngx-toastr';


//MOMENT
import * as _moment from 'moment';
const moment = _moment;


@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  private CARPETA_ARCHIVOS = '';
  created: any;
  file:any;
  identity: any;
  item: Observable<Item>;
  private itemsCollection: AngularFirestoreCollection<Item>;
  profileUrl: any;
  type:any;
  Url: string;


  
  // Main task 
  task: AngularFireUploadTask;
  // Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;

  // Download URL
  downloadURL: Observable<string>;

  // State for dropzone CSS toggling
  isHovering: boolean;

  //MESSAGE
  error: string;

  @Input() project_id : number;
  @Input() service_id : number;


  
  constructor(
    private afs: AngularFirestore, 
    private storage: AngularFireStorage,
    public snackBar: MatSnackBar,  
    private toasterService: ToastrService,
    private _userService: UserService,
    ) 
    { 
    this.created =  new FormControl(moment().format('YYYY[-]MM[-]DD HH:MM'));
    this.identity = this._userService.getIdentity();
    this.error = 'Archivo no valido.';
  }

  ngOnInit() {
    //console.log(this.project_id);
    //console.log(this.service_id);
  }
  
  toggleHover(event: boolean) {
    this.isHovering = event;
  }


  startUpload(event: FileList) {
    // The File object
    if(event){
      this.file = event.item(0);
      this.type = this.file.type.split('/')[1];  
    }
  
    // Client-side validation example
    if (this.file.type.split('/')[1] !== 'pdf' && this.file.type.split('/')[0] !== 'image') { 
      //console.error('unsupported file type :( ')
      this.toasterService.warning('Error: '+this.error, 'Error', {enableHtml: true,closeButton: true, timeOut: 6000 });
      return;
    }
    // The storage path
    const path = `filesprojects/`+this.project_id+'/'+this.service_id+'/'+`${this.file.name}`;
    this.CARPETA_ARCHIVOS = 'filesprojects/'+this.project_id+'/'+this.service_id;
    const fileRef = this.storage.ref(path);    

    // Totally optional metadata
    const customMetadata = { app: 'Inspecciones OCA' };

    // The main task
    this.task = this.storage.upload(path, this.file, { customMetadata })
    

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot   = this.task.snapshotChanges()

    this.task.snapshotChanges().pipe(
      finalize(() => 
        { 
            this.downloadURL = fileRef.getDownloadURL();
            this.snackBar.open('Guardadon documentos.', '', {duration: 2000,});
            this.profileUrl = fileRef.getDownloadURL().subscribe(url => { 
            this.Url = url; // for ts
            if(this.Url){
              this.guardarImagen({ nombre: this.file.name, type: this.type, url: this.Url, created:this.created.value,  identity: this.identity.name + ' ' + this.identity.surname }, this.CARPETA_ARCHIVOS );
            }  
            })
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


}
