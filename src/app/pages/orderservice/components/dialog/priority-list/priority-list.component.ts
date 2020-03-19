import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { UntilDestroy } from '@ngneat/until-destroy';

// MODELS
import { Priority } from 'src/app/models/types';

// SERVICES
import { CustomerService, OrderserviceService, UserService } from 'src/app/services/service.index';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-priority-list',
  templateUrl: './priority-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./priority-list.component.css']
})
@UntilDestroy()
export class PriorityListComponent implements OnInit {

  @Input() id: number;
  @Input() project_id: number;
  @Output() total: EventEmitter<number>;


  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  dataSource = new MatTableDataSource();
  editando = false;
  forma: FormGroup;
  indexitem: number;
  isLoading: boolean;
  isLoadingDelete = false;
  isLoadingSave = false;
  proyectos: any;
  priority = [];
  show = false;
  token: any;


  constructor(
    private _customerService: CustomerService,
    public _userService: UserService,
    private cd: ChangeDetectorRef,
    public dataService: OrderserviceService,
    public snackBar: MatSnackBar,
  ) {
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();
    this.total = new EventEmitter();
  }

  ngOnInit() {
    if (this.id && this.id > 0 && this.project_id && this.project_id > 0) {
      console.log(this.id);
      console.log(this.project_id);
        this.cd.markForCheck();
        this.forma = new FormGroup({
          name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
          label: new FormControl(0, [Validators.required]),
          order_by: new FormControl(0, [Validators.required]),
          status: new FormControl(1, [Validators.required]),
        });
        this.cargar(this.id);
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  cargar(id: number) {
    if (id && id > 0 && this.token.token) {
      this.isLoading = true;
      this.cd.markForCheck();
      this._customerService.getPriority(this.token.token, id).subscribe(
        response => {
          console.log(response);
                if (response.status === 'success') {
                  this.dataSource = new MatTableDataSource(response.datos.priority);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                  this.total.emit(response.datos.priority.length);
                  this.priority = response.datos.priority;
                  this.isLoading = false;
                  this.cd.markForCheck();
                } else {
                  this.dataSource = null;
                  this.priority = [];
                  this.isLoading = false;
                  this.cd.markForCheck();
                }
              },
              error => {
                this.dataSource = null;
                this.priority = [];
                this.isLoading = false;
                console.log(<any>error);
                this.cd.markForCheck();
              });
      }
  }

  onSubmit() {

    let avatar = '';

    if (this.forma.invalid || !this.project_id || !this.id) {
       Swal.fire('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
       return;
    }

    if (this.forma.value.label === 0) {
      this.snackBar.open('Seleccione el color de la priodidad.', '', {duration: 3000, });
      return;
    }

    if (this.forma.value.order_by <= 0  ) {
      this.snackBar.open('Seleccione el orden de la prioridad.', '', {duration: 3000, });
      return;
    }


    if (this.forma.value.label  == 1) {
      avatar = '#E52320';
    }

    if (this.forma.value.label  == 2) {
      avatar = '#00E900';
    }

    if (this.forma.value.label  == 3) {
      avatar = '#c51162';
    }


    const data = new Priority (0, this.id, this.forma.value.name, this.forma.value.label, avatar, this.forma.value.order_by, this.forma.value.status, 0, '', 0, '');

    if (this.project_id && this.project_id > 0 && data) {
      this.dataService.addPriority(this.token.token, this.id, data)
      .subscribe( (resp: any) => {
        if (!resp) {
          this.snackBar.open('Error procesando solicitud!!!', '', {duration: 3000, });
          this.indexitem = -1;
          this.cd.markForCheck();
          return;
        }
        if (resp.status === 'success') {
          this.snackBar.open('Solicitud procesada satisfactoriamente!!!', '', {duration: 3000, });
          this.isLoadingSave = false;
          this.indexitem = -1;
          this.cd.markForCheck();
          this.forma.reset();
          setTimeout( () => {
            this.cargar(this.id);
            this.show = false;
          }, 1000);
        } else {
          this.show = false;
          this.indexitem = -1;
          this.cd.markForCheck();
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

  update(i: number, data: any) {
    this.indexitem = i;
    this.editando = false;
    this.isLoadingSave = true;
    let avatar = '';

    if (data.label  == 1) {
      avatar = '#E52320';
    }

    if (data.label  == 2) {
      avatar = '#00E900';
    }

    if (data.label  == 3) {
      avatar = '#c51162';
    }


    const priority = new Priority (data.id, this.id, data.name, data.label, avatar, data.order_by, data.status, 0, '', 0, '');


    if (priority && this.id && this.id > 0) {


      this.dataService.updatePriority(this.token.token, this.id, priority, priority.id)
      .subscribe( (resp: any) => {
        if (!resp) {
          this.snackBar.open('Error procesando solicitud!!!', '', {duration: 3000});
          this.isLoadingSave = false;
          this.indexitem = -1;
          this.cd.markForCheck();
          return;
        }
        if (resp.status === 'success') {
          this.snackBar.open('Solicitud procesada satisfactoriamente!!!', '', {duration: 3000});
          this.isLoadingSave = false;
          this.indexitem = -1;
          this.cd.markForCheck();
        } else {
          this.snackBar.open('Error procesando solicitud!!!', '', {duration: 3000});
          this.isLoadingSave = false;
          this.indexitem = -1;
          this.cd.markForCheck();
        }
      },
        error => {
          this.snackBar.open('Error procesando solicitud!!!', error.message, {duration: 3000});
          this.isLoadingSave = false;
          this.indexitem = -1;
          this.cd.markForCheck();
          console.log(<any>error);
        }
      );
    }
  }

  destroy(i: number, data: any) {
    this.indexitem = i;
    this.isLoadingDelete = true;
    this.show = false;

    if (data && this.id && this.id > 0) {
      this.dataService.deletePriority(this.token.token, this.id, data.id)
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
            this.cargar(this.id);
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

  startEdit(i: number) {
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
