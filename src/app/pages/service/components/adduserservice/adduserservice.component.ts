import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

// SERVICES
import { UserService } from 'src/app/services/service.index';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-adduserservice',
  templateUrl: './adduserservice.component.html',
  styleUrls: ['./adduserservice.component.css']
})
export class AddUserServiceComponent implements OnInit, OnDestroy {

  identity: any;
  isLoading: boolean = true;
  page: number = 1;
  pageSize: number = 0;
  status: string;
  subscription: Subscription;
  termino: string = '';
  totalRegistros: number = 0;
  token: any;
  usuarios: any[] = [];

  @Input() id : number;
  @Output() totalUsuarios: EventEmitter<number>;
  @Output() removerUsuario: EventEmitter<number>;
  
  constructor(
    public _userService: UserService,
  ) { 
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.totalUsuarios = new EventEmitter();
    this.removerUsuario = new EventEmitter();
  }

  ngOnInit() {
    if(this.id > 0){
      this.cargarUsuarios();
    }
  }

	ngOnDestroy(){
		if(this.subscription){
			this.subscription.unsubscribe();      
      //console.log("ngOnDestroy unsuscribe");
		}
	}


  cargarUsuarios() {
    this.isLoading = true;
    this.subscription = this._userService.getUserPaginate( this.token.token, this.id, this.page )
              .subscribe( (resp: any) => {
                this.totalRegistros = resp.datos.total;
                this.usuarios = resp.datos.data;
                this.totalUsuarios.emit(this.totalRegistros);
                //console.log(this.usuarios);
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

    this.subscription = this._userService.searchUser(this.token.token, this.id, this.page, termino )
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

  remover(userid:number){
    if(userid > 0){
      this.removerUsuario.emit(userid);
      //this.cargarUsuarios();  
    }
  }



}
