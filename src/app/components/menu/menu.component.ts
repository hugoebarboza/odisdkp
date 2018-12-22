import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { FormControl } from '@angular/forms';

//SERVICES
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  public title: string;
  public identity;
  public token;
  public selected = 0;

  searchControl = new FormControl('');


  id:number = 0;
  opened = true;
  over = 'side';
  expandHeight = '40px';
  collapseHeight = '40px';
  displayMode = 'flat';

  @Input() proyectos : any = {};

  constructor(
	private _userService: UserService,
  private _route: ActivatedRoute, 
  ) { 

    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this._userService.handleAuthentication(this.identity, this.token);

    this._route.params.subscribe(params => {
    let id = +params['id'];        
    this.id = id;
    if(this.id >0 ){
      this.selected = this.id;
    }    
    });

  }

  ngOnInit() {
  }

  public navigate(item) {
    this.selected = item;
    //console.log(this.selected);
  }

}
