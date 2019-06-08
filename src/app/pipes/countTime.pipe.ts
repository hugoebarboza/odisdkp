import { Pipe, PipeTransform } from '@angular/core';
import * as _moment from 'moment';
const moment = _moment;

@Pipe({
  name: 'countTime'
})

export class DatePipe implements PipeTransform {

  transform(value: any): any {
    if (!value) {
      return value;
    }

    let day = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let date = '';
    const ini = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const fecha = moment(ini);

    seconds = fecha.diff(value, 's');

    if (seconds > 60) {

      minutes = fecha.diff(value, 'm');

      if (minutes > 60) {

        hours = fecha.diff(value, 'h');

        if (hours > 24) {

          day = fecha.diff(value, 'd');

          if (day <= 1){
            date = day + ' día'; //  + (hours - day * 24) + 'h ' + (minutes - hours * 60) + 'm ' + (seconds - (minutes * 60)) + 's';
          }else{
            date = day + ' días'; //  + (hours - day * 24) + 'h ' + (minutes - hours * 60) + 'm ' + (seconds - (minutes * 60)) + 's';
          }



        } else {
          date = hours + ' hr'; //  + (minutes - hours * 60) + 'm ' + (seconds - (minutes * 60)) + 's';
        }

      } else {
        date = minutes + ' mm'; //  + (seconds - minutes * 60) + 's';
      }

    } else {
      date = seconds + ' ss';
    }

    return date;
  }

}