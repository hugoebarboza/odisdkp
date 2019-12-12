import { Injectable } from '@angular/core';
import { CanLoad , Router } from '@angular/router';

import { UserService, AuthService } from 'src/app/services/service.index';


@Injectable()
export class LoginGuardGuard implements CanLoad  {


  constructor(
    public auth: UserService,
    public authService: AuthService,
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

  canLoad(): boolean {

    // let url: string = route.path;
    // console.log('Url:'+ url);

    if ( this.auth.isAuthenticated() ) {
      // console.log( 'Paso Guard' );
      return true;
    } else {
      // console.log( 'Bloqueado por Guard' );
      // this.auth.resetAction();
      this.auth.logout();
      this.authService.logout();
      // this.router.navigate(['/login']);
      return false;
    }

  }
}

