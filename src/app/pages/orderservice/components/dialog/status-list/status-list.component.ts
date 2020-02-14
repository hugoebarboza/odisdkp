import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { OrderserviceService, UserService } from 'src/app/services/service.index';
import { ServiceEstatus } from 'src/app/models/types';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-status-list',
  templateUrl: './status-list.component.html',
  styleUrls: ['./status-list.component.css']
})
export class StatusListComponent implements OnInit, OnDestroy {

  code: string;
  clase: string;
  editando = false;
  estatus: ServiceEstatus;
  indexitem: number;
  isLoading = true;
  isLoadingSave = false;
  isLoadingDelete = false;
  label = 0;
  newestatus = '';
  orderby = 0;
  serviceestatus: ServiceEstatus[] = [];
  status: string;
  subscription: Subscription;
  show = false;
  token: any;



  @Input() id : number;
  @Output() totalEstatus: EventEmitter<number>;
  @ViewChild('txtInputFisico', { static: true }) txtInputFisico: ElementRef;

  constructor(
    public _userService: UserService,
    public dataService: OrderserviceService,
    public snackBar: MatSnackBar,
  ) {
    this.token = this._userService.getToken();
    this.totalEstatus = new EventEmitter();
  }

  ngOnInit() {
    if (this.id > 0) {
      this.cargarEstatus();
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  crearEstatus(data: ServiceEstatus) {

    if (this.newestatus.length == 0) {
      return;
    }

    if (data.label == 0) {
      this.snackBar.open('Seleccione el color del estatus.', '', {duration: 3000, });
      return;
    }

    if (data.order_by <= 0  ) {
      this.snackBar.open('Seleccione el orden del estatus.', '', {duration: 3000, });
      return;
    }


    if (data.label  == 1) {
      this.code = '#E52320';
      this.clase = 'warn';
    }

    if (data.label  == 2) {
      this.code = '#00E900';
      this.clase = 'primary';
    }

    if (data.label  == 3) {
      this.code = '#c51162';
      this.clase = 'accent';
    }


    this.estatus = new ServiceEstatus (0, this.id, data.name, this.code, this.clase, data.label , data.order_by, 0, 1, '', '');


    this.dataService.addEstatus(this.token.token, this.estatus, this.id)
            .subscribe( (resp: any) => {
              if (!resp) {
                this.snackBar.openFromComponent(SnackErrorComponent, {duration: 3000, });
                this.indexitem = -1;
                return;
              }
              if (resp.status === 'success') {
                this.snackBar.openFromComponent(SnackSuccessComponent, {duration: 3000, });
                this.isLoadingSave = false;
                this.indexitem = -1;
                this.label = 0;
                this.newestatus = '';
                this.orderby = 0;
                setTimeout( () => {
                  this.cargarEstatus();
                  this.show = false;
                }, 1000);
              } else {
                this.show = false;
                this.indexitem = -1;
              }
            },
              error => {
                this.snackBar.openFromComponent(SnackErrorComponent, {duration:3000, });
                this.indexitem = -1;
                console.log(<any>error);
              }
            );

  }

  cargarEstatus() {
    this.isLoading = true;
    this.subscription = this.dataService.getServiceEstatus(this.token.token, this.id)
    .subscribe(
    response => {
              if (!response) {
                this.status = 'error';
                this.isLoading = false;
                return;
              }
              if (response.status === 'success') {
                this.serviceestatus = response.datos;
                this.totalEstatus.emit(this.serviceestatus.length);
                this.isLoading = false;
              }
              },
              error => {
                this.status = 'error';
                this.isLoading = false;
                console.log(<any>error);
              }

              );
  }

  startEdit(i: number) {
    this.indexitem = i;
    this.editando = true;
  }

  close() {
    this.indexitem = -1;
  }

  guardarEstatus(i, estatus) {
    this.indexitem = i;
    this.editando = false;
    this.isLoadingSave = true;
    this.dataService.updateEstatus(this.token.token, estatus, estatus.id)
            .subscribe( (resp: any) => {
              if (!resp) {
                this.snackBar.openFromComponent(SnackErrorComponent, {duration: 3000, });
                this.isLoadingSave = false;
                this.indexitem = -1;
                return;
              }
              if (resp.status === 'success') {
                this.snackBar.openFromComponent(SnackSuccessComponent, {duration: 3000, });
                this.isLoadingSave = false;
                this.indexitem = -1;
              } else {
                this.isLoadingSave = false;
                this.indexitem = -1;
              }
            },
              error => {
                this.snackBar.openFromComponent(SnackErrorComponent, {duration: 3000, });
                this.isLoadingSave = false;
                this.indexitem = -1;
                console.log(<any>error);
              }
            );
  }

  borrarEstatus(i, estatus) {
    this.indexitem = i;
    this.isLoadingDelete = true;
    this.dataService.deleteEstatus(this.token.token, estatus.id)
            .subscribe( (resp: any) => {
              if (!resp) {
                this.snackBar.openFromComponent(SnackErrorComponent, {duration: 3000, });
                this.isLoadingDelete = false;
                this.indexitem = -1;
                return;
              }
              if (resp.status === 'success') {
                this.snackBar.openFromComponent(SnackSuccessComponent, {duration: 3000, });
                this.isLoadingDelete = false;
                this.indexitem = -1;
                setTimeout( () => {
                  this.cargarEstatus();
                }, 2000);

              } else {
                this.isLoadingDelete = false;
                this.indexitem = -1;
              }
            },
              error => {
                this.snackBar.open(error, '', {duration: 3000, });
                this.isLoadingDelete = false;
                this.indexitem = -1;
              }
            );
  }

  toggle() {
    this.show = !this.show;
  }


}



@Component({
  selector: 'snack-bar-component-error',
  templateUrl: 'snack-bar-component-error.html',
  styles: [`
    .snack-error {
      color: hotpink;
    }
  `],
})
export class SnackErrorComponent {}


@Component({
  selector: 'snack-bar-component-sucess',
  templateUrl: 'snack-bar-component-sucess.html',
  styles: [`
    .snack-success {
      color: white;
    }
  `],
})
export class SnackSuccessComponent {}
