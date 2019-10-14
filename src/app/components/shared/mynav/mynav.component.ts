import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mynav',
  templateUrl: './mynav.component.html',
  styleUrls: ['./mynav.component.css']
})
export class MynavComponent implements OnInit {

  projectname: string;
  @Input() project : any;

  constructor() { 
  	this.projectname = this.project;
  }

  ngOnInit() {
  	//console.log('paso');
  	//console.log(this.project);

  }



}
