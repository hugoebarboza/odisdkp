import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

// SERVICES
import { CustomerService, UserService } from 'src/app/services/service.index';
import { Set } from 'src/app/models/types';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-set-list',
  templateUrl: './set-list.component.html',
  styleUrls: ['./set-list.component.css']
})
export class SetListComponent implements OnInit, OnDestroy {

  @Input() id: number;
  @Input() project_id: number;
  @Output() total: EventEmitter<number>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;


  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['descripcion', 'order_by', 'status', 'actions'];
  editando = false;
  forma: FormGroup;
  indexitem: number;
  isLoading = false;
  isLoadingSave = false;
  isLoadingDelete = false;
  label = 0;
  proyecto: any;
  proyectos = [];
  show = false;
  set = [];
  subscription: Subscription;
  token: any;


  constructor(
    private _customerService: CustomerService,
    public _userService: UserService,
    public snackBar: MatSnackBar,
  ) {
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();
    this.total = new EventEmitter();
  }

  ngOnInit() {
    if (this.id && this.id > 0) {
      this.proyecto = this.filterProjectByService(this.id);
      if (this.proyecto && this.proyecto.id > 0) {
        // console.log(this.proyecto);
        this.forma = new FormGroup({
          descripcion: new FormControl(null, [Validators.required, Validators.minLength(2)]),
          order_by: new FormControl(0, [Validators.required]),
          status: new FormControl(1, [Validators.required]),
        });
        this.cargar(this.proyecto.id);
      }
    }
  }

  filterProjectByService(id: number) {
    for (let i = 0; i < this.proyectos.length; i += 1) {
      const result = this.proyectos[i];
      if (result && result.service) {
        for (let y = 0; y < result.service.length; y += 1) {
          const response = result.service[y];
          if (response && response.id === id) {
            return result;
          }
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  cargar(id: number) {

    if (id && id > 0) {
      this.isLoading = true;
      // GET SET
      this.subscription = this._customerService.getProjectSet(this.token.token, id).subscribe(
        response => {
                if (response.status === 'success') {
                  this.set = response.datos.set;
                  this.dataSource = new MatTableDataSource(response.datos.set);
                  // console.log(this.dataSource);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                  this.total.emit(response.datos.set.length);
                  this.isLoading = false;
                } else {
                  this.set = [];
                  this.isLoading = false;
                }
              },
              error => {
                this.isLoading = false;
                console.log(<any>error);
              });
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  edit(i: number) {
    this.indexitem = i;
    this.editando = true;
  }

  close() {
    this.indexitem = -1;
  }


  onSubmit() {

    if (this.forma.invalid || !this.proyecto) {
       Swal.fire('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
       return;
    }

    const data = new Set (0, this.proyecto.id, this.forma.value.order_by, this.forma.value.descripcion, '', this.forma.value.status, 0, '', 0, '');

    if (this.proyecto && this.proyecto.id > 0) {
      this._customerService.addSet(this.token.token, this.proyecto.id, data)
      .subscribe( (resp: any) => {
        if (!resp) {
          this.snackBar.open('Error procesando solicitud!!!', '', {duration: 3000, });
          this.indexitem = -1;
          return;
        }
        if (resp.status === 'success') {
          this.snackBar.open('Solicitud procesada satisfactoriamente!!!', '', {duration: 3000, });
          this.isLoadingSave = false;
          this.indexitem = -1;
          this.label = 0;
          this.forma.reset();
          setTimeout( () => {
            this.cargar(this.proyecto.id);
            this.show = false;
          }, 1000);
        } else {
          this.show = false;
          this.indexitem = -1;
        }
      },
        error => {
          this.snackBar.open('Error procesando solicitud!!!', '', {duration:3000, });
          this.indexitem = -1;
          console.log(<any>error);
        }
      );
    }
  }


  update(i: number, element: Set) {
    this.indexitem = i;
    this.editando = false;
    this.isLoadingSave = true;

    if (element && this.proyecto && this.proyecto.id > 0) {
      this._customerService.updateSet(this.token.token, this.proyecto.id, element, element.id)
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

  }


  delete(i: number, element: Set) {
    this.indexitem = i;
    this.isLoadingDelete = true;
    this.show = false;

    if (element && this.proyecto && this.proyecto.id > 0) {
      this._customerService.deleteSet(this.token.token, this.proyecto.id, element.id)
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
            this.cargar(this.proyecto.id);
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
  }

  datalengh(params: any = []) {
    if (params && params.length > 0) {
      return true;
    } else {
      return false;
    }
  }


  toggle() {
    this.show = !this.show;
  }

}
