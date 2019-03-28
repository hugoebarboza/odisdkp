import { Component, OnInit, Input } from '@angular/core';

//MOMENT
import * as _moment from 'moment';
const moment = _moment;

@Component({
  selector: 'app-viewordertimespent',
  templateUrl: './viewordertimespent.component.html',
  styleUrls: ['./viewordertimespent.component.css']
})
export class ViewOrderTimeSpentComponent implements OnInit {

  @Input() timefrom : any;
  @Input() timeuntil : any;

  public days: any = 0;  
  public hours: any;
  public minutes: any;
  public spenttimeminutes: any;
  public spenttimehours: any;
  public timespent: any;



  constructor() { }

  ngOnInit() {
    //console.log(this.timefrom);
    //console.log(this.timeuntil);
    if(this.timefrom && this.timeuntil){
      this.getSpentTime(this.timefrom, this.timeuntil);

    }
  }

  getSpentTime(timefrom:any, timeuntil:any){    
    let createat = moment(timefrom).format(); //todays date
    //console.log(createat);
    let updateat = moment(timeuntil).format(); // another date
    //console.log(updateat);
    let duration = moment.duration(moment(updateat).diff(createat));
    //console.log(duration);
    //let duration = moment.duration(updateat.diff(createat));
    //console.log(duration);
    this.days = duration.get("days");
    this.hours = duration.get("hours");
    this.minutes = duration.get("minutes");

  }


}
