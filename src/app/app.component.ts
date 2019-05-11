import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';


//MODELS
import { Proyecto } from './models/types';

//SERVICES
import { SettingsService, UserService } from './services/service.index';
import { MediaMatcher } from '@angular/cdk/layout';

//REDUX
import { AppState } from './app.reducers';
import { Store } from '@ngrx/store';
import * as fromContador from './contador.actions';
import { MatSidenav } from '@angular/material';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, OnDestroy {

  titulo: string;
  description: string;
  departamentos: Array<any> = [];
  identity: any;
  proyectos: Array<Proyecto>;
  subscription: Subscription;
  token: any;
  update: boolean = false;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  @ViewChild('sidenav') sidenav: MatSidenav;  

  constructor(
  	private _userService: UserService,
    public _ajustes: SettingsService,
    private _router: Router,
    private _title: Title,
    private _meta: Meta,
    private store: Store<AppState>,
    updates: SwUpdate,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,

  	){
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
  	this.token = this._userService.getToken();
    updates.available.subscribe( event => {
      //this.update = true;
      updates.activateUpdate().then( () => document.location.reload());
    })

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);


    this.getDataRoute()
    .subscribe( data => {
      //console.log(data);
      this.titulo = data.titulo;
      this.description = data.descripcion
      this._title.setTitle( this.titulo );

      const metaTag: MetaDefinition = {
        name: 'description',
        content: this.description
      };
      this._meta.updateTag( metaTag );
    });


  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }


  ngOnInit() {
    this.store.select('objNgrx')
    .subscribe( objNgrx  => {
      if (objNgrx) {
        this.identity = objNgrx.identificacion;
      }

      this.proyectos = this._userService.getProyectos();
      this.identity = this._userService.getIdentity();

      if (!this.identity) {
        this.sidenav.close();
      }

    });
  }
    

  getDataRoute() {
    return this._router.events.pipe(

      filter( evento => evento instanceof ActivationEnd ),
      filter( (evento: ActivationEnd) => evento.snapshot.firstChild === null ),
      map( (evento: ActivationEnd ) => evento.snapshot.data )

    );
  }

  refreshMenu(event:number){
		if(event == 1){
		}
	}

}