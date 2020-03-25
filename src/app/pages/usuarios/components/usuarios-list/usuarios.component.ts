import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material/dialog';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';

import Swal from 'sweetalert2';

// DIALOG
import { AddUserComponent } from 'src/app/pages/usuarios/dialog/adduser/adduser.component';
import { AddTeamComponent } from 'src/app/pages/team/dialog/add-team/add-team.component';
import { EditUserComponent } from 'src/app/pages/usuarios/dialog/edituser/edituser.component';
import { ModalUploadImageComponent } from 'src/app/pages/usuarios/dialog/modaluploadimage/modaluploadimage.component';
import { SettingUserComponent } from 'src/app/pages/usuarios/dialog/setting-user/setting-user.component';
import { ShowProfileSecurityComponent } from 'src/app/pages/usuarios/dialog/showprofilesecurity/showprofilesecurity.component';

// MODEL
import { Proyecto } from 'src/app/models/types';


// NGRX REDUX
// import { AppState } from '../../../app.reducers';
// import { Store } from '@ngrx/store';


// SERVICES
import { SettingsService, UserService } from 'src/app/services/service.index';



@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnDestroy {

  identity: any;
  id: number;
  indexitem: number;
  indexitemdelete: number;
  isLoading = true;
  isLoadingDownload = false;
  isLoadingDelete = false;
  departamento_id: number;
  page = 1;
  pageSize = 0;
  proyectos: Array<Proyecto> = [];
  project: any;
  project_name = '';
  roles = [];
  status: string;
  sub: any;
  subscription: Subscription;
  title: string;
  termino = '';
  token: any;
  totalRegistros = 0;
  usuarios = [];
  verify: number;



  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionrightaction = new FormControl(this.positionOptions[5]);
  positionheaderaction = new FormControl(this.positionOptions[2]);



  constructor(
    private _route: ActivatedRoute,
    public _router: Router,
    public _userService: UserService,
    public dialog: MatDialog,
    public label: SettingsService
  ) {
    this._userService.handleAuthentication(this.identity, this.token);
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();
    this.label.getDataRoute().subscribe(data => {
      this.title = data.subtitle;
    });

    this.sub = this._route.params.subscribe(params => {
      const id = +params['id'];
      this.id = id;
      this.termino = '';
      this.page = 1;
      this.pageSize = 0;
      if (this.id && this.proyectos) {
        this.project = this.filter();
        if (this.project !== 'Undefined' && this.project !== null && this.project) {
        this.departamento_id = this.project.department_id;
        this.project_name = this.project.project_name;
        this.cargarUsuarios();
        this.getRoleUser();
        } else {
          this._router.navigate(['/notfound']);
        }
      }
    });

  }


  ngOnDestroy() {
    if (this.subscription) {
    this.subscription.unsubscribe();
   }
  }


  onChangeIcon(userid: number, status: number) {

    if (status) {
      this.verify = 1;
    }

    if (!status) {
      this.verify = 0;
    }


    this.subscription = this._userService.verifyStatusUser( this.token.token, userid, this.verify )
              .subscribe( (resp: any) => {
                Swal.fire('Solicitud procesada exitosamente', resp.message, 'success' );
              },
              error => {
                Swal.fire('Importante', error, 'error');
              }
              );


    /*
    if(this.label == true){
      const tag = 1;
      this.dataService.important(this.token.token, category_id, orden, tag);
      this.snackBar.open('Se ha marcado la orden como importante.', 'Destacada', {duration: 2000,});
    }*/

  }



  addNew(id: number, departamento: number) {
    if (id > 0 && departamento > 0) {
      const dialogRef = this.dialog.open(AddUserComponent, {
        width: '777px',
        disableClose: true,
        data: { project_id: id,
                departamento_id: departamento
        }
        });

        dialogRef.afterClosed().subscribe(
              result => {
                 if (result === 1) {
                 // After dialog is closed we're doing frontend updates
                 // For add we're just pushing a new row inside DataService
                 // this.dataService.dataChange.value.push(this.OrderserviceService.getDialogData());
                 // this.refresh();
                 }
               });
    }
 }

 addTeam(id: number) {
  if (id > 0) {
    const dialogRef = this.dialog.open(AddTeamComponent, {
      width: '777px',
      disableClose: true,
      data: { project_id: id
      }
      });

      dialogRef.afterClosed().subscribe(
            result => {
               if (result === 1) {
               // After dialog is closed we're doing frontend updates
               // For add we're just pushing a new row inside DataService
               // this.dataService.dataChange.value.push(this.OrderserviceService.getDialogData());
               // this.refresh();
               }
             });
  }
}

  cargarUsuarios() {

    this.isLoading = true;

    this.subscription = this._userService.getUserPaginate( this.token.token, this.id, this.page )
              .subscribe( (resp: any) => {
                this.totalRegistros = resp.datos.total;
                this.usuarios = resp.datos.data;
                this.isLoading = false;
                this.status = 'success';
              },
              error => {
                this.status = 'error';
                this.isLoading = false;
                console.log(<any>error);
              }
              );

  }


  buscarUsuario( termino: string ) {
    if ( termino.length <= 0 || !termino) {
      this.cargarUsuarios();
      return;
    }

    this.isLoading = true;

    this._userService.searchUser(this.token.token, this.id, this.page, termino )
            .subscribe( (resp: any) => {
              this.totalRegistros = resp.datos.total;
              this.usuarios = resp.datos.data;
              this.isLoading = false;
              this.status = 'success';
            },
            error => {
              this.status = 'error';
              this.isLoading = false;
              console.log(<any>error);
            }
            );
  }


  borrarUsuario( usuario: any, i: number ) {

    if ( usuario.id === this.identity.sub ) {
      Swal.fire('No puede borrar usuario', 'No se puede borrar a si mismo', 'error');
      return;
    }

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar a ' + usuario.name + ' ' + usuario.surname,
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    })
    .then( borrar => {
      if (borrar.value) {
        if (borrar) {
          this.indexitemdelete = i;
          this.isLoadingDelete = true;
          this._userService.delete(this.token.token, usuario.id )
                    .subscribe( response => {
                      if (!response) {
                        return;
                      }
                      if (response.status === 'success') {
                        Swal.fire('Usuario eliminado', usuario.name + ' ' + usuario.surname, 'success' );
                        this.isLoadingDelete = false;
                        this.indexitemdelete = -1;
                        this.cargarUsuarios();
                      } else {
                        Swal.fire('Importante', response.message, 'error');
                        this.isLoadingDelete = false;
                        this.indexitemdelete = -1;
                      }
                    },
                      error => {
                        Swal.fire('Importante', error, 'error');
                        this.isLoadingDelete = false;
                        this.indexitemdelete = -1;
                      }
                    );
        }
      } else if (borrar.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
        );
      }
    });
  }

  guardarUsuario( usuario: any, i: number ) {

    this.indexitem = i;
    this.isLoadingDownload = true;


    if (!usuario || !usuario.role_id) {
      Swal.fire('Importante', 'A ocurrido un error en la actualización del usuario.', 'error');
      this.isLoadingDownload = false;
      this.indexitem = -1;
      return;
   }


    this._userService.update(this.token.token, usuario, usuario.id)
            .subscribe( (resp: any) => {
              if (!resp) {
                return;
              }
              if (resp.status === 'success') {
                Swal.fire('Usuario actualizado', usuario.name + ' ' + usuario.surname, 'success' );
                this.isLoadingDownload = false;
                this.indexitem = -1;
              } else {
                Swal.fire('Importante', 'A ocurrido un error en el procesamiento de información', 'error');
                this.isLoadingDownload = false;
                this.indexitem = -1;
              }
            },
              error => {
                Swal.fire('Importante', error, 'error');
                this.isLoadingDownload = false;
                this.indexitem = -1;
              }
            );
  }

  getRoleUser() {
    // const role = 9;
    if (this.token.token) {
      this._userService.getRoleUser(this.token.token, this.identity.role).subscribe(
        response => {
          if (!response) {
            return false;
          }
            if (response.status === 'success') {
              this.roles = response.datos;
              // console.log(this.roles);
            }
        },
            error => {
            console.log(<any>error);
            }
        );
    }

  }

  filter() {
    if (this.proyectos && this.id) {
      for (let i = 0; i < this.proyectos.length; i += 1) {
        const result = this.proyectos[i];
        if (result.id === this.id) {
            return result;
        }
      }
    }
  }

  paginate( valor: number, increment: number ) {

    const desde = this.pageSize + valor;

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      this.pageSize = 0;
      return;
    }

    this.pageSize += valor;
    this.page += increment;

    if ( this.page === 0 ) {
      this.page = 1;
      return;
    }

    this.cargarUsuarios();
  }


  openDialogProfileSecurity(usuario: any): void {

    if (!usuario) {
      return;
    }

    const dialogRef = this.dialog.open(ShowProfileSecurityComponent, {
      width: '777px',
      disableClose: true,
      data: { usuario: usuario,
            }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {

      }
    });
  }

  openDialogProfileImage(usuario: any): void {

    if (!usuario) {
      return;
    }

    const dialogRef = this.dialog.open(ModalUploadImageComponent, {
      width: '777px',
      disableClose: true,
      data: { usuario: usuario,
            }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {

      }
    });
  }



  startEdit(usuario: any) {
    if (!usuario) {
      return;
    }

    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '777px',
      disableClose: true,
      data: {usuario: usuario}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
       // this.refresh();
      }
    });
  }

  setting(usuario: any) {
    if (!usuario) {
      return;
    }
    const dialogRef = this.dialog.open(SettingUserComponent, {
      width: '777px',
      disableClose: true,
      data: {usuario: usuario, id: this.id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
       // this.refresh();
      }
    });

  }

  refreshMenu(event: number) {
    if (event === 1) {

    }
  }


}
