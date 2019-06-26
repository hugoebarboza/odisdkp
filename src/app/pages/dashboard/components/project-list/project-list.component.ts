import { Component, OnInit } from '@angular/core';

//MODEL
import { Proyecto } from 'src/app/models/types';

//SERVICES
import { UserService } from 'src/app/services/service.index';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {


  proyectos: Array<Proyecto>;
  
  constructor(
    public _userService: UserService,
  ) { 
    this.proyectos = this._userService.getProyectos();
  }

  ngOnInit() {
    //console.log(this.proyectos);
  }

}
