import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { takeUntil, shareReplay, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


// SERVICE
import { MonitorBackendService } from '../monitor.service';

// MODEL
import { Order } from 'src/app/models/types';
import { LoadingCompletedService } from 'src/app/services/shared/loading-completed.service';
import { asObservable } from './asObservable';


@Injectable({
    providedIn: 'root'
})

export class MonitorStore {

    private activities$: BehaviorSubject<Order[]> = new BehaviorSubject(([]));
    activity$: Observable<Order[]>;
    destroy = new Subject();

    constructor(
        private loadingService: LoadingCompletedService,
        private monitorBackendService: MonitorBackendService
        ) {

        // this.loadInitialData();
    }

    /*
    private loadInitialData() {
        this.monitorBackendService.getAllMonitor()
                                  .subscribe(
                                        data => {
                                            // console.log(data);
                                            this.subject.next(data);
                                        },
                                        (err) => {
                                            return console.log(err);
                                        }
                                    );
    }*/

    get activities() {
        return this.activity$;
    }

    get monitor() {
        return asObservable(this.activities$);
    }


    public getDataId (id: number, token: any) {

        if (!id) {
            return;
        }

        this.loadingService.loadingOn();


        this.monitorBackendService.getDetailMonitor(id, token)
                                  .pipe(
                                    finalize(() => this.loadingService.loadingOff()),
                                    takeUntil(this.destroy),
                                    shareReplay(),
                                  )
                                  .subscribe(
                                    data => {
                                        this.activities$.next(data.datos.data);
                                    },
                                    error =>  {
                                        this.activities$.next([]);
                                        return throwError(error);
                                      }
                                  );


        /*
        const info = this.activity$.pipe(map(data => {
            console.log(data);
            return data;
        // usersList.push(newItem);
        // return usersList;
        }));
        console.log(info);*/

        /*
        this.activity$ = this.monitorBackendService.getDetailMonitor(id, token)
                                                  .pipe(
                                                      map(params => {
                                                        if (!params.datos.data) {
                                                        // this.subject.next([]);
                                                        throw new Error('Value expected!');
                                                        }
                                                        // this.subject.next(params.datos.data);
                                                        return params.datos.data;
                                                      }
                                                      ),
                                                      finalize(() => this.loadingService.loadingOff()),
                                                      takeUntil(this.destroy),
                                                      shareReplay(),
                                                      catchError((error: any) => {
                                                        this.loadingService.loadingOff();
                                                        return throwError(error);
                                                  }));

        */

    }



}
