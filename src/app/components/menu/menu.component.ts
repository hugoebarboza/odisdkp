import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { FormControl } from '@angular/forms';

//SERVICES
import { UserService } from '../../services/service.index';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  public title: string;
  public identity: any;
  public projectid:number=0;
  public projectselected:number = 0;
  public selected:number = 0;  
  public token: any;
  public url: string = '';

  

  searchControl = new FormControl('');

  id:number = 0;
  collapseHeight = '40px';
  displayMode = 'flat';
  expandHeight = '40px';  
  opened = true;
  over = 'side';

  @Input() proyectos : any = {};
  @Output() RefreshMenu: EventEmitter<number>;

  constructor(
    private _route: ActivatedRoute, 
    public _userService: UserService,
  ) { 

    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.RefreshMenu = new EventEmitter(); 
    this._userService.handleAuthentication(this.identity, this.token);

    this._route.params.subscribe(params => {
    let id = +params['id'];        
    this.id = id;
    if(this.id >0 ){
      //GET RUTA
        this._route.url.subscribe(res =>{
        this.url = res[0].path;
      });
      
      if(this.url === 'projectcalendar'){
        this.selected = 0;
        this.projectselected = this.id;
      }

      if(this.url === 'projectservice'){
        this.selected = 0;
        this.projectselected = this.id;
      }

      if(this.url === 'serviceorder'){
        this.selected = this.id;
        this.projectselected = 0;
      }


    }    
    });

  }

  ngOnInit() {
  }

  public navigate(item) {
    this.selected = item;
  }

  refresh(){
    //console.log('refresh menu');
    this.RefreshMenu.emit(1);
  }

}
