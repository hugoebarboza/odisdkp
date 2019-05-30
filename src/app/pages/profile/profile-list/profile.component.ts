import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import swal from 'sweetalert';

//MODEL
import { Proyecto, User } from '../../../models/types';

//SERVICES
import { ProjectsService, SettingsService, UserService } from '../../../services/service.index';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  fotoperfil: string = '';
  file:any;
  imagenSubir: File;
  imagenTemp: any;
  identity: any;
  isLoading: boolean = true;
  isLoadingPerfil: boolean = true;
  isSave: boolean = false;
  proyectos: Array<Proyecto>;
  subscription: Subscription;
  show:boolean = false;
  title: string;
  token: any;
  usuario: User;
  user: User;
  urlImagenTemp: any;


  constructor(
    public _userService: UserService,
    public label: SettingsService,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.fotoperfil = this._userService.getFotoProfile();
    this.proyectos = this._userService.getProyectos();
    this.label.getDataRoute().subscribe(data => {
      this.title = data.subtitle;
    });
    this.show = false;
    this.isSave = false;

  }

  ngOnInit() {
    this.show = false;
    this.isSave = false;
    this.isLoading = true;
    this.isLoadingPerfil = true;
    if(this.identity){
      this.isLoadingPerfil = false;
      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    if(this.subscription){
      this.subscription.unsubscribe();
      //console.log("ngOnDestroy unsuscribe");
    }
  }

  /*
  ngDoCheck(){
    this.identity = this._userService.getIdentity();  
  }*/


  
  guardar( usuario: User ) {

    this.show = true;
    this.isLoading = false;
    this.isSave = true;

		if(!usuario){
			swal('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
			return;
		}


    this.user = new User('',usuario.dni, usuario.dv, '',usuario.name, usuario.email, '', this.identity.role, usuario.surname, '', 1, usuario.telefono1, usuario.telefono2, 1, 1, 1);

    this.subscription = this._userService.updateProfile(this.token.token, this.user, this.identity.sub).subscribe(
      response => {
				if(response.status == 'success'){
          swal('Usuario actualizado', this.user.email, 'success' );
          this.isLoading = false;
          this.isSave = false;
          //this.ngOnInit();
					//this.status = response.status;	
					//this.user = new User('','','','',1,'','',1);
				}else{

          swal('Importante', response.message, 'error');
          this.isLoading = false;
          this.isSave = false;
					//this.status = 'error';
				}
	 		},
	 		error => {
        swal('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
         console.log(<any>error);
         this.isLoading = false;
         this.isSave = false;
	 		}

    );

  }



  seleccionImage( archivo: FileList ) {
    this.file = archivo.item(0);
    if ( !this.file ) {
      this.imagenSubir = null;
      return;
    }

    if ( this.file.type.indexOf('image') < 0 ) {
      swal('Sólo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = this.file;
    let reader = new FileReader();
    this.urlImagenTemp = reader.readAsDataURL( this.file );
    reader.onloadend = () => {
      this.imagenTemp = reader.result;
    }

  }

  cambiarImagen() {
    this.isLoadingPerfil = true;
    this._userService.updateFotoProfile( this.token.token, this.file).subscribe( 
    (response: any) => {
        if(response.status == 'success'){
        swal('Foto de Perfil de Usuario actualizada.', 'success' );
        this.getPerfilUser(this.identity.sub);
        }else{
        swal('No fue posible procesar su solicitud.', '', 'error');
        this.isLoadingPerfil = false;
        }
      },    
      error => {
      swal('Importante', 'A ocurrido un error.', 'error');
      console.log(<any>error);
      this.isLoadingPerfil = false;
      }    
    );
  }

  getPerfilUser(id: any){
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
                let key = 'fotoprofile';
                this._userService.saveStorage(key, this.fotoperfil);
                this.isLoadingPerfil = false;
              }
            }
        },
            error => {
            console.log(<any>error);
            }   
        );      
    }

  }

  refreshMenu(event:number){
		if(event == 1){
		}
	}


  toggle() {
    this.show = !this.show;
  }


}
