import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

//MATERIAL
import { MAT_DIALOG_DATA, MatDialogRef, Sort, MatTableDataSource } from '@angular/material';

//MODELS
import { Customer } from '../../../models/customer';


//UTILITY
import { MatProgressButtonOptions } from 'mat-progress-buttons'

//SERVICES
import { CustomerService } from '../../../services/customer.service';
import { OrderserviceService } from '../../../services/orderservice.service';

//TOASTER MESSAGES
import { ToastrService } from 'ngx-toastr';

import {ExcelService} from '../../../services/excel.service';



export interface Patio {
  value: string;
  name: string;
}

export interface Sorter {
  active: any;
  direction: string;
  name: string;
}


@Component({
  selector: 'app-csv-customer-component',
  templateUrl: './csvcustomercomponent.component.html',
  styleUrls: ['./csvcustomercomponent.component.css']
})
export class CsvCustomerComponentComponent implements OnInit {

  public exportDataSource: MatTableDataSource<Customer[]>;
  public error: string;
  public formControl = new FormControl('', [Validators.required]);
  public isLoadingResults = false;
  public isRateLimitReached = false;
  public pageSize: number;
  public project_id: number;
  public selectedValueFormat: number;
  public selectedValuePatio: any;
  public selectedValueOrdeno: string;
  public serviceid: number;
  public subscription: Subscription;
  public table:string;
  public title = "Csv de Clientes";
  public token: any;


  public barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Descargar',
    buttonColor: 'primary',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: false
  }

  public barButtonOptionsDisabled: MatProgressButtonOptions = {
    active: false,
    text: 'Descargar',
    buttonColor: 'primary',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'indeterminate',
    value: 0,
    disabled: true
  }


  public patios: Patio[] = [
    {value: '00', name: '00'},
    {value: '01', name: '01'},
    {value: '02', name: '02'},
    {value: '03', name: '03'},
    {value: '04', name: '04'},
    {value: '05', name: '05'},
    {value: '06', name: '06'},
    {value: '07', name: '07'},
    {value: '08', name: '08'},
    {value: '09', name: '09'},
    {value: '10', name: '10'},
    {value: '11', name: '11'},
    {value: '12', name: '12'},
    {value: '13', name: '13'},
    {value: '14', name: '14'},
    {value: '15', name: '15'},
    {value: '16', name: '16'},
    {value: '17', name: '17'},
    {value: '18', name: '18'},
    {value: '19', name: '19'}
  ];

  public sortdate: Sorter[] = [
    {active: 'create_at', direction: 'asc', name: 'Espiga, ascendente.'},
    {active: 'create_at', direction: 'desc', name: 'Espiga, descendente.'}
  ];


  public selectedColumnnDate = {
    fieldValue: '',
    criteria: '',
    columnValueDesde: '',
    columnValueHasta: ''
  };

  public sort: Sort = {
    active: 'projects_customer.id',
    direction: 'asc',
  };


  constructor(
    private _customerService: CustomerService,
    private _orderService: OrderserviceService,
    public dialogRef: MatDialogRef<CsvCustomerComponentComponent>,
    private excelService:ExcelService,
    private toasterService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { 
    this.pageSize = -1;
    this.token = data['token'];
    this.serviceid = data['servicio'];

  }

  ngOnInit() {
    //console.log(this.serviceid);
    //console.log(this.token);
    this.getProject(this.serviceid);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Dato Requerido' : '';
  }

  getProject(id:number) {
    this.subscription = this._orderService.getService(this.token, this.serviceid).subscribe(
     response => {
               if (response.status == 'success'){         
               this.project_id = response.datos['project_id'];
               if(this.project_id > 0){
                 this.table = response.datos.projects_categories_customers.name_table;
               }
               }
      });
   }
 

  reset(){
    this.selectedValuePatio = '';
    this.selectedValueOrdeno = '';
    this.pageSize = -1;
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.error = '';
  }

  ExportTOExcelClient($event):void {
    var valuearrayexcel = "";
    this.barButtonOptions.active = true;
    this.barButtonOptions.text = 'Procesando...';   
    this.isLoadingResults = true;
    this.isRateLimitReached = false;
    this.pageSize = 2000;

    if(this.selectedValueOrdeno){
      this.sort.active = this.selectedValueOrdeno['active'];
      this.sort.direction = this.selectedValueOrdeno['direction'];
    }


    this._customerService.getCustomerShare(      
      this.selectedValuePatio, 
      this.sort.active, this.sort.direction, this.pageSize, this.serviceid, this.token).then(
      (res: any) => 
      {
        res.subscribe(
          (some:any) => 
          { 
            if(some.datos){
              this.exportDataSource = some.datos.data;
              //console.log(this.exportDataSource);
              this.excelService.exportAsExcelFile(this.exportDataSource, 'Reporte');
              this.barButtonOptions.active = false;
              this.barButtonOptions.text = 'Descargar';
              this.isLoadingResults = false;
              this.isRateLimitReached = false;           
            }else{

              this.isLoadingResults = false;
              this.isRateLimitReached = true;          
              this.barButtonOptions.active = false;
              this.barButtonOptions.text = 'Descargar';
              }
          },
            (error:any) => {            
              this.isLoadingResults = false;
              this.isRateLimitReached = true;          
              this.barButtonOptions.active = false;
              this.barButtonOptions.text = 'Descargar';
  
              this.error = 'No se encontraron registros que coincidan con su búsqueda';            
              this.toasterService.error('Error: '+this.error, '', {timeOut: 6000,});
              console.log(<any>error);
            }  
            )
      }) 

  }

}
