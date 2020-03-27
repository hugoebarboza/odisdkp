import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENTS
import { SupportComponent } from './support-list/support.component';
import { SupportsettingsComponent } from './support-settings/supportsettings.component';
import { SupportUsersComponent } from './support-users/supportusers.component';
import { ViewCaseComponent } from './components/view-case/view-case.component';

// GUARDS
import { AuthguardService } from '../../services/authguard.service';

const routes: Routes = [
  {
    path: '',
    component: SupportComponent,
    canActivate: [AuthguardService],
    data: { path: 'support', titulo: 'OCA Global - ODIS Centro de Soporte', subtitle: 'Centro de Soporte', descripcion: 'OCA Global - ODIS Support Managment'}
  },
  { path: 'settings',
  component: SupportsettingsComponent,
  canActivate: [AuthguardService],
  data: { path: 'support', titulo: 'OCA Global - ODIS Centro de Soporte', subtitle: 'Configuración de Centro de Soporte', descripcion: 'OCA Global - ODIS Support Managment' }
  },
  { path: 'users',
  component: SupportUsersComponent,
  canActivate: [AuthguardService],
  data: { path: 'support', titulo: 'OCA Global - ODIS Centro de Soporte', subtitle: 'Listado de Usuarios', descripcion: 'OCA Global - ODIS Support Managment' }
  },
  { path: 'viewcase/:idpais/:iddpto/:iddoc',
  component: ViewCaseComponent,
  canActivate: [AuthguardService],
  data: { path: 'support', titulo: 'OCA Global - ODIS Centro de Soporte', subtitle: 'Ver Caso de Centro de Soporte', descripcion: 'OCA Global - ODIS Support Managment' }
  },
  { path: '**', pathMatch: 'full', redirectTo: '/notfound', data: { titulo: 'OCA Global - ODIS 404', subtitle: '', descripcion: 'OCA Global - ODIS User 404'  } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthguardService]
})

export class SupportRoutingModule { }
