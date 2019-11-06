import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import Swal from 'sweetalert2';

// MODELS
import { Giro } from 'src/app/models/types';

// SERVICES
import { UserService, ProjectsService } from 'src/app/services/service.index';


@Component({
  selector: 'app-giro-list',
  templateUrl: './giro-list.component.html',
  styleUrls: ['./giro-list.component.css']
})
export class GiroListComponent implements OnInit, OnDestroy {

  @Input() id: number;
  @Output() total: EventEmitter<number>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;


  data: Giro;
  displayedColumns: string[] = ['descripcion', 'order_by', 'status', 'actions'];
  dataSource = new MatTableDataSource() ;
  editando = false;
  forma: FormGroup;
  datatype: Giro[] = [];
  indexitem: number;
  isLoading = true;
  isLoadingSave = false;
  isLoadingDelete = false;
  label = 0;
  pageSize = 5;
  resultsLength = 0;
  status: string;
  subscription: Subscription;
  show = false;
  termino = '';
  token: any;



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
        order_by: new FormControl(0, [Validators.required]),
        status: new FormControl(1, [Validators.required]),
      });

      this.cargar();
    }
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  cargar() {
    this.isLoading = true;
    this.subscription = this.dataService.getGiro(this.token.token, this.id)
    .subscribe(
    response => {
              if (!response) {
                this.status = 'error';
                this.isLoading = false;
                return;
              }
              if (response.status === 'success') {
                this.dataSource = new MatTableDataSource(response.datos.giro);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.datatype = response.datos.giro;
                this.resultsLength = this.datatype.length;
                this.total.emit(this.datatype.length);
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

  edit(i: number) {
    this.indexitem = i;
    this.editando = true;
  }

  close() {
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
			Swal.fire('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
			return;
		}
 

    this.data = new Giro (0, this.forma.value.descripcion, this.forma.value.order_by, this.forma.value.status, '', '');

    
    this.dataService.addServiceGiro(this.token.token, this.id, this.data)
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


  save(i:number, element:Giro){
    this.indexitem = i;
    this.editando = false;
    this.isLoadingSave = true;
    //console.log(element);
    
    this.dataService.updateServiceGiro(this.token.token, this.id, element, element.id)
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
  
  delete(i:number, element:Giro){
    this.indexitem = i;
    this.isLoadingDelete = true;
    
    this.dataService.deleteServiceGiro(this.token.token, this.id, element.id)
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
