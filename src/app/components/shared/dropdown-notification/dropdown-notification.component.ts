import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dropdown-notification',
  templateUrl: './dropdown-notification.component.html',
  styleUrls: ['./dropdown-notification.component.css']
})
export class DropdownNotificationComponent implements OnInit {

  @Input() notifications: any;
  @Input() resultCount: number;

  constructor() { }

  ngOnInit() {
    if(this.notifications){
      //console.log(this.notifications);
    }
  
  }

}
