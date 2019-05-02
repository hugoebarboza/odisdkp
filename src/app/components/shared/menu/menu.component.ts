import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

//SERVICES
import { ProjectsService, SettingsService, UserService } from '../../../services/service.index';


@Component({  
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
  
  identity: any;
  path:string;
  proyectos : any = [];
  projectid:number=0;
  projectselected:number = 0;
  selected:number = 0;
  subscription: Subscription;
  title: string;
  token: any;
  url: string = '';
  uri:string;

  

  searchControl = new FormControl('');

  id:number = 0;
  collapseHeight = '40px';
  displayMode = 'flat';
  expandHeight = '40px';  
  opened = true;
  over = 'side';

  //@Input() proyectos : any = {};
  @Output() RefreshMenu: EventEmitter<number>;

  constructor(
    private _route: ActivatedRoute, 
    public _proyectoService: ProjectsService,
    public _userService: UserService,
    public label: SettingsService,
  ) { 

    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.proyectos = this._userService.getProyectos();
    this.RefreshMenu = new EventEmitter();
		this.label.getDataRoute().subscribe(data => {
      this.path = data.path;
      if(this.path === 'calendar'){        
        this.selected = 0;
        this.projectselected = this.id;
      }

      if(this.path === 'users'){
        this.selected = 0;
        this.projectselected = this.id;
      }
      if(this.path === 'project'){
        this.selected = 0;
        this.projectselected = this.id;
      }

      if(this.path === 'order'){
        this.selected = this.id;
        this.projectselected = 0;
      }
      
    });



    this._route.params.subscribe(params => {
    let id = +params['id'];        
    this.id = id;
    if(this.id >0){
      //GET RUTA
        this._route.url.subscribe(res =>{
          if(res[0]){
            this.url = res[0].path;
          }
      });
      
      if(this.url && this.url === 'calendar'){
        this.selected = 0;
        this.projectselected = this.id;
      }

      if(this.url && this.url === 'project'){
        this.selected = 0;
        this.projectselected = this.id;
      }

      if(this.url && this.url === 'users'){
        this.selected = 0;
        this.projectselected = this.id;
      }


      if(this.url && this.url === 'service'){
        this.selected = this.id;
        this.projectselected = 0;
      }


    }    
    });

  }

  ngOnInit() {
    //this.proyectos = this._userService.proyectos;
    //console.log(this.proyectos);
    //console.log(this.identity);
  }
  

  ngOnDestroy(){
		if(this.subscription){
			this.subscription.unsubscribe();
			//console.log("ngOnDestroy unsuscribe");
    }   
  }


  public navigate(item) {
    this.selected = item;
  }

  refresh(){
    this.RefreshMenu.emit(1);
    this.subscription = this._proyectoService.getProyectos(this.token.token, this.identity.dpto).subscribe(
      response => {
          if (response.status == 'success'){
            this.proyectos = response.datos;
            let key = 'proyectos';
            this._userService.saveStorage(key, this.proyectos);
          }
        }
      );		

  }

}
