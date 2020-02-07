import { Component, Input, ViewChild, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FormControl} from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

// MATERIAL
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';

import * as FileSaver from 'file-saver';


import * as firebase from 'firebase/app';

// SERVICES
import { ItemFirebaseService } from 'src/app/services/service.index';

// MODELS
import { Item } from 'src/app/models/types';


@Component({
  selector: 'app-filelist',
  templateUrl: './filelist.component.html',
  styleUrls: ['./filelist.component.css']
})
export class FilelistComponent implements  OnChanges, OnDestroy {

  @Input() projectid: number;
  @Input() serviceid: number;
  @Input() orderid: number;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  data: Subscription;
  title = 'Listado de documentos';
  subtitle = 'Seleccione el archivo a borrar, descargar o visualizar.';
  items: Item[];
  CARPETA_ARCHIVOS: string;
  isLoadingResults: boolean;
  isLoadingDownload = false;
  isRateLimitReached = false;
  file: any;
  indexitem: number;
  profileUrl: Observable<any>;

  columnsToDisplay: string[] = ['nombre', 'tipo', 'create_at', 'visualizar'];
  dataSource: MatTableDataSource<Item>;



  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionheaderaction = new FormControl(this.positionOptions[2]);
  positiondatasourceaction = new FormControl(this.positionOptions[3]);

  constructor(
    // private cdr: ChangeDetectorRef,
    public _http: HttpClient,
    private itemService: ItemFirebaseService,
    public snackBar: MatSnackBar,
    ) {

    }


    ngOnChanges(changes: SimpleChanges) {
      // console.log('Block A change', changes);
      // this.cdr.detectChanges();
      if (changes) {
        this.getData();
      }
    }

    ngOnDestroy() {
      if (this.data) {
        this.data.unsubscribe();
      }
    }


  getData() {
    this.isLoadingResults = true;
    // this.cdr.detectChanges();
    if (this.orderid === 0) {
        this.CARPETA_ARCHIVOS = 'filesprojects/' + this.projectid + '/' + this.serviceid;
    }

    if (this.orderid > 0) {
        this.CARPETA_ARCHIVOS = 'filesorders/' + this.projectid + '/' + this.orderid;
    }

    this.data = this.itemService.getItems(this.CARPETA_ARCHIVOS)
    .subscribe(async res => {
                await this.datasource(res);
      }
    );
  }


  async datasource(data: any) {
    if (data && data.length > 0) {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isRateLimitReached = false;
      this.isLoadingResults = false;
    } else {
      this.isRateLimitReached = true;
      this.isLoadingResults = false;
    }
  }

  applyFilter(filterValue: string) {
    if (filterValue.length > 0) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // console.log(this.dataSource.filteredData.length);
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  downloadItem(item: Item, i: number) {
    this.isLoadingDownload = true;
    this.indexitem = i;
    const storageRef = firebase.storage().ref(`${ this.CARPETA_ARCHIVOS }/${ item.nombre }`);

    if (storageRef) {
      storageRef.getDownloadURL()
      .then(
       (url) => {
         this._http.get(url, {responseType: 'blob'})
          .subscribe(blob => {
            FileSaver.saveAs(blob, item.nombre);
          });

          this.isLoadingDownload = false;
          this.indexitem = -1;
       })
      .catch(
        (error) => {
         console.log(error);
         this.isLoadingDownload = false;
         this.indexitem = -1;
      });
    }
  }


  deleteItem(item: Item) {
      if (item) {
        this.isLoadingResults = true;
        this.itemService.deleteDoc(this.CARPETA_ARCHIVOS, item).subscribe(
        data => {
         this.items = data;
         this.dataSource = new MatTableDataSource(this.items);
         this.isLoadingResults = false;
         if (data.length === 0) {
           this.isRateLimitReached = true;
         }
       });
         this.snackBar.open('Se ha eliminado el documento.', 'Eliminado', {duration: 2000, });
      }

  }



}
