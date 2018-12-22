import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css']
})
export class NotfoundComponent implements OnInit {

  constructor(
		private _route: ActivatedRoute,
		private _router: Router,		
  	) { }

  ngOnInit() {
  	console.log('notfound.component cargado correctamente');
  }

}
