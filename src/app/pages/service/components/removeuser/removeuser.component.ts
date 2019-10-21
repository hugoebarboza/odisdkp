import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';


// SERVICES
import { UserService } from '../../../../services/service.index';


@Component({
  selector: 'app-removeuser',
  templateUrl: './removeuser.component.html',
  styleUrls: ['./removeuser.component.css']
})
export class RemoveUserComponent implements OnInit, OnDestroy {

  identity: any;
  isLoading = true;
  page = 1;
  pageSize = 0;
  status: string;
  subscription: Subscription;
  termino = '';
  totalRegistros = 0;
  token: any;
  usuarios: any[] = [];

  @Input() id: number;
  @Output() totalUsuariosNoActive: EventEmitter<number>;
  @Input() customerid: number;
  @Output() addUsuario: EventEmitter<number>;

  constructor(
    public _userService: UserService,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.addUsuario = new EventEmitter();
    this.totalUsuariosNoActive = new EventEmitter();
  }

  ngOnInit() {
    if (this.id > 0) {
      this.cargarUsuarios();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  cargarUsuarios() {

    this.isLoading = true;

    this.subscription = this._userService.getNotUserPaginate( this.token.token, this.id, this.page, this.customerid )
              .subscribe( (resp: any) => {
                this.totalRegistros = resp.datos.total;
                this.usuarios = resp.datos.data;
                this.totalUsuariosNoActive.emit(this.totalRegistros);
                this.isLoading = false;
                this.status = 'success';
              },
              error => {
                this.status = 'error';
                this.isLoading = false;
                console.log(<any>error);
              }
              );
  }

  buscarUsuario( termino: string ) {
    if ( termino.length <= 0 || !termino) {
      this.cargarUsuarios();
      return;
    }

    this.isLoading = true;

    this.subscription = this._userService.searchaddUser(this.token.token, this.id, this.page, termino, this.customerid )
            .subscribe( (resp: any) => {
              this.totalRegistros = resp.datos.total;
              this.usuarios = resp.datos.data;
              this.isLoading = false;
              this.status = 'success';
            },
            error => {
              this.status = 'error';
              this.isLoading = false;
              console.log(<any>error);
            }
            );
  }

  paginate( valor: number, increment: number ) {

    const desde = this.pageSize + valor;

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      this.pageSize = 0;
      return;
    }

    this.pageSize += valor;
    this.page += increment;

    if ( this.page === 0 ) {
      this.page = 1;
      return;
    }

    this.cargarUsuarios();
  }

  adduser(userid: number) {

    if (userid > 0) {
      this.addUsuario.emit(userid);
    }
  }


}
