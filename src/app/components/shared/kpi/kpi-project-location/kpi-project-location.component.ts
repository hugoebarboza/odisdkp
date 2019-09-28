import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormControl} from '@angular/forms';
import { TooltipPosition } from '@angular/material';


//SERVICES
import { KpiService, OrderserviceService, UserService } from 'src/app/services/service.index';

import { isNumeric } from 'rxjs/util/isNumeric';


@Component({
  selector: 'app-kpi-project-location',
  templateUrl: './kpi-project-location.component.html',
  styleUrls: ['./kpi-project-location.component.css']
})
export class KpiProjectLocationComponent implements OnInit, OnChanges, OnDestroy {

  @Input() id: number;

  promedio:number = 0;
  promedioordercreated:number = 0;
  promediogropeduser:number = 0;
  promediogroupedlocation:number = 0;
  countassigned:number = 0;
  countupdate:number = 0;
  countassignedlocation:number = 0;
  countupdatelocation:number = 0;
  

  hours:number = 0;
  minutes:number = 0;
  seconds:number = 0;
  identity: any;
  isLoading: boolean = true;
  isLoadingKpiUser: boolean = true;
  isLoadingKpiTime: boolean = true;
  isLoadingKpiYear: boolean = true;
  isLoadingKpiYearAssigned: boolean = true;
  isLoadingKpiOrderCreated: boolean = true;
  isLoadingKpiGroupedByUser: boolean = true;
  isLoadingKpiGroupedByLocation: boolean = true;
  
  project: any;
  proyectos: any;
  service:any;
  serviceestatus = [];
  subscription: Subscription;
  token:any;


  //KPI OPTIONS
  count:number = 0;
  countuser:number = 0;
  kpidata = [];
  kpidataOrderCreated = [];
  kpidatauser = [];
  kpidatatimeavg = [];
  kpidatagrupedbyuser = [];
  kpidatagrupedbylocation = [];  
  kpidatayear = [
    {
      name: "",
      series: [
      ]
    },  
  ];
  kpidatayearassigned = [
    {
      name: "",
      series: [
      ]
    },  
  ];  



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
  kpiselectedoptiontime:string = '';
  kpiselectedoptionordercreated:string = '';
  kpiselectedoptiongroupedbylocation:string = '';
  kpiselectedoptiongroupedbyuser:string = '';  

  //CHART OPTIONS
  view: any[] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Fecha';
  showYAxisLabel = true;
  yAxisLabel = 'N. Órdenes';

  xAxisLabelGroupedUser = 'N. Órdenes';
  yAxisLabelGroupedUser = 'Usuarios';

  xAxisLabelGroupedLocation = 'N. Órdenes';
  yAxisLabelGroupedLocation = 'Ubicación';


  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };  

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

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

    if(this.id > 0){
      this.kpiselectedoption = 'day';
      this.kpiselectedoptionuser = 'day';
      this.kpiselectedoptiontime = 'day';
      this.kpiselectedoptionordercreated = 'day';
      this.kpiselectedoptiongroupedbyuser = 'day';
      this.kpiselectedoptiongroupedbylocation = 'day';
      this.project = this.filterProjectByService();
      if(this.project && this.project.id > 0){
        this.service = this.filterService();
        this.getServiceEstatus(this.id);
        this.getDataTimeAvg(this.project.id, this.kpiselectedoptiontime, this.id);
        this.getDataGroupedYear(this.project.id, this.id);
        this.getDataGroupedYearAssigned(this.project.id, this.id);
        this.getDataOrderCreated(this.project.id, this.kpiselectedoptionordercreated, this.id);
        this.getDataGroupedByLocation(this.project.id, this.kpiselectedoptiongroupedbyuser, this.id);
        this.getDataGroupedByUser(this.project.id, this.kpiselectedoptiongroupedbyuser, this.id);
      }
    }

  }

	ngOnDestroy(){
		if(this.subscription){
			this.subscription.unsubscribe();
			//console.log("ngOnDestroy unsuscribe");
		}
  }
  
  onResize(event) {
    //console.log(event.target.innerWidth);
    if(event.target.innerWidth > 1080){
      this.view = [700, 400];
      return;
    }
    let param = event.target.innerWidth / 7;    
    if(param < 400){
      param = 400;
    }
    this.view = [param, 400];
    //console.log(this.viewline);
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

    this._kpiService.getProjectKpiServiceByLocation(this.token.token, id, country, termino, status, service)
    .then(
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
                  porcentaje = Math.round(porcentaje);
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
      .catch((err) => {console.log(err);})   
  }


  public getDataUsers(id:number, termino:string, status:number, service:number){

    if(!id && !service){
      return;
    }


    this.isLoadingKpiUser = true;
    this.kpitotaluser = 0;
    this.kpidatauser = [];
    this.countuser = 0 ;

    this._kpiService.getProjectKpiServiceByUsers(this.token.token, id, termino, status, service)
    .then(
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
                  porcentaje = Math.round(porcentaje);
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
    .catch((err) => {console.log(err);})    
  }

  public getDataTimeAvg(id:number, termino:string, service:number){

    if(!id || !service || !termino){
      return;
    }


    this.isLoadingKpiTime = true;
    this.kpidatatimeavg = [];

    this._kpiService.getProjectKpiServiceByTimeAvg(this.token.token, id, termino, service)
    .then(
      (res: any) => 
      {
        res.subscribe(
          (some:any) => 
          {
            //console.log(some);
            if(some && some.datos && some.datos.length > 0){
              const that = this;
              that.promedio = some.datos.length;
              for (let i = 0; i < some.datos.length; i++) {
                this.kpidatatimeavg.push(some.datos[i]);
                const splits = some.datos[i]['time'].split(' ');
                if(splits && splits.length == 3){
                  let hour = splits[0].split("h");
                  hour = hour[0];
                  if(isNumeric(hour)){
                    that.hours = that.hours + Number(hour);
                  }                  
                  let minute = splits[1].split("m");
                  minute = minute[0];
                  if(isNumeric(minute)){
                    this.minutes = this.minutes + Number(minute);
                  }
                  let second = splits[2].split("s");
                  second = second[0];
                  if(isNumeric(second)){
                    this.seconds = this.seconds + Number(second);
                  }                  
                }
              }

              if (this.kpidatatimeavg.length === some.datos.length) {
                this.isLoadingKpiTime = false;
                //console.log(this.promedio);
                //console.log(this.hours);
                //console.log(this.minutes);
                //console.log(this.seconds);

                this.hours = Math.round(this.hours/this.promedio);
                this.minutes = Math.round(this.minutes/this.promedio);
                this.seconds = Math.round(this.seconds/this.promedio);
                //console.log(this.kpidatatimeavg);
              }
              
            }
          },
          (error:any) => { 
          this.isLoadingKpiTime = false;
          this.kpidatatimeavg = [];
          console.log(<any>error);
          }  
          )
      })
    .catch((err) => {console.log(err);})      
  }

  public getDataGroupedYear(id:number, service:number){
    if(!id || !service){
      return;
    }

    this.isLoadingKpiYear = true;
    this.kpidatayear[0].series.length = 0;
    this.kpidatayear[0].name = "";



    this._kpiService.getProjectKpiServiceByGroupedYear(this.token.token, id, service)
    .then(
      (res: any) => 
      {
        res.subscribe(
          (some:any) => 
          {
            //console.log(some);
            if(some && some.datos && some.datos.length > 0){
              for (let i = 0; i < some.datos.length; i++) {
                this.kpidatayear[0].name = some.datos[i]['service_name'];
                this.kpidatayear[0].series.push({ name: some.datos[i]['fecha'] + ': ' + some.datos[i]['user_count'], value: some.datos[i]['user_count'] });
              }

              if (this.kpidatayear[0].series.length === some.datos.length) {
                this.isLoadingKpiYear = false;
                //console.log(this.kpidatayear);
              }
              
            }
          },
          (error:any) => { 
          this.isLoadingKpiYear = false;
          this.kpidatayear[0].series.length = 0;
          this.kpidatayear[0].name = "";      
          console.log(<any>error);
          }  
          )
      })
    .catch((err) => {console.log(err);})  
  }

  public getDataGroupedYearAssigned(id:number, service:number){
    if(!id || !service){
      return;
    }

    this.isLoadingKpiYearAssigned = true;
    this.kpidatayearassigned[0].series.length = 0;
    this.kpidatayearassigned[0].name = "";

    this._kpiService.getProjectKpiServiceByGroupedYearAssigned(this.token.token, id, service)
    .then(
      (res: any) => 
      {
        res.subscribe(
          (some:any) => 
          {
            console.log(some);
            if(some && some.datos && some.datos.length > 0){
              for (let i = 0; i < some.datos.length; i++) {
                this.kpidatayearassigned[0].name = some.datos[i]['service_name'];
                this.kpidatayearassigned[0].series.push({ name: some.datos[i]['fecha'] + ': ' + some.datos[i]['user_count'], value: some.datos[i]['user_count'] });
              }

              if (this.kpidatayearassigned[0].series.length === some.datos.length) {
                this.isLoadingKpiYearAssigned = false;
                //console.log(this.kpidatayear);
              }
              
            }
          },
          (error:any) => { 
          this.isLoadingKpiYearAssigned = false;
          this.kpidatayearassigned[0].series.length = 0;
          this.kpidatayearassigned[0].name = "";      
          console.log(<any>error);
          }  
          )
      })
    .catch((err) => {console.log(err);})  
  }



  public getDataGroupedByLocation(id:number, termino:string, service:number){

    if(!id || !service || !termino){
      return;
    }


    this.isLoadingKpiGroupedByLocation = true;
    this.kpidatagrupedbylocation = [];
    this.promediogroupedlocation = 0;
    this.countassignedlocation = 0;
    this.countupdatelocation = 0;
    let orderassignedto = [];
    let orderupdate = [];
    let countassigned: number = 0;
    let countupdate: number = 0;

    this._kpiService.getProjectKpiGroupedByLocation(this.token.token, id, termino, service)
    .then(
      (res: any) => 
      {
        res.subscribe(
          (some:any) => 
          {
            //console.log(some);
            if(some){

              if(some.datos && some.datos.length > 0){
                for (let i = 0; i < some.datos.length; i++) {
                  orderassignedto.push(some.datos[i]);
                }
              }

              if(some.datosupdate && some.datosupdate.length > 0){
                for (let x = 0; x < some.datosupdate.length; x++) {
                  orderupdate.push(some.datosupdate[x]);
                }
              }

              if(orderassignedto.length > 0 && orderupdate.length > 0){
                if(orderassignedto.length === some.datos.length && orderupdate.length === some.datosupdate.length){
                  //console.log(orderassignedto);
                  //console.log(orderupdate);                
                  if(orderassignedto.length > orderupdate.length || orderassignedto.length === orderupdate.length){
                      for(let y = 0; y < orderassignedto.length; y++){
                        let result = orderassignedto[y];                        
                        if(result && result.id){
                          const obj = this.findObjectByKey(orderupdate, 'id', result.id);
                          if(obj){
                            countassigned = countassigned + result.user_count;
                            countupdate = countupdate + obj.user_count;
                            const object: OrderCreated = {
                              name: result.region_name+'/'+result.commune_name,
                              series: [{ name: 'Asignadas', value: result.user_count }, { name: 'Editadas', value: obj.user_count }]
                            };

                            this.kpidatagrupedbylocation[y] = object;         
                          }else{
                            countassigned = countassigned + result.user_count;
                            countupdate = countupdate + 0;
                            const object: OrderCreated = {
                              name: result.region_name+'/'+result.commune_name,
                              series: [{ name: 'Asignadas', value: result.user_count }, { name: 'Editadas', value: 0 }]
                            };
                            this.kpidatagrupedbylocation[y] = object;
                          }
                        }
                      }
                  }

                  if(orderassignedto.length < orderupdate.length){
                      for(let y = 0; y < orderupdate.length; y++){
                        let result = orderupdate[y];
                        if(result && result.id){
                          const obj = this.findObjectByKey(orderassignedto, 'id', result.id);
                          if(obj){
                            countassigned = countassigned + obj.user_count;
                            countupdate = countupdate + result.user_count;
                            const object: OrderCreated = {
                              name: result.region_name+'/'+result.commune_name,
                              series: [{ name: 'Asignadas', value: obj.user_count }, { name: 'Editadas', value: result.user_count }]
                            };
                            this.kpidatagrupedbylocation[y] = object;         
                          }else{
                            countassigned = countassigned + 0;
                            countupdate = countupdate + result.user_count;
                            const object: OrderCreated = {
                              name: result.region_name+'/'+result.commune_name,
                              series: [{ name: 'Asignadas', value: 0 }, { name: 'Editadas', value: result.user_count }]
                            };
                            this.kpidatagrupedbylocation[y] = object;
                          }
                        }
                      }
                  }
                }
              }

              if(orderassignedto.length > 0 && orderupdate.length === 0){
                for(let y = 0; y < orderassignedto.length; y++){
                  let result = orderassignedto[y];                        
                  if(result && result.id){
                    const obj = this.findObjectByKey(orderupdate, 'id', result.id);
                    if(obj){
                      countassigned = countassigned + result.user_count;
                      countupdate = countupdate + obj.user_count;
                      const object: OrderCreated = {
                        name: result.region_name+'/'+result.commune_name,
                        series: [{ name: 'Asignadas', value: result.user_count }, { name: 'Editadas', value: obj.user_count }]
                      };
                      this.kpidatagrupedbylocation[y] = object;         
                    }else{
                      countassigned = countassigned + result.user_count;
                      countupdate = countupdate + 0;
                      const object: OrderCreated = {
                        name: result.region_name+'/'+result.commune_name,
                        series: [{ name: 'Asignadas', value: result.user_count }, { name: 'Editadas' , value: 0 }]
                      };
                      this.kpidatagrupedbylocation[y] = object;
                    }
                  }
                }
              }



              if(this.kpidatagrupedbylocation && this.kpidatagrupedbylocation.length > 0){
                if(some.datos && some.datos.length > 0 && this.kpidatagrupedbylocation.length === some.datos.length){
                  //console.log(this.kpidatagrupedbylocation);
                  this.countassignedlocation = countassigned;
                  this.countupdatelocation = countupdate;
                  this.promediogroupedlocation = Math.round((countupdate*100)/countassigned);
                  this.isLoadingKpiGroupedByLocation = false;
                }
                if(some.datosupdate && some.datosupdate.length > 0 && this.kpidatagrupedbylocation.length === some.datosupdate.length){
                  //console.log(this.kpidatagrupedbylocation);
                  this.countassignedlocation = countassigned;
                  this.countupdatelocation = countupdate;
                  this.promediogroupedlocation = Math.round((countupdate*100)/countassigned);
                  this.isLoadingKpiGroupedByLocation = false;                  
                }
              }
            }//END SOME
          },
          (error:any) => { 
          this.isLoadingKpiGroupedByLocation = false;
          this.kpidatagrupedbylocation = [];
          console.log(<any>error);
          }  
          )
      })
      .catch((err) => {console.log(err);})      
  }



  public getDataGroupedByUser(id:number, termino:string, service:number){

    if(!id || !service || !termino){
      return;
    }


    this.isLoadingKpiGroupedByUser = true;
    this.kpidatagrupedbyuser = [];
    this.promediogropeduser = 0;
    this.countassigned = 0;
    this.countupdate = 0;
    let orderassignedto = [];
    let orderupdate = [];
    let countassigned: number = 0;
    let countupdate: number = 0;

    this._kpiService.getProjectKpiGroupedByUser(this.token.token, id, termino, service).then(
      (res: any) => 
      {
        res.subscribe(
          (some:any) => 
          {
            //console.log(some);
            if(some){

              if(some.datos && some.datos.length > 0){
                for (let i = 0; i < some.datos.length; i++) {
                  orderassignedto.push(some.datos[i]);
                }
              }

              if(some.datosupdate && some.datosupdate.length > 0){
                for (let x = 0; x < some.datosupdate.length; x++) {
                  orderupdate.push(some.datosupdate[x]);
                }
              }

              if(orderassignedto.length > 0 && orderupdate.length > 0){
                if(orderassignedto.length === some.datos.length && orderupdate.length === some.datosupdate.length){
                  //console.log(orderassignedto);
                  //console.log(orderupdate);                
                  if(orderassignedto.length > orderupdate.length || orderassignedto.length === orderupdate.length){
                      for(let y = 0; y < orderassignedto.length; y++){
                        let result = orderassignedto[y];                        
                        if(result && result.id){
                          const obj = this.findObjectByKey(orderupdate, 'id', result.id);
                          if(obj){
                            countassigned = countassigned + result.user_count;
                            countupdate = countupdate + obj.user_count;
                            const object: OrderCreated = {
                              name: result.name+' '+result.surname,
                              series: [{ name: 'Asignadas', value: result.user_count }, { name: 'Editadas', value: obj.user_count }]
                            };

                            this.kpidatagrupedbyuser[y] = object;         
                          }else{
                            countassigned = countassigned + result.user_count;
                            countupdate = countupdate + 0;
                            const object: OrderCreated = {
                              name: result.name+' '+result.surname,
                              series: [{ name: 'Asignadas', value: result.user_count }, { name: 'Editadas', value: 0 }]
                            };
                            this.kpidatagrupedbyuser[y] = object;
                          }
                        }
                      }
                  }

                  if(orderassignedto.length < orderupdate.length){
                      for(let y = 0; y < orderupdate.length; y++){
                        let result = orderupdate[y];
                        if(result && result.id){
                          const obj = this.findObjectByKey(orderassignedto, 'id', result.id);
                          if(obj){
                            countassigned = countassigned + obj.user_count;
                            countupdate = countupdate + result.user_count;
                            const object: OrderCreated = {
                              name: result.name+' '+result.surname,
                              series: [{ name: 'Asignadas', value: obj.user_count }, { name: 'Editadas', value: result.user_count }]
                            };
                            this.kpidatagrupedbyuser[y] = object;         
                          }else{
                            countassigned = countassigned + 0;
                            countupdate = countupdate + result.user_count;
                            const object: OrderCreated = {
                              name: result.name+' '+result.surname,
                              series: [{ name: 'Asignadas', value: 0 }, { name: 'Editadas', value: result.user_count }]
                            };
                            this.kpidatagrupedbyuser[y] = object;
                          }
                        }
                      }
                  }
                }
              }

              if(orderassignedto.length > 0 && orderupdate.length === 0){
                for(let y = 0; y < orderassignedto.length; y++){
                  let result = orderassignedto[y];                        
                  if(result && result.id){
                    const obj = this.findObjectByKey(orderupdate, 'id', result.id);
                    if(obj){
                      countassigned = countassigned + result.user_count;
                      countupdate = countupdate + obj.user_count;
                      const object: OrderCreated = {
                        name: result.name+' '+result.surname,
                        series: [{ name: 'Asignadas', value: result.user_count }, { name: 'Editadas', value: obj.user_count }]
                      };
                      this.kpidatagrupedbyuser[y] = object;         
                    }else{
                      countassigned = countassigned + result.user_count;
                      countupdate = countupdate + 0;
                      const object: OrderCreated = {
                        name: result.name+' '+result.surname,
                        series: [{ name: 'Asignadas', value: result.user_count }, { name: 'Editadas' , value: 0 }]
                      };
                      this.kpidatagrupedbyuser[y] = object;
                    }
                  }
                }
              }



              if(this.kpidatagrupedbyuser && this.kpidatagrupedbyuser.length > 0){
                if(some.datos && some.datos.length > 0 && this.kpidatagrupedbyuser.length === some.datos.length){
                  //console.log(this.kpidatagrupedbyuser);
                  this.countassigned = countassigned;
                  this.countupdate = countupdate;
                  this.promediogropeduser = Math.round((countupdate*100)/countassigned);
                  this.isLoadingKpiGroupedByUser = false;
                }
                if(some.datosupdate && some.datosupdate.length > 0 && this.kpidatagrupedbyuser.length === some.datosupdate.length){
                  //console.log(this.kpidatagrupedbyuser);
                  this.countassigned = countassigned;
                  this.countupdate = countupdate;
                  this.promediogropeduser = Math.round((countupdate*100)/countassigned);
                  this.isLoadingKpiGroupedByUser = false;                  
                }
              }
            }//END SOME
          },
          (error:any) => { 
          this.isLoadingKpiGroupedByUser = false;
          this.kpidatagrupedbyuser = [];
          console.log(<any>error);
          }  
          )
      })
      .catch((err) => {console.log(err);})     
  }


  public getDataOrderCreated(id:number, termino:string, service:number){
    if(!id || !service || !termino){
      return;
    }

    this.isLoadingKpiOrderCreated = true;
    this.kpidataOrderCreated = [];
    this.promedioordercreated = 0;

    this._kpiService.getProjectKpiServiceByOrderCreated(this.token.token, id, termino, service).then(
      (res: any) => 
      {
        res.subscribe(
          (some:any) => 
          {
            //console.log(some);
            if(some && some.datos && some.datos.length > 0){
              for (let i = 0; i < some.datos.length; i++) {
                this.kpidataOrderCreated.push(some.datos[i]);
                if(some.datos[i]['user_count']){
                  this.promedioordercreated = this.promedioordercreated + some.datos[i]['user_count'];
                }
              }
              if (this.kpidataOrderCreated.length === some.datos.length) {
                this.isLoadingKpiOrderCreated = false;
                this.promedioordercreated = Math.round(this.promedioordercreated / some.datos.length);
              }
              
            }
          },
          (error:any) => { 
          this.isLoadingKpiOrderCreated = false;
          this.kpidataOrderCreated = [];
          this.promedioordercreated = 0;
          console.log(<any>error);
          }  
          )
      })
      .catch((err) => {console.log(err);})       

  }


  selectChangeKpi(event:any){
    this.getData(this.project.id, this.project.country_id, this.kpiselectedoption, this.kpiselectstatus, this.id);
    //console.log(event);
  }

  selectChangeKpiStatus(event:any){
    this.getData(this.project.id, this.project.country_id, this.kpiselectedoption, this.kpiselectstatus, this.id);
    //console.log(event);
  }

  selectChangeKpiTime(event:any){
    this.getDataTimeAvg(this.project.id, this.kpiselectedoptiontime, this.id);
    //console.log(event);
  }


  selectChangeKpiUser(event:any){
    this.getDataUsers(this.project.id, this.kpiselectedoptionuser, this.kpiselectstatususer, this.id);
  }

  selectChangeKpiStatusUser(event:any){
    this.getDataUsers(this.project.id, this.kpiselectedoptionuser, this.kpiselectstatususer, this.id);
  }

  selectChangeKpiOrderCreated(event:any){
    this.getDataOrderCreated(this.project.id, this.kpiselectedoptionordercreated, this.id);    
  }

  selectChangeKpiGroupedLocation(event:any){
    this.getDataGroupedByLocation(this.project.id, this.kpiselectedoptiongroupedbylocation, this.id);
  }

  selectChangeKpiGroupedUser(event:any){
    this.getDataGroupedByUser(this.project.id, this.kpiselectedoptiongroupedbyuser, this.id);
  }


  findObjectByKey(array, key, value) {
    for (let i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
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

export interface OrderCreated{  
      name: string,
      series: [
        {
         name: string,
         value: number
        },
        {
          name: string,
          value: number
         }        
      ] 
}