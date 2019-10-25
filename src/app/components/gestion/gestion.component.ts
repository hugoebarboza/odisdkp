import { Component, OnInit, OnChanges, OnDestroy, Input, SimpleChanges } from '@angular/core';

// SERVICES
import { OrderserviceService, UserService } from 'src/app/services/service.index';


@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css']
})
export class GestionComponent implements OnInit, OnChanges, OnDestroy {

identity: any;
isLoadingResults: boolean;
kpi = 0;
project: string;
project_id: number;
servicename: string;
tipoServicio = [];
token: any;
users = [];




  @Input() id: number;


  constructor(
    private _dataService: OrderserviceService,
    private _userService: UserService,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
  }

  ngOnChanges(_changes: SimpleChanges) {
    this.tipoServicio = [];
    this.users = [];
    this.loadInfo();
  }

  ngOnDestroy() {

  }

  onResize(_event) {

  }


  public loadInfo(){
    this.isLoadingResults = true;
    this._dataService.getService(this.token.token, this.id).subscribe(
                response => {
                        if (response.status === 'success') {
                          this.servicename = String (response.datos.service_name);
                          this.isLoadingResults = false;
                          this.kpi = response.datos.kpi;
                        } else {
                        this.isLoadingResults = false;
                        }
                    },
                    (error) => {
                      this.isLoadingResults = false;
                      console.log(<any>error);
                    }
                    );

  }

  getTipoServicio($event) {
    this.tipoServicio = $event;
  }

  getUsers($event) {
    this.users = $event;
  }



}
