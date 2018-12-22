import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-vieworderdetail',
  templateUrl: './vieworderdetail.component.html',
  styleUrls: ['./vieworderdetail.component.css']
})
export class ViewOrderDetailComponent implements OnInit {


  @Input() orderid : number;

  constructor() { 

  }

  ngOnInit() {
  }

}
