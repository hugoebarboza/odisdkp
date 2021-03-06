import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

//SERVICES
import { ProjectsService, SettingsService, UserService } from '../../../services/service.index';

//NGRX REDUX
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducers';
import { LoginAction } from '../../../contador.actions';


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
    public _proyectoService: ProjectsService,
    public _userService: UserService,
    public label: SettingsService,
    private store: Store<AppState>,
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

      if(this.path === 'service'){
        this.selected = this.id;
        this.projectselected = 0;
      }
    });    
  }

  ngOnInit() {
    this.store.select('objNgrx')
      .subscribe( objNgrx  => {
        if (objNgrx) {
          this.proyectos = objNgrx.project;
          this.identity = objNgrx.identificacion;
          //console.log(objNgrx);
        }
        //this.identity = this._userService.getIdentity();
        //this.proyectos = this._userService.getProyectos();
      });
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
    //this.RefreshMenu.emit(1);
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.subscription = this._proyectoService.getProyectos(this.token.token, this.identity.dpto).subscribe(
      response => {
          if (response.status == 'success'){
            this.proyectos = response.datos;
            let key = 'proyectos';
            this._userService.saveStorage(key, this.proyectos);
            this.afterRefresch(this.proyectos, this.identity);

          }
        }
      );
  }

  private afterRefresch(p:any, i:any): void {
    const obj: any = {project: p, identificacion: i};
    const accion = new LoginAction(obj);
    this.store.dispatch( accion );
    //console.log('redux dispacth action refresch menu')
  }
}
