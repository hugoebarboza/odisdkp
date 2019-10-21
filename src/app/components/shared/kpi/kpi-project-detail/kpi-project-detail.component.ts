import { Component, Input, OnInit,  OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormControl} from '@angular/forms';
import { TooltipPosition } from '@angular/material';


// SERVICES
import { KpiService, OrderserviceService, UserService } from 'src/app/services/service.index';

@Component({
  selector: 'app-kpi-project-detail',
  templateUrl: './kpi-project-detail.component.html',
  styleUrls: ['./kpi-project-detail.component.css']
})
export class KpiProjectDetailComponent implements OnInit, OnChanges, OnDestroy {

  @Input() id: number;
  @Input() tiposervicio = [];
  @Input() users = [];

  avancegauge = 0;
  identity: any;
  isLoadingResultsKpiDate = true;
  isLoadingResultsKpiST = true;
  isLoadingResultsKpiGauge = true;
  isLoadingResultsKpiLine = true;
  ngxcharttype = 1;
  proyectos: any;
  project: any;
  role = 6; // ROLE DE USUARIOS ADMINISTRADORES
  service: any;
  serviceestatus = [];
  subscription: Subscription;
  token: any;
  isShow = false;

  kpidateallselectedoption = 0;
  kpiselectedoption = 0;
  kpiselecttiposervicio: any;
  kpidateselecttiposervicio: any;
  kpiselectuser: any;
  kpiselectstatus: any;
  kpiselectstatusdate: any;
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
    {value: 'yeardkp', name: 'Año Actual'},
  ];

  kpidatelinesearchoptions = [
    {value: 'day', name: 'Día'},
    {value: 'week', name: 'Semana'},
    {value: 'month', name: 'Mes Actual'},
    {value: 'year', name: 'Año Actual'},
  ];


  kpisearchoptionsgauge = [
    {value: 'daygauge', name: 'Día'},
    {value: 'weekgauge', name: 'Semana'},
    {value: 'monthgauge', name: 'Mes Actual'},
    {value: 'yeargauge', name: 'Año Actual'},
  ];

  kpisearchoptionsline = [
    {value: 'dayline', name: 'Día'},
    {value: 'weekline', name: 'Semana'},
    {value: 'monthline', name: 'Mes Actual'},
    {value: 'yearline', name: 'Año Actual'},
  ];


  kpidatelineallsearchoptions = [
    {value: 0, name: 'Todo'},
    {value: 1, name: 'Tipo de Servicio'},
  ];


  kpidateselectedoption = '';
  kpidatelineselectedoption = '';
  kpiselectedoptionST = '';
  kpiselectedoptiongauge = '';
  kpiselectedoptionline = '';
  kpidatadate = [];
  kpidataST = [];
  kpidatagauge =  [
    {
      name: '',
      value: 0
    },
    {
      name: '',
      value: 0
    }
  ];
  kpitotaldate = 0;
  kpitotalST = 0;
  kpitotalgauge = 0;
  kpitotalgaugeupdate = 0;


  // CHARTS OPTIONS DATE
  showLegend = true;
  showLabels = false;
  explodeSlices = false;
  doughnut = false;
  view = [400, 350];
  colorScheme = {
    domain: ['#C7B42C', '#5AA454', '#A10A28', '#AAAAAA', '#51a351', '#de473c']
  };

  colorSchemeGauge = {
    domain: ['#5AA454', '#A10A28', '#C7B42C']
  };

  // LINE OPTIONS
  viewline: any[] = [700, 400];
  viewgauge: any[] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showXAxisLabel = true;
  showLegendLine = true;
  xAxisLabel = '(Fecha / Hora)';
  showYAxisLabel = true;
  yAxisLabel = 'N. Órdenes';
  autoScale = true;
  multi = [
    {
      name: 'N. Órdenes',
      series: [
      ]
    },
  ];


  // ALL LINE VAR AND OPTIONS
  allmulti = [
    {
      name: '',
      series: [
      ]
    },
    {
      name: '',
      series: [
      ]
    }
  ];

  single = [
    {
      name: 'Creadas',
      value: 0
    },
    {
      name: 'Editadas',
      value: 0
    }
  ];
  xAxisLabelVertical = '(Estatus)';
  kpitotalline = 0;
  kpitotalcreated = 0;
  kpitotalupdate = 0;




  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionheaderaction = new FormControl(this.positionOptions[2]);
  positiondatasourceaction = new FormControl(this.positionOptions[3]);
  positionleftaction = new FormControl(this.positionOptions[4]);
  positionrightaction = new FormControl(this.positionOptions[5]);


  constructor(
    private _kpiService: KpiService,
    private _orderService: OrderserviceService,
    private _userService: UserService,
  ) {
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();
  }

  onResize(event) {
    if (event.target.innerWidth > 1080) {
      this.viewline = [700, 400];
      return;
    }
    let param = event.target.innerWidth / 7;
    if (param < 400) {
      param = 400;
    }
    this.viewline = [param, 400];
  }

  ngOnInit() {
  }

  ngOnChanges(_changes: SimpleChanges) {
    this.kpiusers = [];
    this.service = [];
    if (this.id > 0 && this.tiposervicio.length > 0) {
      this.filterUsers();
      this.kpiselectedoption = 0;
      this.kpidateallselectedoption = 0;
      this.kpidateselectedoption = 'day';
      this.kpiselectedoptionST = 'day';
      this.kpidatelineselectedoption = 'day';
      this.kpiselectedoptiongauge = 'daygauge';
      this.kpiselectedoptionline = 'dayline';
      this.kpiselecttiposervicio = this.tiposervicio[0]['id'];
      this.kpidateselecttiposervicio = this.tiposervicio[0]['id'];
      this.project = this.filterProjectByService();
      this.getServiceEstatus(this.id);
      if (this.kpiusers.length > 0) {
        this.kpiselectuser = this.kpiusers[0]['id'];
      }
      if (this.project && this.project.id) {
        this.service = this.filterService();
        this.loaduserordeneskpigauge(this.project.id, this.kpiselectedoptiongauge, this.id );
        this.loaduserordeneskpiline(this.project.id, this.kpiselectedoptionline, this.id );
      }

    }
  }

  ngOnDestroy() {
    if (this.subscription) {
       this.subscription.unsubscribe();
    }
  }


  filterProjectByService() {
    for (let i = 0; i < this.proyectos.length; i += 1) {
      const result = this.proyectos[i];
      if (result && result.service) {
        for (let y = 0; y < result.service.length; y += 1) {
          const response = result.service[y];
          if (response && response.id === this.id) {
            return result;
          }
        }
      }
    }
  }

  filterService() {
    if (this.project.service && this.id) {
      for (let i = 0; i < this.project.service.length; i += 1) {
        const result = this.project.service[i];
        if (result.id === this.id) {
            return result;
        }
      }
    }
  }


  filterUsers() {
    if (this.users && this.users.length > 0) {
      for (let i = 0; i < this.users.length; i += 1) {
        const result = this.users[i];
        if (result.role_id <= this.role) {
          this.kpiusers.push(result);
        }
      }
    }
  }

  public loaduserordeneskpiline(id: number, termino: string, service: number) {
    this.isLoadingResultsKpiLine = true;
    if (id > 0 ) {
      this.kpitotalline = 0;
      this.kpitotalcreated = 0;
      this.kpitotalupdate = 0;
      this.allmulti[0].series.length = 0;
      this.allmulti[1].series.length = 0;
      this._kpiService.getProjectKpiServiceByDate(this.token.token, id, termino, 0, service).then(
        (res: any) => {
          res.subscribe(
            (some: any) => {
              if (some && some.datos && some.datos.length > 0) {
                  for (let i = 0; i < some.datos.length; i++) {
                    if (some.datos[i]['hora']) {
                      this.allmulti[0].series.push({ name: some.datos[i]['hora'] + ':00:00', value: some.datos[i]['user_count']});
                    }
                    if (some.datos[i]['fecha']) {
                      this.allmulti[0].series.push({ name: some.datos[i]['fecha'], value: some.datos[i]['user_count']});
                    }

                    if (some.datos[i]['month']) {
                      this.allmulti[0].series.push({ name: some.datos[i]['month'], value: some.datos[i]['user_count']});
                    }
                    this.kpitotalline = this.kpitotalline + some.datos[i]['user_count'];
                    this.kpitotalcreated = this.kpitotalcreated + some.datos[i]['user_count'];
                    this.allmulti[0].name = 'Cradas: ' + this.kpitotalcreated;
                    this.single[0].name = 'Cradas: ' + this.kpitotalcreated;
                    this.single[0].value = this.kpitotalcreated;
                  }
                this.isLoadingResultsKpiLine = false;
              } else {
                    this.allmulti[0].name = 'Cradas: ' + this.kpitotalupdate;
                    this.single[0].name = 'Cradas: ' + this.kpitotalupdate;
              }

              if (some && some.datosupdate && some.datosupdate.length > 0) {
                  for (let i = 0; i < some.datosupdate.length; i++) {
                    if (some.datosupdate[i]['hora']) {
                      this.allmulti[1].series.push({ name: some.datosupdate[i]['hora'] + ':00:00', value: some.datosupdate[i]['user_count']});
                    }
                    if (some.datosupdate[i]['fecha']) {
                      this.allmulti[1].series.push({ name: some.datosupdate[i]['fecha'], value: some.datosupdate[i]['user_count']});
                    }

                    if (some.datosupdate[i]['month']) {
                      this.allmulti[1].series.push({ name: some.datosupdate[i]['month'], value: some.datosupdate[i]['user_count']});
                    }
                    this.kpitotalline = this.kpitotalline + some.datosupdate[i]['user_count'];
                    this.kpitotalupdate = this.kpitotalupdate + some.datosupdate[i]['user_count'];
                    this.allmulti[1].name = 'Editadas: ' + this.kpitotalupdate;
                    this.single[1].name = 'Editadas: ' + this.kpitotalupdate;
                    this.single[1].value = this.kpitotalupdate;

                  }
                this.isLoadingResultsKpiLine = false;
              } else {
                  this.allmulti[1].name = 'Editadas: ' + this.kpitotalupdate;
                  this.single[1].name = 'Editadas: ' + this.kpitotalupdate;
              }

              if (this.single.length > 0) {
                // console.log(this.single);
                // console.log(this.allmulti);
              }


            },
            (error: any) => {
            this.allmulti[0].series.length = 0;
            this.allmulti[1].series.length = 0;
            this.isLoadingResultsKpiLine = false;
            console.log(<any>error);
            }
            );
        });
    }
  }




  public loaduserordeneskpigauge(id:number, termino:string, service:number){
    this.isLoadingResultsKpiGauge = true;
    if(id > 0 ){ 
        this.kpidatagauge[0].value = 0;
        this.kpidatagauge[1].value = 0;
        this.kpitotalgaugeupdate = 0;
        this.kpitotalgauge = 0;
        this._kpiService.getProjectKpiServiceByDate(this.token.token, id, termino, 0, service).then(
          (res: any) => 
          {
            res.subscribe(
              (some:any) => 
              {
                //console.log(some);
                if(some && some.datos && some.datos.length > 0){
                    for (let i = 0; i < some.datos.length; i++) {              
                        this.kpitotalgauge = this.kpitotalgauge + some.datos[i]['user_count'];
                        this.kpidatagauge[0].value = this.kpitotalgauge;
                        this.kpidatagauge[0].name = "Creadas: " + this.kpitotalgauge;
                    }
                  this.isLoadingResultsKpiGauge = false;
                }else{
                  this.isLoadingResultsKpiGauge = false;
                }

                if(some && some.datosupdate && some.datosupdate.length > 0){
                  for (let i = 0; i < some.datosupdate.length; i++) {
                    this.kpitotalgaugeupdate = this.kpitotalgaugeupdate + some.datosupdate[i]['user_count'];
                    this.kpidatagauge[1].value = this.kpitotalgaugeupdate;
                    this.kpidatagauge[1].name = "Editadas: " + this.kpitotalgaugeupdate;
                  }
                }else{
                  this.isLoadingResultsKpiGauge = false;
                  this.kpidatagauge[1].name = "Editadas: " + this.kpitotalgaugeupdate;
                }
                
                if(this.kpidatagauge[0].value > 0){
                  this.avancegauge = Math.round((this.kpitotalgaugeupdate*100)/this.kpitotalgauge);
                  //console.log(this.kpidatagauge);
                }
              },
              (error:any) => { 
              this.kpidatagauge[0].value = 0;
              this.kpidatagauge[1].value = 0;        
              this.isLoadingResultsKpiGauge = false;
              console.log(<any>error);
              }  
              )
        })      
    }
  }  

  public getProjectKpiDate(id:number, termino:string, status:number, service:number){
    this.isLoadingResultsKpiDate = true;
    if(id > 0 ){ 
        this.kpitotaldate = 0;
        this.kpidatadate = [];
        this.multi[0].series.length = 0;
        this.multi[0].name = "";
        this._kpiService.getProjectKpiServiceByDate(this.token.token, id, termino, status, service).then(
          (res: any) => 
          {
            res.subscribe(
              (some:any) => 
              {
                if(some && some.datos && some.datos.length > 0){
                  //console.log(some.datos);
                  //console.log(some.datos.length);                  
                    for (let i = 0; i < some.datos.length; i++) {
                      if(some.datos[i]['hora']){
                        //this.kpidatadate[i] = { name: some.datos[i]['hora'], value: some.datos[i]['user_count']};
                        this.multi[0].series.push({ name: some.datos[i]['hora'] + ':00:00', value: some.datos[i]['user_count']});
                        this.kpitotaldate = this.kpitotaldate + some.datos[i]['user_count'];
                        this.multi[0].name = "N. Órdenes: " + this.kpitotaldate;
                      }
                      if(some.datos[i]['fecha']){
                        //this.kpidatadate[i] = { name: some.datos[i]['hora'], value: some.datos[i]['user_count']};
                        this.multi[0].series.push({ name: some.datos[i]['fecha'], value: some.datos[i]['user_count']});
                        this.kpitotaldate = this.kpitotaldate + some.datos[i]['user_count'];
                        this.multi[0].name = "N. Órdenes: " + this.kpitotaldate;
                      }

                      if(some.datos[i]['month']){
                        //this.kpidatadate[i] = { name: some.datos[i]['hora'], value: some.datos[i]['user_count']};
                        this.multi[0].series.push({ name: some.datos[i]['month'], value: some.datos[i]['user_count']});
                        this.kpitotaldate = this.kpitotaldate + some.datos[i]['user_count'];
                        this.multi[0].name = "N. Órdenes: " + this.kpitotaldate;
                      }
                    }                
                  this.isLoadingResultsKpiDate = false;
                }else{
                  this.isLoadingResultsKpiDate = false;
                }
              },
              (error:any) => { 
              this.multi[0].series.length = 0;
              this.isLoadingResultsKpiDate = false;
              console.log(<any>error);
              }  
              )
          })      
    }    
  }


  public getProjectKpiAllDate(id:number, termino:string, status:number, service:number, servicetype:number){
    this.isLoadingResultsKpiDate = true;
    if(id > 0 ){ 
        this.kpitotaldate = 0;
        this.kpidatadate = [];
        this.multi[0].series.length = 0;
        this.multi[0].name = "";
        this._kpiService.getProjectKpiServiceTypeByDate(this.token.token, id, termino, status, service, servicetype).then(
          (res: any) => 
          {
            res.subscribe(
              (some:any) => 
              {
                if(some && some.datos.length > 0){
                  //console.log(some.datos);
                  //console.log(some.datos.length);
                  if(some.datos.length > 0){
                    for (let i = 0; i < some.datos.length; i++) {
                      if(some.datos[i]['hora']){
                        //this.kpidatadate[i] = { name: some.datos[i]['hora'], value: some.datos[i]['user_count']};
                        this.multi[0].series.push({ name: some.datos[i]['hora'] + ':00:00', value: some.datos[i]['user_count']});
                        this.kpitotaldate = this.kpitotaldate + some.datos[i]['user_count'];
                        this.multi[0].name = "N. Órdenes: " + this.kpitotaldate;
                      }
                      if(some.datos[i]['fecha']){
                        //this.kpidatadate[i] = { name: some.datos[i]['hora'], value: some.datos[i]['user_count']};
                        this.multi[0].series.push({ name: some.datos[i]['fecha'], value: some.datos[i]['user_count']});
                        this.kpitotaldate = this.kpitotaldate + some.datos[i]['user_count'];
                        this.multi[0].name = "N. Órdenes: " + this.kpitotaldate;
                      }

                      if(some.datos[i]['month']){
                        //this.kpidatadate[i] = { name: some.datos[i]['hora'], value: some.datos[i]['user_count']};
                        this.multi[0].series.push({ name: some.datos[i]['month'], value: some.datos[i]['user_count']});
                        this.kpitotaldate = this.kpitotaldate + some.datos[i]['user_count'];
                        this.multi[0].name = "N. Órdenes: " + this.kpitotaldate;
                      }

                    }
                  }
                  this.isLoadingResultsKpiDate = false;
                }else{
                  this.isLoadingResultsKpiDate = false;
                }
              },
              (error:any) => { 
              this.multi[0].series.length = 0;
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
        this._kpiService.getProjectKpiService(this.token.token, id, termino, status, service)
        .then(
          (res: any) => 
          {
            res.subscribe(
              (some:any) => 
              {
                if(some && some.datos && some.datos.length > 0){
                  //console.log(some.datos);
                  this.isLoadingResultsKpiST = false;                  
                  for (let i = 0; i < some.datos.length; i++) {
                    if(some.datos[i]['servicetype']){
                      this.kpidataST[i] = { name: some.datos[i]['servicetypename'] + ': ' + some.datos[i]['user_count'], value: some.datos[i]['user_count']};
                      this.kpitotalST = this.kpitotalST + some.datos[i]['user_count'];
                      //console.log(this.kpitotalST);
                    }
                  }
                  if(some.datos.length === this.kpidataST.length){               
                    this.isLoadingResultsKpiST = false;
                  }
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
                if(some && some.datos.length > 0){
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
                if(some && some.datos.length > 0){
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
                      this.kpiselectstatusdate = this.serviceestatus[0]['id'];
                      //console.log(this.kpiselectstatus);
                      if(this.project.id > 0 && this.kpiselectedoptionST && this.kpiselectstatus > 0 && this.id > 0 && this.kpiselecttiposervicio > 0){
                        this.getProjectKpiService(this.project.id, this.kpiselectedoptionST, this.kpiselectstatus, this.id);
                        this.getProjectKpiDate(this.project.id, this.kpidatelineselectedoption, this.kpiselectstatusdate, this.id);
                      }
                      
                    }              
                  }
                  });    
    }
  }  


  valueFormatting(_value: number): string {
    return;
      //return `${Math.round((this.kpitotalgaugeupdate*100)/this.kpitotalgauge).toLocaleString()} %`;    
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

  selectChangeKpiDate(){
    if(this.kpidateallselectedoption == 0){
      this.getProjectKpiDate(this.project.id, this.kpidatelineselectedoption, this.kpiselectstatusdate, this.id);
      return;
    }

    if(this.kpidateallselectedoption == 1){
      this.getProjectKpiAllDate(this.project.id, this.kpidatelineselectedoption, this.kpiselectstatusdate, this.id, this.kpidateselecttiposervicio);
      return;
    }
  }

  selectChangeKpiStatusDate(){
    if(this.kpidateallselectedoption == 0){
      this.getProjectKpiDate(this.project.id, this.kpidatelineselectedoption, this.kpiselectstatusdate, this.id);
      return;
    }
    

    if(this.kpidateallselectedoption == 1){
      this.getProjectKpiAllDate(this.project.id, this.kpidatelineselectedoption, this.kpiselectstatusdate, this.id, this.kpidateselecttiposervicio);
      return;
    }
  }

  selectChangeKpiAllDate(event:any){
    //console.log(event);
    if(event.value === 0){
      this.getProjectKpiDate(this.project.id, this.kpidatelineselectedoption, this.kpiselectstatus, this.id);      
      return;
    }
    if(event.value === 1){
      this.getProjectKpiAllDate(this.project.id, this.kpidatelineselectedoption, this.kpiselectstatusdate, this.id, this.kpidateselecttiposervicio);
      return;
    }
  }

  selectChangeKpiTipoServicioByDate(){
    //console.log(event);
    this.getProjectKpiAllDate(this.project.id, this.kpidatelineselectedoption, this.kpiselectstatusdate, this.id, this.kpidateselecttiposervicio);
  }

  selectChangeKpiGauge(){
    //console.log(event);
    this.loaduserordeneskpigauge(this.project.id, this.kpiselectedoptiongauge, this.id );
  }

  selectChangeKpiLine(){
    this.loaduserordeneskpiline(this.project.id, this.kpiselectedoptionline, this.id );
    this.ngxcharttype = 1;
  }

  toggle(event:any){    
    if(event.currentTarget.checked){
      this.isShow = true;
    }else{
      this.isShow = false;  
    }
  }

  togglengxcharttype(event:number){
    if(!event){
      return;
    }
    this.ngxcharttype = event;
  }


}
