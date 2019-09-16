import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

//SERVICES
import { KpiService, OrderserviceService, UserService } from 'src/app/services/service.index';


@Component({
  selector: 'app-kpi-project-location',
  templateUrl: './kpi-project-location.component.html',
  styleUrls: ['./kpi-project-location.component.css']
})
export class KpiProjectLocationComponent implements OnInit, OnChanges {

  @Input() id: number;

  identity: any;
  isLoading: boolean = true;
  isLoadingKpiUser: boolean = true;
  project: any;
  proyectos: any;
  serviceestatus = [];
  subscription: Subscription;
  token:any;


  //KPI OPTIONS
  count:number = 0;
  countuser:number = 0;
  kpidata = [];
  kpidatauser = [];
  kpitotal:number = 0;
  kpitotaluser:number = 0;
  kpiselectstatus: any;
  kpiselectstatususer: any;
  kpisearchoptions = [
    {value: 'day', name: 'Día'},
    {value: 'week', name: 'Semana'},
    {value: 'month', name: 'Mes Actual'},
    {value: 'year', name: 'Año Actual'},
  ];
  kpisearchoptionsuser = [
    {value: 'day', name: 'Día'},
    {value: 'week', name: 'Semana'},
    {value: 'month', name: 'Mes Actual'},
    {value: 'year', name: 'Año Actual'},
  ];

  kpiselectedoption:string = '';
  kpiselectedoptionuser:string = '';



  constructor(
    private _kpiService: KpiService,
    private _orderService: OrderserviceService,
    private _userService: UserService,
  ) { 
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

    if(this.id > 0){
      this.kpiselectedoption = 'day';
      this.kpiselectedoptionuser = 'day';
      this.project = this.filterProjectByService();
      if(this.project && this.project.id > 0 && this.project.project_type == 0){
        //console.log(this.project)
        this.getServiceEstatus(this.id);
      }
    }

  }

	ngOnDestroy(){
		if(this.subscription){
			this.subscription.unsubscribe();
			//console.log("ngOnDestroy unsuscribe");
		}
  }
  
  filterProjectByService(){
    for(var i = 0; i < this.proyectos.length; i += 1){
      var result = this.proyectos[i];
      if(result && result.service){
        for(var y = 0; y < result.service.length; y += 1){
          var response = result.service[y];
          if(response && response.id === this.id){
            return result;
          }
        }
      }
    }
  }

  public getServiceEstatus(id:number){
    if(id > 0){
      this.subscription = this._orderService.getServiceEstatus(this.token.token, id).subscribe(
        response => {
                  if(!response){
                    return;
                  }
                  if(response.status == 'success'){                  
                    this.serviceestatus = response.datos;
                    if(this.serviceestatus.length > 0){
                      this.kpiselectstatus = this.serviceestatus[0]['id'];
                      this.kpiselectstatususer = this.serviceestatus[0]['id'];

                      if(this.project.id > 0 && this.kpiselectstatus > 0 && this.id > 0 ){
                        this.getData(this.project.id, this.project.country_id, this.kpiselectedoption, this.kpiselectstatus, this.id);
                        this.getDataUsers(this.project.id, this.kpiselectedoptionuser, this.kpiselectstatususer, this.id);
                      }
                      
                    }              
                  }
                  });    
    }
  }  


  public getData(id:number, country:number, termino:string, status:number, service:number){

    if(!id && !country && !service){
      return;
    }

    this.isLoading = true;
    this.kpitotal = 0;
    this.kpidata = [];
    this.count = 0 ;

    this._kpiService.getProjectKpiServiceByLocation(this.token.token, id, country, termino, status, service).then(
      (res: any) => 
      {
        res.subscribe(
          (some:any) => 
          {
            //console.log(some);
            if(some && some.datos && some.datos.length > 0){
              for (let i = 0; i < some.datos.length; i++) {                
                this.kpitotal = this.kpitotal + some.datos[i]['user_count'];
                this.count = this.count + 1;
              }
              if(this.count == some.datos.length){
                for (let x = 0; x < some.datos.length; x++) {
                  let porcentaje:number = 0;
                  porcentaje = ((some.datos[x]['user_count']*100) / this.kpitotal);
                  //porcentaje = Math.round(porcentaje);
                  const object: Element = {
                    region: some.datos[x]['region_name'],
                    comuna: some.datos[x]['commune_name'],
                    produccion: some.datos[x]['user_count'],
                    porcentaje: porcentaje
                  };
                  this.kpidata[x] = object;
                }
              }

              if (this.kpidata.length === some.datos.length) {
                this.isLoading = false;
                //console.log(this.kpidata);
              }
              
            }
          },
          (error:any) => { 
          this.isLoading = false;
          this.kpitotal = 0;
          this.kpidata = [];
          this.count = 0 ;      
          console.log(<any>error);
          }  
          )
      })      
  }


  public getDataUsers(id:number, termino:string, status:number, service:number){

    if(!id && !service){
      return;
    }

    this.isLoadingKpiUser = true;
    this.kpitotaluser = 0;
    this.kpidatauser = [];
    this.countuser = 0 ;

    this._kpiService.getProjectKpiServiceByUsers(this.token.token, id, termino, status, service).then(
      (res: any) => 
      {
        res.subscribe(
          (some:any) => 
          {
            //console.log(some);
            if(some && some.datos && some.datos.length > 0){
              for (let i = 0; i < some.datos.length; i++) {                
                this.kpitotaluser = this.kpitotaluser + some.datos[i]['user_count'];
                this.countuser = this.countuser + 1;
              }
              if(this.countuser == some.datos.length){
                for (let x = 0; x < some.datos.length; x++) {
                  let porcentaje:number = 0;
                  porcentaje = ((some.datos[x]['user_count']*100) / this.kpitotaluser);
                  //porcentaje = Math.round(porcentaje);
                  const object: User = {
                    name: some.datos[x]['name'],
                    surname: some.datos[x]['surname'],
                    produccion: some.datos[x]['user_count'],
                    porcentaje: porcentaje
                  };
                  this.kpidatauser[x] = object;
                }
              }

              if (this.kpidatauser.length === some.datos.length) {
                this.isLoadingKpiUser = false;
                //console.log(this.kpidatauser);
              }
              
            }
          },
          (error:any) => { 
          this.isLoadingKpiUser = false;
          this.kpitotaluser = 0;
          this.kpidatauser = [];
          this.countuser = 0 ;      
          console.log(<any>error);
          }  
          )
      })      
  }


  selectChangeKpi(event:any){
    this.getData(this.project.id, this.project.country_id, this.kpiselectedoption, this.kpiselectstatus, this.id);
    //console.log(event);
  }

  selectChangeKpiStatus(event:any){
    this.getData(this.project.id, this.project.country_id, this.kpiselectedoption, this.kpiselectstatus, this.id);
    //console.log(event);
  }


  selectChangeKpiUser(event:any){
    this.getDataUsers(this.project.id, this.kpiselectedoptionuser, this.kpiselectstatususer, this.id);
  }

  selectChangeKpiStatusUser(event:any){
    this.getDataUsers(this.project.id, this.kpiselectedoptionuser, this.kpiselectstatususer, this.id);
  }


}

export interface Element {
  region: String;
  comuna: String;
  produccion: number;
  porcentaje: number;
}

export interface User {
  name: String;
  surname: String;
  produccion: number;
  porcentaje: number;
}