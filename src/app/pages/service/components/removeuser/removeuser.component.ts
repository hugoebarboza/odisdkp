import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import swal from 'sweetalert';

//SERVICES
import { UserService } from '../../../../services/service.index';


@Component({
  selector: 'app-removeuser',
  templateUrl: './removeuser.component.html',
  styleUrls: ['./removeuser.component.css']
})
export class RemoveUserComponent implements OnInit {

  identity: any;
  isLoading: boolean = true;
  page: number = 1;
  pageSize: number = 0;
  status: string;
  termino: string = '';
  totalRegistros: number = 0;
  token: any;
  usuarios: any[] = [];

  @Input() id : number;
  @Output() totalUsuariosNoActive: EventEmitter<number>;
  @Input() customerid : number;
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
    if(this.id > 0){
      this.cargarUsuarios();
    }
  }

  cargarUsuarios() {

    this.isLoading = true;

    this._userService.getNotUserPaginate( this.token.token, this.id, this.page, this.customerid )
              .subscribe( (resp: any) => {
                this.totalRegistros = resp.datos.total;
                this.usuarios = resp.datos.data;
                this.totalUsuariosNoActive.emit(this.totalRegistros);
                //console.log(this.totalRegistros);
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

    this._userService.searchaddUser(this.token.token, this.id, this.page, termino, this.customerid )
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

  paginate( valor: number, increment:number ) {

    let desde = this.pageSize + valor;

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      this.pageSize = 0;
      return;
    }

    this.pageSize += valor;
    this.page += increment;

    if ( this.page == 0 ) {
      this.page = 1;
      return;
    }

    this.cargarUsuarios();
  }

  adduser(userid:number){

    if(userid > 0){
      this.addUsuario.emit(userid);
      //this.cargarUsuarios();  
    }
  }


}
