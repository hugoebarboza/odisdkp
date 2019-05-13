import { Injectable } from '@angular/core';
import { CanLoad , Route, Router } from '@angular/router';

import { UserService } from '../../services/service.index';


@Injectable()
export class LoginGuardGuard implements CanLoad  {


  constructor(
    public auth: UserService,
    public router: Router
  ) {

  }

  /*
  canActivate() {
    if ( this._userService.isAuthenticated() ) {
      console.log( 'Paso por guard' );
      return true;
    } else {
      console.log( 'Bloqueado por guard' );
      this.router.navigate(['/login']);
      return false;
    }
  }*/

  canLoad(route: Route): boolean {

    let url: string = route.path;
    //console.log('Url:'+ url);

    if ( this.auth.isAuthenticated() ) {
      console.log( 'Paso por guard' );
      return true;
    } else {
      console.log( 'Bloqueado por guard' );
      this.auth.resetAction();      
      this.auth.logout();
      this.router.navigate(['/login']);
      return false;
    }

  }  



}
