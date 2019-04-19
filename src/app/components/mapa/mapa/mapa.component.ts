import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


//AGM
import { InfoWindow } from '@agm/core/services/google-maps-types'

//MODAL
import {NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalMapaComponent } from '../../modal/modalmapa/modalmapa.component'; 


//MODELS
import { 
  Order,
  ServiceEstatus,
  UserGeoreference
 } from '../../../models/types';


//SERVICES
import { CountriesService, MapaService, OrderserviceService, ProjectsService, UserService } from '../../../services/service.index';

//CLASSES
import { Marcador } from '../../../classes/marcador.class';

//MOMENT
import * as _moment from 'moment';
const moment = _moment;

interface User {
  id: number;
  name: string;
}

interface Time {
  hour: any; 
  minute: any
}


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit, OnChanges, OnDestroy {

  public datedesde: FormControl;
  public identity;
  public infoWindow: InfoWindow = undefined;  
  public region = new Array();
  public renderMap: boolean = false;
  public token;
  public wayspoints = [];
  public url: string = "https://www.google.com/";

  public renderOptions: any = {
      suppressMarkers: true,
  }  

 
  public markerOptions = {
      origin: {
          icon: '',
          infoWindow: `
          <h4>Origen<h4>
        `          
      },
      destination: {
          icon: '',
          infoWindow: `
          <h4>Destino<h4>
          `
      },

      waypoints: [
          {
           icon: '',
           infoWindow: '',
          },
      ],    
  };

  //ICON USER TRACKIN
  private iconusertracking = {
    url: '../../../assets/img/marker-red-tod.png', 
  };

  private datadirections = {
    origin: '',
    destination: '',
    waypoints: []  
  }


  public optimizeWaypoints: boolean = false

  //TIME PICKER
  //timefrom = {hour: 9, minute: 0};
  timefrom: Time = {hour: '', minute: ''};
  timeuntil: Time = {hour: '', minute: ''};
  meridian = true;
  spinners = false;  
  columnTimeFromValue: FormControl;
  columnTimeUntilValue: FormControl;

  ordenes: Order[] = [];
  users: UserGeoreference[] = [];  
  usuarios: UserGeoreference[] = [];
  usuariostracking: UserGeoreference[] = [];
  usuariosordenes: UserGeoreference[] = [];
  homemarcador: Marcador[]=[];
  marcadores: Marcador[]=[];
  usermarcadores: Marcador[]=[];
  usertrackingmarcadores: Marcador[]=[];
  directionsmarcadores: Marcador[]=[];
  userordenesmarcadores: Marcador[]=[];
  usertrackingadvancemarcadores: Marcador[]=[];  
  serviceestatus: ServiceEstatus[] = [];
  latitude: number;
  longitude: number;
  lat:number;
  lng:number;
  titulo: string;
  subtitulo:string;
  direccion:string;
  create_at: string;
  update_at: string;
  create_by: string;
  update_by: string;
  estatus: string;
  label:number;
  icon:string;
  servicename: string;
  country_id: number;
  //id : number;
  project_id: number;
  isLoadingResults: boolean;
  termino: any;
  date: any;
  status: number;
  message: String;
  messageadvance: String;
  servicetype: number
  show:boolean = true;
  showadvance:boolean = true;
  showdrawer:boolean = false;


  role:number;

  //FILTERS

  selectedColumnnOrdenes = {
    fieldValue: '',
    criteria: '',
    columnValue: ''
  };

  selectedColumnnEstatus = {
    fieldValue: '',
    criteria: '',
    columnValue: ''
  };

  selectedColumnnAdvance = {
    fieldValue: '',
    criteria: '',
    columnValue: ''
  };

  selectedColumnnDate = {
    fieldValue: '',
    criteria: '',
    columnValueDesde: ''
  };



/** control for the selected user for multi-selection */
  public userCtrl: FormControl = new FormControl();
  public userMultiFilterCtrl: FormControl = new FormControl();
  private user = new Array();  

  public userAdvanceCtrl: FormControl = new FormControl();
  public userAdvanceMultiFilterCtrl: FormControl = new FormControl();


  /** list of users filtered by search keyword */
  public filteredUserMulti: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);
  public filteredUserAdvanceMulti: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);

  private _onDestroy = new Subject<void>();

  @ViewChild('drawer') drawer;
  @Output() ServicioSeleccionado: EventEmitter<string>;
  @Input() id : number;

  constructor(
    private _dataService: OrderserviceService,    
    private _mapaService: MapaService,
    private _proyectoService: ProjectsService,
    private _route: ActivatedRoute,
    private _router: Router,        
    private _regionService: CountriesService,
    private _userService: UserService,
    private modalService: NgbModal
    
  	) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.ServicioSeleccionado = new EventEmitter();
    this.role = 5; //USUARIOS INSPECTORES
    this.message = '';
  	}

  ngOnInit() {



  }


  ngOnChanges(changes: SimpleChanges) {
    //console.log('onchange mapa');
    this.renderMap = false;
    this.homemarcador = [];
    this.marcadores = [];
    this.users = [];
    this.user = [];
    this.usermarcadores = [];    
    this.usertrackingmarcadores = [];
    this.userordenesmarcadores = [];
    this.selectedColumnnOrdenes.fieldValue = '';
    this.selectedColumnnEstatus.fieldValue = '';
    this.selectedColumnnAdvance.fieldValue = '';
    this.selectedColumnnDate.columnValueDesde = '';
    this.message = '';
    this.userCtrl.reset();
    this.userAdvanceCtrl.reset();
    this.loadInfo();
    this.loadServiceEstatus();


    this.userMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterUsers();
      });    

    this.userAdvanceMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterUsersAdvance();
      });    



  }


  refresh() {    
    this.renderMap = false;
    this.homemarcador = [];
    this.marcadores = [];
    this.users = [];
    this.user = [];
    this.usermarcadores = [];    
    this.usertrackingmarcadores = [];
    this.userordenesmarcadores = [];
    this.wayspoints = [];
    this.datadirections.origin = '';
    this.datadirections.destination = '';      
    this.selectedColumnnOrdenes.fieldValue = '';
    this.selectedColumnnEstatus.fieldValue = '';
    this.selectedColumnnAdvance.fieldValue = '';
    this.selectedColumnnDate.columnValueDesde = '';    
    this.message = '';
    this.userCtrl.reset();
    this.userAdvanceCtrl.reset();
    //this.userMultiFilterCtrl.reset();
    this.loadInfo();
    this.loadServiceEstatus();


  }




  reset(){
    this.userCtrl.reset();
    this.userAdvanceCtrl.reset();    
    //this.userMultiFilterCtrl.reset();    
    this.selectedColumnnOrdenes.fieldValue = '';
    this.selectedColumnnEstatus.fieldValue = '';
    this.selectedColumnnAdvance.fieldValue = '';
    this.selectedColumnnDate.columnValueDesde = '';        
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

  private filterUsersAdvance() {
    //console.log('filter');
    if (!this.user) {
      return;
    }
    // get the search keyword
    let search = this.userAdvanceMultiFilterCtrl.value;
    if (!search) {
      this.filteredUserAdvanceMulti.next(this.user.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredUserAdvanceMulti.next(
      this.user.filter(user => user.name.toLowerCase().indexOf(search) > -1)
    );
  }



  public loadInfo(){
    this.isLoadingResults = true;
    this._dataService.getService(this.token.token, this.id).subscribe(
                response => {
                   if(response.status == 'success'){
                     this.project_id = Number (response.datos.project.id);
                     this.country_id = Number (response.datos.project.country_id);
                     this.servicename = String (response.datos.service_name);                     
                     this.ServicioSeleccionado.emit(this.servicename);                     
                     this.loadregion(this.country_id);
                     this.loadproject(this.project_id);
                     this.loaduser(this.project_id);                     
                     this.loadusergeoreference(this.project_id);
                     this.isLoadingResults = false;
                    }else{
                     this.country_id = 0;
                     this.isLoadingResults = false;
                     }
                    },
                    (error) => {                      
                      this.isLoadingResults = false;
                      localStorage.removeItem('departamentos');
                      localStorage.removeItem('fotoprofile');
                      localStorage.removeItem('identity');
                      localStorage.removeItem('token');
                      localStorage.removeItem('proyectos');
                      localStorage.removeItem('expires_at');
                      this._router.navigate(["/login"]);          
                      console.log(<any>error);
                    }  

                    );    

    }//END IF

  public loadregion(countryid:number){
      if(countryid > 0){
        this._regionService.getRegion(this.token.token, countryid).subscribe(
                response => {
                   if(response.status == 'success'){
                    this.latitude = Number (response.datos.latitud);
                    this.longitude = Number (response.datos.longitud);
                    this.titulo = response.datos.company_name;
                    this.subtitulo = response.datos.company_footer;
                    this.direccion = response.datos.company_footer;
                    this.create_at = '';
                    this.update_at = '';
                    this.create_by = '';
                    this.update_by = '';
                    this.estatus = '';
                    this.label = 0;
                    //this.icon = 'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png'
                    //this.icon = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
                    this.icon = 'https://img.icons8.com/color/25/000000/google-home.png';
                    //this.lat = response.datos.latitud;
                    //this.lng = response.datos.longitud;
                    const nuevoMarcador = new Marcador(this.latitude, this.longitude, this.titulo, this.subtitulo, this.label, this.icon, this.direccion, this.create_at, this.update_at, this.create_by, this.update_by, this.estatus);
                    this.homemarcador.push(nuevoMarcador);

                    this.renderMap = true;
                    }else{
                      this.lat = 0;
                      this.lng = 0;
                         }
                    },
                      error => {                      
                      localStorage.removeItem('departamentos');
                      localStorage.removeItem('fotoprofile');
                      localStorage.removeItem('identity');
                      localStorage.removeItem('token');
                      localStorage.removeItem('proyectos');
                      localStorage.removeItem('expires_at');
                      this._router.navigate(["/login"]);
                      console.log(<any>error);
                      } 
                    );    
      //console.log(this.homemarcador);
      }
  }

  public loadproject(projectid:number){
    this.termino = 0;
    this.date = 'day';
    this.status = 0;
    this.servicetype = 0;

    if(projectid > 0){                                
        this._proyectoService.getProjectOrder(this.token.token, projectid, this.termino, this.date, this.status, this.id, this.servicetype).then(
          (res: any) => 
          {
            res.subscribe(
              (some) => 
              {
                if(some.datos){
                  this.ordenes = some.datos;  
                  //console.log(this.ordenes);
                  //console.log(this.ordenes.length);
                  for (var i=0; i<this.ordenes.length; i++){
                    //console.log('paso');
                    //console.log(this.ordenes[i]);
                    if(this.ordenes[i]['latitud'] && this.ordenes[i]['longitud']){
                      this.titulo = String('N.Cliente: '+ this.ordenes[i]['cc_number']);
                      this.subtitulo = String('N.Orden: '+ this.ordenes[i]['order_number']);
                      this.latitude = Number (this.ordenes[i]['latitud']);
                      this.longitude = Number (this.ordenes[i]['longitud']);
                      this.direccion = String('Dirección: '+ this.ordenes[i]['direccion']);
                      this.create_at = String('Creado el: '+ this.ordenes[i]['create_at']);
                      this.update_at = String('Editado el: '+ this.ordenes[i]['update_at']);
                      this.estatus = String('Estatus: '+ this.ordenes[i]['estatus']);
                      this.create_by = String('Creado por: '+ this.ordenes[i]['user']);
                      this.update_by = String('Editado por: '+ this.ordenes[i]['userupdate']);
                      //this.label = String(i);
                      this.label = 0;
                      if(this.ordenes[i]['estatus'] === 'Atendido'){
                        this.icon = './assets/img/marker-green.png';  
                        //this.icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';  
                      }else{
                         this.icon = 'https://img.icons8.com/color/25/000000/marker.png';
                        //this.icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';  
                      }
                      
                      const nuevoMarcador = new Marcador(this.latitude, this.longitude, this.titulo, this.subtitulo, this.label, this.icon, this.direccion, this.create_at, this.update_at, this.create_by, this.update_by, this.estatus);
                      this.marcadores.push(nuevoMarcador);                     
                    }
                    
                    
                  }
                  //console.log(this.marcadores);
                  
                }else{
                }
              },
              (error) => { 
              this.marcadores = [];
              //console.log(<any>error);
              }  
              )
        })
    }//END MAIN IF
  }


  public loadServiceEstatus(){  
    this._dataService.getServiceEstatus(this.token.token, this.id).subscribe(
    response => {
              if(!response){
                return;
              }
              if(response.status == 'success'){                  
                this.serviceestatus = response.datos;
              }
              });        
  }


  public loadusergeoreference(projectid:number){
    this.termino = 0;
    this.date = 'day';
    this.status = 0;
    this.servicetype = 0;

    if(projectid > 0){                                
        this._proyectoService.getProjectUserGeoreference(this.token.token, projectid).then(
          (res: any) => 
          {
            res.subscribe(
              (some) => 
              {
                if(some.datos){
                  this.usuarios = some.datos;  
                  for (var i=0; i<this.usuarios.length; i++){
                    //console.log(this.ordenes[i]);
                    if(this.usuarios[i]['latitud'] && this.usuarios[i]['longitud']){
                      this.titulo = String('Ubicación');
                      this.subtitulo = String('Usuario: '+ this.usuarios[i]['usuario']);
                      this.latitude = Number (this.usuarios[i]['latitud']);
                      this.longitude = Number (this.usuarios[i]['longitud']);
                      this.direccion = String('Dirección: '+ this.usuarios[i]['direccion']);
                      this.create_at = String('Creado el: '+ this.usuarios[i]['create_at']);
                      this.update_at = String('Editado el: '+ this.usuarios[i]['update_at']);
                      this.estatus = String('Estatus: '+ this.usuarios[i]['estatus']);
                      this.create_by = '';
                      this.update_by = '';                      
                      //this.label = String(i);
                      this.label = 0;
                      this.icon = './assets/img/marker-blue.png';  
                      //this.icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';                        
                      const userMarcador = new Marcador(this.latitude, this.longitude, this.titulo, this.subtitulo, this.label, this.icon, this.direccion, this.create_at, this.update_at, this.create_by, this.update_by, this.estatus);
                      this.usermarcadores.push(userMarcador);
                    }
                    
                    
                  }
                  
                }else{

                }
              },
              (error) => { 
              this.usermarcadores = [];
              //console.log(<any>error);
              }  
              )
        })
    }//END MAIN IF PROJECT
  }


  public loaduser(projectid:number){

    if(projectid > 0){     
        this._proyectoService.getProjectUser(this.token.token, projectid, this.role).then(
          (res: any) => 
          {
            res.subscribe(
              (some) => 
              {
                if(some.datos){
                  this.users = some.datos;
                  for (var i=0; i<this.users.length; i++){
                    const userid = this.users[i]['id'];
                    const username = this.users[i]['usuario'];
                    this.user[i] = { name: username, id: userid };
                  }
                  //console.log(this.user);
                  this.filteredUserMulti.next(this.user.slice());
                  this.filteredUserAdvanceMulti.next(this.user.slice());
                  //console.log(this.filteredUserMulti);                  
                }else{
                }
              },
              (error) => { 
              this.users = [];
              //console.log(<any>error);
              }  
              )
        })
    }
  }


  public loadusertracking(projectid:number, userid:number){
    if(projectid > 0 && userid > 0 ){ 
      this.isLoadingResults = true;      
      this.renderMap = false;
      this.marcadores = [];
      this.usermarcadores = [];
      this.usertrackingmarcadores = [];
      this.usertrackingadvancemarcadores = [];      
      this.selectedColumnnEstatus.fieldValue = '';
      this.selectedColumnnDate.columnValueDesde = '';
      this.wayspoints = [];
      this.datadirections.origin = '';
      this.datadirections.destination = '';      

      this.userAdvanceCtrl.reset();
      this.userAdvanceMultiFilterCtrl.reset();
      this.messageadvance = '';
      this.columnTimeFromValue = new FormControl;
      this.columnTimeUntilValue = new FormControl;
      var newtimefrom = "";
      var newtimeuntil = "";


      //this.userordenesmarcadores = [];
        this._proyectoService.gettUserGeoreference(this.token.token, userid, this.selectedColumnnDate.columnValueDesde, newtimefrom, newtimeuntil).then(
          (res: any) => 
          {
            res.subscribe(
              (some) => 
              {
                if(some.datos){
                  //console.log(some.datos);  
                  this.usuariostracking = some.datos;                
                  if(this.usuariostracking.length > 0){
                  var j = Number(this.usuariostracking.length);
                  }                  
                  //console.log(this.usuariostracking.length);
                  for (var i=0; i<this.usuariostracking.length; i++){
                    if(this.usuariostracking[i]['latitud'] && this.usuariostracking[i]['longitud']){
                      this.titulo = String('Ubicación');
                      this.subtitulo = String('Usuario: '+ this.usuariostracking[i]['usuario']);
                      this.latitude = Number (this.usuariostracking[i]['latitud']);
                      this.longitude = Number (this.usuariostracking[i]['longitud']);
                      this.direccion = String('Dirección: '+ this.usuariostracking[i]['direccion']);
                      this.create_at = String('Creado el: '+ this.usuariostracking[i]['create_at']);
                      //this.icon = './assets/img/marker-blue-tod.png';  
                      this.update_at = '';
                      this.estatus = '';
                      this.create_by = '';
                      this.update_by = '';                                            
                      this.label = Number(j--);                                           
                      const userTrackingMarcador = new Marcador(this.latitude, this.longitude, this.titulo, this.subtitulo, this.label, this.icon, this.direccion, this.create_at, this.update_at, this.create_by, this.update_by, this.estatus);
                      this.usertrackingmarcadores.push(userTrackingMarcador);
                      this.isLoadingResults = false;
                    }
                  }
                  this.isLoadingResults = false;
                  this.renderMap = true;
                  this.message = 'success';
                  //this.directions(this.usertrackingmarcadores);
                  //console.log(this.usertrackingmarcadores);
                }else{
                  this.isLoadingResults = false;
                  this.renderMap = true;
                  this.message = 'error';
                }
              },
              (error) => { 
              this.usertrackingmarcadores = [];
              this.isLoadingResults = false;
              this.renderMap = true;
              this.message = 'error';
              //console.log(<any>error);
              }  
              )
          })      
        }
    }

  public directions(data:Marcador[]){
    var banderafirst = false;
    var banderalast = false;    
    this.directionsmarcadores = data;    
    if(this.directionsmarcadores.length > 0){     
    const lastinsert = this.directionsmarcadores.length - 1;
    var j = Number(this.directionsmarcadores.length - 1);
    var x = Number(this.usuariostracking.length);          
      for (var i=0; i<this.directionsmarcadores.length; i++){
        if(this.directionsmarcadores[i].lat && this.directionsmarcadores[i].lng && !banderalast && lastinsert == i){
          this.datadirections.destination = this.directionsmarcadores[i].lat +','+ this.directionsmarcadores[i].lng;
          banderalast = true;     
          break;
        }

        if(banderafirst){ 
           this.wayspoints.push(
          {
              location: { lat: this.directionsmarcadores[j].lat, lng: this.directionsmarcadores[j].lng }
          })
          
          this.markerOptions.waypoints.push({icon:'https://i.imgur.com/7teZKif.png', infoWindow: `
        <h4>Hello<h4>
        `})
          /*GOOGLE API
          if(i==1){
            this.datadirections.waypoints = this.directionsmarcadores[i].lat +','+ this.directionsmarcadores[i].lng ;            
          }else{
            this.datadirections.waypoints = this.datadirections.waypoints + '|' + this.directionsmarcadores[i].lat +','+ this.directionsmarcadores[i].lng ;          
          }*/
          
        }

        if(this.directionsmarcadores[i].lat && this.directionsmarcadores[i].lng && !banderafirst){
          this.datadirections.origin = this.directionsmarcadores[i].lat +','+ this.directionsmarcadores[i].lng;
          banderafirst = true;
        }
        j = j-1;




      }
      if(this.datadirections){
        //console.log(this.markerOptions);
        //console.log(this.datadirections);
        //console.log(this.wayspoints);
        //this.GoogleApi(this.datadirections);
      }
    }
  }

  



  public GoogleApi(data:any){
    if(data){
      //console.log(data);
      this._mapaService.getDirections(this.token.token, data).subscribe(
      response => {
      if(!response){
        return;
         }       
          console.log(response);
        
      },
          error => {                      
          console.log(<any>error);
          }        
      );      


    }



  }

  public loaduserordenes(projectid:number, userid:number){
    this.isLoadingResults = true;
    if(projectid > 0 && userid > 0 ){ 
      this.renderMap = false;
      this.marcadores = [];
      this.usermarcadores = [];
      this.usertrackingadvancemarcadores = [];           
      this.selectedColumnnEstatus.fieldValue = '';
      this.selectedColumnnDate.columnValueDesde = '';
      this.userAdvanceCtrl.reset();
      this.userAdvanceMultiFilterCtrl.reset();      
      this.messageadvance = '';
      this.wayspoints = [];
      this.datadirections.origin = '';
      this.datadirections.destination = '';      

      //this.usertrackingmarcadores = [];
      this.userordenesmarcadores = [];
        this._proyectoService.gettUserOrdenesGeoreference(this.token.token, projectid, userid).then(
          (res: any) => 
          {
            res.subscribe(
              (some) => 
              {
                if(some.datos){
                  //console.log(some.datos);  
                  this.usuariosordenes = some.datos;                
                  if(this.usuariosordenes.length > 0){
                  var j = Number(this.usuariosordenes.length);      
                  }                  
                  //console.log(this.usuariostracking.length);
                  for (var i=0; i<this.usuariosordenes.length; i++){
                    if(this.usuariosordenes[i]['latitud'] && this.usuariosordenes[i]['longitud']){
                      this.titulo = String('N.Cliente: '+ this.ordenes[i]['cc_number']);
                      this.subtitulo = String('N.Orden: '+ this.ordenes[i]['order_number']);
                      this.latitude = Number (this.usuariosordenes[i]['latitud']);
                      this.longitude = Number (this.usuariosordenes[i]['longitud']);
                      this.create_at = String('Creado el: '+ this.usuariosordenes[i]['create_at']);
                      this.update_at = String('Editado el: '+ this.usuariosordenes[i]['update_at']);
                      this.update_by = String('Editada por: '+ this.usuariosordenes[i]['usuario']);
                      this.estatus = String('Estatus: '+ this.usuariosordenes[i]['estatus']);
                      this.icon = './assets/img/marker-green-tod.png';  
                      this.direccion = '';
                      this.create_by = '';
                      this.label = Number(j--);                                           
                      const userOrdenesMarcador = new Marcador(this.latitude, this.longitude, this.titulo, this.subtitulo, this.label, this.icon, this.direccion, this.create_at, this.update_at, this.create_by, this.update_by, this.estatus);
                      this.userordenesmarcadores.push(userOrdenesMarcador);
                      this.isLoadingResults = false;
                    }
                  }
                  this.isLoadingResults = false;
                  this.renderMap = true;
                  this.message = 'success';
                  //console.log(this.usertrackingmarcadores);
                }else{
                  this.isLoadingResults = false;
                  this.renderMap = true;
                  this.message = 'error';
                }
              },
              (error) => { 
              this.userordenesmarcadores = [];
              this.isLoadingResults = false;
              this.renderMap = true;
              this.message = 'error';
              //console.log(<any>error);
              }  
              )
          })      
        }
    }

  public loadordenesestatus(projectid:number, statusid:number){
    this.status = statusid;

    if(projectid > 0 && statusid>0 ){    
    this.isLoadingResults = true; 
    this.renderMap = false;
    this.marcadores = [];
    this.usertrackingmarcadores = [];
    this.usertrackingadvancemarcadores = [];      
    this.userordenesmarcadores = [];    
    this.selectedColumnnOrdenes.fieldValue = '';
    this.selectedColumnnDate.columnValueDesde = '';
    this.wayspoints = [];
    this.datadirections.origin = '';
    this.datadirections.destination = '';      

    this.userAdvanceCtrl.reset();
    this.userAdvanceMultiFilterCtrl.reset();
    this.messageadvance = '';
    this.userCtrl.reset();

                           
        this._proyectoService.getProjectOrder(this.token.token, projectid, this.termino, this.date, this.status, this.id, this.servicetype).then(
          (res: any) => 
          {
            res.subscribe(
              (some) => 
              {
                //console.log('----------------');
                if(some.datos){
                  this.ordenes = some.datos; 
                  //console.log(this.ordenes);
                  for (var i=0; i<this.ordenes.length; i++){
                    //console.log(this.ordenes[i]);
                    if(this.ordenes[i]['latitud'] && this.ordenes[i]['longitud']){
                      this.titulo = String('N.Cliente: '+ this.ordenes[i]['cc_number']);
                      this.subtitulo = String('N.Orden: '+ this.ordenes[i]['order_number']);
                      this.latitude = Number (this.ordenes[i]['latitud']);
                      this.longitude = Number (this.ordenes[i]['longitud']);
                      this.direccion = String('Dirección: '+ this.ordenes[i]['direccion']);
                      this.create_at = String('Creado el: '+ this.ordenes[i]['create_at']);
                      this.update_at = String('Editado el: '+ this.ordenes[i]['update_at']);
                      this.estatus = String('Estatus: '+ this.ordenes[i]['estatus']);
                      this.create_by = String('Creado por: '+ this.ordenes[i]['user']);
                      this.update_by = String('Editado por: '+ this.ordenes[i]['userupdate']);
                      //this.label = String(i);
                      this.label = 0;
                      if(this.ordenes[i]['estatus'] === 'Atendido'){
                        this.icon = './assets/img/marker-green.png';  
                        //this.icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';  
                      }else{
                         this.icon = 'https://img.icons8.com/color/25/000000/marker.png';
                        //this.icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';  
                      }
                      
                      const nuevoMarcador = new Marcador(this.latitude, this.longitude, this.titulo, this.subtitulo, this.label, this.icon, this.direccion, this.create_at, this.update_at, this.create_by, this.update_by, this.estatus);
                      this.marcadores.push(nuevoMarcador);                     
                    }                                        
                  }
                  this.isLoadingResults = false;
                  this.renderMap = true;
                  this.message = 'success';  
                }else{
                  this.isLoadingResults = false;
                  this.renderMap = true;
                  this.message = 'error';                  
                }
              },
              (error) => { 
              this.marcadores = [];
              this.isLoadingResults = false;
              this.renderMap = true;
              this.message = 'error';
              //console.log(<any>error);
              }  
              )
        })
    }//END MAIN IF    

  }


  public loadusertrackingdate(projectid:number, userid:number){

    if(projectid > 0 && userid > 0 ){ 
      this.isLoadingResults = true; 
      this.renderMap = false;
      this.marcadores = [];
      this.usermarcadores = [];
      this.usertrackingmarcadores = [];
      this.userordenesmarcadores = [];      
      this.usertrackingadvancemarcadores = [];
      this.wayspoints = [];
      this.selectedColumnnOrdenes.fieldValue = '';
      this.selectedColumnnEstatus.fieldValue = '';
      this.datadirections.origin = '';
      this.datadirections.destination = '';      
      this.message = '';
      this.userCtrl.reset();
      this.userMultiFilterCtrl.reset();

      if(this.selectedColumnnDate.columnValueDesde){
        this.datedesde = new FormControl(moment(this.selectedColumnnDate.columnValueDesde).format('YYYY[-]MM[-]DD'));
        this.selectedColumnnDate.columnValueDesde = this.datedesde.value;
      }else{
        this.selectedColumnnDate.columnValueDesde = "";
      }


      //console.log(this.timefrom);
      //console.log(this.timeuntil);
      if(this.timefrom !=null && this.timeuntil !=null && this.timefrom.hour !=null && this.timefrom.hour != "" && this.timefrom.hour != "00" && this.timefrom.hour != "0"  && this.timeuntil.hour !=null && this.timeuntil.hour != "" && this.timeuntil.hour != "00" && this.timeuntil.hour != "0"){
        const momenttimefrom = this.timefrom.hour +':'+ this.timefrom.minute +':00';
        const momenttimeuntil  = this.timeuntil.hour +':'+ this.timeuntil.minute +':00';
        this.columnTimeFromValue = new FormControl(moment(momenttimefrom, 'H:mm:ss').format('LTS'));
        this.columnTimeUntilValue = new FormControl(moment(momenttimeuntil, 'H:mm:ss').format('LTS'));
        var newtimefrom = moment(this.columnTimeFromValue.value, "h:mm:ss A").format("HH:mm:ss");   
        var newtimeuntil = moment(this.columnTimeUntilValue.value, "h:mm:ss A").format("HH:mm:ss");
      }else{
        var newtimefrom = "";
        var newtimeuntil = "";
      }      

        this._proyectoService.gettUserGeoreference(this.token.token, userid, this.selectedColumnnDate.columnValueDesde, newtimefrom, newtimeuntil).then(
          (res: any) => 
          {
            res.subscribe(
              (some) => 
              {
                if(some.datos){
                  //console.log(some.datos);  
                  this.usuariostracking = some.datos;                
                  if(this.usuariostracking.length > 0){
                  var j = Number(this.usuariostracking.length);      
                  }                  
                  //console.log(this.usuariostracking.length);
                  for (var i=0; i<this.usuariostracking.length; i++){
                    if(this.usuariostracking[i]['latitud'] && this.usuariostracking[i]['longitud']){
                      this.titulo = String('Ubicación');
                      this.subtitulo = String('Usuario: '+ this.usuariostracking[i]['usuario']);
                      this.latitude = Number (this.usuariostracking[i]['latitud']);
                      this.longitude = Number (this.usuariostracking[i]['longitud']);
                      this.create_at = String('Creado el: '+ this.usuariostracking[i]['create_at']);
                      this.icon = './assets/img/marker-blue-tod.png';  
                      if(this.usuariostracking[i]['direccion']){
                      this.direccion = String('Dirección: '+ this.usuariostracking[i]['direccion']);
                      }else{
                      this.direccion = '';
                      }

                      this.update_at = '';
                      this.estatus = '';
                      this.create_by = '';
                      this.update_by = '';                                            
                      this.label = Number(j--);                                           
                      const userTrackingAdvanceMarcador = new Marcador(this.latitude, this.longitude, this.titulo, this.subtitulo, this.label, this.icon, this.direccion, this.create_at, this.update_at, this.create_by, this.update_by, this.estatus);
                      this.usertrackingadvancemarcadores.push(userTrackingAdvanceMarcador);
                      this.usertrackingmarcadores.push(userTrackingAdvanceMarcador);
                      this.isLoadingResults = false;
                    }
                  }
                  this.isLoadingResults = false;
                  this.renderMap = true;
                  this.messageadvance = 'success';
                  this.directions(this.usertrackingadvancemarcadores);
                  //console.log(this.usertrackingadvancemarcadores);
                }else{
                  this.isLoadingResults = false;
                  this.renderMap = true;
                  this.messageadvance = 'error';
                }
              },
              (error) => { 
              this.usertrackingadvancemarcadores = [];
              this.isLoadingResults = false;
              this.renderMap = true;
              this.messageadvance = 'error';
              //console.log(<any>error);
              }  
              )
          })  
        }     
  }

  public obtainInfowindow(window: InfoWindow) {
    this.infoWindow = window
    console.log(this.infoWindow);
  }


  public change(event: any) {
      this.wayspoints = event.request.waypoints;
      console.log(this.wayspoints);
  }

  handledrawer(): void {
      this.drawer.toggle();
      this.showdrawer = !this.showdrawer;
      return;
  }


  toggle() {    
    this.show = !this.show;
    this.message = '';
    this.userCtrl.reset();

    //this.userMultiFilterCtrl.reset();

  }


  toggleadvance() {
    this.showadvance = !this.showadvance;
    this.messageadvance = '';
    this.userAdvanceCtrl.reset();

  }


  resetUserFilters() {
    this.userCtrl.reset();
    this.userMultiFilterCtrl.reset();
  }  


  resetUserAdvanceFilters() {
    this.userAdvanceCtrl.reset();
    this.userAdvanceMultiFilterCtrl.reset();
    this.selectedColumnnAdvance.fieldValue = '';
    this.selectedColumnnDate.columnValueDesde = '';        

  }  


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


  openwindows() {
    // const modalRef = this.modalService.open(ModalComponent);
    const modalRef = this.modalService.open(ModalMapaComponent, {windowClass: 'xlModal', centered: true, backdrop: 'static'});

    modalRef.componentInstance.id= this.id;
    //modalRef.componentInstance.title = 'About';
  }

}
