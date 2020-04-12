import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { tap, catchError, map, shareReplay, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { throwError } from 'rxjs/internal/observable/throwError';
import { ActivatedRoute, Router } from '@angular/router';
import { TooltipPosition } from '@angular/material/tooltip';
import { Observable } from 'rxjs/Observable';
import { UntilDestroy } from '@ngneat/until-destroy';

// MODEL
import { Order } from 'src/app/models/types';


// MOMENT
import * as _moment from 'moment';
const moment = _moment;

// SERVICES
import { LoadingCompletedService } from 'src/app/services/shared/loading-completed.service';
import { MonitorBackendService } from '../../monitor.service';
import { SettingsService, UserService } from 'src/app/services/service.index';


// STORE
// import { MonitorStore } from '../../store/monitorstore';

@Component({
  selector: 'app-monitor-list',
  templateUrl: './monitor-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./monitor-list.component.css']
})
@UntilDestroy()
export class MonitorListComponent implements OnInit {

  activity$: Observable<Order[]>;
  identity: any;
  proyectos: any;
  project: any;
  since: any;
  title: string;
  token: any;
  destroy = new Subject();

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionrightaction = new FormControl(this.positionOptions[5]);


  constructor(
    public _userService: UserService,
    private cd: ChangeDetectorRef,
    private label: SettingsService,
    private loadingService: LoadingCompletedService,
    private monitorBackendService: MonitorBackendService,
    // public monitorStore: MonitorStore,
    private route: ActivatedRoute,
    public router: Router,
    ) {

      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.proyectos = this._userService.getProyectos();
      this.label.getDataRoute().subscribe(data => {
        this.title = data.subtitle;
      });

    }

    ngOnInit() {

      this.route.params.pipe(
                        tap(async params => {
                          if (!params) {
                            return;
                          }
                          const selectedId = +params.id;
                          if (selectedId && this.proyectos) {
                            const project = await this.filter(selectedId);
                            if (project !== 'undefined' && project !== null && project) {
                              this.project = project;
                              this.loadingService.loadingOn();
                              this.loadInitialData(selectedId);
                              this.since = moment(this.project.create_at).locale('ES').format('LL');
                            } else {
                              this.router.navigateByUrl('/notfound');
                            }
                          }

                        }),
                        takeUntil(this.destroy),
                        shareReplay(),
                        catchError((error: any) => {
                          return throwError(error);
                        })
                      )
                      .subscribe();

    }

    private loadInitialData(id: number): void {

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

      /*
      this.activity$.subscribe(
                                data => {
                                  this.count = data.length;
                                  },
                                  () => {
                                  this.count = 0;
                                  }
                                );*/
      // this.activity$ = data$.pipe(map(params => params.data));
      this.cd.markForCheck();

  }

  async filter(id: number) {
    this.proyectos = this._userService.getProyectos();
    if (this.proyectos && id) {
      for (let i = 0; i < this.proyectos.length; i += 1) {
        const result = this.proyectos[i];
        if (Number(result.id) === Number(id)) {
           return await result;
        }
      }
    }
  }

  load() {

  }


}
