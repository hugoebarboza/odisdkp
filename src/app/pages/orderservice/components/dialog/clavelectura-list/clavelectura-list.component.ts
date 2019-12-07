import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

// SERVICES
import { CustomerService, UserService } from 'src/app/services/service.index';
import { ClaveLectura } from 'src/app/models/types';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-clavelectura-list',
  templateUrl: './clavelectura-list.component.html',
  styleUrls: ['./clavelectura-list.component.css']
})
export class ClavelecturaListComponent implements OnInit, OnDestroy {

  @Input() id: number;
  @Input() project_id: number;
  @Output() total: EventEmitter<number>;


  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['descripcion', 'observacion', 'order_by', 'status', 'actions'];
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
  clavelectura = [];
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
          descripcion: new FormControl(null, [Validators.required, Validators.minLength(2)]),
          observacion: new FormControl(null, [Validators.required, Validators.minLength(2)]),
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  cargar(id: number) {
    if (id && id > 0) {
      this.isLoading = true;
      this.subscription = this._customerService.getClaveDeLectura(this.token.token, id).subscribe(
        response => {
                if (response.status === 'success') {
                  this.dataSource = new MatTableDataSource(response.datos.clavelectura);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                  this.total.emit(response.datos.clavelectura.length);
                  this.clavelectura = response.datos.clavelectura;
                  this.isLoading = false;
                } else {
                  this.dataSource = null;
                  this.clavelectura = [];
                  this.isLoading = false;
                }
              },
              error => {
                this.dataSource = null;
                this.clavelectura = [];
                this.isLoading = false;
                console.log(<any>error);
              });
      }
  }


  onSubmit() {

    if (this.forma.invalid || !this.proyecto) {
       Swal.fire('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
       return;
    }

    const data = new ClaveLectura (0, this.proyecto.id, this.forma.value.order_by, this.forma.value.descripcion, this.forma.value.observacion, this.forma.value.status, 0, '', 0, '');

    if (this.proyecto && this.proyecto.id > 0) {
      this._customerService.addClaveDeLectura(this.token.token, this.proyecto.id, data)
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


  update(i: number, element: ClaveLectura) {
    this.indexitem = i;
    this.editando = false;
    this.isLoadingSave = true;

    if (element && this.proyecto && this.proyecto.id > 0) {
      this._customerService.updateClaveDeLectura(this.token.token, this.proyecto.id, element, element.id)
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



  delete(i: number, element: ClaveLectura) {
    this.indexitem = i;
    this.isLoadingDelete = true;
    this.show = false;

    if (element && this.proyecto && this.proyecto.id > 0) {
      this._customerService.deleteClaveDeLectura(this.token.token, this.proyecto.id, element.id)
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


}
