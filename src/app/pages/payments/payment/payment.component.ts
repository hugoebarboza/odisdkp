import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Proyecto } from 'src/app/models/types';
import { UserService, OrderserviceService } from 'src/app/services/service.index';
import { Subscription } from 'rxjs';

import * as _moment from 'moment';

import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit,  OnChanges {

  loading: Boolean = true;
  project: any;
  proyectos: Array<Proyecto> = [];
  project_name: string;
  title: String = 'Estado de Pago';
  services: any = [];
  serviceestatus: any = [];
  servicetype: any = [];
  id: Number;
  sub: any;
  identity: any;
  token: any;
  subscription: Subscription;
  formulario: FormGroup;

  es = {
    firstDayOfWeek: 0,
    dayNames: [ 'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado' ],
    dayNamesShort: [ 'dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb' ],
    dayNamesMin: [ 'D', 'L', 'M', 'X', 'J', 'V', 'S' ],
    monthNames: [ 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
    'septiembre', 'octubre', 'noviembre', 'diciembre' ],
    monthNamesShort: [ 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic' ],
    today: 'Hoy',
    clear: 'Borrar'
  };

  datesearchoptions = [
    {value: 'day', name: 'Día'},
    {value: 'week', name: 'Semana'},
    {value: 'month', name: 'Mes Actual'},
    {value: 'yeardkp', name: 'Año Actual'},
    {value: 'custom', name: 'Personalizado'},
  ];

  constructor(
    private _route: ActivatedRoute,
    public _router: Router,
    private _orderService: OrderserviceService,
    public _userService: UserService,
    ) {

      this._userService.handleAuthentication(this.identity, this.token);
      this.identity = this._userService.getIdentity();
      this.proyectos = this._userService.getProyectos();
      this.token = this._userService.getToken();

  }

  filter() {
    if (this.proyectos && this.id) {
      for (let i = 0; i < this.proyectos.length; i += 1) {
        const result = this.proyectos[i];
        if (result.id === this.id) {
            return result;
        }
      }
    }
  }

  ngOnInit() {
    this.startData();
  }

  procesarAll(_form: any) {
    //console.log(form.value);
  }

  ngOnChanges(_changes: SimpleChanges) {
    this.startData();
  }

  startData() {


    this._route.params.subscribe(params => {
      this.id = +params['id'];
      if (this.id) {

        this.formulario = new FormGroup({
          dateoptions: new FormControl ('day', [Validators.required]),
          //date_rango: new FormControl (null, [Validators.required]),
          service: new FormControl (null),
          servicetype: new FormControl (null),
          status: new FormControl (null)
        });
        this.services = [];
        this.servicetype = [];
        this.serviceestatus = [];

        this.loading = false;
        this.project = this.filter();
        this.services = this.project.service;
        if (this.project !== 'Undefined' && this.project !== null && this.project) {
          this.project_name = this.project.project_name;
        } else {
          this._router.navigate(['/notfound']);
        }
      }
    });

  }

  selectChangeServicio(event: any) {
    if (event && event.id && event.id > 0) {
      this.getServiceEstatus(event.id);
    }
  }

  public getServiceEstatus(id: number) {
    this.serviceestatus = [];
    this.servicetype = [];

    if (id > 0) {

        this._orderService.getServiceType(this.token.token, id).subscribe(
          response => {
                    if (!response) {
                      return;
                    }
                    if (response.status === 'success') {
                      this.servicetype = response.datos;
                      console.log(this.servicetype);
                    }
          });

        this._orderService.getServiceEstatus(this.token.token, id).subscribe(
          response => {
                    if (!response) {
                      return;
                    }
                    if (response.status === 'success') {
                      this.serviceestatus = response.datos;
                      console.log(this.serviceestatus);
                    }
          });
    }
  }


}
