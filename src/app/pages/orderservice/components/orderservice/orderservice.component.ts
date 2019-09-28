import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription'
import { OnDestroy } from "@angular/core";

import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

//SERVICES
import { DashboardService, SettingsService, UserService } from 'src/app/services/service.index';


//MODELS
import { 
  Constante, 
  Giro, 
  Mercado,
  Order,
  Region, 
  Sector, 
  Service, 
  Tarifa, 
  Zona } from 'src/app/models/types';

// MOMENT
import * as _moment from 'moment';
const moment = _moment;



@Component({  
  selector: 'app-orderservice',
  templateUrl: './orderservice.component.html',
  styleUrls: ['./orderservice.component.css']
})
export class OrderserviceComponent implements OnInit, OnDestroy, AfterViewInit {
  
  
  apikey: string;
  links = ['First', 'Second', 'Third'];
  activeLink = this.links[0];
  background = '';  
  clientid: string;
  category_id: number;
  calendarID: string;
  color: number;
  constantes: Constante;
  country: string = '';
  since: any;
  dataSource: any;  
  element: HTMLElement;
  giros: Giro;
  id: number;
  identity:any;
  isLoading: boolean;
  isExpanded = true;
  loading: boolean;
  mercados: Mercado;
  mode = new FormControl('side');
  otherTheme: boolean = true;
  order: Order[] = [];
  options: FormGroup;
  proyectos = [];  
  project_name: string;
  project: string;
  project_type: number;
  region: Region;
  sectores: Sector;
  selected = new FormControl(0);
  services: Service[] = [];
  service: string;
  subscription: Subscription;
  sub: any;
  table: string = null;
  tabGroup:number;
  tarifas: Tarifa;
  theme: string;
  title: string;
  token:any;
  url: any;
  zonas: Zona;

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

  ajustes: Ajustes = {
    idtema: 0,
    tema: ''
  };

  columnsTab: Array<any> = [
    { name: 'important', label: 'Destacar' },
    { name: 'order_number', label: 'N. Orden' },
    { name: 'cc_number', label: 'N. Cliente' },
    { name: 'region', label: 'Región' },
    { name: 'provincia', label: 'Provincia' },
    { name: 'direccion', label: 'Dirección' },
    { name: 'servicetype', label: 'Servicio' },
    { name: 'estatus', label: 'Estatus' },
    { name: 'user', label: 'Usuario' },
    { name: 'create_at', label: 'Creado El' },
    { name: 'actions', label: 'Acciones' }
  ];  



  constructor(	
  private _route: ActivatedRoute,
  public _ajustes: SettingsService,
	public _userService: UserService,  
  private _proyectoService: DashboardService,
  public fb: FormBuilder,
  private matIconRegistry: MatIconRegistry,
  private domSanitizer: DomSanitizer
  ) 
  {

  this.matIconRegistry.addSvgIcon(
    "icongestion",
    this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/iconprojectblanco.svg")
  );
	this.identity = this._userService.getIdentity();
	this.token = this._userService.getToken();
	this.proyectos = this._userService.getProyectos();
  this.options = fb.group({
          bottom: 0,
          fixed: false,
          top: 0
  });      

  this.sub = this._route.params.subscribe(params => { 
    let id = +params['id'];            
    this.id = id;
  
  if (this.id > 0 && this.token && this.token.token != null){

      //this.getTipoServicio(this.id);

      let paramp = this.filterProject();
      if(paramp){
        this.project_name = paramp.project_name;
        this.country = paramp.country_name;
        if(paramp.project_type == 0){
          this.table = 'address';
        }
        if(paramp.project_type == 1){
          this.table = 'vehiculos';
        }
        if(paramp.create_at){
          this.since = moment(paramp.create_at).locale('ES').format('LL');
        }
      }


      let params = this.filterService();
      if(params){
        this.service = params.service_name;
      }      
      //GET PROJECT FROM SERVICEORDER
      /*
      this.subscription = this._orderService.getService(this.token.token, this.id).subscribe(
                    response => {
                      //console.log(response);
                      if (response.status == 'success'){
                        this.project_name = response.datos.project['project_name'];
                        this.services = response.datos;
                        //console.log(this.services);
                        if(this.services['projects_categories_customers'] && this.services['projects_categories_customers']['id'] > 0){
                          this.category_id = this.services['projects_categories_customers']['id'];
                          this.table = this.services['projects_categories_customers']['name_table'];
                          //console.log(this.table);
                        }
                      }
                    });*/
      }
    });     

  }

  filterProject(){
    if(this.proyectos && this.id){
      for(var i = 0; i < this.proyectos.length; i += 1){
        var result = this.proyectos[i];
        //console.log(result[i]);
        if(result.service){
          for(var j = 0; j < result.service.length; j += 1){
            var data = result.service[j];
            //console.log(data);
            if(data.id === this.id){
              return result;
            }
          }          
        }
      }
    }    
  }  

  filterService(){
    if(this.proyectos && this.id){
      for(var i = 0; i < this.proyectos.length; i += 1){
        var result = this.proyectos[i];
        //console.log(result[i]);
        if(result.service){
          for(var j = 0; j < result.service.length; j += 1){
            var data = result.service[j];
            //console.log(data);
            if(data.id === this.id){
              return data;
            }
          }          
        }
      }
    }    
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
     if(this.subscription){
      this.subscription.unsubscribe();
     }
     this.sub.unsubscribe();
     //console.log("ngOnDestroy unsuscribe order");
  }

  ngAfterViewInit() {
    
  }

  public tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
  //console.log('tabChangeEvent => ', tabChangeEvent);
  //console.log('index => ', tabChangeEvent.index);
  }
  
  loadDataServicio(servicename:string){
      //console.log('viene');
      //console.log(servicetname);
      //this.service = servicename;
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

    if(tcolor == 3){
      this.theme = 'dark-theme';  
    }


    this._ajustes.aplicarTema( this.theme, tcolor );


  }

	refreshMenu(event:number){
		if(event == 1){
      this.subscription = this._proyectoService.getProyectos(this.token.token, this.identity.dpto).subscribe(
        response => {
            if (response.status == 'success'){
              this.proyectos = response.datos;
              let key = 'proyectos';
              localStorage.setItem(key, JSON.stringify(this.proyectos));
            }
          },
        error => {
            console.log(<any>error);
           }
        );    
		}
	}


}

interface Ajustes {
  idtema: number;
  tema: string;
}
