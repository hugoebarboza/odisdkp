import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';

// SERVICES
import { OrderserviceService, UserService } from 'src/app/services/service.index';

// MESSAGE
import Swal from 'sweetalert2';


@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: [
  './delete.component.css'
  ],
  providers: []
})

export class DeleteComponent implements OnInit, OnDestroy {
  public title: string;
  public identity;
  public token;
  // private services: Service[] = [];
  // private servicetype: ServiceType[] = [];
  category_id: number;
  subscription: Subscription;

  constructor(
  // private _route: ActivatedRoute,
  // private _router: Router,
  private _userService: UserService,
  // private _proyectoService: UserService,
  public dialogRef: MatDialogRef<DeleteComponent>,
  private _orderService: OrderserviceService,
  @Inject(MAT_DIALOG_DATA) public data: any,
  // private messageService: MessageService
  ) {
  this.title = 'Eliminar Orden N.';
  this.identity = this._userService.getIdentity();
  this.token = this._userService.getToken();
  }


  ngOnInit() {
    this.category_id = this.data['category_id'];
   // console.log(this.data);
  }

  ngOnDestroy() {
    // console.log('La página se va a cerrar');
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  confirmDelete(): void {
    this._orderService.delete(this.token.token, this.data['order_id'], this.category_id).subscribe(
      (data: any) => {
        if (data.status === 'success') {
          Swal.fire('Eliminada Orden de Trabajo con identificador: ', this.data['order_id'] + ' exitosamente.', 'success' );
          } else {
          Swal.fire('Orden de Trabajo con identificador: ', this.data['order_id'] + ' no eliminada.' , 'error');
          }
        },
        (err: HttpErrorResponse) => {
          // this.error = err.error.message;
          // Swal.fire('No fue posible procesar su solicitud', err.error.message, 'error');
          Swal.fire({
            title: '¿Está seguro? ' + err.error.message,
            text: 'Está seguro de borrar OT ' + this.data['order_id'],
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
          })
          .then( borrar => {
            if (borrar.value) {
              /************************************************/
              this._orderService.deleteotedp(this.token.token, this.data['order_id'], this.category_id).subscribe(
                (data: any) => {
                  if (data.status === 'success') {
                    Swal.fire('Eliminada Orden de Trabajo con identificador: ', this.data['order_id'] + ' exitosamente.', 'success' );
                    } else {
                    Swal.fire('Orden de Trabajo con identificador: ', this.data['order_id'] + ' no eliminada.' , 'error');
                    }
                  },
                  (erro: HttpErrorResponse) => {
                    Swal.fire('No fue posible procesar su solicitud', erro.error.message, 'error');
                  });
                /********************************************** */
            } else if (borrar.dismiss === Swal.DismissReason.cancel) {
              Swal.fire(
                'Cancelado',
              );
            }
          });

        });
  }




}