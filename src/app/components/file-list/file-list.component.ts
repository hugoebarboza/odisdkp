import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl} from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { defer, combineLatest } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { tap, switchMap, map } from 'rxjs/operators';
declare var swal: any;


//import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

//MATERIAL
import { MatPaginator, MatSnackBar, MatSort, MatTableDataSource, TooltipPosition } from '@angular/material';

import * as FileSaver from 'file-saver';

import * as firebase from 'firebase/app';

//SERVICES
import { UserService } from '../../services/service.index';

//MODELS
import { Item } from '../../models/types';

import * as _moment from 'moment';
const moment = _moment;

import { forkJoin } from 'rxjs';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import { ResponseContentType, Http } from '@angular/http';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {


  title = 'Listado de documentos';
  subtitle = 'Seleccione el archivo a borrar, descargar o visualizar.';
  items: Item[];
  CARPETA_ARCHIVOS: string;
  isLoadingResults = true;
  isLoadingDownload = false;
  isRateLimitReached: boolean = true;
  file: any;
  indexitem: number;
  profileUrl: Observable<any>;
  selection = new SelectionModel<any>(true, []);

  public files$: Observable<any[]>;
  private filesCollection: AngularFirestoreCollection<any>;

  columnsToDisplay: string[] = ['select', 'nombre', 'tipo', 'create_at', 'create_by', 'visualizar'];   
  dataSource: MatTableDataSource<Item>;

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionheaderaction = new FormControl(this.positionOptions[2]);
  positiondatasourceaction = new FormControl(this.positionOptions[3]);

  @Input() project_id: number;
  @Input() service_id: number;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  getRequests = [];
  // tslint:disable-next-line:max-line-length
  constructor(
    private _afs: AngularFirestore,
    public http: Http,
    public _http: HttpClient,
    public _userService: UserService,
    // private itemService: ItemFirebaseService,
    public snackBar: MatSnackBar,
    ) {
  }

  ngOnInit() {
    if (this.project_id > 0 && this.service_id > 0){
        // this.CARPETA_ARCHIVOS = 'filesprojects/'+this.project_id+'/'+this.service_id;
        this.CARPETA_ARCHIVOS = 'allfiles/projects/' + this.project_id + '/' + this.service_id + '/files';
        this.filesCollection = this._afs.collection(this.CARPETA_ARCHIVOS, ref => ref.orderBy('created', 'desc'));
        this.filesCollection.snapshotChanges().pipe(
          map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data();
              const idfile = a.payload.doc.id;
              return { idfile, ...data };
            });
          })
        ).subscribe( (collection: any[]) => {
            const count = Object.keys(collection).length;
            if (count === 0) {
              this.isLoadingResults = false;
              this.dataSource = null;
            } else {
              this.gojoin(of(collection));
            }
          }
        );

        /*
        this.itemService.getItems(this.CARPETA_ARCHIVOS).subscribe(
          data => {
            //console.log(data);
            if(data.length > 0){
            this.items = data;
            this.dataSource = new MatTableDataSource(this.items);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.isRateLimitReached = false;
            this.isLoadingResults = false;
            }else{
              this.isRateLimitReached = true;
              this.isLoadingResults = false;
            }
          });    */
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (this.selection.isEmpty()) {
      return false;
    }
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    // console.log(this.selection.selected.length);
    // console.log(this.selection.selected);
    return numSelected === numRows;
  }

  descargar() {
    
    this.isLoadingResults = true;
    this.getRequests = [];
    this.createGetRequets(this.selection.selected);

    // tslint:disable-next-line: deprecation
    forkJoin(...this.getRequests).subscribe(res => {
      const zip = new JSZip();
      let fileName: String;

      // console.log(res);
      res.forEach((f, i) => {
        // console.log(i);
        // console.log(this.selection.selected[i]);
        if (this.selection.selected[i]['data']) {
          fileName = this.selection.selected[i]['data']['order_number'] + '/' + this.selection.selected[i]['nombre'];
        } else {
          fileName = this.selection.selected[i]['nombre'];
        }

          // extract filename from the response
          zip.file(`${fileName}`, f._body, { binary: true, createFolders: true });
          // use it as name, this way we don't need the file type anymore

        // console.log(zip);
      });

      const date = moment(new Date()).format('YYYY-MM-DD_hh-mm-ss');
      zip
        .generateAsync({ type: 'blob' })
        .then(blob => saveAs(blob, 'Documentos_' + date + '.zip'));

        this.isLoadingResults = false;
    });
  }

  private createGetRequets(data: any) {
    data.forEach(liststorage =>
      this.getRequests.push(
        // tslint:disable-next-line: deprecation
        this.http.get(liststorage.url, { responseType: ResponseContentType.Blob })
      )
    );
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => {this.selection.select(row)});
        // console.log(this.selection);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
  if (!row) {
    return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  gojoin(collection) {
    collection.pipe(
      leftJoin(this._afs, 'uid', 'users', 0, '', '', 'username'),
    ).subscribe(
      data => {
        // console.log(data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isRateLimitReached = false;
        this.isLoadingResults = false;
      }
    );
  }



  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  downloadItem(item: Item, i: number) {
    this.isLoadingDownload = true;
    this.indexitem = i;

    if (item.url) {
      this._http.get(item.url, {responseType: 'blob'})
      .subscribe(
        blob => {
          FileSaver.saveAs(blob, item.nombre);
          this.isLoadingDownload = false;
          this.indexitem = -1;
        },
        (error:any) => {
          console.log(error);
        },        
        );
        
    }
    /*
    this.isLoadingDownload = true;
    this.indexitem = i;
    const storageRef = firebase.storage().ref(`${ this.CARPETA_ARCHIVOS }/${ item.nombre }`);

    if (storageRef) {
      const _url = storageRef.getDownloadURL()
      .then(
       (url) => {
         this._http.get(url, {responseType: "blob"})
          .subscribe(blob => {
            FileSaver.saveAs(blob, item.nombre);
          });          
          //this.isLoadingResults = false;      
          this.isLoadingDownload = false;
          this.indexitem = -1;
       })
      .catch(
        (error)=> { 
         console.log(error);
         this.isLoadingDownload = false;
         this.indexitem = -1;
      });
    } */


  }


  deleteItem(item: any){

    const storageRef = firebase.storage().ref();
    
    /*
    if(item.data){      
      storageRef.child(item.ref +'/'+ item.nombre).delete();
      this._afs.doc(item.ref +'/'+ item.iddocfile).delete();
      this._afs.doc(this.CARPETA_ARCHIVOS +'/'+ item.idfile).delete();
      this.snackBar.open('Se ha eliminado el documento.', 'Eliminado', {duration: 2000,});   
    }else{
      storageRef.child(this.CARPETA_ARCHIVOS +'/'+ item.nombre).delete();
      this._afs.doc(this.CARPETA_ARCHIVOS +'/'+ item.idfile).delete();
      this.snackBar.open('Se ha eliminado el documento.', 'Eliminado', {duration: 2000,});       
    }*/

    /*
    if(item){
      this.isLoadingResults = true;
      this.itemService.deleteDoc(item.ref, item).subscribe(
      data => {
        this.ngOnInit();
       //this.items = data;
       //this.dataSource = new MatTableDataSource(this.items);      
       this.isLoadingResults = false;
       if(data.length == 0){
         this.isRateLimitReached = true;
       }
       });
       this.snackBar.open('Se ha eliminado el documento.', 'Eliminado', {duration: 2000,});   
    }*/

    /*

    const storageRef = firebase.storage().ref(`${ this.CARPETA_ARCHIVOS }/${ item.id }`);
    if (storageRef) {
      storageRef.getDownloadURL()
      .then(
       (url) => {
         console.log(url);
          return storageRef.storage.refFromURL(url).delete();
       })
      .catch(
        (error)=> { 
         console.log(error);
      });
    } */

    

    
    
    swal({
      title: '¿Esta seguro?',
      text: 'Esta seguro de borrar documento con nombre ' + item.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if(borrar){
        if(item.data){      
          storageRef.child(item.ref +'/'+ item.nombre).delete();
          this._afs.doc(item.ref +'/'+ item.iddocfile).delete();
          this._afs.doc(this.CARPETA_ARCHIVOS +'/'+ item.idfile).delete();
          this.snackBar.open('Se ha eliminado el documento.', 'Eliminado', {duration: 2000,});   
        }else{
          storageRef.child(this.CARPETA_ARCHIVOS +'/'+ item.nombre).delete();
          this._afs.doc(this.CARPETA_ARCHIVOS +'/'+ item.idfile).delete();
          this.snackBar.open('Se ha eliminado el documento.', 'Eliminado', {duration: 2000,});       
        }
      }
    });

  }



}

export const leftJoin = (
  afs: AngularFirestore,
  field,
  collection,
  type: number,
  where: string,
  condition,
  nameObject
  ) => {
  return source =>
    defer(() => {

      // Operator state
      let collectionData;

      // Track total num of joined doc reads
      // let totalJoins = 0;

      return source.pipe(
        switchMap(data => {
          // Clear mapping on each emitted val ;
          // Save the parent data state
          collectionData = data as any[];

          const reads$ = [];
          for (const doc of collectionData) {

            // Push doc read to Array
            if (doc[field]) {
              // Perform query on join key, with optional limit
              // const q = ref => ref.where(field, '==', doc[field]).limit(limit);

              if (type === 0) {
                reads$.push(afs.doc(collection + '/' + doc[field]).valueChanges());
              }

              if (type === 1) {
                // tslint:disable-next-line:max-line-length
                reads$.push(afs.collection(collection, ref => ref.where( where, condition, doc[field])).valueChanges());
              }

            } else {
              reads$.push(of([]));
            }
          }

          return combineLatest(reads$);
        }),
        map(joins => {
          return collectionData.map((v: any, i: any) => {
            // totalJoins += joins[i].length;
            return { ...v, [nameObject]: joins[i] || null };
          });
        }),
        tap(_final => {
            // console.log( `Queried ${(final as any).length}, Joined ${totalJoins} docs`);
          // totalJoins = 0;
        })
      );
    });
};