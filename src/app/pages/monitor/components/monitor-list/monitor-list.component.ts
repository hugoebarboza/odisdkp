import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { tap, catchError, map, shareReplay, takeUntil, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { throwError } from 'rxjs/internal/observable/throwError';
import { ActivatedRoute } from '@angular/router';
import { TooltipPosition } from '@angular/material/tooltip';
import { Observable } from 'rxjs/Observable';

// MODEL
import { Order } from 'src/app/models/types';

// MOMENT
import * as _moment from 'moment';
const moment = _moment;

// SERVICES
import { SettingsService, UserService } from 'src/app/services/service.index';

// STORE
import { MonitorStore } from '../../store/monitorstore';


@Component({
  selector: 'app-monitor-list',
  templateUrl: './monitor-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./monitor-list.component.css']
})

export class MonitorListComponent implements OnInit, OnDestroy {

  activity$: Observable<Order[]>;
  project: any;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionrightaction = new FormControl(this.positionOptions[5]);
  since: any;
  title: string;
  token: any;
  destroy = new Subject();

  constructor(
    public _userService: UserService,
    private cd: ChangeDetectorRef,
    private label: SettingsService,
    public monitorStore: MonitorStore,
    private route: ActivatedRoute,
    ) {

      this.token = this._userService.getToken();
      this.label.getDataRoute().subscribe(data => {
        this.title = data.subtitle;
      });

    }

   ngOnInit() {

      this.route.params.pipe(
                        tap(),
                        map(params => +params['id']),
                        switchMap(id =>
                          this.label.getProject(id)
                        ),
                        takeUntil(this.destroy),
                        shareReplay(),
                        catchError((error: any) => {
                          return throwError(error);
                        }),
                      ).subscribe( resp => {

                        this.project = resp;

                        if (this.project && this.project.id && this.project.create_at) {
                          this.since = moment(this.project.create_at).locale('ES').format('LL');
                          this.monitorStore.getDataId(this.project.id, this.token.token);
                          this.cd.markForCheck();
                          // const data$ = this.monitorStore.getDataId(this.project.id, this.token.token);
                          // const loaddata$ = this.loadingService.showLoaderUntilCompleted(data$);
                          // this.activity$ = loaddata$.pipe(map(params => params.data as Order[]));
                        } else {
                          return new Error('Value expected!');
                        }
                      }
                      );

    }


    /*
    private loadInitialData(id: number): void {

      if (!id) {
        return;
      }

      const data$ = this.monitorBackendService.getDetailMonitor(id, this.token.token)
                                              .pipe(
                                                  map(params => {
                                                    if (!params.datos) {
                                                      throw new Error('Value expected!');
                                                    }
                                                    return params.datos;
                                                  }
                                                  ),
                                                  takeUntil(this.destroy),
                                                  shareReplay(),
                                                  catchError((error: any) => {
                                                    return throwError(error);
                                              }));


      const loaddata$ = this.loadingService.showLoaderUntilCompleted(data$);
      this.activity$ = loaddata$.pipe(map(params => params.data));
      // this.activity$ = data$.pipe(map(params => params.data));
      this.cd.markForCheck();

  }*/


  load() {

  }

  ngOnDestroy() {
    this.destroy.next(null);
  }


}
