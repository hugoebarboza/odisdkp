import { Component, Output, EventEmitter, OnInit } from '@angular/core';

// SERVICES
import { UserService } from 'src/app/services/service.index';

// REDUX
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Output() sidenav: EventEmitter<number>;

  identity: any;

  constructor(
    private _userService: UserService,
    private store: Store<AppState>,
  ) {
    this.identity = this._userService.getIdentity();
    this.sidenav = new EventEmitter();
  }

  ngOnInit() {

    this.store.select('objNgrx')
    .subscribe( objNgrx  => {
      if (objNgrx) {
        this.identity = objNgrx.identificacion;
        // console.log(this.identity);
      }
      this.identity = this._userService.getIdentity();
    });
  }

  toggle(event: number) {
    this.sidenav.emit(event);
  }

}
