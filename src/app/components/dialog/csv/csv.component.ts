import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Sort, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatProgressButtonOptions } from 'mat-progress-buttons'

//MOMENT
import * as _moment from 'moment';
const moment = _moment;


//MODELS
import {
  Order, 
  ServiceEstatus,
  ServiceType,
  Zona } from '../../../models/types';




//SERVICES
import { CustomerService, OrderserviceService, ProjectsService } from '../../../services/service.index';


import * as FileSaver from 'file-saver';

//TOASTER MESSAGES
import { ToastrService } from 'ngx-toastr';



interface User {
  id: number;
  name: string;
}

interface Time {
  hour: any; 
  minute: any
}

export interface Limit {
  value: any;
  name: string;
}


export interface Formato {
  value: string;
  name: string;
}

export interface Sorter {
  active: any;
  direction: string;
  name: string;
}


@Component({
  selector: 'app-csv',
  templateUrl: './csv.component.html',
  styleUrls: ['./csv.component.css']
})
export class CsvComponent implements OnInit, OnDestroy {

  title = "Csv de Órdenes";
  
  date = new FormControl(moment(new Date()).format('YYYY[-]MM[-]DD'));
  estatus: Array<Object> = [];
  error: string; 
  exportDataSource: MatTableDataSource<Order[]>; 
  isLoadingResults = false;
  isRateLimitReached = false;
  project_id: number;
  serviceid: number;
  servicetypeid: number = 0;
  selectedValueFormat: number;
  servicetype: ServiceType[] = [];
  tipoServicio_id = 0;
  tiposervicio: Array<Object> = [];
  token: any;

  userSelected: number;

  selectedValueOrdeno: string;
  role:number;
  public serviceestatus: ServiceEstatus[] = [];
  private _onDestroy = new Subject<void>();
  public datedesde: FormControl;
  public datehasta: FormControl;
  public regionMultiCtrl: FormControl = new FormControl('', Validators.required );
  public zonas: Zona;
  public defaultselectedColumnnDate = 'orders.create_at';


/** control for the selected user for multi-selection */
  public userCtrl: FormControl = new FormControl();
  public userMultiFilterCtrl: FormControl = new FormControl();
  private user = new Array();  
  public filteredUserMulti: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);

  formControl = new FormControl('', [Validators.required]);

  //ORIGINAL FILTERS
  /*
  sort: Sort = {
    active: 'create_at',
    direction: 'desc',
  };*/
  timefrom: any;
  timeuntil: any;
  columnTimeFromValue: FormControl;
  columnTimeUntilValue: FormControl;


  sort: Sort = {
    active: 'order_id',
    direction: 'asc',
  };


  filterValue = '';

  selectedColumnn = {
    fieldValue: '',
    criteria: '',
    columnValue: ''
  };

  selectedColumnnDate = {
    fieldValue: 'orders.create_at',
    criteria: '',
    columnValueDesde: this.date.value,
    columnValueHasta: this.date.value
  };

  selectedColumnnUsuario = {
    fieldValue: '',
    criteria: '',
    columnValue: ''
  };

  selectedColumnnEstatus = {
    fieldValue: 'orders_details.status_id',
    criteria: '',
    columnValue: ''
  };

  selectedColumnnZona = {
    fieldValue: 'ma_zona.id',
    criteria: '',
    columnValue: 0
  };


  filtersregion = {
    fieldValue: '',
    criteria: '',
    filtervalue: ''
  };


 limits: Limit[] = [
    {value: '500', name: '< 500'},
    {value: '1000', name: '< 1000'},
    {value: '2000', name: '< 2000'},
    {value: '0', name: 'Todo (No Recomendado)'}
  ];


 formatos: Formato[] = [
    {value: '0', name: 'Formato original'},
    {value: '1', name: 'Formato mayúscula'},
    {value: '2', name: 'Sólo datos de inspección'},
    {value: '3', name: 'Sólo datos de la orden'}
  ];


 sortdate: Sorter[] = [
    {active: 'create_at', direction: 'asc', name: 'Creado el, ascendente.'},
    {active: 'create_at', direction: 'desc', name: 'Creado el, descendente.'}
  ];

 sortdateupdate: Sorter[] = [
    {active: 'update_at', direction: 'asc', name: 'Editado el, ascendente.'},
    {active: 'update_at', direction: 'desc', name: 'Editato el, descendente.'}
  ];


  // MatPaginator Inputs
  pageSize: number;


  barButtonOptionsDisabled: MatProgressButtonOptions = {
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


  barButtonOptions: MatProgressButtonOptions = {
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

  subscription: Subscription;

  constructor(
  	public dialogRef: MatDialogRef<CsvComponent>,
  	public dataService: OrderserviceService,
    private _customerService: CustomerService,
    private _proyectoService: ProjectsService,
    private toasterService: ToastrService,    
    @Inject(MAT_DIALOG_DATA) public data

    ) {
  	  this.project_id = data['project'];
  	  this.serviceid = data['servicio'];
      this.tiposervicio = data['tiposervicio'];
      this.estatus = data['estatus'];
      this.token = data['token'];
      this.pageSize = -1;
      this.role = 5; //USUARIOS INSPECTORES
    }


  ngOnInit() {
  this.user = [];
  this.loadServiceType();
  this.loaduser(this.project_id);
  this.getServiceEstatus();
  this.getZona();
  this.userMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterUsers();
      });    
  }


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    this.subscription.unsubscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.error = '';
  }


  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Dato Requerido' : '';
  }


  private filterUsers() {
    //console.log('filter');
    if (!this.user) {
      return;
    }
    // get the search keyword
    let search = this.userMultiFilterCtrl.value;
    if (!search) {
      this.filteredUserMulti.next(this.user.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredUserMulti.next(
      this.user.filter(user => user.name.toLowerCase().indexOf(search) > -1)
    );
  }

  getServiceEstatus(){  
    this.dataService.getServiceEstatus(this.token, this.serviceid)
    .pipe(takeUntil(this._onDestroy))
    .subscribe(
    response => {
              if(!response){
                return;
              }
              if(response.status == 'success'){   
                this.serviceestatus = response.datos;
              }
              });        
    }

  getZona(){  
    this.subscription = this._customerService.getZona(this.token, this.serviceid).subscribe(
      response => {
       if(response.status == 'success' && response.datos.zona.length > 0){                  
       this.zonas = response.datos.zona;
       //console.log(this.zonas);
       }else{
       this.zonas = null;
       }
    });



  }


  public loaduser(projectid:number){

    if(projectid > 0){     
        this._proyectoService.getProjectUser(this.token, projectid, this.role).then(
          (res: any) => 
          {
            res.subscribe(
              (some) => 
              {
                if(some.datos){
                  this.user = some.datos;
                  for (var i=0; i<this.user.length; i++){
                    const userid = this.user[i]['id'];
                    const username = this.user[i]['usuario'];
                    this.user[i] = { name: username, id: userid };
                  }
                  //console.log(this.user);
                  this.filteredUserMulti.next(this.user.slice());                  
                }else{
                }
              },
              (error) => { 
              this.user = [];
              console.log(<any>error);
              }  
              )
        })
    }
  }

  public loadServiceType(){  
    this.servicetype = null;    
    this.subscription = this.dataService.getServiceType(this.token, this.serviceid).subscribe(
    (response: any) => {
              if(!response){
                return;
              }
              if(response.status == 'success'){                  
                this.servicetype = response.datos;
                //console.log(this.servicetype);
              }
              },
    (error) => { 
                console.log(<any>error);
                }            
              );        
    }  

  reset(){
    this.selectedValueOrdeno ='';
    this.userSelected = 0;
    this.selectedColumnnDate.columnValueHasta = '';
    this.selectedColumnnDate.columnValueDesde = '';
    this.selectedValueFormat = 0;
    this.pageSize = -1;
    this.selectedColumnnUsuario.fieldValue = '';
    this.selectedColumnnUsuario.columnValue = '';
  }

 ExportTOExcelClient($event):void {
   //console.log($event);
    this.barButtonOptions.active = true;
    this.barButtonOptions.text = 'Procesando...';   
    var arraydata = new Array();
    var arrayexcel = new Array();
    var orderatributovalue = [];
    var arraydata = [];
    var valuearrayexcel = "";
    var pattern = /(\w+)\s+(\w+)/;

    this.isLoadingResults = true;
    this.isRateLimitReached = false;     
    this.regionMultiCtrl.reset();

    
    if(this.selectedValueOrdeno){
      this.sort.active = this.selectedValueOrdeno['active'];
      this.sort.direction = this.selectedValueOrdeno['direction'];
    }

    if(!this.selectedColumnnEstatus.columnValue){
      this.selectedColumnnEstatus.fieldValue = '';
      this.selectedColumnnEstatus.columnValue = '';
    }else{
      this.selectedColumnnEstatus.fieldValue = 'orders_details.status_id'
    }

    if(!this.selectedColumnnUsuario.fieldValue){
      this.selectedColumnnUsuario.fieldValue = '';
      this.selectedColumnnUsuario.columnValue = '';
    }



    if(!this.regionMultiCtrl.value && this.selectedColumnnDate.fieldValue && this.selectedColumnnDate.columnValueDesde && this.selectedColumnnDate.columnValueHasta){
       this.selectedColumnn.fieldValue = '';
       this.selectedColumnn.columnValue = '';
       this.filtersregion.fieldValue = '';
       this.datedesde = new FormControl(moment(this.selectedColumnnDate.columnValueDesde).format('YYYY[-]MM[-]DD'));
       this.datehasta = new FormControl(moment(this.selectedColumnnDate.columnValueHasta).format('YYYY[-]MM[-]DD'));
       this.selectedColumnnDate.columnValueDesde = this.datedesde.value;
       this.selectedColumnnDate.columnValueHasta = this.datehasta.value;
    }

    if(this.timefrom !=null && this.timeuntil !=null){
        this.columnTimeFromValue = new FormControl(moment(this.timefrom, 'H:mm:ss').format('LTS'));
        this.columnTimeUntilValue = new FormControl(moment(this.timeuntil, 'H:mm:ss').format('LTS'));
        var newtimefrom = moment(this.columnTimeFromValue.value, "h:mm:ss A").format("HH:mm:ss");   
        var newtimeuntil = moment(this.columnTimeUntilValue.value, "h:mm:ss A").format("HH:mm:ss");
    }else{
        var newtimefrom = '';
        var newtimeuntil = '';
    }      

    //console.log(this.servicetypeid);
    //console.log(this.serviceid);
    //console.log(this.project_id);
    //console.log(this.pageSize);
    this.dataService.getProjectShareOrder(      
      this.filterValue, this.selectedColumnn.fieldValue, this.selectedColumnn.columnValue,             
      this.selectedColumnnDate.fieldValue, this.selectedColumnnDate.columnValueDesde, this.selectedColumnnDate.columnValueHasta, 
      this.filtersregion.fieldValue, this.regionMultiCtrl.value,
      this.selectedColumnnUsuario.fieldValue, this.selectedColumnnUsuario.columnValue,
      this.selectedColumnnEstatus.fieldValue, this.selectedColumnnEstatus.columnValue,
      newtimefrom, newtimeuntil,
      this.selectedColumnnZona.columnValue,
      this.servicetypeid,
      this.sort.active, this.sort.direction, this.pageSize, 0, this.project_id, this.serviceid, this.token, $event).then(
      (res: any) => 
      {
        res.subscribe(
          (some) => 
          { 
            if(some.datos){
            //console.log(some.datos);
            this.exportDataSource = new MatTableDataSource(some.datos);
            
            if(!this.exportDataSource.data.length){
              this.exportDataSource = new MatTableDataSource(some.datos.data);
            }
            
              if(this.exportDataSource.data.length && this.exportDataSource.data.length > 0){
                for (var i=0; i<this.exportDataSource.data.length; i++){
                  var bandera: boolean = false;
                  for (var j=0; j<arraydata.length; j++){
                    if(arraydata[j] == this.exportDataSource.data[i]['servicetype_id']){
                      //console.log(this.exportDataSource.data[i]['servicetype_id']);
                      bandera = true;
                    }                    

                  }
                  if(bandera == false){
                    arraydata.push(this.exportDataSource.data[i]['servicetype_id']);
                  }
                }
              }
            

                //console.log(arraydata);
               if($event < 2){
                for (var i=0; i<arraydata.length; i++){//FIRSTFOR
                  var banderatitulo: boolean = true;
                  for (var j=0; j<this.exportDataSource.data.length; j++){//SECONDFORD
                    if(arraydata[i] == this.exportDataSource.data[j]['servicetype_id']){ //FIRST IF    
                      if(Object.keys(this.exportDataSource.data[j]['atributo_share']).length > 0 && banderatitulo == true){
                        if(this.exportDataSource.data[j]['name_table'] == 'address'){
                           valuearrayexcel = valuearrayexcel + "ID ORDEN;NUMERO DE ORDEN;IMAGEN;CREADO POR;EDITADO POR;ASIGNADO A;SERVICIO;TIPO DE SERVICIO;ESTATUS;LEIDOPOR;OBSERVACIONES;NUMERO DE CLIENTE;UBICACIÓN;RUTA;COMUNA;CALLE;NUMERO;BLOCK;DEPTO;TRANSFORMADOR;MEDIDOR;TARIFA;CONSTANTE;GIRO;SECTOR;ZONA;MERCADO;FECHA CREACIÓN;FECHA DE ACTUALIZACIÓN;";
                        }else{
                           valuearrayexcel = valuearrayexcel + "ID ORDEN;NUMERO DE ORDEN;IMAGEN;CREADO POR;EDITADO POR;ASIGNADO A;SERVICIO;TIPO DE SERVICIO;ESTATUS;OBSERVACIONES;NUMERO DE CLIENTE;REALIZADOEN;UBICACIÓN;MARCAVEHICULO;MODELOVEHICULO;COLORVEHICULO;DESCRIPCIONVEHICULO;OTROCOLORVEHICULO;PATIO;ESPIGA;POSICION;FECHA CREACIÓN;FECHA DE ACTUALIZACIÓN;";                          
                        }
                        for(let key in this.exportDataSource.data[j]['atributo_share']){
                          let newarray = this.exportDataSource.data[j]['atributo_share'][key];
                          if(newarray['type']  !== 'label' && newarray['type']  !== 'layout_line'){  
                             valuearrayexcel = valuearrayexcel+newarray['descripcion']+';';
                          }
                        }
                        banderatitulo = false;
                        valuearrayexcel = valuearrayexcel +'\n';

                      }else{
                        if(Object.keys(this.exportDataSource.data[j]['atributo_share']).length == 0 && banderatitulo == true && this.exportDataSource.data[j]['name_table'] == 'vehiculos'){
                          valuearrayexcel = valuearrayexcel + "ID ORDEN;NUMERO DE ORDEN;IMAGEN;CREADO POR;EDITADO POR;ASIGNADO A;SERVICIO;TIPO DE SERVICIO;ESTATUS;OBSERVACIONES;NUMERO DE CLIENTE;REALIZADOEN;UBICACIÓN;MARCAVEHICULO;MODELOVEHICULO;COLORVEHICULO;DESCRIPCIONVEHICULO;OTROCOLORVEHICULO;PATIO;ESPIGA;POSICION;FECHA CREACIÓN;FECHA DE ACTUALIZACIÓN;" + '\n';
                          banderatitulo = false;
                        }else{
                          if(Object.keys(this.exportDataSource.data[j]['atributo_share']).length == 0 && banderatitulo == true && this.exportDataSource.data[j]['name_table'] == 'address'){
                          valuearrayexcel = valuearrayexcel + "ID ORDEN;NUMERO DE ORDEN;IMAGEN;CREADO POR;EDITADO POR;ASIGNADO A;SERVICIO;TIPO DE SERVICIO;ESTATUS;LEIDOPOR;OBSERVACIONES;NUMERO DE CLIENTE;UBICACIÓN;RUTA;COMUNA;CALLE;NUMERO;BLOCK;DEPTO;TRANSFORMADOR;MEDIDOR;TARIFA;CONSTANTE;GIRO;SECTOR;ZONA;MERCADO;FECHA CREACIÓN;FECHA DE ACTUALIZACIÓN;" + '\n';
                          banderatitulo = false;
                          }
                        }
                      }
                        if(this.exportDataSource.data[j]['name_table'] == 'address'){
                          var ubicacion = this.exportDataSource.data[j]['direccion'];
                        }
                        if(this.exportDataSource.data[j]['name_table'] == 'vehiculos'){
                          var ubicacion = this.exportDataSource.data[j]['patio']+'-'+this.exportDataSource.data[j]['espiga']+'-'+this.exportDataSource.data[j]['posicion'];
                        }

                        if(this.exportDataSource.data[j]['name_table'] == 'vehiculos'){
                        valuearrayexcel = valuearrayexcel + this.exportDataSource.data[j]['order_id'] +';'+ this.exportDataSource.data[j]['order_number']+';'+this.exportDataSource.data[j]['imagen']+';'+this.exportDataSource.data[j]['user']+';'+this.exportDataSource.data[j]['userupdate']
                                              +';'+this.exportDataSource.data[j]['userassigned']+';'+this.exportDataSource.data[j]['service_name']+';'+this.exportDataSource.data[j]['servicetype']+';'+this.exportDataSource.data[j]['estatus']+';';

                                              var obs = String(this.exportDataSource.data[j]['observation']).replace(/(\r\n|\n|\r)/gm,' ');

                                              valuearrayexcel = valuearrayexcel+obs+';'+this.exportDataSource.data[j]['cc_number']+';'+this.exportDataSource.data[j]['orderdetail_direccion']+';'+ubicacion
                                              +';'+this.exportDataSource.data[j]['marca']+';'+this.exportDataSource.data[j]['modelo']+';'+this.exportDataSource.data[j]['color']+';'+this.exportDataSource.data[j]['description']+';'+this.exportDataSource.data[j]['secondcolor']
                                              +';'+this.exportDataSource.data[j]['patio']+';'+this.exportDataSource.data[j]['espiga']+';'+this.exportDataSource.data[j]['posicion']
                                              +';'+this.exportDataSource.data[j]['create_at']+';'+this.exportDataSource.data[j]['update_at'] +';';
                        }else{
                          valuearrayexcel = valuearrayexcel + this.exportDataSource.data[j]['order_id'] +';'+ this.exportDataSource.data[j]['order_number']+';'+this.exportDataSource.data[j]['imagen']+';'+this.exportDataSource.data[j]['user']+';'+this.exportDataSource.data[j]['userupdate']
                          +';'+this.exportDataSource.data[j]['userassigned']+';'+this.exportDataSource.data[j]['service_name']+';'+this.exportDataSource.data[j]['servicetype']+';'+this.exportDataSource.data[j]['estatus']
                          +';'+this.exportDataSource.data[j]['leido_por']+';';

                          var obs = String(this.exportDataSource.data[j]['observation']).replace(/(\r\n|\n|\r)/gm,' ');

                          valuearrayexcel = valuearrayexcel+obs+';'+this.exportDataSource.data[j]['cc_number']+';'+ubicacion
                          +';'+this.exportDataSource.data[j]['ruta']+';'+this.exportDataSource.data[j]['comuna']+';'+this.exportDataSource.data[j]['calle']+';'+this.exportDataSource.data[j]['numero']+';'+this.exportDataSource.data[j]['block']+';'+this.exportDataSource.data[j]['depto']
                          +';'+this.exportDataSource.data[j]['transformador']+';'+this.exportDataSource.data[j]['medidor']+';'+this.exportDataSource.data[j]['tarifa']+';'+this.exportDataSource.data[j]['constante']
                          +';'+this.exportDataSource.data[j]['giro']+';'+this.exportDataSource.data[j]['sector']+';'+this.exportDataSource.data[j]['zona']+';'+this.exportDataSource.data[j]['mercado']                          
                          +';'+this.exportDataSource.data[j]['create_at']+';'+this.exportDataSource.data[j]['update_at'] +';';
                        }

                        
                        //console.log(this.exportDataSource.data[j]['orderatributo']);
                        if(Object.keys(this.exportDataSource.data[j]['orderatributo']).length > 0){
                        for (var keyatributovalue in this.exportDataSource.data[j]['atributo_share']) {
                          if(this.exportDataSource.data[j]['atributo_share'][keyatributovalue] !== null){                        
                            orderatributovalue[keyatributovalue] = this.exportDataSource.data[j]['atributo_share'][keyatributovalue];
                            var banderasindato = true;
                            for(var keyorderatributovalue in this.exportDataSource.data[j]['orderatributo']){
                             if(this.exportDataSource.data[j]['orderatributo'][keyorderatributovalue]['atributo_id'] == this.exportDataSource.data[j]['atributo_share'][keyatributovalue]['id']){

                                 if(this.exportDataSource.data[j]['atributo_share'][keyatributovalue]['type'] == "chip"){
                                  const orderarray: Array<any> = JSON.parse(this.exportDataSource.data[j]['orderatributo'][keyorderatributovalue]['valor']);
                                  let chipconcat = '';
                                  orderarray.forEach(elemento => {
                                      if (elemento.value) {
                                        chipconcat = chipconcat  + elemento.descripcion + ' | ';
                                      }
                                  });
                                  chipconcat = chipconcat.substring(0, chipconcat.length - 2);
                                  ordervalue = chipconcat;
                                  ordervalue = ordervalue.split("\n").join(" ");
                                  ordervalue = ordervalue.split("\t").join(" ");
                                  ordervalue = ordervalue.split(";").join(" ");
                                  valuearrayexcel = valuearrayexcel + ordervalue + ';';
                                  banderasindato = false;
                                } else {
                                  var ordervalue = this.exportDataSource.data[j]['orderatributo'][keyorderatributovalue]['valor'];
                                    ordervalue = ordervalue.split("\n").join(" ");
                                    ordervalue = ordervalue.split("\t").join(" ");
                                    ordervalue = ordervalue.split(";").join(" ");
                                    valuearrayexcel = valuearrayexcel + ordervalue + ';';
                                    banderasindato = false;
                                }
                             }
                             if(this.exportDataSource.data[j]['atributo_share'][keyatributovalue]['type'] == 'label' || this.exportDataSource.data[j]['atributo_share'][keyatributovalue]['type'] == 'layout_line'){
                                banderasindato = false;
                             }
                            }
                            if(banderasindato == true){
                              valuearrayexcel = valuearrayexcel + 'S/N ; '; 
                            }

                          }
                        }

                        valuearrayexcel = valuearrayexcel + '\n';


                        }else{
                           valuearrayexcel = valuearrayexcel +'\n';
                        }

                    }//END FIRST IF
                    

                  }//END SECOND FOR                                 
                }//END //FIRSTFOR
              }

               if($event == 2){
                for (var i=0; i<arraydata.length; i++){//FIRSTFOR
                  var banderatitulo: boolean = true;
                  for (var j=0; j<this.exportDataSource.data.length; j++){//SECONDFORD
                    if(arraydata[i] == this.exportDataSource.data[j]['servicetype_id']){ //FIRST IF                                           
                      if(Object.keys(this.exportDataSource.data[j]['atributo_share']).length > 0 && banderatitulo == true){
                        if(this.exportDataSource.data[j]['name_table'] == 'address'){
                           valuearrayexcel = valuearrayexcel+ " NO; ";
                        }
                        for(let key in this.exportDataSource.data[j]['atributo_share']){
                          let newarray = this.exportDataSource.data[j]['atributo_share'][key];
                          if(newarray['type']  !== 'label' && newarray['type']  !== 'layout_line'){    
                             valuearrayexcel = valuearrayexcel+newarray['descripcion']+';';
                          }
                        }
                        banderatitulo = false;
                        valuearrayexcel = valuearrayexcel +'\n';
                      }else{
                        if(Object.keys(this.exportDataSource.data[j]['atributo_share']).length == 0 && banderatitulo == true){
                          //console.log('paso salto de pagina');
                          valuearrayexcel = valuearrayexcel+" NO; "+'\n';
                          banderatitulo = false;
                        }

                      }

                        valuearrayexcel = valuearrayexcel + j +';';
                        

                        if(Object.keys(this.exportDataSource.data[j]['orderatributo']).length > 0){
                        for (var keyatributovalue in this.exportDataSource.data[j]['atributo_share']) {
                          if(this.exportDataSource.data[j]['atributo_share'][keyatributovalue] !== null){                        
                            orderatributovalue[keyatributovalue] = this.exportDataSource.data[j]['atributo_share'][keyatributovalue];
                            var banderasindato = true;
                            for(var keyorderatributovalue in this.exportDataSource.data[j]['orderatributo']){
                             if(this.exportDataSource.data[j]['orderatributo'][keyorderatributovalue]['atributo_id'] == this.exportDataSource.data[j]['atributo_share'][keyatributovalue]['id']){
                              
                              if(this.exportDataSource.data[j]['atributo_share'][keyatributovalue]['type'] == "chip"){
                                  const orderarray: Array<any> = JSON.parse(this.exportDataSource.data[j]['orderatributo'][keyorderatributovalue]['valor']);
                                  let chipconcat = '';
                                  orderarray.forEach(elemento => {
                                      if (elemento.value) {
                                        chipconcat = chipconcat  + elemento.descripcion + ' | ';
                                      }
                                  });
                                  chipconcat = chipconcat.substring(0, chipconcat.length - 2);
                                  ordervalue = chipconcat;
                                  ordervalue = ordervalue.split("\n").join(" ");
                                  ordervalue = ordervalue.split("\t").join(" ");
                                  ordervalue = ordervalue.split(";").join(" ");
                                  valuearrayexcel = valuearrayexcel + ordervalue + ';';
                                  banderasindato = false;
                                } else {
                                var ordervalue = this.exportDataSource.data[j]['orderatributo'][keyorderatributovalue]['valor'];
                                  ordervalue = ordervalue.split("\n").join(" ");
                                  ordervalue = ordervalue.split("\t").join(" ");
                                  ordervalue = ordervalue.split(";").join(" ");
                                  valuearrayexcel = valuearrayexcel + ordervalue + ';';
                                  banderasindato = false;
                              }
                             }
                             if(this.exportDataSource.data[j]['atributo_share'][keyatributovalue]['type'] == 'label' || this.exportDataSource.data[j]['atributo_share'][keyatributovalue]['type'] == 'layout_line'){
                                banderasindato = false;
                             }
                            }
                            if(banderasindato == true){
                              valuearrayexcel = valuearrayexcel + 'S/N ; '; 
                            }

                          }
                        }

                        valuearrayexcel = valuearrayexcel + '\n';


                        }else{
                           valuearrayexcel = valuearrayexcel +'\n';
                        }

                    }//END FIRST IF
                    

                  }//END SECOND FOR                                 
                }//END //FIRSTFOR
                valuearrayexcel = valuearrayexcel.toUpperCase();
              }


              if($event == 3){
                for (var i=0; i<arraydata.length; i++){//FIRSTFOR
                  var banderatitulo: boolean = true;
                  for (var j=0; j<this.exportDataSource.data.length; j++){//SECONDFORD
                    if(arraydata[i] == this.exportDataSource.data[j]['servicetype_id']){ //FIRST IF    
                      if(this.exportDataSource.data[j]['atributo_share'] && Object.keys(this.exportDataSource.data[j]['atributo_share']).length > 0 && banderatitulo == true){
                        if(this.exportDataSource.data[j]['name_table'] == 'address'){
                           valuearrayexcel = valuearrayexcel + "ID ORDEN;NUMERO DE ORDEN;IMAGEN;CREADO POR;EDITADO POR;ASIGNADO A;SERVICIO;TIPO DE SERVICIO;ESTATUS;LEIDOPOR;OBSERVACIONES;NUMERO DE CLIENTE;UBICACIÓN;RUTA;COMUNA;CALLE;NUMERO;BLOCK;DEPTO;TRANSFORMADOR;MEDIDOR;TARIFA;CONSTANTE;GIRO;SECTOR;ZONA;MERCADO;FECHA CREACIÓN;FECHA DE ACTUALIZACIÓN;";
                        }else{
                           valuearrayexcel = valuearrayexcel + "ID ORDEN;NUMERO DE ORDEN;IMAGEN;CREADO POR;EDITADO POR;ASIGNADO A;SERVICIO;TIPO DE SERVICIO;ESTATUS;OBSERVACIONES;NUMERO DE CLIENTE;REALIZADOEN;UBICACIÓN;MARCAVEHICULO;MODELOVEHICULO;COLORVEHICULO;DESCRIPCIONVEHICULO;OTROCOLORVEHICULO;PATIO;ESPIGA;POSICION;FECHA CREACIÓN;FECHA DE ACTUALIZACIÓN;";                          
                        }


                        banderatitulo = false;
                        valuearrayexcel = valuearrayexcel +'\n';

                      }else{
                        if(!this.exportDataSource.data[j]['atributo_share'] && banderatitulo == true && this.exportDataSource.data[j]['name_table'] == 'vehiculos'){
                          valuearrayexcel = valuearrayexcel + "ID ORDEN;NUMERO DE ORDEN;IMAGEN;CREADO POR;EDITADO POR;ASIGNADO A;SERVICIO;TIPO DE SERVICIO;ESTATUS;OBSERVACIONES;NUMERO DE CLIENTE;REALIZADOEN;UBICACIÓN;MARCAVEHICULO;MODELOVEHICULO;COLORVEHICULO;DESCRIPCIONVEHICULO;OTROCOLORVEHICULO;PATIO;ESPIGA;POSICION;FECHA CREACIÓN;FECHA DE ACTUALIZACIÓN;" + '\n';
                          banderatitulo = false;
                        }else{
                          if(!this.exportDataSource.data[j]['atributo_share'] && banderatitulo == true && this.exportDataSource.data[j]['name_table'] == 'address'){
                          valuearrayexcel = valuearrayexcel + "ID ORDEN;NUMERO DE ORDEN;IMAGEN;CREADO POR;EDITADO POR;ASIGNADO A;SERVICIO;TIPO DE SERVICIO;ESTATUS;LEIDOPOR;OBSERVACIONES;NUMERO DE CLIENTE;UBICACIÓN;RUTA;COMUNA;CALLE;NUMERO;BLOCK;DEPTO;TRANSFORMADOR;MEDIDOR;TARIFA;CONSTANTE;GIRO;SECTOR;ZONA;MERCADO;FECHA CREACIÓN;FECHA DE ACTUALIZACIÓN;" + '\n';
                          banderatitulo = false;
                          }
                        }
                      }
                        if(this.exportDataSource.data[j]['name_table'] == 'address'){
                          var ubicacion = this.exportDataSource.data[j]['direccion'];
                        }
                        if(this.exportDataSource.data[j]['name_table'] == 'vehiculos'){
                          var ubicacion = this.exportDataSource.data[j]['patio']+'-'+this.exportDataSource.data[j]['espiga']+'-'+this.exportDataSource.data[j]['posicion'];
                        }

                        if(this.exportDataSource.data[j]['name_table'] == 'vehiculos'){
                        valuearrayexcel = valuearrayexcel + this.exportDataSource.data[j]['order_id'] +';'+ this.exportDataSource.data[j]['order_number']+';'+this.exportDataSource.data[j]['imagen']+';'+this.exportDataSource.data[j]['user']+';'+this.exportDataSource.data[j]['userupdate']
                                              +';'+this.exportDataSource.data[j]['userassigned']+';'+this.exportDataSource.data[j]['service_name']+';'+this.exportDataSource.data[j]['servicetype']+';'+this.exportDataSource.data[j]['estatus']+';';

                                              var obs = String(this.exportDataSource.data[j]['observation']).replace(/(\r\n|\n|\r)/gm,' ');

                                              valuearrayexcel = valuearrayexcel+obs+';'+this.exportDataSource.data[j]['cc_number']+';'+this.exportDataSource.data[j]['orderdetail_direccion']+';'+ubicacion
                                                                                                                                        
                                              +';'+this.exportDataSource.data[j]['marca']+';'+this.exportDataSource.data[j]['modelo']+';'+this.exportDataSource.data[j]['color']+';'+this.exportDataSource.data[j]['description']+';'+this.exportDataSource.data[j]['secondcolor']
                                              +';'+this.exportDataSource.data[j]['patio']+';'+this.exportDataSource.data[j]['espiga']+';'+this.exportDataSource.data[j]['posicion']
                                              +';'+this.exportDataSource.data[j]['create_at']+';'+this.exportDataSource.data[j]['update_at'] +';';
                        }else{
                          valuearrayexcel = valuearrayexcel + this.exportDataSource.data[j]['order_id'] +';'+ this.exportDataSource.data[j]['order_number']+';'+this.exportDataSource.data[j]['imagen']+';'+this.exportDataSource.data[j]['user']+';'+this.exportDataSource.data[j]['userupdate']
                          +';'+this.exportDataSource.data[j]['userassigned']+';'+this.exportDataSource.data[j]['service_name']+';'+this.exportDataSource.data[j]['servicetype']+';'+this.exportDataSource.data[j]['estatus']
                          +';'+this.exportDataSource.data[j]['leido_por']+';';
                          
                          var obs = String(this.exportDataSource.data[j]['observation']).replace(/(\r\n|\n|\r)/gm,' ');

                          valuearrayexcel = valuearrayexcel+obs+';'+this.exportDataSource.data[j]['cc_number']+';'+ubicacion                                                                        
                          +';'+this.exportDataSource.data[j]['ruta']+';'+this.exportDataSource.data[j]['comuna']+';'+this.exportDataSource.data[j]['calle']+';'+this.exportDataSource.data[j]['numero']+';'+this.exportDataSource.data[j]['block']+';'+this.exportDataSource.data[j]['depto']
                          +';'+this.exportDataSource.data[j]['transformador']+';'+this.exportDataSource.data[j]['medidor']+';'+this.exportDataSource.data[j]['tarifa']+';'+this.exportDataSource.data[j]['constante']
                          +';'+this.exportDataSource.data[j]['giro']+';'+this.exportDataSource.data[j]['sector']+';'+this.exportDataSource.data[j]['zona']+';'+this.exportDataSource.data[j]['mercado']                          
                          +';'+this.exportDataSource.data[j]['create_at']+';'+this.exportDataSource.data[j]['update_at'] +';';
                        }                      
                        
                        valuearrayexcel = valuearrayexcel + '\n';



                    }//END FIRST IF                    
                  }//END SECOND FOR                                 
                }//END //FIRSTFOR
              }



            if($event==1){
              valuearrayexcel = valuearrayexcel.toUpperCase();
            }

            const FILE_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;";
            const FILE_EXTENSION = '.csv';
            const fileName = "Ordenes";
            var blob = new Blob([valuearrayexcel], {type: FILE_TYPE});
            FileSaver.saveAs(blob, fileName + '_export_' + new Date().getTime() + FILE_EXTENSION);
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
          (error) => {            
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
