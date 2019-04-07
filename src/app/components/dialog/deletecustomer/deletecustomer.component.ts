import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


//MODELS
import { Customer } from '../../../models/customer';
import { Region } from '../../../models/Region';
import { Provincia } from '../../../models/Provincia';
import { Comuna } from '../../../models/Comuna';
import { Tarifa } from '../../../models/Tarifa';
import { Constante } from '../../../models/Constante';
import { Giro } from '../../../models/Giro';
import { Sector } from '../../../models/Sector';
import { Zona } from '../../../models/Zona';
import { Mercado } from '../../../models/Mercado';
import { Marca } from '../../../models/marca';
import { Modelo } from '../../../models/modelo';
import { Color } from '../../../models/color';
import { Service } from '../../../models/Service';

//SERVICES
import { CountriesService } from '../../../services/countries.service';
import { CustomerService } from '../../../services/customer.service';
import { OrderserviceService } from '../../../services/orderservice.service';
import { UserService } from '../../../services/service.index';

@Component({
  selector: 'app-deletecustomer',
  templateUrl: './deletecustomer.component.html',
  styleUrls: ['./deletecustomer.component.css']
})
export class DeletecustomerComponent implements OnInit {
  public title: string;
  public identity;
  public token;  
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
    private _route: ActivatedRoute,
    private _router: Router,            
    private _userService: UserService,
    private _orderService: OrderserviceService,
    private _regionService: CountriesService,
    private _customerService: CustomerService,
    public dialogRef: MatDialogRef<DeletecustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer
  	) 
  { 
    this.title = "Eliminar Cliente.";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    //this.customer = new Customer('','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','');        
    this.id = this.data['service_id'];
    this.category_id = this.data['category_id'];
    this.cc_id = this.data['cc_id'];
  }

  ngOnInit() {
  	this.loadInfo(this.id);
  }

  public loadData(projectid:number){
    if(projectid > 0){                                
      this._customerService.getProjectCustomerDetail(this.token.token, projectid, this.cc_id).subscribe(
      response => {
         if(response.status == 'success'){                  
         	this.customer = response.datos;
         	//console.log(this.customer);
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
				   this.data['id_region'] = this.customer[i]['id_region'];                   	
				   this.data['id_provincia'] = this.customer[i]['id_provincia'];
				   this.data['id_comuna'] = this.customer[i]['id_comuna'];
				   this.data['region'] = this.customer[i]['region'];                   	
				   this.data['provincia'] = this.customer[i]['province'];
				   this.data['comuna'] = this.customer[i]['comuna'];                   
                   this.data['observacion'] = this.customer[i]['observacion'];
                   this.data['marca_id'] = this.customer[i]['marca_id'];
                   this.data['modelo_id'] = this.customer[i]['modelo_id'];
                   this.data['color_id'] = this.customer[i]['color_id'];
                   this.data['marca'] = this.customer[i]['marca'];
                   this.data['modelo'] = this.customer[i]['modelo'];
                   this.data['color'] = this.customer[i]['color'];
                   this.data['patio'] = this.customer[i]['patio'];
                   this.data['espiga'] = this.customer[i]['espiga'];
                   this.data['posicion'] = this.customer[i]['posicion'];                   
                   break;             
                 }               
              }

         }else{
         	if(response.status == 'error'){                  
			//console.log(response);         		
        	}
	     }     
      },
          error => { 
          console.log(<any>error);
          }        
      ); 

    }
  }

  public loadInfo(id:number){
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


  confirmDelete(): void {
    //console.log(this.cc_id);
    this._customerService.delete(this.token.token, this.project_id, this.cc_id);
  }




}
