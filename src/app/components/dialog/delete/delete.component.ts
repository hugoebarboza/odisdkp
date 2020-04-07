import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs/Subscription';
import { UntilDestroy } from '@ngneat/until-destroy';

// SERVICES
import { OrderserviceService, UserService, WebsocketService } from 'src/app/services/service.index';

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
@UntilDestroy()
export class DeleteComponent implements OnInit, OnDestroy {
  public title: string;
  public identity;
  public token;
  // private services: Service[] = [];
  // private servicetype: ServiceType[] = [];
  category_id: number;
  subscription: Subscription;

  constructor(
  private _orderService: OrderserviceService,
  private _userService: UserService,
  public dialogRef: MatDialogRef<DeleteComponent>,
  public wsService: WebsocketService,
  @Inject(MAT_DIALOG_DATA) public data: any,
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


  confirmDelete() {

    const query: any = this._orderService.delete(this.token.token, this.data['order_id'], this.category_id);

    // Socket data
    const payload = {
      serviceid: this.data['service_id'],
      orderid: this.data['order_id'],
    };

    query
    .subscribe(
      (data: any) => {
        if (data.status === 'success') {
          Swal.fire('Eliminada Orden de Trabajo con identificador: ', this.data['order_id'] + ' exitosamente.', 'success' );
          // Socket
          this.wsService.emit('delete-order', payload);
          } else {
          Swal.fire('Orden de Trabajo con identificador: ', this.data['order_id'] + ' no eliminada.' , 'error');
          }
        },
        (err: any) => {
          // this.error = err.error.message;
          // Swal.fire('No fue posible procesar su solicitud', err.error.message, 'error');
          if (err.status === 403) {
            Swal.fire({
              title: '¿Está seguro? ' + err.error.message,
              text: 'Está seguro de borrar OT ' + this.data['order_id'],
              showCancelButton: true,
              confirmButtonText: 'Si',
              cancelButtonText: 'No'
            })
            .then( borrar => {
              if (borrar.value) {
                this._orderService.deleteotedp(this.token.token, this.data['order_id'], this.category_id).subscribe(
                  (data: any) => {
                    if (data.status === 'success') {
                      Swal.fire('Eliminada Orden de Trabajo con identificador: ', this.data['order_id'] + ' exitosamente.', 'success' );
                      // Socket
                      this.wsService.emit('delete-order', payload);
                      } else {
                      Swal.fire('Orden de Trabajo con identificador: ', this.data['order_id'] + ' no eliminada.' , 'error');
                      }
                    },
                    (erro: any) => {
                      Swal.fire('No fue posible procesar su solicitud', erro.error.message, 'error');
                    });
              } else if (borrar.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                  'Cancelado',
                );
              }
            });
          } else {
            Swal.fire('No fue posible procesar su solicitud', err.error.message, 'error');
          }

        });


  }



}
