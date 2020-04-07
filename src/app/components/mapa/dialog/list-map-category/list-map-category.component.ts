import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UserService, CustomformService } from 'src/app/services/service.index';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import clonedeep from 'lodash.clonedeep';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { trigger, state, transition, style, animate } from '@angular/animations';

import Swal from 'sweetalert2';

interface CategoriaMap {
  id: number;
  descripcion: string;
  order_by: number;
  status: number;
  fillColor: string;
  strokeColor: string;
}

@Component({
  selector: 'app-list-map-category',
  templateUrl: './list-map-category.component.html',
  styleUrls: ['./list-map-category.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ListMapCategoryComponent implements OnInit {

  identity: any;
  isLoading = false;
  title = 'Categorías de formas';
  subtitle = 'Listado de categorías en Mapa';
  token: any;
  service_id: any;
  totalRegistros = 0;
  selected = new FormControl(0);
  displayedColumns: string[] = ['order_by', 'descripcion', 'fillColor', 'strokeColor', 'status', 'actions'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  forma: FormGroup;
  showform = false;
  expandedElement: any | null;
  booaction = false;

  constructor(
    public _userService: UserService,
    public dialogRef: MatDialogRef<ListMapCategoryComponent>,
    public toasterService: ToastrService,
    private cd: ChangeDetectorRef,
    public _customForm: CustomformService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    if (this.data.service_id && this.data.service_id > 0) {
      this.service_id = this.data.service_id;
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
    }
  }

  ngOnInit(): void {
    this.isLoading = false;
    if (this.service_id && this.service_id > 0) {
      this.forma = new FormGroup({
        id: new FormControl(0),
        descripcion: new FormControl(null, [Validators.required, Validators.minLength(2)]),
        order_by: new FormControl(0, [Validators.required]),
        status: new FormControl(1, [Validators.required]),
        fillColor: new FormControl('#DC143C', [Validators.required]),
        strokeColor: new FormControl('#0B3356', [Validators.required])
      });
      this.getMapCategory(); // GET CATEGORIA
    }
  }

  async getMapCategory() {
    this.isLoading = true;
    this.dataSource = new MatTableDataSource();
    const show: any = await this._customForm.showMapCategory(this.token.token, this.service_id);
    // console.log(show);
    if (show && show.status && show.status === 'success') {
      const mapCategory = show.datos;
      if (mapCategory.length > 0) {
        this.totalRegistros = mapCategory.length;
        this.booaction = true;
        this.dataSource = new MatTableDataSource(mapCategory);
      }
      this.isLoading = false;
    } else {
      this.totalRegistros = 0;
      this.booaction = false;
      this.isLoading = false;
    }
  }

  addRow(): void {
    const form = JSON.parse(JSON.stringify(this.forma.getRawValue()));
    if (!form) {
      return;
    }
    // console.log(form);
    this.addrowtable(form);
  }

  addrowtable(response: any) {
    // console.log('addrowtable', response);
    // console.log('addrowtable', this.dataSource.data);
    const datasource = JSON.parse(JSON.stringify(this.dataSource.data));
    // console.log('addrowtable', datasource);
    if (response.order_by && response.order_by > 0) {
      datasource.splice((response.order_by - 1), 0, response);
      this.totalRegistros = datasource.length;
      this.dataSource = new MatTableDataSource(datasource);
      this.dataSource.paginator = this.paginator;
    } else {
      datasource.push(response);
      this.totalRegistros = datasource.length;
      // this.dataSource.data = datasource;
      this.dataSource = new MatTableDataSource(datasource);
      this.dataSource.paginator = this.paginator;
    }
  }

  async save(data: Array<CategoriaMap>) {
    // console.log(JSON.stringify(data));
    if (data && data.length > 0) {
      const pila: any = JSON.parse(JSON.stringify(data));
      const object: object = {'pila': pila};
      this.isLoading = true;
      const store: any = await this._customForm.storeMapCategory(this.token.token, object, this.service_id);
      // console.log(store);
      if (store && store.status === 'success') {
        // this.getAtributo(this.servicetype);
        this.toasterService.success('Categorias registradas exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
        this.isLoading = false;
        return;
      } else {
        Swal.fire('Importante', 'A ocurrido un error con el registro del listado de categorias', 'error');
        this.isLoading = false;
        return;
      }
    } else {
      Swal.fire('Importante', 'Debe registrar al menos una categoría', 'error');
      this.isLoading = false;
      return;
    }
  }

  async update(data: Array<CategoriaMap>) {
    // console.log(JSON.stringify(data));
    if (data && data.length > 0) {
      const pila: any = JSON.parse(JSON.stringify(data));
      const object: object = {'pila': pila};
      this.isLoading = true;
      const update: any = await this._customForm.updateMapCategory(this.token.token, object, this.service_id);
      // console.log(update);
      if (update && update.status === 'success') {
        this.getMapCategory();
        this.toasterService.success('Categorias actulizadas exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
        this.isLoading = false;
      } else {
        Swal.fire('Importante', 'A ocurrido un error con la actulización del listado de categorias', 'error');
        this.isLoading = false;
      }
    } else {
      Swal.fire('Importante', 'Debe registrar al menos una categoría', 'error');
      this.isLoading = false;
    }
  }

  async deleteCategoria(row: any, index: number) {
    if (!row) {
      return;
    }
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta acción es permanente. ¿Seguro de que quieres eliminar la categoría?',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    })
    .then( async borrar => {
      if (borrar.value) {
        if (borrar) {
          this.isLoading = true;
          const deleteform: any = await this._customForm.deleteMapCategory(this.token.token, this.service_id, row.id);
          if (deleteform && deleteform.status === 'success') {
            // this.getAtributo(this.servicetype);
            this.toasterService.success('Categoría eliminada exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
            this.expandedElement = null;
            const datasource = this.dataSource.data;
            datasource.splice(index, 1);
            this.dataSource.data = datasource;
            this.totalRegistros = this.dataSource.data.length;
            this.isLoading = false;
            this.cd.markForCheck();
          } else {
            this.isLoading = false;
            Swal.fire('Importante', 'A ocurrido un error en la eliminación. Verifique si existen polígonos asociados.', 'error');
            return;
          }
        }
      } else if (borrar.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
        );
      }
    });
  }

  delete(index: any, row: any) {
    // console.log(index);
    // console.log(row);
    if (row.id === 0) {
      const datasource = this.dataSource.data;
      datasource.splice(index, 1);
      this.dataSource.data = datasource;
      this.totalRegistros = this.dataSource.data.length;
      this.toasterService.success('Categoría eliminada exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
    } else {
      this.deleteCategoria(row, index);
    }
  }

  onListDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.dataSource.data = clonedeep(this.dataSource.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
