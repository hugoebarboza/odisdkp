import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import swal from 'sweetalert';

//MODELS
import { CurrencyValue, ServiceTypeValue } from 'src/app/models/types';

//SERVICES
import { UserService, ProjectsService } from 'src/app/services/service.index';


@Component({
  selector: 'app-service-type-value-list',
  templateUrl: './service-type-value-list.component.html',
  styleUrls: ['./service-type-value-list.component.css']
})
export class ServiceTypeValueListComponent implements OnInit, OnDestroy {

  @Input() id : number;
  @Input() type : number;
  @Output() total: EventEmitter<number>;
  @Output() servicetypename: EventEmitter<number>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;


  currencys_values: CurrencyValue;
  data: ServiceTypeValue;
  displayedColumns: string[] = ['valor', 'from_date', 'to_date', 'status', 'actions'];
  dataSource = new MatTableDataSource() ;
  editando: boolean = false;
  forma: FormGroup;
  datatype: ServiceTypeValue[] = [];
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
    this.servicetypename = new EventEmitter();
  }

  ngOnInit() {
    //console.log(this.id);
    if(this.id > 0 && this.type > 0){
      
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
    this.subscription = this.dataService.getServiceTypeValue(this.token.token, this.type)
    .subscribe(
    response => {
              //console.log(response);
              if(!response){
                this.status = 'error';
                this.isLoading = false;
                return;
              }
              if(response.status == 'success'){
                this.dataSource = new MatTableDataSource(response.datos.services_types_values);
                //console.log(response.datos.services_types_values);
                //console.log(response.datos.servicevalue);
                //console.log(this.dataSource);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort; 
                this.datatype = response.datos.services_types_values;
                this.resultsLength = this.datatype.length;
                this.servicetypename.emit(response.datos.name)
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
			swal('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
			return;
		}
 


    this.data = new ServiceTypeValue (0, this.id, this.forma.value.value_id, this.forma.value.from_date, this.forma.value.to_date, this.forma.value.status, '', '');

  
    this.dataService.addServiceTypeValue(this.token.token, this.type, this.data)
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


  save(i:number, element:ServiceTypeValue){
    this.indexitem = i;
    this.editando = false;
    this.isLoadingSave = true;
    //console.log(element.id);
    
    this.dataService.updateServiceTypeValue(this.token.token, this.type, element, element.id)
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
  
  delete(i:number, element:ServiceTypeValue){
    this.indexitem = i;
    this.isLoadingDelete = true;
    
    this.dataService.deleteServiceTypeValue(this.token.token, this.type, element.id)
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
