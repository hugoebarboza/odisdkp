import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

// SERVICES
import { CustomerService, UserService } from 'src/app/services/service.index';
import { Sed } from 'src/app/models/types';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-sed-list',
  templateUrl: './sed-list.component.html',
  styleUrls: ['./sed-list.component.css']
})
export class SedListComponent implements OnInit, OnDestroy {

  @Input() id: number;
  @Input() project_id: number;
  @Output() total: EventEmitter<number>;


  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['alimentador', 'descripcion', 'order_by', 'status', 'actions'];
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
  alimentador = [];
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
        this.forma = new FormGroup({
          id_alimentador: new FormControl(0, [Validators.required, Validators.minLength(1)]),
          descripcion: new FormControl(null, [Validators.required, Validators.minLength(1)]),
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


  onSubmit() {

    if (this.forma.invalid || !this.proyecto) {
       Swal.fire('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
       return;
    }

    const data = new Sed (0, this.forma.value.id_alimentador, this.forma.value.order_by, this.forma.value.descripcion, '', this.forma.value.status, 0, '', 0, '');

    if (this.proyecto && this.proyecto.id > 0) {
      this._customerService.addSed(this.token.token, data.id_alimentador, data)
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
          this.snackBar.open('Error procesando solicitud!!!', '', {duration: 3000, });
          this.indexitem = -1;
          console.log(<any>error);
        }
      );
    }
  }

  getSet(alimentador: any): String {

    if (alimentador && alimentador.id_set) {
        for (let i = 0; i < this.set.length; i++) {
          if (this.set[i]['id'] === alimentador.id_set) {
            return this.set[i]['descripcion'];
          }
        }
    } else {
      return 'Error';
    }

  }

  cargar(id: number) {
    if (id && id > 0) {
      this.isLoading = true;

      this.subscription = this._customerService.getProjectSetAlimentadorSed(this.token.token, id).subscribe(
        response => {
                if (response.status === 'success') {
                  // console.log(response);
                  this.dataSource = new MatTableDataSource(response.sed);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                  this.total.emit(response.sed.length);
                  this.alimentador = response.alimentador;
                  this.set = response.set;
                  this.isLoading = false;
                } else {
                  this.dataSource = null;
                  this.alimentador = [];
                  this.set = [];
                  this.isLoading = false;
                }
              },
              error => {
                this.dataSource = null;
                  this.alimentador = [];
                  this.set = [];
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



  update(i: number, element: Sed) {
    this.indexitem = i;
    this.editando = false;
    this.isLoadingSave = true;

    if (element && this.proyecto && this.proyecto.id > 0) {
      this._customerService.updateSed(this.token.token, element.id_alimentador, element, element.id)
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



  delete(i: number, element: Sed) {
    this.indexitem = i;
    this.isLoadingDelete = true;
    this.show = false;

    if (element && this.proyecto && this.proyecto.id > 0) {
      this._customerService.deleteSed(this.token.token, element.id_alimentador, element.id)
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


  edit(i: number) {
    this.indexitem = i;
    this.editando = true;
  }

  close() {
    this.indexitem = -1;
  }


  toggle() {
    this.show = !this.show;
  }


  datalengh(params: any = []) {
    if (params && params.length > 0) {
      return true;
    } else {
      return false;
    }
  }


}
