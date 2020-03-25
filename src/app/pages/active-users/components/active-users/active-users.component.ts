import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

// SERVICES
import { UserService, WebsocketService } from 'src/app/services/service.index';


@Component({
  selector: 'app-active-users',
  templateUrl: './active-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./active-users.component.css']
})
export class ActiveUsersComponent implements OnInit {

  identity: any;
  usuariosActivosObs: Observable<any>;

  constructor(
    public _userService: UserService,
    public wsService: WebsocketService,
  ) {
    this.identity = this._userService.getIdentity();
  }

  ngOnInit(): void {

    this.usuariosActivosObs = this.wsService.getUsuariosActivos();

    // Emitir el obtenerUsuarios
    this.wsService.emitirUsuariosActivos();

  }

}
