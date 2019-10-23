import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import Swal from 'sweetalert2';

//MODELS
import { CurrencyValue, ServiceValue } from 'src/app/models/types';

//SERVICES
import { UserService, ProjectsService } from 'src/app/services/service.index';


@Component({
  selector: 'app-service-value-list',
  templateUrl: './service-value-list.component.html',
  styleUrls: ['./service-value-list.component.css']
})
export class ServiceValueListComponent implements OnInit, OnDestroy {

  @Input() id : number;
  @Output() total: EventEmitter<number>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;


  currencys_values: CurrencyValue;
  data: ServiceValue;
  displayedColumns: string[] = ['valor', 'from_date', 'to_date', 'status', 'actions'];
  dataSource = new MatTableDataSource() ;
  editando: boolean = false;
  forma: FormGroup;
  datatype: ServiceValue[] = [];
  indexitem:number;
  isLoading: boolean = true;
  isLoadingSave: boolean = false;
  isLoadingDelete: boolean = false;
  label:number = 0;
  pageSize = 5;
  resultsLength:number = 0;
  status: string;
  subscription: Subscription;
  show:boolean = false;
  termino: string = '';
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
    //console.log(this.id);
    if(this.id > 0){
      
      this.forma = new FormGroup({
        value_id: new FormControl(0, [Validators.required]),
        from_date: new FormControl('0000-00-00', [Validators.required]),
        to_date: new FormControl('0000-00-00', [Validators.required]),
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

  cargar(){
    this.isLoading = true;
    this.subscription = this.dataService.getServiceValue(this.token.token, this.id)
    .subscribe(
    response => {
      //console.log(response);      
              if(!response){
                this.status = 'error';
                this.isLoading = false;
                return;
              }
              if(response.status == 'success'){
                this.dataSource = new MatTableDataSource(response.datos.servicevalue);
                //console.log(response.datos.servicevalue);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort; 
                this.datatype = response.datos.servicevalue;
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
              
              
    this.subscription = this.dataService.getCurrencyValue(this.token.token)
    .subscribe(
    response => {
              //console.log(response);
              if(!response){
                return;
              }
              if(response.status == 'success'){
                this.currencys_values = response.datos;
                //console.log(this.currencys_values);
              }
              },
              error => {
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
  

		if(this.forma.invalid || this.forma.value.value_id == 0){
			Swal.fire('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
			return;
		}
 


    this.data = new ServiceValue (0, this.id, this.forma.value.value_id, this.forma.value.from_date, this.forma.value.to_date, this.forma.value.status, '', '');

  
    this.dataService.addServiceValue(this.token.token, this.id, this.data)
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
                setTimeout( () => {
                  this.ngOnInit();
                  this.show = false;
                }, 1000);
            
              }else{
                this.show = false;
                this.indexitem = -1;
              }
            },
              error => {
                this.snackBar.open('Error procesando solicitud!!!', error.error.mensaje, {duration:3000, });
                this.indexitem = -1;
                console.log(<any>error);
              }       
            );  
  }


  save(i:number, element:ServiceValue){
    this.indexitem = i;
    this.editando = false;
    this.isLoadingSave = true;
    //console.log(element);
    
    this.dataService.updateServiceValue(this.token.token, this.id, element, element.id)
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
                this.snackBar.open('Error procesando solicitud!!!', error.error.mensaje, {duration:3000, });
                this.isLoadingSave = false;
                this.indexitem = -1;
                console.log(<any>error);
              }       
            );
  }  
  
  delete(i:number, element:ServiceValue){
    this.indexitem = i;
    this.isLoadingDelete = true;
    
    this.dataService.deleteServiceValue(this.token.token, this.id, element.id)
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
                  this.ngOnInit();
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
