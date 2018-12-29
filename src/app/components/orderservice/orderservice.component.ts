import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material';
import {FormControl, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {switchMap, debounceTime, tap, finalize} from 'rxjs/operators';
import {Observable,  SubscriptionLike as ISubscription } from 'rxjs'
import { OnDestroy } from "@angular/core";



//SERVICES
import { CustomerService } from '../../services/customer.service';
import { CountriesService } from '../../services/countries.service';
import { OrderserviceService } from '../../services/orderservice.service';
import { SettingsService } from '../../services/service.index';
import { UserService } from '../../services/user.service';

//MODELS
import { Proyecto } from '../../models/proyecto';
import { Order } from '../../models/order';
import { Comuna } from '../../models/Comuna';
import { Tarifa } from '../../models/Tarifa';
import { Constante } from '../../models/Constante';
import { Giro } from '../../models/Giro';
import { Sector } from '../../models/Sector';
import { Zona } from '../../models/Zona';
import { Mercado } from '../../models/Mercado';
import { Service } from '../../models/Service';
import { Region } from '../../models/Region';



@Component({
  selector: 'app-orderservice',
  templateUrl: './orderservice.component.html',
  styleUrls: ['./orderservice.component.css']
})
export class OrderserviceComponent implements OnInit, OnDestroy {
  public title: string;
  public identity;
  public token;
  public proyectos: Array<Proyecto>;
  public order: Order[] = [];
  public tarifas: Tarifa;
  public constantes: Constante;
  public giros: Giro;
  public sectores: Sector;
  public zonas: Zona;
  public mercados: Mercado;
  private services: Service[] = [];
  public region: Region;
  private subscription: ISubscription;
  otherTheme: boolean = true;
  theme: string;
  color: number;
  options: FormGroup;

  isLoading: boolean;
  loading: boolean;
  project_name: string;
  project: string;
  service: string;
  table: string = null;
  id: number;
  category_id: number; 
  dataSource;
  tabGroup:number;

  links = ['First', 'Second', 'Third'];
  activeLink = this.links[0];
  background = '';
  selected = new FormControl(0);

  isExpanded = true;
  element: HTMLElement;

  mode = new FormControl('side');
  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

  ajustes: Ajustes = {
    idtema: 0,
    tema: ''
  };



  constructor(	
  private _route: ActivatedRoute,
	private _router: Router,		  	
	private _userService: UserService,  
	private _proyectoService: UserService,
  private _orderService: OrderserviceService,
  private _customerService: CustomerService,
  private _regionService: CountriesService,
  public _ajustes: SettingsService,
  fb: FormBuilder

  ) 
  { 

	this.identity = this._userService.getIdentity();
	this.token = this._userService.getToken();
	this.proyectos = this._proyectoService.getProyectos();
  this.options = fb.group({
          bottom: 0,
          fixed: false,
          top: 0
  });      

  //this._userService.handleAuthentication(this.identity, this.token);
  //const newid = this._route.snapshot.paramMap.get('id');

  this._route.params.subscribe(params => { 
    let id = +params['id'];            
    this.id = id;
    if (this.id > 0 && this.token.token != null){
                    //GET SERVICE
                    this.subscription = this._orderService.getService(this.token.token, this.id).subscribe(
                    response => {
                      if (response.status == 'success'){   
                        this.project_name = response.datos.project['project_name'];       
                        this.services = response.datos;                
                        this.category_id = this.services['projects_categories_customers']['id'];
                        if(this.table){
                          this.table = null;
                        }
                        this.table = this.services['projects_categories_customers']['name_table'];
                      }
                    });   
                    }
    });


  }

  ngOnInit() {
    if ( localStorage.getItem('ajustes') ) {
      this.ajustes = JSON.parse( localStorage.getItem('ajustes') );
      this.theme = this.ajustes.tema;      
    }
    this.order = []; 
    this.dataSource = [];    
  }

  ngOnDestroy(){
     this.subscription.unsubscribe();
     //console.log("ngOnDestroy unsuscribe order");
  }


  public tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
  //console.log('tabChangeEvent => ', tabChangeEvent);
  //console.log('index => ', tabChangeEvent.index);
  }
  
  loadDataServicio(servicetname:string){
      //console.log('viene');
      //console.log(servicetname);
      this.service = servicetname;    
   }


toggleActive(event:any){
  //console.log(event);
    //debugger;
    event.preventDefault();
    if(this.element !== undefined){
      this.element.style.backgroundColor = "white";
    } 
    var target = event.currentTarget;
    target.style.backgroundColor = "#F6F6F6";
    this.element = target;
  }

  changeTheme(tcolor: number){
    
    if(tcolor == 0){
      this.theme = '';  
    }

    if(tcolor == 1){
      this.theme = 'alternative_green';  
    }
    
    if(tcolor == 2){
      this.theme = 'alternative_dark';  
    }

    this._ajustes.aplicarTema( this.theme, tcolor );


  }


}

interface Ajustes {
  idtema: number;
  tema: string;
}
