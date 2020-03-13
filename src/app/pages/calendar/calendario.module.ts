import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// COMPONENTS
import { AddCalendarComponent } from './dialog/addcalendar/addcalendar.component';
import { CalendarComponent } from './calendar-list/calendar.component';

// INTERCEPTOR
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from '../../providers/interceptor/index';


// MODULES
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarModule } from 'primeng/calendar';
import { CalendarModule as AngularCalendar, DateAdapter as AngularDateAdapter } from 'angular-calendar';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';

// MOMENT
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

// ROUTING
import { CalendarRoutingModule } from './calendario.routing';

// SERVICES
import { ServiceModule } from 'src/app/services/service.module';


@NgModule({
  imports: [
    AngularCalendar.forRoot({
        provide: AngularDateAdapter,
        useFactory: adapterFactory
      }),
    CalendarModule,
    CommonModule,
    CalendarRoutingModule,
    FormsModule,
    HttpClientModule,
    PipesModule,
    ReactiveFormsModule,
    ServiceModule,
    SharedModule
  ],
  declarations: [
    AddCalendarComponent,
    CalendarComponent,
  ],
  entryComponents: [
    AddCalendarComponent,
  ],
  providers: [
    httpInterceptorProviders,
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: LOCALE_ID, useValue: 'es' },
    {provide: MAT_DATE_LOCALE, useValue: 'es'},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class CalendarioModule { }
