import 'rxjs/add/observable/of';
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { timer, of } from 'rxjs';
import { flatMap } from 'rxjs/operators/';

@Injectable()
export class CustomPreloading implements PreloadingStrategy {
  preload(route: Route, load: Function): Observable<any> {
      const loadRoute = (delay) => delay
          ? timer(150).pipe(flatMap(_ => load()))
          : load();
      return route.data && route.data.preload 
          ? loadRoute(route.data.delay)
          : of(null);
    }
}
