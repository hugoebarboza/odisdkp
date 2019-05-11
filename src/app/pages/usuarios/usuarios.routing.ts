import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//COMPONENT
import { UsuariosComponent } from './usuarios-list/usuarios.component';

//Guards
import { AuthguardService } from '../../services/authguard.service';



const routes: Routes = [
  {
    path: ':id',
    component: UsuariosComponent,
    canActivate: [AuthguardService],
    data: { path: 'users', titulo: 'OCA Global - ODIS Users Managment', subtitle: 'Usuarios', descripcion: 'OCA Global - ODIS Users Managment' } 
  }
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