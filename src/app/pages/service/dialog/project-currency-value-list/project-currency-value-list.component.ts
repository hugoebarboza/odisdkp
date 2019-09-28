import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

declare var swal: any;

//MODELS
import { Currency, CurrencyValue } from 'src/app/models/types';

//SERVICES
import { UserService, ProjectsService } from 'src/app/services/service.index';

@Component({
  selector: 'app-project-currency-value-list',
  templateUrl: './project-currency-value-list.component.html',
  styleUrls: ['./project-currency-value-list.component.css']
})
export class ProjectCurrencyValueListComponent implements OnInit {

  @Input() id : number;
  @Output() total: EventEmitter<number>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;


  currency: Currency[] = [];
  displayedColumns: string[] = ['currency_id', 'value', 'status', 'actions'];
  dataSource = new MatTableDataSource() ;
  editando: boolean = false;
  forma: FormGroup;
  data: CurrencyValue;
  datatype: CurrencyValue[] = [];
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
    if(this.id > 0){
      this.forma = new FormGroup({
        currency_id: new FormControl(0, [Validators.required]),
        value: new FormControl(null, [Validators.required, Validators.minLength(2)]),
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
    this.subscription = this.dataService.getCurrencyValue(this.token.token)
    .subscribe(
    response => {
        if(!response){
          this.status = 'error';
          this.isLoading = false;
          return;
        }
        if(response.status == 'success'){
          this.dataSource = new MatTableDataSource(response.datos);
          //console.log(response.datos);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort; 
          this.datatype = response.datos;
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
              
    this.subscription = this.dataService.getCurrency(this.token.token)
    .subscribe(
    response => {
              //console.log(response);
              if(!response){
                return;
              }
              if(response.status == 'success'){
                this.currency = response.datos;
                //console.log(this.currency);
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

    this.data = new CurrencyValue (0, this.forma.value.currency_id, this.forma.value.value, this.forma.value.status, 0, '', 0, '');

  
    this.dataService.addCurrencyValue(this.token.token, this.data)
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



  save(i:number, element:CurrencyValue){
    this.indexitem = i;
    this.editando = false;
    this.isLoadingSave = true;
    //console.log(element);
    //return;
    
    this.dataService.updateCurrencyValue(this.token.token, element.id, element)
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
  
  delete(i:number, element:CurrencyValue){

    swal({
      title: '¿Esta seguro?',
      text: 'Esta seguro de borrar información ',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if(borrar){
        this.indexitem = i;
        this.isLoadingDelete = true;    
        this.dataService.deleteCurrencyValue(this.token.token, element.id)
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
    });    
  }


}
