import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl} from '@angular/forms';
import { HttpClient} from '@angular/common/http';

//MATERIAL
import { MatPaginator, MatSnackBar, MatSort, MatTableDataSource, TooltipPosition } from '@angular/material';


import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as FileSaver from 'file-saver';


import * as firebase from 'firebase/app';

//SERVICES
import { ItemFirebaseService } from '../../services/itemfirebase.service';
import { UserService } from '../../services/service.index';

//MODELS
import { Item } from '../../models/item';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {


  title = "Listado de documentos";
  subtitle = "Seleccione el archivo a borrar, descargar o visualizar.";
  items: Item[];
  CARPETA_ARCHIVOS: string;
  isLoadingResults = true;
  isLoadingDownload = false;
  isRateLimitReached = false;
  file: any;
  indexitem:number;
  profileUrl: Observable<any>;

  columnsToDisplay: string[] = ['nombre', 'tipo', 'create_at', 'create_by', 'visualizar'];   
  dataSource: MatTableDataSource<Item>;



  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionheaderaction = new FormControl(this.positionOptions[2]);
  positiondatasourceaction = new FormControl(this.positionOptions[3]);



  @Input() project_id : number;
  @Input() service_id : number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;  


  constructor(
    public _http: HttpClient,
    private _userService: UserService,
    private itemService: ItemFirebaseService,
    public snackBar: MatSnackBar,
    ) {
  }

  ngOnInit() {
    if (this.project_id > 0 && this.service_id > 0){
        this.CARPETA_ARCHIVOS = 'filesprojects/'+this.project_id+'/'+this.service_id;

        this.itemService.getItems(this.CARPETA_ARCHIVOS).subscribe(
          data => {
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
          });    
    }



  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  downloadItem(item: Item, i: number){
    //this.isLoadingResults = true;  
    //console.log(i);
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
    } 
  }


  deleteItem(item: Item){
     this.isLoadingResults = true;
     this.itemService.deleteDoc(this.CARPETA_ARCHIVOS, item).subscribe(
     data => {      
      this.items = data;
      this.dataSource = new MatTableDataSource(this.items);      
      this.isLoadingResults = false;
      if(data.length == 0){
        this.isRateLimitReached = true;        
      }
    });
      this.snackBar.open('Se ha eliminado el documento.', 'Eliminado', {duration: 2000,});
  }



}

