import { Component, Input } from '@angular/core';

@Component({
  
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  providers: []
})

export class FooterComponent {

	year: number;
	@Input() identity : any = {};

	constructor() {
		this.year = new Date().getFullYear();
	}

}
