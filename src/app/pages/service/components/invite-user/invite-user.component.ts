import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

//SERVICES
import { UserService } from 'src/app/services/service.index';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.css']
})
export class InviteUserComponent implements OnInit, OnDestroy {

  @Input() id : number;
  @Output() addUsuario: EventEmitter<number>;

  identity: any;
  isLoading: boolean;
  subscription: Subscription;
  status: string = '';
  termino: string = '';
  totalRegistros: number = 0;
  token: any;
  usuarios: any[] = [];


  constructor(
    public _userService: UserService,    
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.addUsuario = new EventEmitter();
   }

  ngOnInit() {
    if(this.id > 0){
      //console.log(this.id);
    }

  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  buscarUsuario( termino: string ) {
    if ( termino.length <= 0 || !termino) {
      this.usuarios = [];
      return;
    }

    this.isLoading = true;

    this.subscription = this._userService.searchInviteUser(this.token.token, this.id, termino)
            .subscribe( (resp: any) => {
              this.totalRegistros = resp.datos.length;
              this.usuarios = resp.datos
              this.isLoading = false;
              this.status = 'success';
            },
            (error:any) => {
              this.status = 'error';
              this.isLoading = false;
              console.log(<any>error);
            }
            );
  }
  
  adduser(userid:number){

    if(userid > 0){
      this.addUsuario.emit(userid);
      //this.cargarUsuarios();  
    }
  }
  


}
