import { Component, Input, OnInit,  OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';


//SERVICES
import { KpiService, OrderserviceService, UserService } from 'src/app/services/service.index';

@Component({
  selector: 'app-kpi-project-detail',
  templateUrl: './kpi-project-detail.component.html',
  styleUrls: ['./kpi-project-detail.component.css']
})
export class KpiProjectDetailComponent implements OnInit, OnChanges {

  identity: any;
  isLoadingResultsKpiDate: boolean = true;
  isLoadingResultsKpiST: boolean = true;
  proyectos: any;
  project: any;
  role: number = 6; // ROLE DE USUARIOS ADMINISTRADORES
  service: any;
  serviceestatus = [];
  subscription: Subscription;
  token: any;

  kpiselectedoption: number = 0;
  kpiselecttiposervicio: any;
  kpiselectuser: any;
  kpiselectstatus: any;
  kpiusers = [];
  kpisearchoptions = [
    {value: 0, name: 'Todo'},
    {value: 1, name: 'Tipo de Servicio'},
    {value: 2, name: 'Usuario'},
  ];
  kpidatesearchoptions = [
    {value: 'day', name: 'Día'},
    {value: 'week', name: 'Semana'},
    {value: 'month', name: 'Mes Actual'},
  ];
  kpidateselectedoption = '';
  kpiselectedoptionST = '';
  kpidatadate = [];
  kpidataST = [];
  kpitotaldate: number = 0;
  kpitotalST: number = 0;

  //CHARTS OPTIONS DATE
  showLegend = true;
  showLabels = false;
  explodeSlices = false;
  doughnut = false;
  view = [400, 350];
  colorScheme = {
    domain: ['#C7B42C', '#5AA454', '#A10A28', '#AAAAAA', '#51a351', '#de473c']
  };



  @Input() id : number;
  @Input() tiposervicio = [];
  @Input() users = [];

  constructor(
    //private _dataService: OrderserviceService,
    private _kpiService: KpiService,
    private _orderService: OrderserviceService,
    private _userService: UserService,
  ) { 
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();
    //this.view = [innerWidth / 1.3, 400];
  }

  onResize(event) {
    //this.view = [event.target.innerWidth / 1.35, 400];
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.kpiusers = [];
    this.service = [];
    if(this.id > 0 && this.tiposervicio.length > 0){
      this.filterUsers();
      this.kpiselectedoption = 0;
      this.kpidateselectedoption = 'day';
      this.kpiselectedoptionST = 'day';  
      this.kpiselecttiposervicio = this.tiposervicio[0]['id'];
      this.project = this.filterProjectByService();
      this.getServiceEstatus(this.id);
      //console.log(this.id);
      //console.log(this.kpiselecttiposervicio);
      //console.log(this.tiposervicio);
      if(this.kpiusers.length > 0){
        this.kpiselectuser = this.kpiusers[0]['id'];
      }
      if(this.project && this.project.id){
        //console.log(this.project);
        this.service = this.filterService();
        this.getProjectKpiDate(this.project.id, this.kpidateselectedoption);
      }

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
  
  filterService(){
    if(this.project.service && this.id){
      for(var i = 0; i < this.project.service.length; i += 1){
        var result = this.project.service[i];
        if(result.id === this.id){
            return result;
        }
      }
    }    
  }  


  filterUsers(){
    if(this.users && this.users.length > 0){
      for(var i = 0; i < this.users.length; i += 1){
        var result = this.users[i];
        //console.log(result.role_id);
        if(result.role_id <= this.role){
          //console.log(result);
          this.kpiusers.push(result);
        }
      }
    }
  }


  public getProjectKpiDate(id:number, termino:string){
    this.isLoadingResultsKpiDate = true;
    if(id > 0 ){ 
      this.kpitotaldate = 0;
        this.kpidatadate = [];            
        this._kpiService.getProjectKpi(this.token.token, id, termino).then(
          (res: any) => 
          {
            res.subscribe(
              (some:any) => 
              {
                if(some.datos){
                  //console.log(some.datos);
                  if(some.datos.length > 0){
                    for (let i = 0; i < some.datos.length; i++) {                        
                      if(some.datos[i]['servicetype']){
                        this.kpidatadate[i] = { name: some.datos[i]['servicetypename'] + ': ' + some.datos[i]['user_count'], value: some.datos[i]['user_count']};
                        this.kpitotaldate = this.kpitotaldate + some.datos[i]['user_count'];
                        //console.log(this.kpitotal);
                      }
                    }
                  }
                  //console.log(this.kpidata);
                  this.isLoadingResultsKpiDate = false;
                }else{
                  this.isLoadingResultsKpiDate = false;
                }
              },
              (error:any) => { 
              this.kpidatadate = [];
              this.isLoadingResultsKpiDate = false;
              console.log(<any>error);
              }  
              )
          })      
        }    
  }


  public getProjectKpiService(id:number, termino:string, status:number, service:number){
    this.isLoadingResultsKpiST = true;
    if(id > 0 ){ 
        this.kpitotalST = 0;
        this.kpidataST = [];            
        this._kpiService.getProjectKpiService(this.token.token, id, termino, status, service).then(
          (res: any) => 
          {
            res.subscribe(
              (some:any) => 
              {
                if(some.datos){
                  //console.log(some.datos);
                  this.isLoadingResultsKpiST = false;
                  if(some.datos.length > 0){
                    for (let i = 0; i < some.datos.length; i++) {
                      if(some.datos[i]['servicetype']){
                        this.kpidataST[i] = { name: some.datos[i]['servicetypename'] + ': ' + some.datos[i]['user_count'], value: some.datos[i]['user_count']};
                        this.kpitotalST = this.kpitotalST + some.datos[i]['user_count'];
                        //console.log(this.kpitotalST);
                      }
                    }
                  }
                  this.isLoadingResultsKpiST = false;
                }else{
                  this.isLoadingResultsKpiST = false;
                }
              },
              (error:any) => { 
              this.kpidataST = [];
              this.isLoadingResultsKpiST = false;
              console.log(<any>error);
              }  
              )
          })      
        }    
  }

  public getProjectKpiServiceType(id:number, termino:string, status:number, service:number, servicetype:number){
    this.isLoadingResultsKpiST = true;
    if(id > 0 ){ 
        this.kpitotalST = 0;
        this.kpidataST = [];            
        this._kpiService.getProjectKpiServiceType(this.token.token, id, termino, status, service, servicetype).then(
          (res: any) => 
          {
            res.subscribe(
              (some:any) => 
              {
                if(some.datos){
                  //console.log(some.datos);
                  this.isLoadingResultsKpiST = false;
                  this.isLoadingResultsKpiST = false;
                  if(some.datos.length > 0){
                    for (let i = 0; i < some.datos.length; i++) {
                      if(some.datos[i]['servicetype']){
                        this.kpidataST[i] = { name: some.datos[i]['servicetypename'] + ': ' + some.datos[i]['user_count'], value: some.datos[i]['user_count']};
                        this.kpitotalST = this.kpitotalST + some.datos[i]['user_count'];
                        //console.log(this.kpitotalST);
                      }
                      if(some.datos[i]['name']){
                        this.kpidataST[i] = { name: some.datos[i]['name'] + ': ' + some.datos[i]['user_count'], value: some.datos[i]['user_count']};
                        this.kpitotalST = this.kpitotalST + some.datos[i]['user_count'];
                        //console.log(this.kpitotalST);
                      }
                    }
                  }
                  //console.log(this.kpidata);
                  this.isLoadingResultsKpiST = false;
                }else{
                  this.isLoadingResultsKpiST = false;
                }
              },
              (error:any) => { 
              this.kpidataST = [];
              this.isLoadingResultsKpiST = false;
              console.log(<any>error);
              }  
              )
          })      
        }    
  }


  public getProjectKpiServiceByUser(id:number, termino:string, status:number, service:number, userid:number){
    this.isLoadingResultsKpiST = true;
    if(id > 0 ){ 
        this.kpitotalST = 0;
        this.kpidataST = [];            
        this._kpiService.getProjectKpiServiceByUser(this.token.token, id, termino, status, service, userid).then(
          (res: any) => 
          {
            res.subscribe(
              (some:any) => 
              {
                if(some.datos){
                  //console.log(some.datos);
                  this.isLoadingResultsKpiST = false;
                  this.isLoadingResultsKpiST = false;
                  if(some.datos.length > 0){
                    for (let i = 0; i < some.datos.length; i++) {
                      if(some.datos[i]['servicetype']){
                        this.kpidataST[i] = { name: some.datos[i]['servicetypename'] + ': ' + some.datos[i]['user_count'], value: some.datos[i]['user_count']};
                        this.kpitotalST = this.kpitotalST + some.datos[i]['user_count'];
                        //console.log(this.kpitotalST);
                      }
                      if(some.datos[i]['name']){
                        this.kpidataST[i] = { name: some.datos[i]['name'] + ': ' + some.datos[i]['user_count'], value: some.datos[i]['user_count']};
                        this.kpitotalST = this.kpitotalST + some.datos[i]['user_count'];
                        //console.log(this.kpitotalST);
                      }
                    }
                  }
                  //console.log(this.kpidata);
                  this.isLoadingResultsKpiST = false;
                }else{
                  this.isLoadingResultsKpiST = false;
                }
              },
              (error:any) => { 
              this.kpidataST = [];
              this.isLoadingResultsKpiST = false;
              console.log(<any>error);
              }  
              )
          })      
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
                      //console.log(this.serviceestatus);
                      this.kpiselectstatus = this.serviceestatus[0]['id'];
                      //console.log(this.kpiselectstatus);
                      if(this.project.id > 0 && this.kpiselectedoptionST && this.kpiselectstatus > 0 && this.id > 0 && this.kpiselecttiposervicio > 0){
                        //this.getProjectKpiServiceType(this.project.id, this.kpiselectedoptionST, this.kpiselectstatus, this.id, this.kpiselecttiposervicio);
                        this.getProjectKpiService(this.project.id, this.kpiselectedoptionST, this.kpiselectstatus, this.id);
                      }
                      
                    }              
                  }
                  });    
    }
  }  



  selectChangeKpiDate(event:any){
    this.getProjectKpiDate(this.project.id, event.value);
    //console.log(event.value);
  }

  selectChangeKpiDateST(event:any){
    //console.log(event.value);
    if(this.kpiselectedoption == 0){
      this.getProjectKpiService(this.project.id, event.value, this.kpiselectstatus, this.id);
      return;
    }
    if(this.kpiselectedoption == 1){
      this.getProjectKpiServiceType(this.project.id, this.kpiselectedoptionST, this.kpiselectstatus, this.id, this.kpiselecttiposervicio);
      return;
    }
    if(this.kpiselectedoption == 2){
      this.getProjectKpiServiceByUser(this.project.id, this.kpiselectedoptionST, this.kpiselectstatus, this.id, this.kpiselectuser);
      return;
    }
    //console.log(event.value);
  }

  selectChangeKpiStatusST(event:any){
    //console.log(event);
    this.getProjectKpiService(this.project.id, this.kpiselectedoptionST, event.id, this.id);
  }


  selectChangeKpi(event:any){
    //console.log(event.value);
    if(event.value == 0){
      this.getProjectKpiService(this.project.id, this.kpiselectedoptionST, this.kpiselectstatus, this.id);
      return;
    }
    if(event.value == 1){
      this.getProjectKpiServiceType(this.project.id, this.kpiselectedoptionST, this.kpiselectstatus, this.id, this.kpiselecttiposervicio);
      return;
    }
    if(event.value == 2){
      this.getProjectKpiServiceByUser(this.project.id, this.kpiselectedoptionST, this.kpiselectstatus, this.id, this.kpiselectuser);
      return;
    }

  }


  selectChangeKpiTipoServicio(event:any){
    //console.log(event);
    this.getProjectKpiServiceType(this.project.id, this.kpiselectedoptionST, this.kpiselectstatus, this.id, event.id);
  }

  selectChangeKpiUser(event:any){
    //console.log(event);
    this.getProjectKpiServiceByUser(this.project.id, this.kpiselectedoptionST, this.kpiselectstatus, this.id, event.id);
  }




}