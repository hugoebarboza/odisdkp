import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MatTableDataSource } from '@angular/material/table';

// SERVICES
import { CustomerService, UserService } from 'src/app/services/service.index';


@Component({
  selector: 'app-priority-list',
  templateUrl: './priority-list.component.html',
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
  forma: FormGroup;
  isLoading: boolean;
  proyectos: any;
  priority = [];
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
    if (this.id && this.id > 0 && this.project_id && this.project_id > 0) {
        this.forma = new FormGroup({
          descripcion: new FormControl(null, [Validators.required, Validators.minLength(2)]),
          label: new FormControl(0, [Validators.required]),
          order_by: new FormControl(0, [Validators.required]),
          status: new FormControl(1, [Validators.required]),
        });
        this.cargar(this.project_id);
    }
  }

  cargar(id: number) {
    if (id && id > 0 && this.token.token) {
      this.isLoading = true;
      this._customerService.getPriority(this.token.token, id).subscribe(
        response => {
                if (response.status === 'success') {
                  this.dataSource = new MatTableDataSource(response.datos.priority);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                  this.total.emit(response.datos.priority.length);
                  this.priority = response.datos.priority;
                  this.isLoading = false;
                } else {
                  this.dataSource = null;
                  this.priority = [];
                  this.isLoading = false;
                }
              },
              error => {
                this.dataSource = null;
                this.priority = [];
                this.isLoading = false;
                console.log(<any>error);
              });
      }
  }



}
