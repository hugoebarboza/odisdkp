import { Component, Output, EventEmitter } from '@angular/core';

// SERVICES
import { UserService } from 'src/app/services/service.index';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent  {

  @Output() sidenav: EventEmitter<number>;

  identity: any;

  constructor(
    private _userService: UserService,
  ) {
    this.identity = this._userService.getIdentity();
    this.sidenav = new EventEmitter();
  }

  toggle(event: number) {
    this.sidenav.emit(event);
  }

}
