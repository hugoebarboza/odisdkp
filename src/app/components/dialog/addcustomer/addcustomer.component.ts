import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

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
import { UserService } from '../../../services/user.service';
import { OrderserviceService } from '../../../services/orderservice.service';
import { CountriesService } from '../../../services/countries.service';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-addcustomer',
  templateUrl: './addcustomer.component.html',
  styleUrls: ['./addcustomer.component.css']
})

export class AddcustomerComponent implements OnInit, OnDestroy {
  public title: string;
  public identity: any;
  public token: any;  
  public customer: Customer;
  public termino: string;
  public results: Object = [];
  public resultsprovincias: Object = [];
  public resultscomunas: Object = [];   
  private services: Service[] = [];
  public region: Region;
  public provincia: Provincia;
  public comuna: Comuna;

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

  day = new Date().getDate();
  month = new Date().getMonth();
  year = new Date().getFullYear();
  hour = new Date().getHours();
  minutes = new Date().getMinutes();
  seconds = new Date().getSeconds();

  id:number;
  category_id:number;
  step = 0;  
  //@Input() id : number;

  subscription: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,            
    private _userService: UserService,
    private _orderService: OrderserviceService,
    private _regionService: CountriesService,
    private _customerService: CustomerService,
    public dialogRef: MatDialogRef<AddcustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer
  	//public data: Order
  ) 
  { 
    this.title = "Agregar Cliente.";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.customer = new Customer('','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','');        
    this.id = this.data['service_id'];    
  }

  ngOnInit() {    
    this.loadInfo(this.id);
  }

  formControl = new FormControl('', [Validators.required]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Dato Requerido' : '';
  }

  ngOnDestroy() {
    //console.log('La página se va a cerrar');
    this.subscription.unsubscribe();
  }


  onGenerarCliente() {
  const client =this.identity.sub+''+this.day+''+this.month+''+this.year+''+this.hour+''+this.minutes+''+this.seconds+''+Math.round(Math.random()*100+1);
  this.customer.cc_number = client;
  //console.log(client);
  }


  public loadInfo(id:number){
                    this.subscription = this._regionService.getRegion(this.token.token, this.identity.country).subscribe(
                    response => {
                       if(response.status == 'success'){                  
                              this.region = response.datos.region;
                            }else{
                              this.region = null;
                            }
                     });

                    //GET SERVICE AND CATEGORY CLIENT
                    this.subscription = this._orderService.getService(this.token.token, this.id).subscribe(
                    response => {
                      if (response.status == 'success'){         
                        this.services = response.datos;                
                        this.category_id = this.services['projects_categories_customers']['id'];
                        this.project = this.services['project']['project_name'];
                        this.project_id = this.services['project']['id'];
                      }
                    });   
                    

                    //GET TARIFA
                    this.subscription = this._customerService.getTarifa(this.token.token, this.id).subscribe(
                    response => {
                            if(response.status == 'success'){                  
                              this.tarifas = response.datos.tarifa;
                              //console.log(this.tarifas);
                            }else{
                              this.tarifas = null;
                             // console.log(this.tarifa);
                            }
                            }); 
                    
                    //GET CONSTANTE
                    this.subscription = this._customerService.getConstante(this.token.token, this.id).subscribe(
                    response => {
                            if(response.status == 'success'){                  
                              this.constantes = response.datos.constante;
                            }else{
                              this.constantes = null;
                            }
                            });
                    
                    //GET GIRO
                    this.subscription = this._customerService.getGiro(this.token.token, this.id).subscribe(
                    response => {
                            if(response.status == 'success'){                  
                              this.giros = response.datos.giro;                              
                            }else{
                              this.giros = null;
                            }
                            });

                    //GET SECTOR
                    this.subscription = this._customerService.getSector(this.token.token, this.id).subscribe(
                    response => {
                    if(response.status == 'success'){                  
                      this.sectores = response.datos.sector;
                    }else{
                      this.sectores = null;
                    }
                    });

                    //GET ZONA
                    this.subscription = this._customerService.getZona(this.token.token, this.id).subscribe(
                    response => {
                    if(response.status == 'success'){                  
                      this.zonas = response.datos.zona;
                    }else{
                      this.zonas = null;
                    }
                    });

                    //GET MERCADO
                   this.subscription = this._customerService.getMercado(this.token.token, this.id).subscribe(
                    response => {
                            if(response.status == 'success'){                  
                              this.mercados = response.datos.mercado;
                            }else{
                              this.mercados = null;

                            }
                            });       

                    //GET MARCA DE VEHICULOS
                   this.subscription = this._customerService.getMarca(this.token.token).subscribe(
                    response => {
                            if(response.status == 'success'){                  
                              this.marcas = response.marca;
                            }else{
                              this.marcas = null;

                            }
                            });       


                    //GET COLORES DE VEHICULOS
                   this.subscription = this._customerService.getColor(this.token.token).subscribe(
                    response => {
                            if(response.status == 'success'){                  
                              this.colors = response.color;
                            }else{
                              this.colors = null;

                            }
                            });       

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }


  confirmAdd(form){
    //console.log(this.category_id);
    this._customerService.add(this.token.token, this.customer, this.category_id);
    this.dialogRef.close();
  }


    public searchCustomer(termino: string){
     this.termino = termino;     
     if(this.termino.length > 2){       
       this.subscription = this._orderService.getCustomer(this.token.token, this.termino, this.category_id).subscribe(
        response => {
              if(!response){
                return;
              }
              if(response.status == 'success'){
                this.results = response.datos;                
              }
              }); 
      }else{
        this.results = null;
      }
   }

   onSelectRegion(regionid:number) {      
     if(regionid > 0){
       this.resultscomunas = null;
       this.subscription = this._regionService.getProvincia(this.token.token, regionid).subscribe(
        response => {
              if(!response){
                return;
              }
              if(response.status == 'success'){  
                this.resultsprovincias = response.datos.provincia;
              }
              }); 
      }else{
        this.resultsprovincias = null;
      }
   }

   onSelectProvincia(provinciaid:number) {
     if(provinciaid > 0){
       this.subscription = this._regionService.getComuna(this.token.token, provinciaid).subscribe(
        response => {
              if(!response){
                return;
              }
              if(response.status == 'success'){  
                this.resultscomunas = response.datos.comuna;
              }
              }); 
      }else{
        this.resultscomunas = null;
      }

   }

   onSelectComuna(comunaid:number) {
   // this.states = this._dataService.getStates().filter((item)=> item.countryid == countryid);
   }

  public loadSector(){
      this.subscription = this._customerService.getSector(this.token.token, this.id).subscribe(
      response => {
              if(response.status == 'success'){                  
                this.sectores = response.datos.sector;
              }else{
                this.sectores = null;
              }
              });
    }

   onSelectMarca(marcaid:number) {      
     if(marcaid > 0){
       this.subscription = this._customerService.getModelo(this.token.token, marcaid).subscribe(       
        response => {              
              if(!response){
                return;
              }
              if(response.status == 'success'){  
                this.modelos = response.datos;
              }else{
                this.modelos = null;
              }
              }); 
      }else{
        this.modelos = null;
      }
   }




}
