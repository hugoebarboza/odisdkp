import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RouteConfigLoadStart, RouteConfigLoadEnd, RouterEvent } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
// import { ActivationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { MediaMatcher } from '@angular/cdk/layout';

// MODELS
import { Proyecto } from './models/types';

// SERVICES
import { SettingsService, SidenavService, UserService } from 'src/app/services/service.index';

// REDUX
import { AppState } from './app.reducers';
import { Store } from '@ngrx/store';
import { MatSidenav } from '@angular/material/sidenav';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, OnDestroy {

  id: number;
  titulo: string;
  description: string;
  departamentos: Array<any> = [];
  identity: any;
  loading: boolean;
  proyectos: Array<Proyecto>;
  subscription: Subscription;
  token: any;
  update = false;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;
  @ViewChild('supportDrawer', { static: true }) supportDrawer: MatSidenav;


  constructor(
    private sidenavService: SidenavService,
    private _userService: UserService,
    public _ajustes: SettingsService,
    private _router: Router,
    private _title: Title,
    private _meta: Meta,
    private store: Store<AppState>,
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

    /*
     this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
          const url = this._router.url.split('/');
          const urlid = url[2];
          this.id = Number(urlid);
          console.log(this.id);
      });*/

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }


  ngOnInit() {
    this.store.select('objNgrx')
    .subscribe( objNgrx  => {
      if (objNgrx) {
        this.identity = objNgrx.identificacion;
        // this.identity = this._userService.getIdentity();
      }

      this.proyectos = this._userService.getProyectos();
      this.identity = this._userService.getIdentity();


      if (!this.identity) {
        // console.log('no identity');
        /*this.identity = {};
        if(Object.keys(this.identity).length == 0){
        }*/
        this.sidenav.close();
      }

    });

    this.sidenavService.setSidenav(this.supportDrawer);
  }

  /*
  getDataRoute() {
    return this._router.events.pipe(
      filter( evento => evento instanceof ActivationEnd ),
      filter( (evento: ActivationEnd) => evento.snapshot.firstChild === null ),
      map( (evento: ActivationEnd ) => evento.snapshot.data )
    );
  }*/

  refreshMenu(event: number) {
  if ( event === 1 ) {
    }
  }

}
