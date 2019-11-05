import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MatSnackBar } from '@angular/material';

import Swal from 'sweetalert2';

// MODELS
import { ProjectServiceType } from 'src/app/models/types';

// SERVICES
import { ProjectsService, UserService } from 'src/app/services/service.index';



@Component({
  selector: 'app-project-type-list',
  templateUrl: './project-type-list.component.html',
  styleUrls: ['./project-type-list.component.css']
})
export class ProjectTypeListComponent implements OnInit, OnDestroy {

  data: ProjectServiceType;
  editando = false;
  forma: FormGroup;
  projectype: ProjectServiceType[] = [];
  indexitem: number;
  isLoading = true;
  isLoadingSave = false;
  isLoadingDelete = false;
  label = 0;
  status: string;
  subscription: Subscription;
  show = false;
  token: any;



  @Input() id: number;
  @Output() total: EventEmitter<number>;

  constructor(
    public _userService: UserService,
    public dataService: ProjectsService,
    public snackBar: MatSnackBar,
  ) {
    this.token = this._userService.getToken();
    this.total = new EventEmitter();
  }



  ngOnInit() {
    if (this.id > 0) {

      this.forma = new FormGroup({
        descripcion: new FormControl(null, [Validators.required, Validators.minLength(2)]),
        observacion: new FormControl(null, ),
        order_by: new FormControl(0, [Validators.required]),
      });

      this.cargar();      
    }  
  }

  cargar(){
    this.isLoading = true;
    this.subscription = this.dataService.getProjectServiceType(this.token.token, this.id)
    .subscribe(
    response => {
              if(!response){
                this.status = 'error';
                this.isLoading = false;
                return;
              }
              if(response.status == 'success'){   
                this.projectype = response.datos;
                this.total.emit(this.projectype.length);
                this.isLoading = false;
              }
              },
              error => {
                this.status = 'error';
                this.isLoading = false;
                console.log(<any>error);
              }

              );        
  }

  edit(i:number){
    this.indexitem = i;
    this.editando = true;
  }

  close(){
    this.indexitem = -1;
  }




  onSubmit() {

		if (this.forma.invalid) {
			Swal.fire('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
			return;
		}

    this.data = new ProjectServiceType (0, this.forma.value.descripcion, this.forma.value.observacion, this.forma.value.order_by, '', 1, '');

    this.dataService.addProjecType(this.token.token, this.id, this.data)
            .subscribe( (resp: any) => {
              if (!resp) {
                this.snackBar.open('Error procesando solicitud!!!', '', {duration:3000, });
                this.indexitem = -1;
                return;
              }
              if (resp.status === 'success') {
                this.snackBar.open('Solicitud procesada satisfactoriamente!!!', '', {duration: 3000,});
                this.isLoadingSave = false;
                this.indexitem = -1;
                this.label = 0;
                this.forma.reset();
                setTimeout( () => {
                  this.cargar();
                  this.show = false;
                }, 1000);
              } else {
                this.show = false;
                this.indexitem = -1;
              }
            },
              error => {
                this.snackBar.open('Error procesando solicitud!!!', '', {duration: 3000, });
                this.indexitem = -1;
                console.log(<any>error);
              }
            );
  }


  save(i, element) {
    this.indexitem = i;
    this.editando = false;
    this.isLoadingSave = true;

    this.dataService.updateProjecType(this.token.token, this.id, element, element.id)
            .subscribe( (resp: any) => {
              if (!resp) {
                this.snackBar.open('Error procesando solicitud!!!', '', {duration: 3000, });
                this.isLoadingSave = false;
                this.indexitem = -1;
                return;
              }
              if (resp.status === 'success'){
                this.snackBar.open('Solicitud procesada satisfactoriamente!!!', '', {duration: 3000,});
                this.isLoadingSave = false;
                this.indexitem = -1;
              } else {
                this.isLoadingSave = false;
                this.indexitem = -1;
              }
            },
              error => {
                this.snackBar.open('Error procesando solicitud!!!', '', {duration:3000, });
                this.isLoadingSave = false;
                this.indexitem = -1;
                console.log(<any>error);
              }
            );
  }

  delete(i, element) {

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta seguro de borrar información ',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    })
    .then( borrar => {
      if (borrar.value) {
      if (borrar) {
        this.indexitem = i;
        this.isLoadingDelete = true;

        this.dataService.deleteProjecType(this.token.token, this.id, element.id)
                .subscribe( (resp: any) => {
                  if (!resp) {
                    this.snackBar.open('Error procesando solicitud!!!', '', {duration: 3000, });
                    this.isLoadingDelete = false;
                    this.indexitem = -1;
                    return;
                  }
                  if (resp.status === 'success'){
                    this.snackBar.open('Solicitud procesada satisfactoriamente!!!', '', {duration: 3000, });
                    this.isLoadingDelete = false;
                    this.indexitem = -1;
                    setTimeout( () => {
                      this.cargar();
                    }, 2000);
                  } else {
                    this.isLoadingDelete = false;
                    this.indexitem = -1;
                  }
                },
                  error => {
                    this.snackBar.open(error.error.message, '', {duration: 3000, });
                    this.isLoadingDelete = false;
                    this.indexitem = -1;
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


	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
  }

  toggle() {
    this.show = !this.show;
  }

}
