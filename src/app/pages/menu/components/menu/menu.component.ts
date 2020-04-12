import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import {filter} from 'rxjs/operators';

// SERVICES
import { ProjectsService, SettingsService, UserService } from 'src/app/services/service.index';

// NGRX REDUX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { LoginAction } from 'src/app/contador.actions';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {

  identity: any;
  path: string;
  proyectos: any;
  projectid = 0;
  projectselected = 0;
  selected = 0;
  subscription: Subscription;
  title: string;
  token: any;
  url = '';
  uri: string;
  sub: any;

  searchControl = new FormControl('');

  id = 0;
  collapseHeight = '40px';
  displayMode = 'flat';
  expandHeight = '40px';
  opened = true;
  over = 'side';

  @Output() RefreshMenu: EventEmitter<number>;

  constructor(
    public _proyectoService: ProjectsService,
    private _router: Router,
    public _userService: UserService,
    public label: SettingsService,
    private store: Store<AppState>,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.proyectos = this._userService.getProyectos();
    this.RefreshMenu = new EventEmitter();


    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
          const url: any = this._router.url.split('/');
          this.path = url[1];
          const urlid = url[2];
          this.id = Number(urlid);
          this.projectselected = this.id;
          this.selected = this.id;

      });

    /*
    this.label.getDataRoute().subscribe(data => {
      this.path = data.path;
      if (this.path === 'calendar') {
        // this.selected = 0;
        // this.projectselected = this.id;
      }

      if (this.path === 'users') {
        // this.selected = 0;
        // this.projectselected = this.id;
      }

      if (this.path === 'project') {
        // this.selected = 0;
        // this.projectselected = this.id;
      }

      if (this.path === 'order') {
        // this.selected = this.id;
        // this.projectselected = 0;
      }

      if (this.path === 'service') {
        // this.selected = this.id;
        // this.projectselected = 0;
      }
    });*/
  }

  ngOnInit() {
    this.store.select('objNgrx')
      .subscribe( objNgrx  => {
        if (objNgrx) {
          this.proyectos = objNgrx.project;
          this.identity = objNgrx.identificacion;
        }
      });
      // console.log(this.proyectos);
  }


  ngOnDestroy() {
    if (this.subscription) {
    this.subscription.unsubscribe();
    }
  }


  public navigate(item) {
    this.selected = item;
  }

  refresh() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    this.subscription = this._proyectoService.getUserProjectService(this.token.token, this.identity.sub).subscribe(
      response => {
          if (response.status === 'success') {
            this.proyectos = response.datos;
            const key = 'proyectos';
            this._userService.saveStorage(key, this.proyectos);
            this.afterRefresch(this.proyectos, this.identity);

          }
        }
      );
  }

  private afterRefresch(p: any, i: any): void {
    const obj: any = {project: p, identificacion: i};
    const accion = new LoginAction(obj);
    this.store.dispatch( accion );
  }

}
