import { Component, OnInit, DoCheck } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';


//MODELS
import { Proyecto } from './models/types';

//SERVICES
import { SettingsService, UserService } from './services/service.index';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck {
  titulo: string;

  description: string;
  departamentos: Array<any> = [];
  identity: any;
  public proyectos: Array<Proyecto>;
  subscription: Subscription;
  token: any;
  update: boolean = false;


  constructor(
  	private _userService: UserService,
    public _ajustes: SettingsService,
    private _router: Router,
    private _title: Title,
    private _meta: Meta,
    updates: SwUpdate
  	){
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
  	this.token = this._userService.getToken();
    updates.available.subscribe( event => {
      //this.update = true;
      updates.activateUpdate().then( () => document.location.reload());
    })

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

  ngOnInit(){


  }
    
  ngDoCheck(){
    //this.identity = this._userService.getIdentity();
    //this.token = this._userService.getToken();
    //this.proyectos = this._proyectos.getProyectos(); 
  }


  getDataRoute() {
    return this._router.events.pipe(

      filter( evento => evento instanceof ActivationEnd ),
      filter( (evento: ActivationEnd) => evento.snapshot.firstChild === null ),
      map( (evento: ActivationEnd ) => evento.snapshot.data )

    );
  }




}