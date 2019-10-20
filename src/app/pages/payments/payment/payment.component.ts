import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Proyecto } from 'src/app/models/types';
import { UserService } from 'src/app/services/service.index';
import { Subscription } from 'rxjs/Subscription';

import * as _moment from 'moment';


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
  id: Number;
  sub: any;
  identity: any;
  token: any;
  subscription: Subscription;



  constructor(
    private _route: ActivatedRoute,
    public _router: Router,
    public _userService: UserService,
    ) {

      this._userService.handleAuthentication(this.identity, this.token);
      this.identity = this._userService.getIdentity();
      this.proyectos = this._userService.getProyectos();
      this.token = this._userService.getToken();

  }


  ngOnInit() {
    this.startData();
  }


  ngOnChanges(_changes: SimpleChanges) {
    this.startData();
  }

  startData() {

    this._route.params.subscribe(params => {
      this.id = +params['id'];
      if (this.id) {

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



}
