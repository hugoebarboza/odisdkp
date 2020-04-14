import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, OnChanges, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgZone} from '@angular/core';
import { MapsAPILoader, MouseEvent} from '@agm/core';
// import {} from '@types/googlemaps';

// AGM
import { InfoWindow } from '@agm/core/services/google-maps-types';

// MODAL
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalMapaComponent } from '../../modal/modalmapa/modalmapa.component';

// MODELS
import {
  Order,
  ServiceEstatus,
  UserGeoreference
} from 'src/app/models/types';

import { ToastrService } from 'ngx-toastr';

// SERVICES
import { MapaService, OrderserviceService, ProjectsService, UserService, CustomformService, DataService } from 'src/app/services/service.index';

// CLASSES
import { Marcador } from '../../../classes/marcador.class';

// MOMENT
import * as _moment from 'moment';
const moment = _moment;
declare const google: any;
import * as $ from 'jquery';
import { MatDialog } from '@angular/material/dialog';
import { NewshapeComponent } from '../dialog/newshape/newshape.component';
import { ListMapCategoryComponent } from '../dialog/list-map-category/list-map-category.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import Swal from 'sweetalert2';
import { EditshapeComponent } from '../dialog/editshape/editshape.component';

interface User {
  id: number;
  name: string;
}

interface Equipos {
  id: number;
  descripcion: string;
}

interface Time {
  hour: any;
  minute: any;
}

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})

export class MapaComponent implements OnInit, OnChanges, OnDestroy {

  public context = this;
  public datedesde: FormControl;
  public identity;
  public infoWindow: InfoWindow = undefined;
  public region = new Array();
  public renderMap = false;
  public token;
  public wayspoints = [];
  public url = 'https://www.google.com/';
  public renderOptions: any = {
      suppressMarkers: true,
  };
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

  // ICON USER TRACKIN
  // private iconusertracking = { url: '../../../assets/img/marker-red-tod.png',   };
  private datadirections = {
    origin: '',
    destination: '',
    waypoints: []
  };

  public optimizeWaypoints = false;

  // TIME PICKER
  // timefrom = {hour: 9, minute: 0};
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
  homemarcador: Marcador[] = [];
  marcadores: Marcador[] = [];
  usermarcadores: Marcador[] = [];
  usertrackingmarcadores: Marcador[] = [];
  directionsmarcadores: Marcador[] = [];
  userordenesmarcadores: Marcador[] = [];
  userequipomarcadores: Marcador[] = [];
  usertrackingadvancemarcadores: Marcador[] = [];
  serviceestatus: ServiceEstatus[] = [];
  latitude: number;
  longitude: number;
  lat: number;
  lng: number;
  titulo: string;
  subtitulo: string;
  direccion: string;
  create_at: string;
  update_at: string;
  create_by: string;
  update_by: string;
  estatus: string;
  label: number;
  icon: string;
  servicename: string;
  country_id: number;
  project_id: number;
  isLoadingResults: boolean;
  termino: any;
  date: any;
  status: number;
  message: String;
  messageadvance: String;
  servicetype: number;
  show = true;
  showadvance = true;
  showdrawer = false;
  role: number;

  element: HTMLElement;
  element2: HTMLElement;

  // FILTERS
  selectedColumnnOrdenes = {
    fieldValue: '',
    criteria: '',
    columnValue: ''
  };

  selectedColumnEquipos = {
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

  /** Control for the selected user for multi-selection */

  public userCtrl: FormControl = new FormControl();
  public userMultiFilterCtrl: FormControl = new FormControl();
  public ordenesCtrl: FormControl = new FormControl();
  public ordenesFilterCtrl: FormControl = new FormControl();
  public equiposCtrl: FormControl = new FormControl();
  public equiposFilterCtrl: FormControl = new FormControl();
  private user = new Array();
  public userAdvanceCtrl: FormControl = new FormControl();
  public userAdvanceMultiFilterCtrl: FormControl = new FormControl();

  /** List of users filtered by search keyword */
  public filteredUserOrdenes: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);
  public filteredUserMulti: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);
  public filteredUserAdvanceMulti: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);
  public filteredEquipos: ReplaySubject<Equipos[]> = new ReplaySubject<Equipos[]>(1);
  private _onDestroy = new Subject<void>();

  @ViewChild('drawer', { static: true }) drawer;
  @Output() ServicioSeleccionado: EventEmitter<string>;
  @Input() id: number;
  @ViewChild('search', { static: true }) search;
  public zoom = 15;
  private geoCoder;
  mylatitude: number;
  mylongitude: number;
  myaddress: number;
  categoria = [];
  roles = [];
  equipos = new Array();

  // GOOGLE MAP POLIGONOS
  drawingManager: any;
  mapReady: any;
  public context_ = this;

  constructor(
    public dataService: DataService,
    private _dataService: OrderserviceService,
    private _mapaService: MapaService,
    public _customForm: CustomformService,
    private _proyectoService: ProjectsService,
    public dialog: MatDialog,
    private _userService: UserService,
    private modalService: NgbModal,
    public toasterService: ToastrService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public cdf: ChangeDetectorRef,
    ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.ServicioSeleccionado = new EventEmitter();
    this.role = 5;
    this.message = '';
  }

  ngOnInit() {
  }

  ngOnChanges(_changes: SimpleChanges) {
    this.renderMap = false;
    this.homemarcador = [];
    this.marcadores = [];
    this.users = [];
    this.user = [];
    this.usermarcadores = [];
    this.usertrackingmarcadores = [];
    this.userordenesmarcadores = [];
    this.userequipomarcadores = [];
    this.selectedColumnnOrdenes.fieldValue = '';
    this.selectedColumnnEstatus.fieldValue = '';
    this.selectedColumnnAdvance.fieldValue = '';
    this.selectedColumnEquipos.fieldValue = '';
    this.selectedColumnnDate.columnValueDesde = '';
    this.message = '';
    this.userCtrl.reset();
    this.ordenesCtrl.reset();
    this.equiposCtrl.reset();
    this.userAdvanceCtrl.reset();
    this.loadInfo();
    this.loadServiceEstatus();
    this.userMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterUsers();
      });
    this.ordenesFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterUsersOrdenes();
    });
    this.userAdvanceMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterUsersAdvance();
      });
    this.equiposFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filteredUserTeam();
      });
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      const autocomplete = new google.maps.places.Autocomplete(this.search.nativeElement, {
        types: ['address']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.mylatitude = place.geometry.location.lat();
          this.mylongitude = place.geometry.location.lng();
          this.getAddress(this.mylatitude, this.mylongitude);
        });
      });
    });
    this.getCategory();
    this.getRoleUser();
  }

  getRoleUser() {
    if (this.token.token) {
      this._userService.getRoleUser(this.token.token, this.identity.role)
      .subscribe(
        response => {
          if (!response) {
            return false;
          }
            if (response.status === 'success') {
              this.roles = response.datos;
              // console.log(this.roles);
            }
        },
            error => {
            console.log(<any>error);
            }
        );
    }
  }

  async getCategory() {
    const response: any = await this._customForm.showMapCategory(this.token.token, this.id);
    // console.log(response);
    if (response && response.status && response.status === 'success') {
      this.categoria = response.datos;
      for (let i = 0; i < this.categoria.length; i++) {
        this.getPoligonos(this.categoria[i], i);
      }
    } else {
      this.categoria = [];
    }
  }

  async getPoligonos(categoria: any, x: number) {
    if (categoria && !categoria.poligonos) {
      // this.isLoadingMenu = false;
      const data: any = await this._customForm.showMapFigura(categoria.id, this.token.token);
      // this.isLoadingMenu = true;
      if (data && data.datos && data.datos.length > 0) {
        // for (let i = 0; i < this.categoria.length; i++) {
          if (this.categoria[x]['id'] === categoria.id) {
            this.categoria[x]['poligonos'] = data.datos;
            this.createPoligonos(x);
            /**this.element = document.getElementById('category' + x) as HTMLElement;
            this.element.setAttribute('aria-expanded', 'true');
            this.element2 = document.getElementById('category' + x) as HTMLElement;
            this.element2.setAttribute('data-toggle', 'collapse');*/
            // break;
          }
        // }
      }
    }
  }


  changeCategory(event: MatCheckboxChange, i: number) {
    if (event.checked) {
      this.categoria[i]['status'] = event.checked;
      if (this.categoria[i]['poligonos'] && this.categoria[i]['poligonos'].length > 0) {
        const poligonos = this.categoria[i]['poligonos'];
        for (let x = 0; x < poligonos.length; x++) {
          this.categoria[i]['poligonos'][x]['status'] = event.checked;
          const element = poligonos[x];
          const eventMap = element.eventMap;
          eventMap.setMap(this.mapReady);
        }
      }
    } else {
      this.categoria[i]['status'] = event.checked;
      if (this.categoria[i]['poligonos'] && this.categoria[i]['poligonos'].length > 0) {
        const poligonos = this.categoria[i]['poligonos'];
        for (let x = 0; x < poligonos.length; x++) {
          this.categoria[i]['poligonos'][x]['status'] = event.checked;
          const element = poligonos[x];
          const eventMap = element.eventMap;
          eventMap.setMap(null);
        }
      }
    }
  }

  changePoligono(event: MatCheckboxChange, i: number, x: number) {
    const eventMap = this.categoria[i]['poligonos'][x]['eventMap'];
    if (event.checked) {
      eventMap.setMap(this.mapReady);
    } else {
      eventMap.setMap(null);
    }
  }

  createPoligonos(index: number) {

    const that = this;

    if (index >= 0) {

      const poligonos = this.categoria[index]['poligonos'];
      const category = this.categoria[index];

      for (let i = 0; i < poligonos.length; i++) {

        const figura = poligonos[i];
        // console.log(figura);
        const type = figura.type;
        const coords = JSON.parse(figura.coordinates);
        let polygon: any;
        // console.log(coords);
        // console.log(typeof coords);

        switch (type) {
          case 1:
            polygon = new google.maps.Polygon({
              paths: coords,
              strokeColor: category.strokeColor,
              strokeOpacity: 0.8,
              strokeWeight: 1,
              fillColor: category.fillColor,
              fillOpacity: 0.35
            });
            break;
          case 2:
            polygon = new google.maps.Circle({
              center: coords.center,
              radius: coords.radius,
              strokeColor: category.strokeColor,
              strokeOpacity: 0.8,
              strokeWeight: 1,
              fillColor: category.fillColor,
              fillOpacity: 0.35
            });
            break;
          case 3:
            polygon = new google.maps.Rectangle({
              bounds: coords,
              strokeColor: category.strokeColor,
              strokeOpacity: 0.8,
              strokeWeight: 1,
              fillColor: category.fillColor,
              fillOpacity: 0.35
            });
          break;
        }

        polygon.setMap(this.mapReady);

        this.categoria[index]['poligonos'][i]['eventMap'] = polygon;

        const id = 'id' + Math.random().toString(16).slice(2);
        const infobutton = new google.maps.InfoWindow({});
        const clickinfobutton = new google.maps.InfoWindow({});

        google.maps.event.addListener(polygon, 'click', (event: any) => {
          clickinfobutton.setContent('<div align="center"><b>' + figura.name + '</b><br>' + figura.description + '</div>');
          clickinfobutton.setPosition(event.latLng);
          clickinfobutton.open(that.mapReady);
        });

        if (this.identity.role >= 7) {
          google.maps.event.addListener(polygon, 'rightclick', (event: any) => {

            infobutton.setContent('<div align="center"><b>Acciones</b><br><div id="infocontent_' + id + '" style="display: grid;"></div></div>');
            infobutton.setPosition(event.latLng);
            infobutton.open(that.mapReady);

            const btn_edit = document.createElement('input');
            btn_edit.setAttribute('type', 'button');
            btn_edit.setAttribute('value', 'Editar');
            btn_edit.setAttribute('id', 'edit_' + id);
            btn_edit.setAttribute('class', 'btn btn-light');

            const btn_save = document.createElement('input');
            btn_save.setAttribute('type', 'button');
            btn_save.setAttribute('value', 'Guardar');
            btn_save.setAttribute('id', 'save_' + id);
            btn_save.setAttribute('class', 'btn btn-success');

            const btn_delete = document.createElement('input');
            btn_delete.setAttribute('type', 'button');
            btn_delete.setAttribute('value', 'Borrar');
            btn_delete.setAttribute('id', 'delete_' + id);
            btn_delete.setAttribute('class', 'btn btn-danger');

            /**btn_save.onclick = function(e: any) {
              console.log(e);
              const polygon = newshape.getPath().getArray();
              coordinates = [];
              for (let i = 0; i < polygon.length; i++) {
                coordinates.push({
                  lat: polygon[i].lat(),
                  lng: polygon[i].lng()
                });
              }
              console.log('newcoordinates', coordinates);
              that.saveShape({coordinates: coordinates, project: that.project_id});
            };*/

            google.maps.event.addListener(infobutton, 'domready', function() {

              $('#infocontent_' + id).empty().append(btn_edit, btn_save, btn_delete);

              google.maps.event.addDomListener(btn_edit, 'click', function() {
                polygon.setEditable(!polygon.getEditable());
                polygon.setDraggable(!polygon.getDraggable());
              });

              google.maps.event.addDomListener(btn_save, 'click', function() {
                /**
                const polygon_ = polygon.getPath().getArray();
                const coordinates = [];
                for (let x = 0; x < polygon_.length; x++) {
                  coordinates.push({
                    lat: polygon_[x].lat(),
                    lng: polygon_[x].lng()
                  });
                }
                poligonos.coordinates = coordinates;*/
                const arratPo = that.categoria[index]['poligonos'][i];

                let coordinates: any;
                switch (arratPo.type) {
                  case 1:
                    const poligon_: any = that.categoria[index]['poligonos'][i]['eventMap'];
                    const rectangleArray = poligon_.getPath().getArray();
                    const newarry = [];
                    for (let ii = 0; ii < rectangleArray.length; ii++) {
                      newarry.push({
                        lat: rectangleArray[ii].lat(),
                        lng: rectangleArray[ii].lng()
                      });
                    }
                    coordinates = newarry;
                    break;
                  case 2:
                    const circle: any = that.categoria[index]['poligonos'][i]['eventMap'];
                    const center = circle.getCenter();
                    const radius = circle.getRadius();
                    coordinates = { center: { lat: center.lat(), lng: center.lng() }, radius: radius };
                    break;
                  case 3:
                    const rectangle: any = that.categoria[index]['poligonos'][i]['eventMap'];
                    const bounds = rectangle.getBounds();
                    const SW = bounds.getSouthWest();
                    const NE = bounds.getNorthEast();
                    coordinates = { north: NE.lat(), south: SW.lat(), east: NE.lng(), west: SW.lng()};
                    break;
                }

                arratPo.coordinates = coordinates;
                arratPo.service_id = that.id;
                // console.log(arratPo);

                const dialogRef = that.dialog.open(EditshapeComponent, {
                  width: '677px',
                  disableClose: true,
                  data: arratPo
                });

                dialogRef.afterClosed().subscribe(result => {
                  if (result) {
                    const arrayPo = that.categoria[index]['poligonos'][i];
                    arrayPo.name = result.name;
                    arrayPo.description = result.description;
                    arrayPo.id_categoria = result.id_categoria;
                    arrayPo.coordinates = result.coordinates;
                    that.categoria[index]['poligonos'][i] = arrayPo;
                    clickinfobutton.setMap(null);
                    clickinfobutton.setContent('<div align="center"><b>' + result.name + '</b><br>' + result.description + '</div>');
                    clickinfobutton.setPosition(event.latLng);
                    clickinfobutton.open(that.mapReady);
                  }
                });
              });

              google.maps.event.addDomListener(btn_delete, 'click',  function() {
                Swal.fire({
                  title: '¿Esta seguro?',
                  text: 'Esta acción es permanente. ¿Seguro de que quieres eliminar la figura?',
                  showCancelButton: true,
                  confirmButtonText: 'Si',
                  cancelButtonText: 'No'
                })
                .then( async borrar => {
                  if (borrar.value) {
                    if (borrar) {
                      // this.isLoading = true;
                      const deleteform: any = await that._customForm.deleteMapFigura(that.token.token, category.id, figura.id);
                      if (deleteform && deleteform.status === 'success') {
                        // this.getAtributo(this.servicetype);
                        that.toasterService.success('Figura eliminada exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
                        const arratPo = that.categoria[index]['poligonos'];
                        if (arratPo.length === 1) {
                          that.categoria[index]['poligonos'] = [];
                        } else {
                          that.categoria[index]['poligonos'] = arratPo.splice(i, 1);
                        }
                        // this.isLoading = false;
                        polygon.setMap(null);
                        infobutton.setMap(null);
                        clickinfobutton.setMap(null);
                      } else {
                        // this.isLoading = false;
                        Swal.fire('Importante', 'A ocurrido un error en la eliminación de la figura', 'error');
                      }
                    }
                  }
                });
              });
            });
          });
        }
      }
    }
  }

  createPoligonoInsert(index: number, id_poligono: number) {

    const that = this;

    if (index >= 0) {
      // console.log('PASOOOO insert: ', id_poligono);
      const poligonos = this.categoria[index]['poligonos'];
      const category = this.categoria[index];

      for (let i = 0; i < poligonos.length; i++) {

        // console.log('PASOOOO insert For OBJ: ', poligonos[i]);
        if (poligonos[i]['id'] === id_poligono) {

          // console.log('PASOOOO for: ', poligonos[i]['id']);
          const figura = poligonos[i];
          // console.log(figura);
          const type = figura.type;
          const coords = JSON.parse(figura.coordinates);
          let polygon: any;
          // console.log(coords);
          // console.log(typeof coords);

          switch (type) {
            case 1:
              polygon = new google.maps.Polygon({
                paths: coords,
                strokeColor: category.strokeColor,
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: category.fillColor,
                fillOpacity: 0.35
              });
              break;
            case 2:
              polygon = new google.maps.Circle({
                center: coords.center,
                radius: coords.radius,
                strokeColor: category.strokeColor,
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: category.fillColor,
                fillOpacity: 0.35
              });
              break;
            case 3:
              polygon = new google.maps.Rectangle({
                bounds: coords,
                strokeColor: category.strokeColor,
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: category.fillColor,
                fillOpacity: 0.35
              });
            break;
          }

          polygon.setMap(this.mapReady);

          this.categoria[index]['poligonos'][i]['eventMap'] = polygon;

          const id = 'id' + Math.random().toString(16).slice(2);
          const infobutton = new google.maps.InfoWindow({});
          const clickinfobutton = new google.maps.InfoWindow({});

          google.maps.event.addListener(polygon, 'click', (event: any) => {
            clickinfobutton.setContent('<div align="center"><b>' + figura.name + '</b><br>' + figura.description + '</div>');
            clickinfobutton.setPosition(event.latLng);
            clickinfobutton.open(that.mapReady);
          });

          google.maps.event.addListener(polygon, 'rightclick', (event: any) => {

            infobutton.setContent('<div align="center"><b>Acciones</b><br><div id="infocontent_' + id + '" style="display: grid;"></div></div>');
            infobutton.setPosition(event.latLng);
            infobutton.open(that.mapReady);

            const btn_edit = document.createElement('input');
            btn_edit.setAttribute('type', 'button');
            btn_edit.setAttribute('value', 'Editar');
            btn_edit.setAttribute('id', 'edit_' + id);
            btn_edit.setAttribute('class', 'btn btn-light');

            const btn_save = document.createElement('input');
            btn_save.setAttribute('type', 'button');
            btn_save.setAttribute('value', 'Guardar');
            btn_save.setAttribute('id', 'save_' + id);
            btn_save.setAttribute('class', 'btn btn-success');

            const btn_delete = document.createElement('input');
            btn_delete.setAttribute('type', 'button');
            btn_delete.setAttribute('value', 'Borrar');
            btn_delete.setAttribute('id', 'delete_' + id);
            btn_delete.setAttribute('class', 'btn btn-danger');

            /**btn_save.onclick = function(e: any) {
              console.log(e);
              const polygon = newshape.getPath().getArray();
              coordinates = [];
              for (let i = 0; i < polygon.length; i++) {
                coordinates.push({
                  lat: polygon[i].lat(),
                  lng: polygon[i].lng()
                });
              }
              console.log('newcoordinates', coordinates);
              that.saveShape({coordinates: coordinates, project: that.project_id});
            };*/

            google.maps.event.addListener(infobutton, 'domready', function() {

              $('#infocontent_' + id).empty().append(btn_edit, btn_save, btn_delete);

              google.maps.event.addDomListener(btn_edit, 'click', function() {
                polygon.setEditable(!polygon.getEditable());
                polygon.setDraggable(!polygon.getDraggable());
              });

              google.maps.event.addDomListener(btn_save, 'click', function() {
                /**
                const polygon_ = polygon.getPath().getArray();
                const coordinates = [];
                for (let x = 0; x < polygon_.length; x++) {
                  coordinates.push({
                    lat: polygon_[x].lat(),
                    lng: polygon_[x].lng()
                  });
                }
                poligonos.coordinates = coordinates;*/
                const arratPo = that.categoria[index]['poligonos'][i];

                let coordinates: any;
                switch (arratPo.type) {
                  case 1:
                    const poligon_: any = that.categoria[index]['poligonos'][i]['eventMap'];
                    const rectangleArray = poligon_.getPath().getArray();
                    const newarry = [];
                    for (let ii = 0; ii < rectangleArray.length; ii++) {
                      newarry.push({
                        lat: rectangleArray[ii].lat(),
                        lng: rectangleArray[ii].lng()
                      });
                    }
                    coordinates = newarry;
                    break;
                  case 2:
                    const circle: any = that.categoria[index]['poligonos'][i]['eventMap'];
                    const center = circle.getCenter();
                    const radius = circle.getRadius();
                    coordinates = { center: { lat: center.lat(), lng: center.lng() }, radius: radius };
                    break;
                  case 3:
                    const rectangle: any = that.categoria[index]['poligonos'][i]['eventMap'];
                    const bounds = rectangle.getBounds();
                    const SW = bounds.getSouthWest();
                    const NE = bounds.getNorthEast();
                    coordinates = { north: NE.lat(), south: SW.lat(), east: NE.lng(), west: SW.lng()};
                    break;
                }

                arratPo.coordinates = coordinates;
                arratPo.service_id = that.id;
                // console.log(arratPo);

                const dialogRef = that.dialog.open(EditshapeComponent, {
                  width: '677px',
                  disableClose: true,
                  data: arratPo
                });

                dialogRef.afterClosed().subscribe(result => {
                  if (result) {
                    const arrayPo = that.categoria[index]['poligonos'][i];
                    arrayPo.name = result.name;
                    arrayPo.description = result.description;
                    arrayPo.id_categoria = result.id_categoria;
                    arrayPo.coordinates = result.coordinates;
                    that.categoria[index]['poligonos'][i] = arrayPo;
                    clickinfobutton.setMap(null);
                    clickinfobutton.setContent('<div align="center"><b>' + result.name + '</b><br>' + result.description + '</div>');
                    clickinfobutton.setPosition(event.latLng);
                    clickinfobutton.open(that.mapReady);
                  }
                });
              });

              google.maps.event.addDomListener(btn_delete, 'click',  function() {
                Swal.fire({
                  title: '¿Esta seguro?',
                  text: 'Esta acción es permanente. ¿Seguro de que quieres eliminar la figura?',
                  showCancelButton: true,
                  confirmButtonText: 'Si',
                  cancelButtonText: 'No'
                })
                .then( async borrar => {
                  if (borrar.value) {
                    if (borrar) {
                      // this.isLoading = true;
                      const deleteform: any = await that._customForm.deleteMapFigura(that.token.token, category.id, figura.id);
                      if (deleteform && deleteform.status === 'success') {
                        // this.getAtributo(this.servicetype);
                        that.toasterService.success('Figura eliminada exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
                        const arratPo = that.categoria[index]['poligonos'];
                        if (arratPo.length === 1) {
                          that.categoria[index]['poligonos'] = [];
                        } else {
                          that.categoria[index]['poligonos'] = arratPo.splice(i, 1);
                        }
                        // this.isLoading = false;
                        polygon.setMap(null);
                        infobutton.setMap(null);
                        clickinfobutton.setMap(null);
                      } else {
                        // this.isLoading = false;
                        Swal.fire('Importante', 'A ocurrido un error en la eliminación de la figura', 'error');
                      }
                    }
                  }
                });
              });
            });
          });
          break;
        }
      }
    }
  }

  onMapReady(map: any) {
    this.mapReady = map;
    if (this.identity.role >= 7) {
      this.initDrawingManager(map);
    }
  }

  initDrawingManager(map: any) {

    const that: any = this;
    const options = {
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes:  ['polygon', 'circle', 'rectangle']
      },
      polygonOptions: {
        fillColor: '#0B3356',
        fillOpacity: 0.25,
        strokeColor: '#0B3356',
        strokeOpacity: 0.8,
      },
      circleOptions: {
        fillColor: '#0B3356',
        fillOpacity: 0.25,
        strokeColor: '#0B3356',
        strokeOpacity: 0.8,
      },
      rectangleOptions: {
        fillColor: '#0B3356',
        fillOpacity: 0.25,
        strokeColor: '#0B3356',
        strokeOpacity: 0.8,
      }
    };

    this.drawingManager = new google.maps.drawing.DrawingManager(options);
    this.drawingManager.setMap(map);

    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (polygon_e: any) => {

      const newshape: any = polygon_e.overlay;
      let type = 0;

      if (polygon_e.type === google.maps.drawing.OverlayType.RECTANGLE ||
        polygon_e.type === google.maps.drawing.OverlayType.CIRCLE ||
        polygon_e.type === google.maps.drawing.OverlayType.POLYGON) {

        switch (polygon_e.type) {
          case google.maps.drawing.OverlayType.POLYGON:
            if (newshape.getPath().getArray().length < 3) {
              newshape.setMap(null);
              this.toasterService.warning('Error: Se debe seleccionar al menos 3 puntos', 'Error', {enableHtml: true, closeButton: true, timeOut: 6000 });
              return;
            }
            type = 1;
            break;
          case google.maps.drawing.OverlayType.CIRCLE:
            type = 2;
            break;
          case google.maps.drawing.OverlayType.RECTANGLE:
            type = 3;
            break;
          default:
            this.toasterService.warning('Error: Al crear la figura', 'Error', {enableHtml: true, closeButton: true, timeOut: 6000 });
            break;
        }

        const id = 'id' + Math.random().toString(16).slice(2);
        const infobutton = new google.maps.InfoWindow({});

        google.maps.event.addListener(newshape, 'rightclick', (event: any) => {

          infobutton.setContent('<div align="center"><b>Acciones</b><br><div id="infocontent_' + id + '" style="display: grid;"></div></div>');
          infobutton.setPosition(event.latLng);
          infobutton.open(map);

          const btn_edit = document.createElement('input');
          btn_edit.setAttribute('type', 'button');
          btn_edit.setAttribute('value', 'Editar');
          btn_edit.setAttribute('id', 'edit_' + id);
          btn_edit.setAttribute('class', 'btn btn-light');

          const btn_save = document.createElement('input');
          btn_save.setAttribute('type', 'button');
          btn_save.setAttribute('value', 'Guardar');
          btn_save.setAttribute('id', 'save_' + id);
          btn_save.setAttribute('class', 'btn btn-success');

          const btn_delete = document.createElement('input');
          btn_delete.setAttribute('type', 'button');
          btn_delete.setAttribute('value', 'Borrar');
          btn_delete.setAttribute('id', 'delete_' + id);
          btn_delete.setAttribute('class', 'btn btn-danger');

          google.maps.event.addListener(infobutton, 'domready', function() {

            $('#infocontent_' + id).empty().append(btn_edit, btn_save, btn_delete);

            google.maps.event.addDomListener(btn_edit, 'click', function() {
              newshape.setEditable(!newshape.getEditable());
              newshape.setDraggable(!newshape.getDraggable());
            });

            google.maps.event.addDomListener(btn_save, 'click', function() {

              let coordinates: any;
              switch (polygon_e.type) {
                case google.maps.drawing.OverlayType.POLYGON:
                  const rectangle: any = polygon_e.overlay;
                  const rectangleArray = rectangle.getPath().getArray();
                  const newarry = [];
                  for (let i = 0; i < rectangleArray.length; i++) {
                    newarry.push({
                      lat: rectangleArray[i].lat(),
                      lng: rectangleArray[i].lng()
                    });
                  }
                  coordinates = newarry;
                  break;
                case google.maps.drawing.OverlayType.CIRCLE:
                  const circle: any = polygon_e.overlay;
                  const center = circle.getCenter();
                  const radius = circle.getRadius();
                  coordinates = { center: { lat: center.lat(), lng: center.lng() }, radius: radius };
                  break;
                case google.maps.drawing.OverlayType.RECTANGLE:
                  const polygon: any = polygon_e.overlay;
                  const bounds = polygon.getBounds();
                  const SW = bounds.getSouthWest();
                  const NE = bounds.getNorthEast();
                  coordinates = { north: NE.lat(), south: SW.lat(), east: NE.lng(), west: SW.lng()};
                  break;
              }

              // that.saveShape({coordinates: coordinates, service_id: that.id, type: type });

              const dialogRef = that.dialog.open(NewshapeComponent, {
                width: '677px',
                disableClose: true,
                data: {coordinates: coordinates, service_id: that.id, type: type }
              });
              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  if (that.categoria.length > 0) {
                    for (let x = 0; x < that.categoria.length; x++) {
                      const categoria_ = that.categoria[x];
                      if (categoria_.id === result.id_categoria) {
                        newshape.setMap(null);
                        infobutton.setMap(null);
                        // console.log('PASOOOO');
                        if (that.categoria[x]['poligonos']) {
                          // console.log('PASOOOO 111');
                          const poligonos = that.categoria[x]['poligonos'];
                          poligonos.push(result);
                          that.categoria[x]['poligonos'] = poligonos;
                          that.createPoligonoInsert(x, result.id);
                        } else {
                          // console.log('PASOOOO 2222');
                          that.categoria[x]['poligonos'] = [result];
                          that.createPoligonoInsert(x, result.id);
                        }
                        break;
                      }
                    }
                  } else {
                    newshape.setMap(null);
                    infobutton.setMap(null);
                    that.getCategory();
                  }
                }
              });

            });

            google.maps.event.addDomListener(btn_delete, 'click',  function() {
              newshape.setMap(null);
              infobutton.setMap(null);
            });

          });

        });

        /**
        newshape.addListener('click', (event: any) => {
          console.log('click', event);
        });
        newshape.addListener('bounds_changed', (event: any) => {
          console.log('bounds_changed', event);
        });
        newshape.getPath().addListener('set_at', (event: any) => {
          if (!isBeingDragged) {
            console.log('set_at', event);
            const polygon = newshape.getPath().getArray();
            coordinates = [];
            for (let i = 0; i < polygon.length; i++) {
              coordinates.push({
                lat: polygon[i].lat(),
                lng: polygon[i].lng()
              });
            }
            console.log('newcoordinates', coordinates);
          }
        });
        newshape.getPath().addListener('insert_at', (event: any) => {
          if (!isBeingDragged) {
            console.log('insert_at', event);
            const polygon = newshape.getPath().getArray();
            coordinates = [];
            for (let i = 0; i < polygon.length; i++) {
              coordinates.push({
                lat: polygon[i].lat(),
                lng: polygon[i].lng()
              });
            }
            console.log('newcoordinates', coordinates);
          }
        }); */
      }
    });
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.mylatitude = position.coords.latitude;
        this.mylongitude = position.coords.longitude;
        // this.zoom = 15;
        this.getAddress(this.mylatitude, this.mylongitude);
      });
    }
  }

  markerDragEnd($event: MouseEvent) {
    this.mylatitude = $event.coords.lat;
    this.mylongitude = $event.coords.lng;
    this.getAddress(this.mylatitude, this.mylongitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.myaddress = results[0].formatted_address;
          this.latitude = latitude;
          this.longitude = longitude;
          this.zoom = 17;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
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
    this.userequipomarcadores = [];
    this.wayspoints = [];
    this.datadirections.origin = '';
    this.datadirections.destination = '';
    this.selectedColumnnOrdenes.fieldValue = '';
    this.selectedColumnnEstatus.fieldValue = '';
    this.selectedColumnnAdvance.fieldValue = '';
    this.selectedColumnEquipos.fieldValue = '';
    this.selectedColumnnDate.columnValueDesde = '';
    this.message = '';
    this.userCtrl.reset();
    this.ordenesCtrl.reset();
    this.equiposCtrl.reset();
    this.userAdvanceCtrl.reset();
    // this.userMultiFilterCtrl.reset();
    // this.ordenesFilterCtrl.reset();
    this.loadInfo();
    this.loadServiceEstatus();
    this.loadusergeoreference(this.project_id);
    this.categoria = [];
    this.getCategory();
  }

  reset() {
    this.userCtrl.reset();
    this.ordenesCtrl.reset();
    this.equiposCtrl.reset();
    this.userAdvanceCtrl.reset();
    // this.userMultiFilterCtrl.reset();
    // this.ordenesFilterCtrl.reset();
    this.selectedColumnnOrdenes.fieldValue = '';
    this.selectedColumnnEstatus.fieldValue = '';
    this.selectedColumnnAdvance.fieldValue = '';
    this.selectedColumnEquipos.fieldValue = '';
    this.selectedColumnnDate.columnValueDesde = '';
  }

  private filterUsersOrdenes() {
    if (!this.user) {
      return;
    }
    // get the search keyword
    let search = this.ordenesFilterCtrl.value;
    if (!search) {
      this.filteredUserOrdenes.next(this.user.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredUserOrdenes.next(
      this.user.filter(user => user.name.toLowerCase().indexOf(search) > -1)
    );
  }


  private filteredUserTeam() {
    if (!this.equipos) {
      return;
    }
    // get the search keyword
    let search = this.ordenesFilterCtrl.value;
    if (!search) {
      this.filteredEquipos.next(this.equipos.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredEquipos.next(
      this.equipos.filter(team => team.descripcion.toLowerCase().indexOf(search) > -1)
    );
  }

  private filterUsers() {
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

  public loadInfo() {
    this.isLoadingResults = true;
    this._dataService.getService(this.token.token, this.id).subscribe(
                response => {
                   if (response.status === 'success') {
                     this.project_id = Number (response.datos.project.id);
                     this.country_id = Number (response.datos.project.country_id);
                     this.servicename = String (response.datos.service_name);
                     this.ServicioSeleccionado.emit(this.servicename);
                     this.loadregion(this.country_id);
                     this.loadproject(this.project_id);
                     this.loaduser(this.project_id);
                     this.loadusergeoreference(this.project_id);
                     this.getEquipos(this.project_id);
                     this.isLoadingResults = false;
                    } else {
                     this.country_id = 0;
                     this.isLoadingResults = false;
                     }
                    },
                    (error) => {
                      this.isLoadingResults = false;
                      this._userService.logout();
                      console.log(<any>error);
                    }

                    );

  }// END IF

  async loadregion(countryid: number) {

    const data = await this._userService.getRegion();

    if (data && countryid > 0) {
      this.latitude = Number (data.datos.latitud);
      this.longitude = Number (data.datos.longitud);
      this.titulo = data.datos.company_name;
      this.subtitulo = data.datos.company_footer;
      this.direccion = data.datos.company_footer;
      this.create_at = '';
      this.update_at = '';
      this.create_by = '';
      this.update_by = '';
      this.estatus = '';
      this.label = 0;
      this.icon = 'https://img.icons8.com/color/25/000000/google-home.png';
      const nuevoMarcador = new Marcador(this.latitude, this.longitude, this.titulo, this.subtitulo, this.label, this.icon, this.direccion, this.create_at, this.update_at, this.create_by, this.update_by, this.estatus);
      this.homemarcador.push(nuevoMarcador);

      this.renderMap = true;

      /*
        this._regionService.getRegion(this.token.token, countryid).subscribe(
                response => {
                   if(response.status === 'success') {
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
                    // this.icon = 'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png'
                    // this.icon = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
                    this.icon = 'https://img.icons8.com/color/25/000000/google-home.png';
                    // this.lat = response.datos.latitud;
                    // this.lng = response.datos.longitud;
                    const nuevoMarcador = new Marcador(this.latitude, this.longitude, this.titulo, this.subtitulo, this.label, this.icon, this.direccion, this.create_at, this.update_at, this.create_by, this.update_by, this.estatus);
                    this.homemarcador.push(nuevoMarcador);

                    this.renderMap = true;
                    } else {
                      this.lat = 0;
                      this.lng = 0;
                         }
                    },
                      error => {
                      this._userService.logout();
                      // this._router.navigate(["/login"]);
                      console.log(<any>error);
                      }
                    );
      // console.log(this.homemarcador);*/

      } else {
        this.lat = 0;
        this.lng = 0;
      }
  }

  public loadproject(projectid: number) {
    this.termino = 0;
    this.date = 'day';
    this.status = 0;
    this.servicetype = 0;

    if (projectid > 0) {
        this._proyectoService.getProjectOrder(this.token.token, projectid, this.termino, this.date, this.status, this.id, this.servicetype).then(
          (res: any) => {
            res.subscribe(
              (some) => {
                if (some.datos) {
                  this.ordenes = some.datos;
                  for (let i = 0; i < this.ordenes.length; i++) {
                    if (this.ordenes[i]['latitud'] && this.ordenes[i]['longitud']) {
                      this.titulo = String('N.Cliente: ' + this.ordenes[i]['cc_number']);
                      this.subtitulo = String('N.Orden: ' + this.ordenes[i]['order_number']);
                      this.latitude = Number (this.ordenes[i]['latitud']);
                      this.longitude = Number (this.ordenes[i]['longitud']);
                      this.direccion = String('Dirección: ' + this.ordenes[i]['direccion']);
                      this.create_at = String('Creado el: ' + this.ordenes[i]['create_at']);
                      this.update_at = String('Editado el: ' + this.ordenes[i]['update_at']);
                      this.estatus = String('Estatus: ' + this.ordenes[i]['estatus']);
                      this.create_by = String('Creado por: ' + this.ordenes[i]['user']);
                      this.update_by = String('Editado por: ' + this.ordenes[i]['userupdate']);
                      // this.label = String(i);
                      this.label = 0;
                      if (this.ordenes[i]['estatus'] === 'Atendido') {
                        this.icon = './assets/img/marker-green.png';
                        // this.icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
                      } else {
                         this.icon = './assets/img/marker-red.png';
                        // this.icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
                      }

                      const nuevoMarcador = new Marcador(this.latitude, this.longitude, this.titulo, this.subtitulo, this.label, this.icon, this.direccion, this.create_at, this.update_at, this.create_by, this.update_by, this.estatus);
                      this.marcadores.push(nuevoMarcador);
                    }

                  }
                } else {
                }
              },
              (_error) => {
              this.marcadores = [];
              // console.log(<any>error);
              }
              );
        });
    }// END MAIN IF
  }

  public loadServiceEstatus() {
    this._dataService.getServiceEstatus(this.token.token, this.id).subscribe(
    response => {
              if (!response) {
                return;
              }
              if (response.status === 'success') {
                this.serviceestatus = response.datos;
              }
            });
  }

  public loadusergeoreference(projectid: number) {
    this.termino = 0;
    this.date = 'day';
    this.status = 0;
    this.servicetype = 0;

    if (projectid > 0) {
        this._proyectoService.getProjectUserGeoreference(this.token.token, projectid).then(
          (res: any) => {
            res.subscribe(
              (some) => {
                if (some.datos) {
                  this.usuarios = some.datos;
                  // console.log(this.usuarios);
                  for (let i = 0; i < this.usuarios.length; i++) {
                    if (this.usuarios[i]['latitud'] && this.usuarios[i]['longitud']) {
                      this.titulo = String('Ubicación');
                      this.subtitulo = String(this.usuarios[i]['role'] + ': ' + this.usuarios[i]['usuario']);
                      this.latitude = Number (this.usuarios[i]['latitud']);
                      this.longitude = Number (this.usuarios[i]['longitud']);
                      this.direccion = String('Dirección: ' + this.usuarios[i]['direccion']);
                      this.create_at = String('Creado el: ' + this.usuarios[i]['create_at']);
                      this.update_at = String('Editado el: ' + this.usuarios[i]['update_at']);
                      this.estatus = String('Estatus: ' + this.usuarios[i]['estatus']);
                      this.create_by = '';
                      this.update_by = '';
                      // this.label = String(i);
                      this.label = 0;
                      this.icon = './assets/img/' + this.usuarios[i]['role_id'] + '.png';
                      // this.icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
                      const userMarcador = new Marcador(this.latitude, this.longitude, this.titulo, this.subtitulo, this.label, this.icon, this.direccion, this.create_at, this.update_at, this.create_by, this.update_by, this.estatus);
                      this.usermarcadores.push(userMarcador);
                    }
                  }
                } else {
                }
              },
              (_error) => {
              this.usermarcadores = [];
              // console.log(<any>error);
              }
              );
        });
    }// END MAIN IF PROJECT
  }

  public loaduser(projectid: number) {
    if (projectid > 0) {
        this._proyectoService.getProjectUser(this.token.token, projectid, this.role).then(
          (res: any) => {
            res.subscribe(
              (some) => {
                if (some.datos) {
                  this.users = some.datos;
                  // console.log(this.users);
                  for (let i = 0; i < this.users.length; i++) {
                    const userid = this.users[i]['id'];
                    const username = this.users[i]['usuario'];
                    this.user[i] = { name: username, id: userid };
                  }
                  this.filteredUserMulti.next(this.user.slice());
                  this.filteredUserOrdenes.next(this.user.slice());
                  this.filteredUserAdvanceMulti.next(this.user.slice());
                } else {
                }
              },
              (_error) => {
              this.users = [];
              }
              );
        });
    }
  }

  public loadusertracking(projectid: number, userid: number) {
    if (projectid > 0 && userid > 0 ) {
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
      var newtimefrom = '';
      var newtimeuntil = '';

        this._proyectoService.gettUserGeoreference(this.token.token, userid, this.selectedColumnnDate.columnValueDesde, newtimefrom, newtimeuntil).then(
          (res: any) => {
            res.subscribe(
              (some) => {
                if (some.datos) {
                  this.usuariostracking = some.datos;
                  let j: any;
                  if (this.usuariostracking.length > 0) {
                    j = Number(this.usuariostracking.length);
                  }
                  // console.log(this.usuariostracking.length);
                  for (let i = 0; i < this.usuariostracking.length; i++) {
                    if (this.usuariostracking[i]['latitud'] && this.usuariostracking[i]['longitud']){
                      this.titulo = String('Ubicación');
                      this.subtitulo = String('Usuario: ' + this.usuariostracking[i]['usuario']);
                      this.latitude = Number (this.usuariostracking[i]['latitud']);
                      this.longitude = Number (this.usuariostracking[i]['longitud']);
                      this.direccion = String('Dirección: ' + this.usuariostracking[i]['direccion']);
                      this.create_at = String('Creado el: ' + this.usuariostracking[i]['create_at']);
                      // this.icon = './assets/img/marker-blue-tod.png';
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
                  // this.directions(this.usertrackingmarcadores);
                  // console.log(this.usertrackingmarcadores);
                } else {
                  this.isLoadingResults = false;
                  this.renderMap = true;
                  this.message = 'error';
                }
              },
              (_error) => {
              this.usertrackingmarcadores = [];
              this.isLoadingResults = false;
              this.renderMap = true;
              this.message = 'error';
              }
              );
          });
        }
    }

  public directions(data: Marcador[]) {
    let banderafirst = false;
    let banderalast = false;
    this.directionsmarcadores = data;
    if (this.directionsmarcadores.length > 0) {
    const lastinsert = this.directionsmarcadores.length - 1;
    var j = Number(this.directionsmarcadores.length - 1);
    // var x = Number(this.usuariostracking.length);
      for (let i = 0; i < this.directionsmarcadores.length; i++) {
        if (this.directionsmarcadores[i].lat && this.directionsmarcadores[i].lng && !banderalast && lastinsert == i){
          this.datadirections.destination = this.directionsmarcadores[i].lat +','+ this.directionsmarcadores[i].lng;
          banderalast = true;
          break;
        }

        if (banderafirst) {
           this.wayspoints.push(
          {
              location: { lat: this.directionsmarcadores[j].lat, lng: this.directionsmarcadores[j].lng }
          });

          this.markerOptions.waypoints.push({icon: 'https://i.imgur.com/7teZKif.png', infoWindow: `
        <h4>Hello<h4>
        `});
          /*GOOGLE API
          if(i==1){
            this.datadirections.waypoints = this.directionsmarcadores[i].lat +','+ this.directionsmarcadores[i].lng ;
          }else{
            this.datadirections.waypoints = this.datadirections.waypoints + '|' + this.directionsmarcadores[i].lat +','+ this.directionsmarcadores[i].lng ;
          }*/

        }

        if (this.directionsmarcadores[i].lat && this.directionsmarcadores[i].lng && !banderafirst) {
          this.datadirections.origin = this.directionsmarcadores[i].lat +','+ this.directionsmarcadores[i].lng;
          banderafirst = true;
        }
        j = j - 1;

      }
      if (this.datadirections) {
        // console.log(this.markerOptions);
        // console.log(this.datadirections);
        // console.log(this.wayspoints);
        // this.GoogleApi(this.datadirections);
      }
    }
  }

  getEquipos(id) {
    this.dataService.getEquipos(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.equipos = some['datos'];
            this.filteredEquipos.next(this.equipos.slice());
          },
          (error) => {
            console.log(<any>error);
          }
        );
      }
    );
  }

  opencategoria() {
    this.dialog.open(ListMapCategoryComponent, {
      width: '777px',
      disableClose: true,
      data: {service_id: this.id}
    });
  }

  /**editShape(datos: any) {
    if (!datos) {
      return;
    }
    // console.log(JSON.stringify(datos));
    const dialogRef = this.dialog.open(EditshapeComponent, {
      width: '677px',
      disableClose: true,
      data: datos
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        console.log(result);
      }
    });
    this.cdf.detectChanges();
  }

  saveShape(datos: any) {
    if (!datos) {
      return;
    }
    console.log(JSON.stringify(datos));
    const dialogRef = this.dialog.open(NewshapeComponent, {
      width: '677px',
      disableClose: true,
      data: datos
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        console.log(result);
      }
    });
    this.cdf.detectChanges();
  }*/

  public GoogleApi(data: any) {
    if (data) {
      // console.log(data);
      this._mapaService.getDirections(this.token.token, data).subscribe(
      response => {
      if (!response) {
        return;
      }
      // console.log(response);
      },
          error => {
          console.log(<any>error);
          }
      );
    }
  }

  async loaduserequipos(projectid: number, teamid: number) {
    this.isLoadingResults = true;
    if (projectid > 0 && teamid > 0 ) {
      this.renderMap = false;
      this.marcadores = [];
      this.usermarcadores = [];
      this.userordenesmarcadores = [];
      this.userequipomarcadores = [];
      this.usertrackingadvancemarcadores = [];
      this.selectedColumnnEstatus.fieldValue = '';
      this.selectedColumnnDate.columnValueDesde = '';
      this.userAdvanceCtrl.reset();
      this.userAdvanceMultiFilterCtrl.reset();
      this.messageadvance = '';
      this.wayspoints = [];
      this.datadirections.origin = '';
      this.datadirections.destination = '';

      const response: any = await this._customForm.getTeamGeoreference(this.token.token, projectid, teamid);
      // console.log(response);
      if (response && response.status && response.status === 'success') {
        // console.log(response.datos);
        const usuarios: any = response.datos;
        for (let i = 0; i < usuarios.length; i++) {
          if (usuarios[i]['latitud'] && usuarios[i]['longitud']) {
            // console.log('PASOO ' + i);
            const titulo = String('Ubicación');
            const subtitulo = String(usuarios[i]['role'] + ': ' + usuarios[i]['usuario']);
            const latitude = Number (usuarios[i]['latitud']);
            const longitude = Number (usuarios[i]['longitud']);
            const direccion = String('Dirección: ' + usuarios[i]['direccion']);
            const create_at = String('Creado el: ' + usuarios[i]['create_at']);
            const update_at = '';
            const estatus = '';
            const create_by = '';
            const update_by = '';
            // this.label = String(i);
            const label = 0;
            const icon = './assets/img/' + usuarios[i]['role_id'] + '.png';
            // this.icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
            const userMarcador = new Marcador(latitude, longitude, titulo, subtitulo, label, icon, direccion, create_at, update_at, create_by, update_by, estatus);
            this.userequipomarcadores.push(userMarcador);
            this.cdf.detectChanges();
          }
        }
        this.isLoadingResults = false;
        this.renderMap = true;
        this.message = 'success';
      } else {
        this.userequipomarcadores = [];
        this.isLoadingResults = false;
        this.renderMap = true;
        this.message = 'error';
      }

    }
  }

  public loaduserordenes(projectid: number, userid: number) {
    this.isLoadingResults = true;
    if (projectid > 0 && userid > 0 ) {
      this.renderMap = false;
      this.marcadores = [];
      this.usermarcadores = [];
      this.userequipomarcadores = [];
      this.usertrackingadvancemarcadores = [];
      this.selectedColumnnEstatus.fieldValue = '';
      this.selectedColumnnDate.columnValueDesde = '';
      this.userAdvanceCtrl.reset();
      this.userAdvanceMultiFilterCtrl.reset();
      this.messageadvance = '';
      this.wayspoints = [];
      this.datadirections.origin = '';
      this.datadirections.destination = '';

      // this.usertrackingmarcadores = [];
      this.userordenesmarcadores = [];
        this._proyectoService.gettUserOrdenesGeoreference(this.token.token, projectid, userid).then(
          (res: any) => {
            res.subscribe(
              (some) => {
                if (some.datos) {
                  this.usuariosordenes = some.datos;
                  let j: any;
                  if (this.usuariosordenes.length > 0) {
                    j = Number(this.usuariosordenes.length);
                  }
                  // console.log(this.usuariostracking.length);
                  for (let i = 0; i < this.usuariosordenes.length; i++) {
                    if (this.usuariosordenes[i]['latitud'] && this.usuariosordenes[i]['longitud']) {
                      this.titulo = String('N.Cliente: ' + this.ordenes[i]['cc_number']);
                      this.subtitulo = String('N.Orden: ' + this.ordenes[i]['order_number']);
                      this.latitude = Number (this.usuariosordenes[i]['latitud']);
                      this.longitude = Number (this.usuariosordenes[i]['longitud']);
                      this.create_at = String('Creado el: ' + this.usuariosordenes[i]['create_at']);
                      this.update_at = String('Editado el: ' + this.usuariosordenes[i]['update_at']);
                      this.update_by = String('Editada por: ' + this.usuariosordenes[i]['usuario']);
                      this.estatus = String('Estatus: ' + this.usuariosordenes[i]['estatus']);
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
                  // console.log(this.usertrackingmarcadores);
                } else {
                  this.isLoadingResults = false;
                  this.renderMap = true;
                  this.message = 'error';
                }
              },
              (_error) => {
              this.userordenesmarcadores = [];
              this.isLoadingResults = false;
              this.renderMap = true;
              this.message = 'error';
              // console.log(<any>error);
              }
              );
          });
        }
  }

  public loadordenesestatus(projectid: number, statusid: number) {
    this.status = statusid;

    if (projectid > 0 && statusid > 0 ) {
    this.isLoadingResults = true;
    this.renderMap = false;
    this.marcadores = [];
    this.userequipomarcadores = [];
    this.usertrackingmarcadores = [];
    this.usertrackingadvancemarcadores = [];
    this.userordenesmarcadores = [];
    this.selectedColumnnOrdenes.fieldValue = '';
    this.selectedColumnEquipos.fieldValue = '';
    this.selectedColumnnDate.columnValueDesde = '';
    this.wayspoints = [];
    this.datadirections.origin = '';
    this.datadirections.destination = '';

    this.userAdvanceCtrl.reset();
    this.userAdvanceMultiFilterCtrl.reset();
    this.messageadvance = '';
    this.userCtrl.reset();
    this.ordenesCtrl.reset();
    this.equiposCtrl.reset();

      this._proyectoService.getProjectOrder(this.token.token, projectid, this.termino, this.date, this.status, this.id, this.servicetype).then(
        (res: any) => {
          res.subscribe(
            (some) => {
              if (some.datos) {
                this.ordenes = some.datos;
                for (let i = 0; i < this.ordenes.length; i++) {
                  if (this.ordenes[i]['latitud'] && this.ordenes[i]['longitud']) {
                    this.titulo = String('N.Cliente: ' + this.ordenes[i]['cc_number']);
                    this.subtitulo = String('N.Orden: ' + this.ordenes[i]['order_number']);
                    this.latitude = Number (this.ordenes[i]['latitud']);
                    this.longitude = Number (this.ordenes[i]['longitud']);
                    this.direccion = String('Dirección: ' + this.ordenes[i]['direccion']);
                    this.create_at = String('Creado el: ' + this.ordenes[i]['create_at']);
                    this.update_at = String('Editado el: ' + this.ordenes[i]['update_at']);
                    this.estatus = String('Estatus: ' + this.ordenes[i]['estatus']);
                    this.create_by = String('Creado por: ' + this.ordenes[i]['user']);
                    this.update_by = String('Editado por: ' + this.ordenes[i]['userupdate']);
                    // this.label = String(i);
                    this.label = 0;
                    if (this.ordenes[i]['estatus'] === 'Atendido') {
                      this.icon = './assets/img/marker-green.png';
                      // this.icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
                    } else {
                      this.icon =  './assets/img/marker-red.png';
                      // 'https://img.icons8.com/color/25/000000/marker.png';
                      // this.icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
                    }

                    const nuevoMarcador = new Marcador(this.latitude, this.longitude, this.titulo, this.subtitulo, this.label, this.icon, this.direccion, this.create_at, this.update_at, this.create_by, this.update_by, this.estatus);
                    this.marcadores.push(nuevoMarcador);
                  }
                }
                this.isLoadingResults = false;
                this.renderMap = true;
                this.message = 'success';
              } else {
                this.isLoadingResults = false;
                this.renderMap = true;
                this.message = 'error';
              }
            },
            (_error) => {
            this.marcadores = [];
            this.isLoadingResults = false;
            this.renderMap = true;
            this.message = 'error';
            }
            );
      });
    }// END MAIN IF

  }

  public loadusertrackingdate(projectid: number, userid: number) {

    if (projectid > 0 && userid > 0 ) {
      this.isLoadingResults = true;
      this.renderMap = false;
      this.marcadores = [];
      this.usermarcadores = [];
      this.usertrackingmarcadores = [];
      this.userordenesmarcadores = [];
      this.userequipomarcadores = [];
      this.usertrackingadvancemarcadores = [];
      this.wayspoints = [];
      this.selectedColumnnOrdenes.fieldValue = '';
      this.selectedColumnnEstatus.fieldValue = '';
      this.selectedColumnEquipos.fieldValue = '';
      this.datadirections.origin = '';
      this.datadirections.destination = '';
      this.message = '';
      this.userCtrl.reset();
      this.ordenesCtrl.reset();
      this.equiposCtrl.reset();
      this.userMultiFilterCtrl.reset();
      this.ordenesFilterCtrl.reset();

      if (this.selectedColumnnDate.columnValueDesde) {
        this.datedesde = new FormControl(moment(this.selectedColumnnDate.columnValueDesde).format('YYYY[-]MM[-]DD'));
        this.selectedColumnnDate.columnValueDesde = this.datedesde.value;
      } else {
        this.selectedColumnnDate.columnValueDesde = '';
      }

      // console.log(this.timefrom);
      // console.log(this.timeuntil);
      if (this.timefrom != null && this.timeuntil != null && this.timefrom.hour != null && this.timefrom.hour !== '' && this.timefrom.hour !== '00' && this.timefrom.hour !== '0'  && this.timeuntil.hour !== null && this.timeuntil.hour !== '' && this.timeuntil.hour !== '00' && this.timeuntil.hour !== '0') {
        const momenttimefrom = this.timefrom.hour +':'+ this.timefrom.minute + ':00';
        const momenttimeuntil  = this.timeuntil.hour +':'+ this.timeuntil.minute + ':00';
        this.columnTimeFromValue = new FormControl(moment(momenttimefrom, 'H:mm:ss').format('LTS'));
        this.columnTimeUntilValue = new FormControl(moment(momenttimeuntil, 'H:mm:ss').format('LTS'));
        var newtimefrom = moment(this.columnTimeFromValue.value, 'h:mm:ss A').format('HH:mm:ss');
        var newtimeuntil = moment(this.columnTimeUntilValue.value, 'h:mm:ss A').format('HH:mm:ss');
      } else {
        var newtimefrom = '';
        var newtimeuntil = '';
      }

        this._proyectoService.gettUserGeoreference(this.token.token, userid, this.selectedColumnnDate.columnValueDesde, newtimefrom, newtimeuntil).then(
          (res: any) => {
            res.subscribe(
              (some) => {
                if (some.datos) {
                  // console.log(some.datos);
                  this.usuariostracking = some.datos;
                  if (this.usuariostracking.length > 0) {
                  var j = Number(this.usuariostracking.length);
                  }
                  // console.log(this.usuariostracking.length);
                  for (let i = 0; i < this.usuariostracking.length; i++) {
                    if (this.usuariostracking[i]['latitud'] && this.usuariostracking[i]['longitud']) {
                      this.titulo = String('Ubicación');
                      this.subtitulo = String('Usuario: '+ this.usuariostracking[i]['usuario']);
                      this.latitude = Number (this.usuariostracking[i]['latitud']);
                      this.longitude = Number (this.usuariostracking[i]['longitud']);
                      this.create_at = String('Creado el: '+ this.usuariostracking[i]['create_at']);
                      this.icon = './assets/img/marker-blue-tod.png';
                      if (this.usuariostracking[i]['direccion']) {
                      this.direccion = String('Dirección: ' + this.usuariostracking[i]['direccion']);
                      } else {
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
                  // console.log(this.usertrackingadvancemarcadores);
                } else {
                  this.isLoadingResults = false;
                  this.renderMap = true;
                  this.messageadvance = 'error';
                }
              },
              (_error) => {
              this.usertrackingadvancemarcadores = [];
              this.isLoadingResults = false;
              this.renderMap = true;
              this.messageadvance = 'error';
              }
              );
          });
        }
  }

  public obtainInfowindow(window: InfoWindow) {
    this.infoWindow = window;
    // console.log(this.infoWindow);
  }

  public change(event: any) {
    this.wayspoints = event.request.waypoints;
    // console.log(this.wayspoints);
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
    this.ordenesCtrl.reset();
    this.equiposCtrl.reset();
    // this.userMultiFilterCtrl.reset();
    // this.ordenesFilterCtrl.reset();
  }

  toggleadvance() {
    this.showadvance = !this.showadvance;
    this.messageadvance = '';
    this.userAdvanceCtrl.reset();
  }

  resetUserFilters() {
    this.userCtrl.reset();
    this.ordenesCtrl.reset();
    this.equiposCtrl.reset();
    this.userMultiFilterCtrl.reset();
    this.ordenesFilterCtrl.reset();
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

    modalRef.componentInstance.id = this.id;
    // modalRef.componentInstance.title = 'About';
  }

}
