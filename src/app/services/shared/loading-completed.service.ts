import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { finalize, tap, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class LoadingCompletedService {

    private subject = new BehaviorSubject<boolean>(false);
    loading$: Observable<boolean> = this.subject.asObservable();

    showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {

        this.loadingOn();

        const obs = obs$.pipe(
            tap(),
            map(params => params),
            finalize(() => this.loadingOff())
          );

          return obs;
    }

    loadingOn() {
        this.subject.next(true);
    }

    loadingOff() {
        this.subject.next(false);
    }

}
