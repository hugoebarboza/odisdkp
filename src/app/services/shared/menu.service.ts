import { Injectable } from '@angular/core';

//SERVICES
import { UserService } from '../../services/service.index';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  proyectos: any[] = [];

  constructor(
    public _userService: UserService,
  ) { }

  cargarMenu() {
    this.proyectos = this._userService.proyectos;
    console.log(this.proyectos);
  }
}
