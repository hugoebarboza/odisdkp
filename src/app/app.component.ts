import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { RouteConfigLoadStart, RouteConfigLoadEnd, RouterEvent } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { Subscription } from 'rxjs/Subscription';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { MediaMatcher } from '@angular/cdk/layout';

// MATERIAL
import { MatSidenav } from '@angular/material/sidenav';

// MODELS
import { Proyecto } from './models/types';

// SERVICES
import { SettingsService, SidenavService, UserService } from 'src/app/services/service.index';

// REDUX
import { AppState } from './app.reducers';
import { Store } from '@ngrx/store';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {

  description: string;
  departamentos: Array<any> = [];
  id: number;
  identity: any;
  titulo: string;
  loading: boolean;
  proyectos: Array<Proyecto>;
  subscription: Subscription;
  token: any;
  update = false;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  @ViewChild('mainsidenav', { static: true }) mainsidenav: MatSidenav;
  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;
  @ViewChild('supportDrawer', { static: true }) supportDrawer: MatSidenav;
  @ViewChild('activeUsersDrawer', { static: true }) activeUsersDrawer: MatSidenav;

  constructor(
    private sidenavService: SidenavService,
    private _userService: UserService,
    public _ajustes: SettingsService,
    private _router: Router,
    private _title: Title,
    private _meta: Meta,
    private store: Store<AppState>,
    @Inject(PLATFORM_ID) private platformId,
    updates: SwUpdate,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,

    ) {
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();
    updates.available.subscribe( () => {
      updates.activateUpdate().then( () => document.location.reload());
    });

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);


    this._ajustes.getDataRoute().subscribe( data => {
      this.titulo = data.titulo;
      this.description = data.descripcion;
      this._title.setTitle( this.titulo );

      const metaTag: MetaDefinition = {
        name: 'description',
        content: this.description
      };
      this._meta.updateTag( metaTag );
    });

    this._router.events.subscribe(
      (event: RouterEvent): void => {
        if (event instanceof RouteConfigLoadStart) {
          // console.log('trueeee');
          this.loading = true;
        } else if (event instanceof RouteConfigLoadEnd) {
          // console.log('false');
          this.loading = false;
        }
      }
    );

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
    this.store.select('objNgrx')
    .subscribe( objNgrx  => {
      if (objNgrx) {
        this.identity = objNgrx.identificacion;
        // this.identity = this._userService.getIdentity();
      }

      this.proyectos = this._userService.getProyectos();
      this.identity = this._userService.getIdentity();


      if (!this.identity) {
        if (this.sidenav) {
          this.sidenav.close();
          this.supportDrawer.close();
          this.activeUsersDrawer.close();
        }
      }

    });

      this.sidenavService.setSidenav(this.supportDrawer);
    }
  }

  refreshMenu(event: number) {
  if ( event === 1 ) {
    }
  }

  sideToggle(event: number) {
    if ( event === 1 ) {
      this.sidenav.toggle();
    }
  }

}
