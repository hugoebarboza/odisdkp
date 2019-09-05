import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//COMPONENT
import { UsuariosComponent } from './usuarios-list/usuarios.component';
import { UsuariosDetailComponent } from './usuarios-detail/usuarios-detail.component';
import { UsuarioWorkComponent } from './usuario-work/usuario-work.component';

//Guards
import { AuthguardService } from '../../services/authguard.service';



const routes: Routes = [
  {
    path: ':id',
    component: UsuariosComponent,
    canActivate: [AuthguardService],
    data: { path: 'users', titulo: 'OCA Global - ODIS Users Managment', subtitle: 'Usuarios', descripcion: 'OCA Global - ODIS Users Managment' } 
  },
  { path:':id/settings', 
  component: UsuariosDetailComponent,
  canActivate: [AuthguardService],
  data: { path: 'project', titulo: 'OCA Global - ODIS Users Managment', subtitle: 'Configuración de Usuario', descripcion: 'OCA Global - ODIS Project Users Managment' }
  },
  { path:':id/work', 
  component: UsuarioWorkComponent,
  canActivate: [AuthguardService],
  data: { path: 'project', titulo: 'OCA Global - ODIS Users Managment', subtitle: 'Órdenes de Trabajo del Usuario', descripcion: 'OCA Global - ODIS Project Users Managment' }
  },
  { path:'**', pathMatch: 'full', redirectTo: '/notfound', data: { titulo: 'OCA Global - ODIS 404', subtitle: '', descripcion: 'OCA Global - ODIS User 404'  } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthguardService]
})
export class UsuariosRoutingModule { }


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/