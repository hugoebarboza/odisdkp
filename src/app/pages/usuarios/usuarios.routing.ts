import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENT
import { UsuariosComponent } from 'src/app/pages/usuarios/components/usuarios-list/usuarios.component';
import { UsuariosDetailComponent } from 'src/app/pages/usuarios/components/usuarios-detail/usuarios-detail.component';
import { UsuarioWorkComponent } from 'src/app/pages/usuarios/components/usuario-work/usuario-work.component';

// Guards
import { AuthguardService } from '../../services/authguard.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthguardService],
    children: [
    {
      path: ':id',
      component: UsuariosComponent,
      data: { path: 'users', titulo: 'OCA Global - ODIS Users Managment', subtitle: 'Usuarios', descripcion: 'OCA Global - ODIS Users Managment' }
    },
    { path: ':id/settings',
    component: UsuariosDetailComponent,
    data: { path: 'users', titulo: 'OCA Global - ODIS Users Managment', subtitle: 'Configuración de Usuario', descripcion: 'OCA Global - ODIS Project Users Managment' }
    },
    { path: ':id/work',
    component: UsuarioWorkComponent,
    data: { path: 'users', titulo: 'OCA Global - ODIS Users Managment', subtitle: 'Órdenes de Trabajo del Usuario', descripcion: 'OCA Global - ODIS Project Users Managment' }
    },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UsuariosRoutingModule { }


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
