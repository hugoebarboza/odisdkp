import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import swal from 'sweetalert';

//MODELS
import { 
  Proyecto,
  Service
  } from '../../../../models/types';

//SERVICES
import { UserService } from '../../../../services/service.index';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  customerid:number
  id:number;
  identity: any;
  loading: boolean = false;
  project: any;
  project_name: string;
  proyectos: Array<Proyecto> = [];
  title:string = "Usuarios de Proyecto";
  totalRegistros: number = 0;
  totalRegistrosNoActive: number = 0;
  selected = new FormControl(0);
  subtitle:string = "Seleccione los usuarios de acuerdo a las siguientes opciones."
  status: string;
  token: any;

  constructor(
    public _userService: UserService,
    public dialogRef: MatDialogRef<UserComponent>,   
    @Inject(MAT_DIALOG_DATA) public data: Service

  ) { 
    this.loading = true;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.proyectos = this._userService.getProyectos();

  }

  ngOnInit() {
    if(this.data.project_id > 0){
      this.id = this.data.project_id;
      this.project = this.filter();
      this.project_name = this.project.project_name;
      this.customerid = this.project.customer_id;
      this.loading = false;
    }
  }

  loadDataUser(total:number){
    this.totalRegistros = total;
  }

  loadDataUserNoActive(total:number){
    this.totalRegistrosNoActive = total;
  }


  adduser(userid:number){
    if(userid > 0) {
      
      this._userService.adduser(this.token.token, userid, this.id).subscribe(      
        response => {
         if(response.status == 'success'){
          this.dialogRef.close();
          swal('Solicitud procesada ', 'exitosamente.', 'success' );  
         }else{
          console.log(response);
          this.dialogRef.close();
          swal('No fue posible procesar su solicitud', '', 'error');  
        }
        },
        error => {
          this.dialogRef.close();
          //swal('No fue posible procesar su solicitud', error.error.message, 'error');
          swal('No fue posible procesar su solicitud', error, 'error');
        }
      );
    }
  }



  remover(userid:number){
    if (userid === this.identity.sub ) {
      this.dialogRef.close();
      swal('No puede borrar usuario', 'No se puede borrar a si mismo', 'error');
      return;
    }
    
    this._userService.remover(this.token.token, userid, this.id).subscribe(      
      response => {
       if(response.status == 'success'){
        this.dialogRef.close();
        swal('Solicitud procesada ', 'exitosamente.', 'success' );
        //this.cargarUsuarios();
       }else{
        this.dialogRef.close();
        swal('No fue posible procesar su solicitud', '', 'error');
       }
      },
      error => {
        this.dialogRef.close();
        swal('No fue posible procesar su solicitud', error, 'error');
      }
    );

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

  onNoClick(): void {
    this.dialogRef.close();
  }


}
