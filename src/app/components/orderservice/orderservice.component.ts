import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { SubscriptionLike as ISubscription } from 'rxjs'
import { OnDestroy } from "@angular/core";



//SERVICES
import { DashboardService } from '../../services/dashboard.service';
import { OrderserviceService } from '../../services/orderservice.service';
import { ProjectsService } from '../../services/projects.service';
import { SettingsService } from '../../services/service.index';
import { UserService } from '../../services/user.service';

//MODELS
import { Proyecto } from '../../models/proyecto';
import { Order } from '../../models/order';
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
export class OrderserviceComponent implements OnInit, OnDestroy, AfterViewInit {
  public title: string;
  public identity:any;
  public token:any;
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
  private sub: any;
  public url: any;
  otherTheme: boolean = true;
  theme: string;
  color: number;
  options: FormGroup;

  apikey: string;
  clientid: string;
  calendarID: string;
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
  private _orderService: OrderserviceService,
	private _project: ProjectsService,
  public _ajustes: SettingsService,
	public _userService: UserService,  
  private _proyectoService: UserService,
  private _proyectoServiceRefresh: DashboardService,

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

  this.sub = this._route.params.subscribe(params => { 
    let id = +params['id'];            
    this.id = id;
  
  if (this.id > 0 && this.token.token != null){
        //GET RUTA
        this._route.url.subscribe(res =>{
          this.url = res[0].path;        
          //console.log(this.url);
        });


        //GET PROJECT FROM CALENDAR
        if(this.url === 'projectcalendar'){
          this._project.getProject(this.token.token, this.id).then(
            (res:any) => {
              {
                res.subscribe(
                  (some) => 
                  {
                    if(some.datos){                      
                      this.project_name = some.datos.project_name;
                      this.apikey = some.datos.apikey;
                      this.clientid = some.datos.clientid;
                      this.calendarID = some.datos.calendarID;
                      
                    }else{
                    }
                  },
                  (error) => { 
                  console.log(<any>error);
                  }  
                  )
            }

            });   
        }


        //GET PROJECT FROM PROJECTSERVICE
        if(this.url === 'projectservice'){
          this._project.getProject(this.token.token, this.id).then(
            (res:any) => {
              {
                res.subscribe(
                  (some) => 
                  {
                    if(some.datos){                      
                      this.project_name = some.datos.project_name
                      //console.log(this.project_name);
                    }else{
                    }
                  },
                  (error) => { 
                  console.log(<any>error);
                  }  
                  )
            }

            });   
        }//END IF GET PROJECT SERVICE
        

        //GET PROJECT FROM SERVICEORDER
        if(this.url === 'serviceorder'){
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
        }//END IF GET SERVICE

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

	refresh(event:number){
		if(event == 1){
      this.subscription = this._proyectoServiceRefresh.getProyectos(this.token.token, this.identity.dpto).subscribe(
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
