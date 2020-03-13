import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy, } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { Proyecto } from 'src/app/models/types';
import { CustomformService, UserService, SettingsService, KpiService, OrderserviceService } from 'src/app/services/service.index';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import clonedeep from 'lodash.clonedeep';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { NewelementComponent } from './newelement/newelement.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  styleUrls: ['./formulario.component.css']
})

export class FormularioComponent implements OnInit , OnDestroy {

  @ViewChild('sidenav', {static: false}) sidenav: any;
  @ViewChild('sidenavend', {static: false}) sidenavend: any;

  subscription: Subscription;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  project_id = 0;
  identity: any;
  project: any;
  token: any;
  proyectos: Array<Proyecto> = [];
  servicios: Array<any> = [];
  roles = [];
  sub: any;
  title = '';
  forma: FormGroup;
  element: HTMLElement;
  element2: HTMLElement;
  atributo = new Array();
  displayedColumns: string[] = ['position', 'type', 'descripcion', 'datos', 'required', 'rol'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  isLoadingAtributos = false;
  isLoadingSave = true;
  isLoadingMenu = true;
  isLoading = false;
  booaction = true;
  expandedRow: number;
  servicetype: any;
  countclick = 0;
  expandedElement: any | null;

  types = [
          {type: 'date', value: 'Fecha'},
          {type: 'datepicker', value: 'Fecha y hora'},
          {type: 'timepicker', value: 'Hora'},
          {type: 'spinner', value: 'Lista deplegable'},
          {type: 'layout_line', value: 'Salto de linea'},
          {type: 'radio', value: 'Seleción única'},
          {type: 'chip', value: 'Seleción multiple'},
          {type: 'text', value: 'Texto'},
          {type: 'textarea', value: 'Texto amplio'},
          {type: 'int', value: 'Texto numerico'},
          {type: 'double', value: 'Texto numerico con decimales'},
          {type: 'label', value: 'Título'}
        ];

  constructor(
    public kpiservice: KpiService,
    public _customForm: CustomformService,
    private _orderService: OrderserviceService,
    private _route: ActivatedRoute,
    public _userService: UserService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    public label: SettingsService,
    media: MediaMatcher,
    private _bottomSheet: MatBottomSheet,
    public toasterService: ToastrService,
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.cd.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();

    this.label.getDataRoute().subscribe(data => {
      this.title = data.subtitle;
    });

    this.isLoadingMenu = false;
    this.sub = this._route.params.subscribe(params => {
      this.project_id = +params['id'];
      if (this.project_id) {

        this.project = this.filter();
        this.servicios = this.project.service;
        this.isLoadingMenu = true;
        this.getRoleUser();

      }
      this.cd.markForCheck();
    });
  }

  getRoleUser() {
    // const role = 9;
    if (this.token.token) {
      this._userService.getRoleUser(this.token.token, this.identity.role).subscribe(
        response => {
          if (!response) {
            return false;
          }
            if (response.status === 'success') {
              this.roles = response.datos;
            }
        },
            error => {
            console.log(<any>error);
            }
        );
    }

  }

  getRol(id: number): String {
    if (id && id > 0) {
      for (let i = 0; i < this.roles.length; i++) {
        const rol: any = this.roles[i];
        if (rol.id && rol.id ===  id) {
          return rol.title;
        }
      }
    }
  }

  getType(value: String): String {
    if (value) {
      for (let i = 0; i < this.types.length; i++) {
        const type: any = this.types[i];
        if (type.type === value) {
          return type.value;
        }
      }
    }
  }

  filter() {
    if (this.proyectos && this.project_id) {
      for (let i = 0; i < this.proyectos.length; i += 1) {
        const result = this.proyectos[i];
        if (result.id === this.project_id) {
            return result;
        }
      }
    }
  }

  checkedvalue(value: number): boolean {
    if (value === 1) {
      return true;
    } else {
      return false;
    }
  }

  changetype(row: any) {

    if (row.type === 'layout_line') {
      row.descripcion = 'linear';
      row.required = 0;
    } else {
      row.descripcion = '';
    }

    if (row.type === 'label') {
      row.required = 0;
    }

    if (row.type === 'spinner' || row.type === 'radio' || row.type === 'chip') {
        row.datos = [];
    } else {
      row.datos = '';
    }

  }

  changetypeform(type: any) {

    if (type !== 'layout_line') {
      this.forma.controls['descripcion'].setValue(null);
      this.forma.controls['descripcion'].enable();
      this.forma.controls['descripcion'].updateValueAndValidity();
      this.forma.controls['required'].setValue(0);
      this.forma.controls['required'].enable();
      this.forma.controls['required'].updateValueAndValidity();
    }

    if (type === 'layout_line') {
      this.forma.controls['descripcion'].setValue('linear');
      this.forma.controls['descripcion'].disable();
      this.forma.controls['descripcion'].updateValueAndValidity();
      this.forma.controls['required'].setValue(0);
      this.forma.controls['required'].disable();
      this.forma.controls['required'].updateValueAndValidity();
    }

    if (type === 'label') {
      this.forma.controls['required'].setValue(0);
      this.forma.controls['required'].disable();
      this.forma.controls['required'].updateValueAndValidity();
    }

    if (type === 'spinner' || type === 'radio' || type === 'chip') {
        this.forma.controls['datos'].setValue([]);
        this.forma.controls['datos'].setValidators([Validators.required, Validators.minLength(1)]);
    } else {
      this.forma.controls['datos'].setValue(null);
      this.forma.controls['datos'].clearValidators();
      this.forma.controls['datos'].updateValueAndValidity();
    }
  }


  addRow(): void {

    const form = JSON.parse(JSON.stringify(this.forma.getRawValue()));

    if (form && form.type && (form.type === 'spinner' || form.type === 'radio' || form.type === 'chip')) {
      const datosfiltro = form.datos;
      const newdatosfiltro: Array<any> = [];
      for (let i = 0; i < datosfiltro.length; i++) {
        const element = datosfiltro[i];
        if (element.label) {
          newdatosfiltro.push({value: element.label});
        } else if (element.value) {
          newdatosfiltro.push({value: element.value});
        } else {
          Swal.fire('Importante', 'A ocurrido un error al agregar un elemento al formulario', 'error');
          return;
        }
      }
      form.datos = newdatosfiltro;
    }
    // console.log(form);
    this.addrowtable(form);

  }

  ngOnInit() {

    this.forma = new FormGroup({
      id: new FormControl(0),
      servicetype_id: new FormControl({value: 0, disabled: true}, [Validators.required]),
      order_by: new FormControl(0),
      descripcion: new FormControl('', [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      datos: new FormControl(null),
      dependencia: new FormControl({value: '', disabled: true}),
      observacion: new FormControl({value: '', disabled: true}),
      required: new FormControl(0, [Validators.required]),
      rol: new FormControl(null, [Validators.required]),
      status: new FormControl(0, [Validators.required]),
      create_by: new FormControl(0, [Validators.required]),
      create_at: new FormControl({value: '', disabled: true}),
      update_by: new FormControl({value: 0, disabled: true}),
      update_at: new FormControl({value: '', disabled: true})
    });

  }

  addrowtable(response) {
    const datasource = JSON.parse(JSON.stringify(this.dataSource.data));
    if (response.order_by && response.order_by > 0) {
      datasource.splice((response.order_by - 1), 0, response);
      // this.dataSource.data = datasource;
      this.dataSource = new MatTableDataSource(datasource);
      this.dataSource.sort = this.sort;
      this.expandedElement = response;
    } else {
      datasource.push(response);
      // this.dataSource.data = datasource;
      this.dataSource = new MatTableDataSource(datasource);
      this.dataSource.sort = this.sort;
      this.expandedElement = response;
    }

    /**
         moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.dataSource.data = clonedeep(this.dataSource.data);
     */
  }

  openBottomSheet(): void {
    const sheetRef = this._bottomSheet.open(NewelementComponent, {
      data: {servicetype: this.servicetype},
    });
    sheetRef.afterDismissed().subscribe( data => {
      // console.log('after close data :', data);
      if (data && data.message === 'success' && data.data) {
        const form: any = data.data;
        // console.log(form);

        if (form && form.type && (form.type === 'spinner' || form.type === 'radio' || form.type === 'chip')) {
          const datosfiltro = form.datos;
          const newdatosfiltro: Array<any> = [];
          for (let i = 0; i < datosfiltro.length; i++) {
            const element = datosfiltro[i];
            if (element.label) {
              newdatosfiltro.push({value: element.label});
            } else if (element.value) {
              newdatosfiltro.push({value: element.value});
            } else {
              Swal.fire('Importante', 'A ocurrido un error al agregar un elemento al formulario', 'error');
              return;
            }
          }
          form.datos = newdatosfiltro;
        }
        this.addrowtable(form);
      }
    });
  }

  async deleteFormField(row: any, index: any) {

    if (row.id === 0) {
      const datasource = this.dataSource.data;
      datasource.splice(index, 1);
      this.dataSource.data = datasource;
      this.toasterService.success('Elemento eliminado exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
    } else {
      this.deleteAtributo(row, index);
    }
  }

  autoGrowTextZone(e: any) {
    e.target.style.height = '0px';
    e.target.style.height = (e.target.scrollHeight + 25) + 'px';
  }

  onListDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.dataSource.data = clonedeep(this.dataSource.data);
  }

  async getServicetype(service: any, x: number) {
    if (service && !service.servicetype) {
      this.isLoadingMenu = false;
      const data: any = await this._customForm.getTipoServicio(service.id, this.token.token);
      this.isLoadingMenu = true;
      if (data && data.datos) {
        for (let i = 0; i < this.servicios.length; i++) {
          if (this.servicios[i]['id'] === service.id) {
            this.servicios[i]['servicetype'] = data.datos;
            this.element = document.getElementById('service' + x) as HTMLElement;
            this.element.setAttribute('aria-expanded', 'true');
            this.element2 = document.getElementById('service' + x) as HTMLElement;
            this.element2.setAttribute('data-toggle', 'collapse');
            break;
          }
        }
      }
    }
  }

  async updatePila(data: any) {

    if (data && data.length > 0) {
      const pila: any = JSON.parse(JSON.stringify(data));

      for (let i = 0; i < pila.length; i++) {
        const item: any = pila[i];
        if (item.type === 'spinner' || item.type === 'radio' || item.type === 'chip') {
          const datosArray: Array<any> = [];
          if (item.type === 'spinner') {
            datosArray.push({value: 'Seleccione'});
          }
          const datos: any = item.datos;
          datos.sort(function (a, b) {
            if (a.value > b.value) {
              return 1;
            }
            if (a.value < b.value) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });
          const type = item.type;
          if (item.type === 'spinner') {
            item.datos = JSON.stringify({[type]: datosArray.concat(datos)});
          } else {
            item.datos = JSON.stringify({[type]: datos});
          }
        }
      }

      // console.log(pila);

      this.isLoadingSave = false;
      const object: object = {'atributo': pila};
      const update: any = await this._customForm.updateAtributo(this.token.token, object, this.servicetype.id);
      // console.log(update);
      if (update && update.status === 'success') {
        this.getAtributo(this.servicetype);
        this.toasterService.success('Formulario actulizado exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
        this.isLoadingSave = true;
      } else {
        Swal.fire('Importante', 'A ocurrido un error con la actulización del formulario', 'error');
        this.isLoadingSave = true;
      }
    } else {
      Swal.fire('Importante', 'Debe selecionar al menos 1 respuesta para actulizar la Alerta', 'error');
      this.isLoadingSave = true;
    }

  }

  async savePila(data: any) {

    if (data && data.length > 0) {

      const pila: any = JSON.parse(JSON.stringify(data));

      for (let i = 0; i < pila.length; i++) {
        const item: any = pila[i];
        if (item.type === 'spinner' || item.type === 'radio' || item.type === 'chip') {
          const datosArray: Array<any> = [];
          if (item.type === 'spinner') {
            datosArray.push({value: 'Seleccione'});
          }
          const datos: any = item.datos;
          datos.sort(function (a, b) {
            if (a.value > b.value) {
              return 1;
            }
            if (a.value < b.value) {
              return -1;
            }
            return 0;
          });
          const type = item.type;
          if (item.type === 'spinner') {
            item.datos = JSON.stringify({[type]: datosArray.concat(datos)});
          } else {
            item.datos = JSON.stringify({[type]: datos});
          }
        }
        const validatedatos: any = item.datos;
        if (!validatedatos) {
          item.datos = null;
        }

        if (validatedatos && validatedatos.trim().length === 0) {
          item.datos = null;
        }
      }

      // console.log(pila);

      const object: object = {'atributo': pila};
      this.isLoadingSave = false;
      const store: any = await this._customForm.storeAtributo(this.token.token, object, this.servicetype.id);
      // console.log(store);
      if (store && store.status === 'success') {
        this.getAtributo(this.servicetype);
        this.toasterService.success('Formulario creado exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
        this.isLoadingSave = true;
        return;
      } else {
        Swal.fire('Importante', 'A ocurrido un error con el registro del formulario', 'error');
        this.isLoadingSave = true;
        return;
      }
    } else {
      Swal.fire('Importante', 'Debe selecionar al menos una respuesta para crear la Notificación', 'error');
      this.isLoadingSave = true;
      return;
    }

  }

  showRespuestas(type: any): boolean {
    if (type === 'text' || type === 'textarea' || type === 'int' || type === 'double') {
      return true;
    }
    return false;
  }


  getAtributo(servicetype: any) {

    if (servicetype && servicetype.id) {

      // console.log(servicetype);

      this.servicetype = null;
      this.isLoadingAtributos = true;
      this.atributo = null;
      this.dataSource = new MatTableDataSource();
      this.expandedElement = null;
      this.subscription = this._orderService.getAtributoServiceType(this.token.token, servicetype.id).subscribe(
        response => {
                  if (!response) {
                    this.isLoadingAtributos = false;
                    return;
                  }
                  if (response.status === 'success') {
                    const atributotem = response.datos;
                    // console.log('atributotem', atributotem);

                    if (atributotem.length > 0) {
                      atributotem.forEach(element => {
                        if (element.type === 'spinner' || element.type === 'radio'  || element.type === 'chip') {
                          const array: any = JSON.parse(element.datos);
                          if (element.type === 'spinner') {
                            const spinner: Array<any> = array[element.type];
                            const index = spinner.findIndex(x => x.value = 'Seleccione');
                            if (index > -1) {
                              spinner.splice(index, 1);
                            }
                            element.datos = spinner;
                          } else {
                            element.datos = array[element.type];
                          }
                        }
                      });
                      this.servicetype = servicetype;
                      this.resetformvalue();
                      this.booaction = true;
                      this.atributo = atributotem;
                      this.dataSource = new MatTableDataSource(atributotem);
                      this.dataSource.sort = this.sort;
                      this.countclick++;
                    }

                    this.isLoadingAtributos = false;

                  }
                  },
              error => {
                if (error && error.status && error.status === 401) {
                  this.servicetype = servicetype;
                  this.resetformvalue();
                  this.booaction = false;
                  this.dataSource = new MatTableDataSource();
                  this.dataSource.sort = this.sort;
                  this.countclick++;
                  this.isLoadingAtributos = false;
                } else {
                  this.isLoadingAtributos = false;
                  Swal.fire('Importante', 'A ocurrido un error al cargar el formulario.', 'error');
                }
                console.log(<any>error);
              });
    }
  }


  resetformvalue() {
    if (this.servicetype) {
      this.forma.setValue({
        'id': 0,
        'servicetype_id': this.servicetype.id,
        'order_by': 0,
        'descripcion': null,
        'type': null,
        'datos': null,
        'dependencia': null,
        'observacion': null,
        'required': 0,
        'rol': null,
        'status': 1,
        'create_by': this.identity.sub,
        'create_at': '',
        'update_by': this.identity.sub,
        'update_at': ''
      });
    }
  }


  resetform() {
    this.atributo = null;
    this.dataSource = new MatTableDataSource();
  }

  async deleteAtributo(row: any, index: number) {
    if (!row) {
      return;
    }

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta acción es permanente. ¿Seguro de que quieres eliminar el elemento del formulario?',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    })
    .then( async borrar => {
      if (borrar.value) {
        if (borrar) {
          this.isLoadingSave = false;
          const deleteform: any = await this._customForm.deleteAtributo(this.token.token, row.servicetype_id, row.id);
          if (deleteform && deleteform.status === 'success') {
            // this.getAtributo(this.servicetype);
            this.toasterService.success('Elemento eliminado exitosamente', 'Exito', {timeOut: 4000, closeButton: true, });
            const datasource = this.dataSource.data;
            datasource.splice(index, 1);
            this.dataSource.data = datasource;
            this.isLoadingSave = true;
            this.cd.markForCheck();
          } else {
            this.isLoadingSave = true;
            Swal.fire('Importante', 'A ocurrido un error en la eliminación. Verifique si existen ordenes creadas que contengan el elemento.', 'error');
            return;
          }
        }
      } else if (borrar.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
        );
      }
    });
  }

  sideNavOnClick() {
    this.sidenav.opened = !this.sidenav.opened;
  }

  sideNavOnEndClick() {
    this.sidenavend.opened = !this.sidenavend.opened;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}

