import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { timer } from 'rxjs';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class RouterResolver implements Resolve<any> {
  constructor(
    ) { }

  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<any> {
    return timer(500);
  }
}