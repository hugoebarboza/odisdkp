import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

// MODELS
import {
  Color,
  Comuna,
  Constante,
  Customer,
  Giro,
  Marca,
  Mercado,
  Modelo,
  Provincia,
  Region,
  Sector,
  Service,
  Tarifa,
  Zona } from 'src/app/models/types';


// SERVICES
import { CustomerService, OrderserviceService, UserService } from 'src/app/services/service.index';


@Component({
  selector: 'app-showcustomer',
  templateUrl: './showcustomer.component.html',
  styleUrls: ['./showcustomer.component.css']

})
export class ShowcustomerComponent implements OnInit {
  public title: string;
  public identity: any;
  isLoading:boolean = true;
  public token: any;  
  public termino: string;
  public results: Object = [];
  public resultsprovincias: Object = [];
  public resultscomunas: Object = [];   
  private services: Service[] = [];
  public region: Region;
  public provincia: Provincia;
  public comuna: Comuna;
  public customer: Customer[] = [];
  public tarifas: Tarifa;
  public constantes: Constante;
  public giros: Giro;
  public sectores: Sector;
  public zonas: Zona;
  public mercados: Mercado;

  public marcas: Marca;
  public modelos: Modelo;
  public colors: Color;

  public project: string;
  project_id: number;
  id:number;
  cc_id:number;
  category_id:number;
  step = 0;  	

  constructor(
    private _userService: UserService,
    private _orderService: OrderserviceService,
    private _customerService: CustomerService,
    public dialogRef: MatDialogRef<ShowcustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  	) 
  { 
    this.title = "Ver Cliente.";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.id = this.data['service_id'];
    this.category_id = this.data['category_id'];
    this.cc_id = this.data['cc_id'];
  }

  ngOnInit() {
  	//console.log(this.data);
  	//console.log(this.cc_id);
  	this.loadInfo(this.id);
  }

  public loadData(projectid:number){
    if(projectid > 0){                                
      this._customerService.getProjectCustomerDetail(this.token.token, projectid, this.cc_id).subscribe(
      response => {
         if(response.status == 'success'){    
           this.customer = response.datos;

              for (var i=0; i<this.customer.length; i++){
                 if (this.customer){

                   this.data['name_table'] = this.customer[i]['name_table'];
                   this.data['cc_number'] = this.customer[i]['cc_number'];
                   this.data['nombrecc'] = this.customer[i]['nombrecc'];
                   this.data['ruta'] = this.customer[i]['ruta'];
                   this.data['calle'] = this.customer[i]['calle'];
                   this.data['numero'] = this.customer[i]['numero'];
                   this.data['block'] = this.customer[i]['block'];
                   this.data['depto'] = this.customer[i]['depto'];
                   this.data['latitud'] = this.customer[i]['latitud'];
                   this.data['longitud'] = this.customer[i]['longitud'];
                   this.data['medidor'] = this.customer[i]['medidor'];
                   this.data['modelo_medidor'] = this.customer[i]['modelo_medidor'];
                   this.data['id_tarifa'] = this.customer[i]['id_tarifa'];
                   this.data['id_constante'] = this.customer[i]['id_constante'];
                   this.data['id_giro'] = this.customer[i]['id_giro'];
                   this.data['id_sector'] = this.customer[i]['id_sector'];
                   this.data['id_zona'] = this.customer[i]['id_zona'];
                   this.data['id_mercado'] = this.customer[i]['id_mercado'];

                   this.data['tarifa'] = this.customer[i]['tarifa'];
                   this.data['constante'] = this.customer[i]['constante'];
                   this.data['giro'] = this.customer[i]['giro'];
                   this.data['sector'] = this.customer[i]['sector'];
                   this.data['zona'] = this.customer[i]['zona'];
                   this.data['mercado'] = this.customer[i]['mercado'];

                   this.data['id_region'] = this.customer[i]['id_region'];                   	
                   this.data['id_provincia'] = this.customer[i]['id_provincia'];
                   this.data['id_comuna'] = this.customer[i]['id_comuna'];
                   this.data['region'] = this.customer[i]['region'];                   	
                   this.data['provincia'] = this.customer[i]['province'];
                   this.data['comuna'] = this.customer[i]['comuna'];
                          
                   this.data['observacion'] = this.customer[i]['observacion'];
                   this.data['marca_id'] = this.customer[i]['marca_id'];
                   this.data['modelo_id'] = this.customer[i]['modelo_id'];
                   this.data['description'] = this.customer[i]['description'];
                   this.data['color_id'] = this.customer[i]['color_id'];
                   this.data['marca'] = this.customer[i]['marca'];
                   this.data['modelo'] = this.customer[i]['modelo'];
                   this.data['color'] = this.customer[i]['color'];
                   this.data['patio'] = this.customer[i]['patio'];
                   this.data['espiga'] = this.customer[i]['espiga'];
                   this.data['posicion'] = this.customer[i]['posicion'];
                   this.isLoading = false;                 
                   break;             
                 }               
              }

         }else{
         	if(response.status == 'error'){
            this.isLoading = false;                  
			//console.log(response);         		
        	}
	     }     
      },
          error => { 
            this.isLoading = false;
          console.log(<any>error);
          }        
      ); 
    }

  }

  public loadInfo(_id:number){
                    //GET SERVICE AND CATEGORY CLIENT
                    this._orderService.getService(this.token.token, this.id).subscribe(
                    response => {
                      if (response.status == 'success'){         
                        this.services = response.datos;                
                        this.category_id = this.services['projects_categories_customers']['id'];
                        this.project = this.services['project']['project_name'];
                        this.project_id = this.services['project']['id'];
                        this.loadData(this.project_id);
                      }
                    });                       
  }

  onNoClick(): void {
    this.dialogRef.close();
  }




}
