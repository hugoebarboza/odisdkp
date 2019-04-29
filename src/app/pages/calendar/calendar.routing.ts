import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarComponent } from './calendar-list/calendar.component';

// Guards
import { AuthguardService } from '../../services/authguard.service';


const routes: Routes = [
	{ 
		path:':id', 
		component: CalendarComponent,
		canActivate: [ AuthguardService ],
		data: { path: 'calendar', titulo: 'OCA Global - ODIS Calendario', subtitle: 'Calendario', descripcion: 'OCA Global - ODIS Calendar Managment' }
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthguardService]
})
export class CalendarRoutingModule { }
