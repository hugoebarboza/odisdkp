import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Proyecto } from 'src/app/models/types';
import { UserService } from 'src/app/services/service.index';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as _moment from 'moment';



@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  loading: Boolean = true;
  project: any;
  proyectos: Array<Proyecto> = [];
  project_name: string;
  title: String = 'Estado de Pago';
  services: any = [];
  item: any;
  id = new BehaviorSubject(this.item);
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
    this._route.params.subscribe(params => {
      this.item = +params['id'];
      const oldid = this.item;
      const newid: any = oldid;
      this.id.next(newid);
      if (this.id && this.id.value > 0) {
        this.loading = false;
        this.project = this.filter(Number(this.id.value));
        this.services = this.project.service;
        if (this.project !== 'Undefined' && this.project !== null && this.project) {
          this.project_name = this.project.project_name;
        } else {
          this._router.navigate(['/notfound']);
        }
      }
    });
  }



  filter(id: number) {
    if (this.proyectos && id > 0) {
      for (let i = 0; i < this.proyectos.length; i += 1) {
        const result = this.proyectos[i];
        if (result.id === id) {
            return result;
        }
      }
    }
  }



}
