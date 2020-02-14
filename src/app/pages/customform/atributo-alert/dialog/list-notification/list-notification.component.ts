import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService, CustomformService, UserService } from 'src/app/services/service.index';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-notification',
  templateUrl: './list-notification.component.html',
  styleUrls: ['./list-notification.component.css']
})
export class ListNotificationComponent implements OnInit {

  token: any;
  isLoading = false;
  title = 'Listado de notificaciones:';
  displayedColumns: string[] = ['status', 'name', 'action'];
  dataSourceDes = new MatTableDataSource();
  // @ViewChild('paginatorDes', {read: MatPaginator, static: false}) paginatorDes: MatPaginator;
  @ViewChild('tableDes', {read: MatSort, static: false}) sortDes: MatSort;
  dataSourceAct = new MatTableDataSource();
  // @ViewChild('paginatorAct', {read: MatPaginator, static: false}) paginatorAct: MatPaginator;
  @ViewChild('tableAct', {read: MatSort, static: false}) sortAct: MatSort;
  servicetype: any = [];
  activos: any = [];
  desactivos: any = [];

  constructor(
    public dataService: DataService,
    public dialogRef: MatDialogRef<ListNotificationComponent>,
    public toasterService: ToastrService,
    public _customForm: CustomformService,
    public _userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    this.servicetype = this.data.servicetype;
    this.getNotifications (this.servicetype.id);
  }

  applyFilterDes(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceDes.filter = filterValue.trim().toLowerCase();
  }

  applyFilterAct(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAct.filter = filterValue.trim().toLowerCase();
  }

  async getNotifications (id: any) {

    if (id) {
      this.dataSourceDes = new MatTableDataSource();
      // this.paginatorDes.firstPage();
      this.dataSourceAct = new MatTableDataSource();
      // this.paginatorAct.firstPage();
      this.isLoading = true;
      const data: any = await this._customForm.getFormNotification(this.token.token, id);
      this.isLoading = false;
      if (data && data.datos) {
        this.activos = data.datos;
        this.dataSourceAct = new MatTableDataSource(data.datos);
        // this.dataSourceAct.paginator = this.paginatorAct;
        this.dataSourceAct.sort = this.sortAct;
      }
      if (data && data.noform) {
        this.desactivos = data.noform;
        this.dataSourceDes = new MatTableDataSource(data.noform);
        // this.dataSourceDes.paginator = this.paginatorDes;
        this.dataSourceDes.sort = this.sortDes;
      }
    }
  }

  async editNotificacion(notificacion: any) {
    if (!notificacion) {
      Swal.fire('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
      return;
    }

    const status: number = +notificacion.status;
    if (status === 0) {
      notificacion.status = 1;
    } else {
      notificacion.status = 0;
    }

    const user: any = notificacion.user;
    notificacion.user = JSON.parse(user);

    if (notificacion && notificacion.id && notificacion.id > 0) {
      const update: any = await this._customForm.updateFormNotification(this.token.token, notificacion, this.servicetype.id, notificacion.id);
      if (update && update.status === 'success') {
        this.ngOnInit();
        this.toasterService.success('Notificación actualizada exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
        return;
      } else {
        Swal.fire('Importante', 'A ocurrido un error en la actualización de la notificación', 'error');
        return;
      }
    } else {
      Swal.fire('Importante', 'A ocurrido un error en la actualización de la notificación', 'error');
      return;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
