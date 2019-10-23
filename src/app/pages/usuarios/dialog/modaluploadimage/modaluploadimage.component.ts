import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import Swal from 'sweetalert2';

// SERVICES
import { UserService } from '../../../../services/service.index';


@Component({
  selector: 'app-modaluploadimage',
  templateUrl: './modaluploadimage.component.html',
  styleUrls: ['./modaluploadimage.component.css']
})
export class ModalUploadImageComponent implements OnInit {

  title = "Perfil del Usuario - Imagen";

  file:any;
  fotoperfil: string = '';
  isLoadingPerfil: boolean = true;
  imagenSubir: File;
  imagenTemp: any;
  token: any;
  usuario:any;
  urlImagenTemp: any;

  constructor(
    public _userService: UserService,
    public dialogRef: MatDialogRef<ModalUploadImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { 
    this.token = this._userService.getToken();
    this.usuario = this.data.usuario;
  }

  ngOnInit() {
    if(this.usuario){
      this.isLoadingPerfil = true;
      this.getPerfilUser(this.usuario.id);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  seleccionImage( archivo: FileList ) {
    this.file = archivo.item(0);
    if ( !this.file ) {
      this.dialogRef.close();
      Swal.fire('Importante', 'A ocurrido un error.', 'error');
      this.imagenSubir = null;
      return;
    }

    if ( this.file.type.indexOf('image') < 0 ) {
      this.dialogRef.close();
      Swal.fire('Sólo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = this.file;
    const reader = new FileReader();
    this.urlImagenTemp = reader.readAsDataURL( this.file );
    reader.onloadend = () => {
      this.imagenTemp = reader.result;
    }

  }

  cambiarImagen() {
    this.isLoadingPerfil = true;
    this._userService.updateFotoProfileUser( this.token.token, this.file, this.usuario.id).subscribe( 
    (response: any) => {
        if (response.status === 'success') {
        this.dialogRef.close();
        Swal.fire('Foto de Perfil de Usuario actualizada.', 'success' );
        this.getPerfilUser(this.usuario.id);
        } else {
        this.dialogRef.close();
        Swal.fire('No fue posible procesar su solicitud.', '', 'error');
        this.isLoadingPerfil = false;
        }
      },
      error => {
        this.dialogRef.close();
      Swal.fire('Importante', 'A ocurrido un error.', 'error');
      console.log(<any>error);
      this.isLoadingPerfil = false;
      }
    );
  }


  getPerfilUser(id: any){

    if(!id || !this.token.token){
      return;
    }

    this._userService.getPerfilUser(this.token.token, id)
    .then((resp:any) => {
      if(resp && resp.datos && resp.datos[0]['archivo']){
        this.fotoperfil = resp.datos[0]['archivo'];
        if(this.fotoperfil.length > 0){
          let key = 'fotoprofile';
          this._userService.saveStorage(key, this.fotoperfil);
          this.isLoadingPerfil = false;
        }else{
          this.isLoadingPerfil = false;
        }
      }
    })
    .catch((error) => {
      this.isLoadingPerfil = false;      
      console.log(error);
      return false;
    });

    /*
    if(id && this.token.token){
      this._userService.getPerfilUser(this.token.token, id).subscribe(
        response => {        
          if(!response){
            this.isLoadingPerfil = false;
            return false;        
          }
            if(response.status == 'success'){ 
              this.fotoperfil = response.datos[0]['archivo'];
              if(this.fotoperfil.length > 0){
                this.isLoadingPerfil = false;
              }else{
                this.isLoadingPerfil = false;
              }
            }
        },
            error => {
            console.log(<any>error);
            this.isLoadingPerfil = false;
            }   
        );      
    }*/

  }



}
