import { Component, OnInit, DoCheck } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';



import * as $ from 'jquery';
import { UserService } from './services/user.service';
import { Proyecto } from './models/proyecto';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck {
  title = 'ODIS DKP';
  public identity;
  public token;
  public proyectos: Array<Proyecto>;
  
  update: boolean = false;


  constructor(
  	private _userService: UserService,
    private _proyectos: UserService,
    updates: SwUpdate
  	){
  	this.identity = this._userService.getIdentity();
  	this.token = this._userService.getToken();
    this.proyectos = this._proyectos.getProyectos();
    updates.available.subscribe( event => {
      //this.update = true;
      updates.activateUpdate().then( () => document.location.reload());
    })

  }

  ngOnInit(){
	//console.log('app.component cargado');

  }
    
  ngDoCheck(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.proyectos = this._proyectos.getProyectos(); 
  }

}