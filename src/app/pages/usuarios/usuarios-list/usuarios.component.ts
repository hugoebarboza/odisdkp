import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, TooltipPosition } from '@angular/material';
import { FormControl } from '@angular/forms';

declare var swal: any;

// DIALOG
import { AddUserComponent } from '../dialog/adduser/adduser.component';
import { EditUserComponent } from '../dialog/edituser/edituser.component';
import { ModalUploadImageComponent } from '../dialog/modaluploadimage/modaluploadimage.component';
import { ShowProfileSecurityComponent } from '../dialog/showprofilesecurity/showprofilesecurity.component';

// MODEL
import { Proyecto } from '../../../models/types';


// NGRX REDUX
// import { AppState } from '../../../app.reducers';
// import { Store } from '@ngrx/store';


// SERVICES
import { SettingsService, UserService } from '../../../services/service.index';



@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy {

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
  roles:  any[] = [];
  status: string;
  sub: any;
  subscription: Subscription;
  title: string;
  termino = '';
  token: any;
  totalRegistros = 0;
  usuarios: any[] = [];
  verify: number;


  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionrightaction = new FormControl(this.positionOptions[5]);

  
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
      let id = +params['id'];            
      this.id = id;
      this.termino = '';
      this.page = 1;
      this.pageSize = 0;
      if(this.id && this.proyectos){
        this.project = this.filter();
        if (this.project != "Undefined" && this.project !== null && this.project){
        this.departamento_id = this.project.department_id;
        this.project_name = this.project.project_name;
        this.cargarUsuarios();
        this.getRoleUser();
        }else{
          this._router.navigate(['/notfound']);
        }
      }
    });
    
  }

  ngOnInit() {

    /*
    this.subscription = this.store.select('loading')
    .subscribe( loading => 
      {
        this.isLoading = loading.isLoading;  
      }
    );*/


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
                swal('Solicitud procesada exitosamente', resp.message, 'success' );
              },
              error => {
                swal('Importante', error, 'error');
              }
              );


    /*
    if(this.label == true){
      const tag = 1;
      this.dataService.important(this.token.token, category_id, orden, tag);
      this.snackBar.open('Se ha marcado la orden como importante.', 'Destacada', {duration: 2000,});
    }*/

  }  



  addNew(id:number, departamento:number) {
    if(id > 0 && departamento > 0){
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
                 //this.dataService.dataChange.value.push(this.OrderserviceService.getDialogData());  
                 //this.refresh();
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
                //console.log(this.usuarios);
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


  borrarUsuario( usuario: any, i:number ) {

    if ( usuario.id === this.identity.sub ) {
      swal('No puede borrar usuario', 'No se puede borrar a si mismo', 'error');
      return;
    }
    
    swal({
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar a ' + usuario.name + ' ' + usuario.surname,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })

    .then( borrar => {

      if (borrar) {
        this.indexitemdelete = i;
        this.isLoadingDelete = true;
        this._userService.delete(this.token.token, usuario.id )
                  .subscribe( response => {
                    if(!response){
                      return;        
                    }
                    if(response.status == 'success'){ 
                      swal('Usuario eliminado', usuario.name +' '+usuario.surname, 'success' );
                      this.isLoadingDelete = false;
                      this.indexitemdelete = -1;
                      this.cargarUsuarios();
                    }else{
                      swal('Importante', response.message, 'error');
                      this.isLoadingDelete = false;
                      this.indexitemdelete = -1;
                    }
                  },
                    error => {
                      //swal('Importante', error.error.message, 'error');
                      swal('Importante', error, 'error');
                      this.isLoadingDelete = false;
                      this.indexitemdelete = -1;
                    }                               
                  );
      }

    });
  }

  guardarUsuario( usuario: any, i: number ) {

    this.indexitem = i;
    this.isLoadingDownload = true;
    
    this._userService.update(this.token.token, usuario, usuario.id)
            .subscribe( (resp: any) => {              
              if(!resp){
                return;        
              }
              if(resp.status == 'success'){ 
                swal('Usuario actualizado', usuario.name +' '+usuario.surname, 'success' );
                this.isLoadingDownload = false;
                this.indexitem = -1;
              }else{
                swal('Importante', 'A ocurrido un error en el procesamiento de información', 'error');
                this.isLoadingDownload = false;
                this.indexitem = -1;
              }
            },
              error => {
                //swal('Importante', error.error.message, 'error');
                swal('Importante', error, 'error');
                this.isLoadingDownload = false;
                this.indexitem = -1;
              }       
            );
  }

  getRoleUser(){
    if(this.token.token){
      this._userService.getRoleUser(this.token.token, this.identity.role).subscribe(
        response => {        
          if(!response){
            return false;        
          }
            if(response.status == 'success'){ 
              this.roles = response.datos;
            }
        },
            error => {
            console.log(<any>error);
            }   
        );      
    }

  }

  filter(){
    if(this.proyectos && this.id){
      for(var i = 0; i < this.proyectos.length; i += 1){
        var result = this.proyectos[i];
        if(result.id === this.id){
            return result;
        }
      }
    }    
  }

  paginate( valor: number, increment:number ) {

    let desde = this.pageSize + valor;

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      this.pageSize = 0;
      return;
    }

    this.pageSize += valor;
    this.page += increment;

    if ( this.page == 0 ) {
      this.page = 1;
      return;
    }

    this.cargarUsuarios();
  }


  openDialogProfileSecurity(usuario:any): void {

    if(!usuario){
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

  openDialogProfileImage(usuario:any): void {

    if(!usuario){
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



  startEdit(usuario:any) {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '777px',
      disableClose: true,  
      data: {usuario: usuario}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        //const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
        // this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
       //this.refresh();
      }
    });
  }

  refreshMenu(event:number){
		if(event == 1){
		}
	}


}
