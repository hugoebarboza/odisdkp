import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

// MODELS
import { User } from 'src/app/models/types';

// SERVICES
import { UserService } from 'src/app/services/service.index';



@Component({
  selector: 'app-setting-user',
  templateUrl: './setting-user.component.html',
  styleUrls: ['./setting-user.component.css']
})
export class SettingUserComponent implements OnInit {

  identity: any;
  title = 'Perfil de Acceso del Usuario - Seguridad';
  token: any;
  usuario: any;
  username: string;
  user: User;


  constructor(
    public _userService: UserService,
    public dialogRef: MatDialogRef<SettingUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this._userService.handleAuthentication(this.identity, this.token);
    this.usuario = this.data.usuario;
    this.username = this.data.usuario.name + ' ' + this.data.usuario.surname;
  }

  ngOnInit() {
    if (!this.data || !this.usuario) {
      return;
    }

    if (this.usuario && this.usuario.id) {
      // this.getServices();
    }
  }

  update(data: any) {
    if (!data) {
      return;
    }
  }

  /*
  getServices(id: number) {

    this.subscription = this._proyectoService.getProjectService(this.token, id).subscribe(
    (response: any) => {
              if(!response){
                return;
              }
              if(response.status == 'success') {
                this.service = response.datos;
                //console.log(this.service.length);
                //console.log(this.service);
              }
              },
    (error) => {
                console.log(<any>error);
                }
              );
    }*/

  onNoClick(): void {
    this.dialogRef.close();
  }

}
