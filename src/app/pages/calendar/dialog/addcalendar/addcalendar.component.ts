import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators, NgForm } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';


// MOMENT
import * as _moment from 'moment';
const moment = _moment;

declare const gapi: any;

@Component({
  selector: 'app-addcalendar',
  templateUrl: './addcalendar.component.html',
  styleUrls: ['./addcalendar.component.css']
})
export class AddCalendarComponent implements OnInit {

  public title: string = 'Agregar Evento';
  formControl = new FormControl('', [Validators.required]);  
  en: any;
  
  

  constructor(
    public dialogRef: MatDialogRef<AddCalendarComponent>,
    private toaster: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { 

    
  }

  ngOnInit() {
    //console.log(this.data);
    this.en = {
      firstDayOfWeek: 0,
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"],
      monthNames: [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
      monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
      today: 'Hoy',
      clear: 'Borrar'
    };

  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Dato Requerido' : '';
  }


  confirmAdd(form:NgForm){

    const formdata = form;

    if (!this.data.formcalendar && this.data.formcalendar == null) {
      this.createEvent(formdata);
    } else {
      this.updateEvent(formdata);
    }

  }

  createEvent(form:NgForm){
    //console.log(form.value);
    const that = this;
    let _start = {}

    if (form.value.date !== '' ) {
      _start = {
        'dateTime': moment(form.value.date).format('YYYY-MM-DDTHH:mm:ss.SSZ')
      }
    } else {
      _start = {
        'date': moment(form.value.date).format('YYYY-MM-DDTHH:mm:ss.SSZ')
      }
    }

    let _end = {}

    if (form.value.due_date !== '' ) {
      _end = {
        'dateTime': moment(form.value.due_date).format('YYYY-MM-DDTHH:mm:ss.SSZ')
      }
    } else {
      _end = {
        'date': moment(form.value.due_date).format('YYYY-MM-DDTHH:mm:ss.SSZ')    
      }
    }

    const event = {
      'summary': form.value.titulo,
      'description': form.value.descripcion,
      'start': _start,
      'end': _end
    };

    //this.loadingResults = true;
    gapi.client.calendar.events.insert({
      calendarId: that.data.calendarID,
      resource: event
    }).then(function(event) {
      //that.loadingResults = false;
      jQuery('#form-modal').modal('toggle');
      if (event.error !== undefined) {
        that.toaster.warning('Error: Ha ocurrido error al agregar evento', 'Error', {enableHtml: true,closeButton: true, timeOut: 6000 });
      } else {
        that.toaster.success('Exito: Se ha agregado el evento', 'Exito', {enableHtml: true,closeButton: true, timeOut: 6000 });
        //that.listUpcomingEvents();
      }
    }, function (_err){
      jQuery('#form-modal').modal('toggle');
      that.toaster.warning('Error: Ha ocurrido error al agregar evento', 'Error', {enableHtml: true,closeButton: true, timeOut: 6000 });
    });    

  }



  updateEvent(form:NgForm){
    //console.log(form.value);
    const that = this;
    let _start = {}

    if (form.value.date !== '' ) {
      _start = {
        'dateTime': moment(form.value.date).format('YYYY-MM-DDTHH:mm:ss.SSZ')
      }
    } else {
      _start = {
        'date': moment(form.value.date).format('YYYY-MM-DDTHH:mm:ss.SSZ')
      }
    }

    let _end = {}

    if (form.value.due_date !== '' ) {
      _end = {
        'dateTime': moment(form.value.due_date).format('YYYY-MM-DDTHH:mm:ss.SSZ')
      }
    } else {
      _end = {
        'date': moment(form.value.due_date).format('YYYY-MM-DDTHH:mm:ss.SSZ')    
      }
    }

    const event = {
      'summary': form.value.titulo,
      'description': form.value.descripcion,
      'start': _start,
      'end': _end
    };

    //this.loadingResults = true;

    gapi.client.calendar.events.patch({
      calendarId: that.data.calendarID,
      eventId: that.data.event.id,
      resource: event
    }).then(function(event) {
      //that.loadingResults = false;
      jQuery('#form-modal').modal('toggle');
      if (event.error !== undefined) {
        that.toaster.warning('Error: Ha ocurrido error al editar evento', 'Error', {enableHtml: true,closeButton: true, timeOut: 6000 });
      } else {
        that.toaster.success('Exito: Se ha editado el evento', 'Exito', {enableHtml: true,closeButton: true, timeOut: 6000 });
        //that.listUpcomingEvents();
      }
    }, function (_err){
      jQuery('#form-modal').modal('toggle');
      that.toaster.warning('Error: Ha ocurrido error al editar evento', 'Error', {enableHtml: true,closeButton: true, timeOut: 6000 });
    });    

  }  
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}
