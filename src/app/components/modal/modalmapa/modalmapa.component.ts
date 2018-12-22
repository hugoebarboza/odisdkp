import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modalmapa',
  templateUrl: './modalmapa.component.html',
  styleUrls: ['./modalmapa.component.css']
})
export class ModalMapaComponent implements OnInit {

  title:string = "Georeferencia";
  id: number;


  constructor(
	  public activeModal: NgbActiveModal
  	) { 

  }

  ngOnInit() {
  	//console.log(this.id);

  }

}
