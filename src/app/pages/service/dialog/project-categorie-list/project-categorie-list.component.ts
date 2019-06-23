import { Component, OnInit, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MatSnackBar } from '@angular/material';

import swal from 'sweetalert';

//MODELS
import { ProjectServiceCategorie } from 'src/app/models/types';

//SERVICES
import { ProjectsService, UserService } from 'src/app/services/service.index';



@Component({
  selector: 'app-project-categorie-list',
  templateUrl: './project-categorie-list.component.html',
  styleUrls: ['./project-categorie-list.component.css']
})
export class ProjectCategorieListComponent implements OnInit, OnDestroy {

  data: ProjectServiceCategorie;
  editando: boolean = false;
  forma: FormGroup;
  projectcategorie: ProjectServiceCategorie[] = [];
  indexitem:number;
  isLoading: boolean = true;
  isLoadingSave: boolean = false;
  isLoadingDelete: boolean = false;
  label:number = 0;
  status: string;
  subscription: Subscription;
  show:boolean = false;
  token: any;



  @Input() id : number;
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
    //console.log(this.id);
    if(this.id > 0){
      
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
    this.subscription = this.dataService.getProjectServiceCategorie(this.token.token, this.id)
    .subscribe(
    response => {
              if(!response){
                this.status = 'error';
                this.isLoading = false;
                return;
              }
              if(response.status == 'success'){   
                this.projectcategorie = response.datos;
                this.total.emit(this.projectcategorie.length);
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

	ngOnDestroy(){
		if(this.subscription){
			this.subscription.unsubscribe();      
      //console.log("ngOnDestroy unsuscribe");
		}
  }

  toggle() {
    this.show = !this.show;
  }


  onSubmit(){
  

		if(this.forma.invalid){
			swal('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
			return;
		}

    this.data = new ProjectServiceCategorie (0, this.forma.value.descripcion, this.forma.value.observacion, this.forma.value.order_by, '', 1, '');

    
    this.dataService.addProjectServiceCategorie(this.token.token, this.id, this.data)
            .subscribe( (resp: any) => {              
              if(!resp){
                this.snackBar.open('Error procesando solicitud!!!', '', {duration:3000, });
                this.indexitem = -1;
                return;        
              }
              if(resp.status == 'success'){
                this.snackBar.open('Solicitud procesada satisfactoriamente!!!', '', {duration: 3000,});
                this.isLoadingSave = false;
                this.indexitem = -1;
                this.label = 0;
                this.forma.reset();
                setTimeout( () => {
                  this.cargar();
                  this.show = false;
                }, 1000);
            
              }else{
                this.show = false;
                this.indexitem = -1;
              }
            },
              error => {
                this.snackBar.open('Error procesando solicitud!!!', '', {duration:3000, });
                this.indexitem = -1;
                console.log(<any>error);
              }       
            );  
  }

  save(i, element){
    this.indexitem = i;
    this.editando = false;
    this.isLoadingSave = true;
    //console.log(element);

    
    this.dataService.updateProjectServiceCategorie(this.token.token, this.id, element, element.id)
            .subscribe( (resp: any) => {
              if(!resp){
                this.snackBar.open('Error procesando solicitud!!!', '', {duration:3000, });
                this.isLoadingSave = false;
                this.indexitem = -1;
                return;        
              }
              if(resp.status == 'success'){
                this.snackBar.open('Solicitud procesada satisfactoriamente!!!', '', {duration: 3000,});
                this.isLoadingSave = false;
                this.indexitem = -1;
              }else{
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


  delete(i, element){
    this.indexitem = i;
    this.isLoadingDelete = true;
    
    this.dataService.deleteProjectServiceCategorie(this.token.token, this.id, element.id)
            .subscribe( (resp: any) => {
              if(!resp){
                this.snackBar.open('Error procesando solicitud!!!', '', {duration:3000, });
                this.isLoadingDelete = false;
                this.indexitem = -1;
                return;        
              }
              if(resp.status == 'success'){
                this.snackBar.open('Solicitud procesada satisfactoriamente!!!', '', {duration: 3000,});
                this.isLoadingDelete = false;
                this.indexitem = -1;
                setTimeout( () => {
                  this.cargar();
                }, 2000);
                
              }else{
                this.isLoadingDelete = false;
                this.indexitem = -1;
              }
            },
              error => {
                //console.log(<any>error.error);
                //this.snackBar.open('Error procesando solicitud!!!', '', {duration:3000, });
                this.snackBar.open(error.error.message, '', {duration:3000, });
                this.isLoadingDelete = false;
                this.indexitem = -1;
              }       
            );
  }    


  
}
