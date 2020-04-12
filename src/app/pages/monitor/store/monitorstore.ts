import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';

// SERVICE
import { MonitorBackendService } from '../monitor.service';

// MODEL
import { Order } from '../../../models/types';


@Injectable({
    providedIn: 'root'
})

export class MonitorStore {

    private subject: BehaviorSubject<Order[]> = new BehaviorSubject(([]));
    monitor$: Observable<Order[]> = this.subject.asObservable();

    constructor(
        private monitorBackendService: MonitorBackendService
        ) {

        this.loadInitialData();
    }

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
    }



}
