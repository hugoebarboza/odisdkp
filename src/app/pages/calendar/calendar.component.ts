//ANGULAR
import { Component, OnInit, NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/Subject';
import { Subscription } from "rxjs/Subscription";
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

//MODEL
import { Proyecto } from '../../models/types';

//CALENDAR
import {  CalendarEvent,  CalendarEventAction,  CalendarEventTimesChangedEvent,  CalendarEventTitleFormatter,  CalendarView} from 'angular-calendar';

import {  startOfDay,  endOfDay,  subDays,  addDays,  endOfMonth,  isSameDay,  isSameMonth,  addHours } from 'date-fns';

//DIALOG
import { AddCalendarComponent } from '../../components/dialog/addcalendar/addcalendar.component';

//SERVICES
import { ProjectsService, UserService } from '../../services/service.index';

//MOMENT
import * as moment from 'moment';



export interface Month {
  value: number;
  name: string;
}

export interface Year {
  name: string;
}

declare const gapi: any;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  
  activeDayIsOpen = false;
  date: Date;
  events = [];
  events_calendar: CalendarEvent[] = [];
  identity: any;  
  id:number;
  loadingResults: boolean = false;
  project: any;
  proyectos: Array<Proyecto> = [];
  project_name: string = '';  
  refresh: Subject<any> = new Subject();
  sub: any;
  subtitle: string = 'Seleccione de acuerdo a las siguientes opciones'
  subscription: Subscription;
  title: string = 'Calendario'
  token: any;
  updatesuccess:string = 'Evento actualizado';
  updateerror:string = 'Evento no actualizado';  
  viewDate: Date = new Date();

  

  //VIEW
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  active_m = true;
  active_w = false;
  active_d = false;
  dateTerm: string = 'Mes';

  public colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3'
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF'
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA'
    }
  }  

  months: Month[] = [
    {value: 0, name: 'Enero'},
    {value: 1, name: 'Febrero'},
    {value: 2, name: 'Marzo'},
    {value: 3, name: 'Abril'},
    {value: 4, name: 'Mayo'},
    {value: 5, name: 'Junio'},
    {value: 6, name: 'Julio'},
    {value: 7, name: 'Agosto'},
    {value: 8, name: 'Septiembre'},
    {value: 9, name: 'Octubre'},
    {value: 10, name: 'Noviembre'},
    {value: 11, name: 'Diciembre'}
  ];

  years: Year[] = [
    { name: '2019'},
    { name: '2020'},
    { name: '2021'},
    { name: '2022'},
    { name: '2023'},
    { name: '2024'},
    { name: '2025'},
    { name: '2026'},
    { name: '2027'},    
  ];

  selectedMonth: any;
  selectedYear: any;


  apikey: string;
  clientid: string;
  calendarID: string;

  constructor(
    public _ngZone: NgZone,
    private _proyectoService: ProjectsService,		
    private _route: ActivatedRoute,
    private _userService: UserService,
    public dialog: MatDialog,
    private toaster: ToastrService,    
  ) { 
    this._userService.handleAuthentication(this.identity, this.token);    
    this.date = new Date();
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();

    this.sub = this._route.params.subscribe(params => { 
      let id = +params['id'];            
      this.id = id;
      if(this.id){
        this.project = this.filter();
        this.project_name = this.project.project_name;
        this.calendarID = this.project.calendarID;
        this.apikey = this.project.apikey;
        this.clientid = this.project.clientid;
        this.calendarID = this.project.calendarID;
        if(this.calendarID){
          this.viewDate = new Date();
          this.getCalendar(this.calendarID);      
        }
    
      
      }
    });


  }

  ngOnInit() {
    //console.log(this.calendarID)
    //console.log(this.date);
  }

  ngOnDestroy(){
		if(this.subscription){
      this.subscription.unsubscribe();
      //console.log("ngOnDestroy unsuscribe");
		}		
	}


  addNew() {    
    const dialogRef = this.dialog.open(AddCalendarComponent, {
    height: '650px',
    width: '777px',
    disableClose: true,        
    data: { calendarID: this.calendarID,
            date: null,
            due_date: null,
            titulo: null,
            descripcion: null,
            formcalendar: null
    }
    });
    

    dialogRef.afterClosed().subscribe(
          result => {       
            
             if (result === 1) { 
              this.listUpcomingEvents();
             // After dialog is closed we're doing frontend updates 
             // For add we're just pushing a new row inside DataService
             //this.dataService.dataChange.value.push(this.OrderserviceService.getDialogData());  
             //this.ngOnInit();
             }
           });
 }  


 edit(event) {

  let start = ''
  let startTime = ''
  let end = ''
  let endTime = ''

  if (event.start.date === undefined) {
    const fecha = new Date(event.start.dateTime);
    start = moment(fecha).format('YYYY-MM-DD HH:mm');
  } else {
    start = event.start.date;
  }

  if (event.end.date === undefined) {
    const fecha = new Date(event.end.dateTime);
    end = moment(fecha).format('YYYY-MM-DD HH:mm');
  } else {
    end = event.end.date
  }

  if(start && end){
    const dialogRef = this.dialog.open(AddCalendarComponent, {
      height: '650px',
      width: '777px',
      disableClose: true,        
      data: { calendarID: this.calendarID,
              date: start,
              due_date: end,
              titulo: event.summary,
              descripcion: event.description,
              formcalendar: true,
              event: event
      }
      });
      
  
      dialogRef.afterClosed().subscribe(
            result => {       
              
               if (result === 1) { 
                this.listUpcomingEvents();
               // After dialog is closed we're doing frontend updates 
               // For add we're just pushing a new row inside DataService
               //this.dataService.dataChange.value.push(this.OrderserviceService.getDialogData());  
               //this.ngOnInit();
               }
             });
  
  }

}


  refreshCalendar(){
    this.selectedMonth = '';
    this.selectedYear = '';
    this.listUpcomingEvents();
  }

  getCalendar(calendarID:string){
    const that = this;
    this.viewDate = new Date();
   

    gapi.load('client:auth2', {

      callback: function() {
        gapi.client.init({
          apiKey: that.apikey,
          clientId: that.clientid,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
          scope: 'https://www.googleapis.com/auth/calendar  https://www.googleapis.com/auth/calendar.events'
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen((result) => {
            that.updateSigninStatus(result)
          });
          // Handle the initial sign-in state.
          that.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
      },
      onerror: function() {
        // Handle loading error.
        alert('gapi.client failed to load!');
      },
      timeout: 5000, // 5 seconds.
      ontimeout: function() {
        // Handle timeout.
        alert('gapi.client could not load in a timely manner!');
      }
    });

  }

  

  additem(_start, _end, _text, _obj): void {
    // this.loadingResults = false;
    const that = this;
    this.events_calendar.push({
      title: _text,
      start: _start,
      end: _end,
      // Contiene Objeto evento id = _obj
      id: _obj,
      color: that.colors.red,
      actions: [
        {                  
          label: '<i class="material-icons">edit</i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            that.edit(_obj)
          }
        },
        {
          label: '<i class="material-icons">clear</i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            that.deleteEvent(_obj)
          }
        }
      ],
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }


  dateGTM ( dateString ): Date {
    let date = new Date(dateString);
    date = new Date(date.valueOf() + date.getTimezoneOffset());
    return date;
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    const datestart = moment(newStart).format('YYYY-MM-DDTHH:mm:ss.SSZ');
    const dateend = moment(newEnd).format('YYYY-MM-DDTHH:mm:ss.SSZ');

    //console.log(datestart + ' - ' + dateend);
    let _event_objeto = event.id;

    const success: Object = {
      'start' :  {'dateTime': datestart},
      'end': {'dateTime': dateend},
    };

    _event_objeto = Object.assign(_event_objeto, success);

    // console.log(_event_objeto);

    this.updateEvent(_event_objeto, true);
  }


  month(event: CalendarEvent): string {
    console.log(event);
    return `<b>${moment(event.start).format('YYYY-MM-DD HH:mm')}</b> ${event.title}`;
  }  
  

  handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
  }


  handleEvent(action: string, event: CalendarEvent): void {
    // this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
  }  
  

  listUpcomingEvents() {

    const that = this;
    this.loadingResults = true;

    gapi.client.calendar.events.list({
      calendarId: that.calendarID,
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime'
    }).then(function(response) {
      that.loadingResults = false;
      that.events = response.result.items;
      that.events_calendar = [];
      that.events.forEach((obj) => {
        // tslint:disable-next-line:max-line-length
        const fechaInicio = obj['start']['dateTime'] ? that.dateGTM(moment(obj['start']['dateTime']).format('YYYY-MM-DD HH:mm:ss')) : that.dateGTM(moment(obj['start']['date']).format('YYYY-MM-DD'))
        const fechaFin = obj['end']['dateTime'] ? that.dateGTM(moment(obj['end']['dateTime']).format('YYYY-MM-DD HH:mm:ss')) : that.dateGTM(moment(obj['end']['date']).format('YYYY-MM-DD'));
        // console.log(fechaInicio + ' - ' + fechaFin);
        that.additem(fechaInicio, fechaFin, obj['summary'], obj);
      });
      that._ngZone.run((ob) => { });

    }, function(error) {
       console.log(error);
        that.loadingResults = false;
        that.toaster.warning('Error: '+this.error, 'Error', {enableHtml: true,closeButton: true, timeOut: 6000 });
    });
  }

  updateEvent(event, bandera) {
    const that = this;
    this.loadingResults = true;
    const request = gapi.client.calendar.events.patch({
      calendarId: that.calendarID,
      eventId: event.id,
      resource: event
    }).then(function (event) {
      that.loadingResults = false;
      if (event.error !== undefined) {
        that.toaster.warning('Error: '+this.error, 'Error', {enableHtml: true,closeButton: true, timeOut: 6000 });
      } else {
        that.toaster.success('Exito: '+ that.updatesuccess , 'Exito' , {timeOut: 4000,});
        if(!bandera){
          jQuery('#form-modal').modal('hide');
        }
        that.listUpcomingEvents();
      }
    }, function (err){
      jQuery('#form-modal').modal('');
      that.toaster.warning('Error: ' + that.updateerror, 'Error', {enableHtml: true,closeButton: true, timeOut: 6000 });
    });
  }

  
  updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      this.listUpcomingEvents();
    } else {
      this.handleAuthClick()
    }
  }


  deleteEvent(event: any) {

    const that = this;
    this.loadingResults = true;
    const request = gapi.client.calendar.events.delete({
      calendarId: that.calendarID,
      eventId: event.id
    }).then(function(event) {
      that.loadingResults = false;
      if (event.error !== undefined) {
        that.toaster.warning('Error: Ha ocurrido un error al eliminar una tarea' + that.updateerror, 'Error', {enableHtml: true,closeButton: true, timeOut: 6000 });        
      } else {
        that.toaster.success('Exito: el evento ha sido eliminado exitosamente'+ that.updatesuccess , 'Exito' , {timeOut: 4000,});
        that.listUpcomingEvents();
      }
    }, function (err){
      that.toaster.warning('Error: Ha ocurrido un error al eliminar una tarea' + that.updateerror, 'Error', {enableHtml: true,closeButton: true, timeOut: 6000 });
    });
  }  


  buildSimpleFilters(month, year, reloadPage = false) {
    // console.log('buildSimpleFilters');
    const parse: string = month;
    this.viewDate = new Date(year, parseInt(parse));
  }


  filter(){
    if(this.proyectos && this.id){
      for(var i = 0; i < this.proyectos.length; i += 1){
        var result = this.proyectos[i];
        if(result.id === this.id){
            return result;
        }
      }
    }    
  }

  refreshMenu(event:number){
		if(event == 1){
			this.subscription = this._proyectoService.getProyectos(this.token.token, this.identity.dpto).subscribe(
				response => {
						if (response.status == 'success'){
							this.proyectos = response.datos;
							let key = 'proyectos';
							this._userService.saveStorage(key, this.proyectos);
						}
					}
				);
    }
	}


}
