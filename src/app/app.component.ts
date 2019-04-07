import { Component, OnInit, DoCheck } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';


//SERVICES
import { SettingsService } from './services/service.index';
import { UserService } from './services/service.index';

//MODEL
import { Proyecto } from './models/proyecto';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck {
  public identity: any;
  public token: any;
  public proyectos: Array<Proyecto>;
  titulo: string;
  description: string;
  
  update: boolean = false;


  constructor(
  	private _userService: UserService,
    private _proyectos: UserService,
    public _ajustes: SettingsService,
    private _router: Router,
    private _title: Title,
    private _meta: Meta,
    updates: SwUpdate
  	){
  	this.identity = this._userService.getIdentity();
  	this.token = this._userService.getToken();
    this.proyectos = this._proyectos.getProyectos();
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
	//console.log('app.component cargado');

  }
    
  ngDoCheck(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.proyectos = this._proyectos.getProyectos(); 
  }


  getDataRoute() {
    return this._router.events.pipe(

      filter( evento => evento instanceof ActivationEnd ),
      filter( (evento: ActivationEnd) => evento.snapshot.firstChild === null ),
      map( (evento: ActivationEnd ) => evento.snapshot.data )

    );
  }

}