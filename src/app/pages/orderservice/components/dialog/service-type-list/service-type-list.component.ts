import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import Swal from 'sweetalert2';

// MODELS
import { ServiceType } from 'src/app/models/types';

// SERVICES
import { UserService, ProjectsService } from 'src/app/services/service.index';

@Component({
  selector: 'app-service-type-list',
  templateUrl: './service-type-list.component.html',
  styleUrls: ['./service-type-list.component.css']
})

export class ServiceTypeListComponent implements OnInit, OnDestroy {

  @Input() id: number;
  @Input() project_id: number;
  @Output() total: EventEmitter<number>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  data: ServiceType;
  displayedColumns: string[] = ['descripcion', 'shortname', 'ndocumento', 'ddocumento', 'observation', 'status', 'sign', 'actions'];
  dataSource = new MatTableDataSource();
  editando = false;
  forma: FormGroup;
  datatype: ServiceType[] = [];
  indexitem: number;
  isLoading = true;
  isLoadingSave = false;
  isLoadingDelete = false;
  label = 0;
  pageSize = 5;
  resultsLength = 0;
  status: string;
  subscription: Subscription;
  subscriptionServiceType: Subscription;
  show = false;
  termino = '';
  token: any;
  checkedToggle = false;
  allFormularios: any;

  constructor(
    public _userService: UserService,
    public dataService: ProjectsService,
    public snackBar: MatSnackBar,
  ) {
    this.token = this._userService.getToken();
    this.total = new EventEmitter();
  }

  ngOnInit() {
    // console.log(this.id);
    if (this.id > 0) {

      this.forma = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(2)]),
        shortname: new FormControl('', [Validators.required, Validators.minLength(1)]),
        ndocumento: new FormControl(null),
        ddocumento: new FormControl(null),
        observation: new FormControl(null),
        sign: new FormControl(''),
        status: new FormControl(''),
        checkedToggle: new FormControl(false),
        formulario: new FormControl(null)
      });

      this.cargar();
    }

  }

  cargar() {
    this.isLoading = true;
    // console.log(this.id);
    this.subscription = this.dataService.getTipoServicio(this.token.token, this.id)
    .subscribe(
    response => {
      // console.log(response);
              if (!response) {
                this.status = 'error';
                this.isLoading = false;
                return;
              }
              if (response.status === 'success') {

                // console.log(response);
                this.dataSource = new MatTableDataSource(response.datos);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.resultsLength = this.datatype.length;
                this.datatype = response.datos;
                this.total.emit(this.datatype.length);
                this.isLoading = false;
              }
              },
              error => {
                this.status = 'error';
                this.isLoading = false;
                console.log(<any>error);
              }

              );

    this.subscriptionServiceType = this.dataService.getAllTiposervicioProyecto(this.token.token, this.project_id)
    .subscribe(
    response => {

        // console.log(response);

        if (response && response.length > 0) {

          const arr = [];
          for (let i = 0; i < response.length; i++) {
            if (response[i] && response[i].length > 0) {
              for (let ii = 0; ii < response[i].length; ii++) {
                arr.push({id: response[i][ii]['id'], name: response[i][ii]['name']});
              }
            }
          }


          if (arr.length > 0) {
            arr.sort(this.compareValues('name', 'asc'));
            this.allFormularios = arr;
          }
        }

      },
        error => {
        console.log(<any>error);
      }
    );

  }

  compareValues(key: any, order: any) {
    return function(a: any, b: any) {
      if (!a.hasOwnProperty(key) ||
         !b.hasOwnProperty(key)) {
        return 0;
      }

      const varA = (typeof a[key] === 'string') ?
        a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string') ?
        b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ?
        (comparison * -1) : comparison
      );
    };
  }

  edit(i: number) {
    this.indexitem = i;
    this.editando = true;
    this.checkedToggle = false;
    this.show = false;
  }

  close() {
    this.indexitem = -1;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.subscriptionServiceType) {
      this.subscriptionServiceType.unsubscribe();
    }
  }

  toggle() {
    this.show = !this.show;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSubmit() {

    if (this.forma.invalid) {
      Swal.fire('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
      return;
    }

    // console.log(this.forma.value);
    // tslint:disable-next-line:max-line-length

    if (this.checkedToggle && this.forma.value.formulario.id) {
      // tslint:disable-next-line:max-line-length
      this.data = new ServiceType (1, this.forma.value.formulario.id, this.forma.value.name, this.forma.value.shortname, this.forma.value.ndocumento, this.forma.value.ddocumento, this.forma.value.status, this.forma.value.observation, this.forma.value.sign, 0, 0);
    } else {
      // tslint:disable-next-line:max-line-length
      this.data = new ServiceType (0, this.id, this.forma.value.name, this.forma.value.shortname, this.forma.value.ndocumento, this.forma.value.ddocumento, this.forma.value.status, this.forma.value.observation, this.forma.value.sign, 0, 0);
    }

    this.dataService.addServiceType(this.token.token, this.id, this.data)
            .subscribe( (resp: any) => {
              if (!resp) {
                this.snackBar.open('Error procesando solicitud!!!', '', {duration: 3000, });
                this.indexitem = -1;
                return;
              }
              if (resp.status === 'success') {
                this.snackBar.open('Solicitud procesada satisfactoriamente!!!', '', {duration: 3000});
                this.isLoadingSave = false;
                this.indexitem = -1;
                this.label = 0;
                this.forma.reset();
                this.checkedToggle = false;
                setTimeout( () => {
                  this.cargar();
                  this.show = false;
                }, 1000);
              } else {
                this.show = false;
                this.indexitem = -1;
              }
            },
              error => {
                this.snackBar.open('Error procesando solicitud!!!', '', {duration: 3000, });
                this.indexitem = -1;
                console.log(<any>error);
              }
            );
  }

  save(i: number, element: ServiceType) {
    this.indexitem = i;
    this.editando = false;
    this.isLoadingSave = true;
    // console.log(element);

    this.dataService.updateServiceType(this.token.token, this.id, element, element.id)
            .subscribe( (resp: any) => {
              if (!resp) {
                this.snackBar.open('Error procesando solicitud!!!', '', {duration: 3000});
                this.isLoadingSave = false;
                this.indexitem = -1;
                return;
              }
              if (resp.status === 'success') {
                this.snackBar.open('Solicitud procesada satisfactoriamente!!!', '', {duration: 3000});
                this.isLoadingSave = false;
                this.indexitem = -1;
              } else {
                this.snackBar.open('Error procesando solicitud!!!', '', {duration: 3000});
                this.isLoadingSave = false;
                this.indexitem = -1;
              }
            },
              error => {
                this.snackBar.open('Error procesando solicitud!!!', error.message, {duration: 3000});
                this.isLoadingSave = false;
                this.indexitem = -1;
                console.log(<any>error);
              }
            );
  }

  delete(i: number, element: ServiceType) {
    this.indexitem = i;
    this.isLoadingDelete = true;
    this.checkedToggle = false;
    this.show = false;

    this.dataService.deleteServiceType(this.token.token, this.id, element.id)
            .subscribe( (resp: any) => {
              if (!resp) {
                this.snackBar.open('Error procesando solicitud!!!', '', {duration: 3000});
                this.isLoadingDelete = false;
                this.indexitem = -1;
                return;
              }
              if (resp.status === 'success') {
                this.snackBar.open('Solicitud procesada satisfactoriamente!!!', '', {duration: 3000});
                this.isLoadingDelete = false;
                this.indexitem = -1;
                setTimeout( () => {
                  this.cargar();
                }, 2000);
              } else {
                this.snackBar.open('Error procesando solicitud!!!', '', {duration: 3000});
                this.isLoadingDelete = false;
                this.indexitem = -1;
              }
            },
              error => {
                // console.log(<any>error.error);
                // this.snackBar.open('Error procesando solicitud!!!', '', {duration:3000, });
                this.snackBar.open(error.error.message, '', {duration: 3000});
                this.isLoadingDelete = false;
                this.indexitem = -1;
              }
            );
  }


  datalengh(params: ServiceType[] = []) {
    if (params && params.length > 0) {
      return true;
    } else {
      return false;
    }
  }


}
