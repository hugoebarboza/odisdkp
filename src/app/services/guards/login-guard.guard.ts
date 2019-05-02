import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UserService } from '../../services/service.index';


@Injectable()
export class LoginGuardGuard implements CanActivate {


  constructor(
    public _userService: UserService,
    public router: Router
  ) {
    //this.token = this._userService.getToken();
  }

  canActivate() {

    if ( this._userService.isAuthenticated() ) {
      console.log( 'Paso por guard' );
      return true;
    } else {
      console.log( 'Bloqueado por guard' );
      this.router.navigate(['/login']);
      return false;
    }

  }
}
