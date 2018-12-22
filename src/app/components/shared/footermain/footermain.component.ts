import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footermain',
  templateUrl: './footermain.component.html',
  styleUrls: ['./footermain.component.css']
})
export class FootermainComponent  {

	year: number;

	constructor() {
		this.year = new Date().getFullYear();
	}

}
