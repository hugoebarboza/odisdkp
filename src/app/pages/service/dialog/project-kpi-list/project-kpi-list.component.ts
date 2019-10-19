import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

//SERVICES
import { KpiService, OrderserviceService, UserService } from 'src/app/services/service.index';

@Component({
  selector: 'app-project-kpi-list',
  templateUrl: './project-kpi-list.component.html',
  styleUrls: ['./project-kpi-list.component.css']
})
export class ProjectKpiListComponent implements OnInit {

  identity: any;
  isLoadingResultsKpiDate: boolean = true;
  isLoadingResults: boolean = true;
  serviceestatus = [];
  subscription: Subscription;
  kpiselectstatus: any;
  kpidatesearchoptions = [
    {value: 'daydkp', name: 'Día'},
    {value: 'weekdkp', name: 'Semana'},
    {value: 'monthdkp', name: 'Mes Actual'},
    {value: 'yeardkp', name: 'Año Actual'}
  ];
  kpidatelinesearchoptions = [
    {value: 'day', name: 'Día'},
    {value: 'week', name: 'Semana'},
    {value: 'month', name: 'Mes Actual'},
    {value: 'year', name: 'Año Actual'},
  ];
  kpisearchoptions = [
    {value: 0, name: 'Todo'},
    {value: 1, name: 'Servicio'},
  ];


  kpidateselectedoption = '';
  kpiselectedoption = '';
  kpiselectservicio:any;
  kpioption: number = 0;
  kpidatadate = [];
  kpitotaldate: number = 0;

  kpidata = [];
  kpitotal: number = 0;
  kpitotalupdate: number = 0;
  kpitotalnoupdate: number = 0;

  project: any;
  proyectos: any;
  title:string = "Indicadores de Proyecto";
  token: any;
  //CHARTS OPTIONS DATE
  showLegend = true;
  showLabels = false;
  explodeSlices = false;
  doughnut = false;
  view = [550, 400];
  colorScheme = {
    domain: ['#C7B42C', '#5AA454', '#A10A28', '#AAAAAA', '#51a351', '#de473c']
  };

    //LINE OPTIONS
    viewline: any[] = [550, 400];
    viewallline: any[] = [700, 400];
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showXAxisLabel = true;
    showLegendLine = false;
    xAxisLabel = '(Fecha / Hora)';
    showYAxisLabel = true;
    yAxisLabel = 'N. Órdenes';
    autoScale = true;
    colorSchemeLine = {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
  
    multi = [
      {
        name: "N. Órdenes",
        series: [      
        ]
      },  
    ];  
  
    allmulti = [
      {
        name: "Editadas",
        series: [      
        ]
      },
      {
        name: "No Editadas",
        series: [      
        ]
      }      
    ];  


  constructor(
    private _kpiService: KpiService,
    private _orderService: OrderserviceService,
    private _userService: UserService,
    public dialogRef: MatDialogRef<ProjectKpiListComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { 
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();
  }

  onResize(event) {
    //console.log(event.target.innerWidth);
    if(event.target.innerWidth > 1080){
      this.viewline = [550, 400];
      return;
    }
    let param = event.target.innerWidth / 7;    
    if(param < 400){
      param = 400;
    }
    this.viewline = [param, 400];
    //console.log(this.viewline);
  }

  onResizeAllLine(event) {
    //console.log(event.target.innerWidth);
    if(event.target.innerWidth > 1080){
      this.viewallline = [700, 400];
      return;
    }
    let param = event.target.innerWidth / 7;    
    if(param < 700){
      param = 700;
    }
    this.viewallline = [param, 400];
    //console.log(this.viewline);
  }

  ngOnInit() {
    this.kpidateselectedoption = 'daydkp';
    this.kpiselectedoption =  'day';
    if(this.data && this.data.project_id > 0){
      this.project = this.filterProject();
      if(this.project){
        //console.log(this.project);
        this.getProjectKpiDateLineByDate(this.project.id, this.kpiselectedoption);
        this.getProjectKpiDate(this.project.id, this.kpidateselectedoption);
      /*
      this.kpiselectservicio = this.project.service[0]['id'];
      if(this.kpiselectservicio && this.kpiselectservicio > 0){
        //console.log(this.kpiselectservicio);
        this.getServiceEstatus(this.kpiselectservicio);
      }*/

      }
      
    }
  }


  filterProject(){
    if(this.proyectos && this.data.project_id > 0){
      for(var i = 0; i < this.proyectos.length; i += 1){
        var result = this.proyectos[i];
        if(result && result.id === this.data.project_id){
            return result;
        }
      }
    }
  }




  public getProjectKpiDateLineByDate(id:number, termino:string){
    this.isLoadingResults = true;
    if(id > 0 ){
      this.kpitotal = 0;
      this.kpitotalupdate = 0;
      this.kpitotalnoupdate = 0;
      this.kpidata = [];
      this.multi[0].series.length = 0;
      this.allmulti[0].series.length = 0;
      this.allmulti[1].series.length = 0;
      this._kpiService.getProjectKpiByDate(this.token.token, id, termino).then(
        (res: any) => 
        {
          res.subscribe(
            (some:any) => 
            {
              //console.log(some);
              //console.log(some.datos.length);
              //console.log(some.datosnoupdate.length);
              if(some && some.datos && some.datos.length > 0){                
                  for (let i = 0; i < some.datos.length; i++) {
                    if(some.datos[i]['hora']){
                      this.allmulti[0].series.push({ name: some.datos[i]['hora'] + ':00:00', value: some.datos[i]['user_count']});
                    }
                    if(some.datos[i]['fecha']){
                      this.allmulti[0].series.push({ name: some.datos[i]['fecha'], value: some.datos[i]['user_count']});
                    }

                    if(some.datos[i]['month']){
                      this.allmulti[0].series.push({ name: some.datos[i]['month'], value: some.datos[i]['user_count']});
                    }
                    this.kpitotal = this.kpitotal + some.datos[i]['user_count'];
                    this.kpitotalupdate = this.kpitotalupdate + some.datos[i]['user_count'];
                    this.allmulti[0].name = "Editadas: " + this.kpitotalupdate;
                  }
                this.isLoadingResults = false;
              }else{
                    this.allmulti[0].name = "Editadas: " + this.kpitotalupdate;
              }

              if(some && some.datosnoupdate && some.datosnoupdate.length > 0){
                  for (let i = 0; i < some.datosnoupdate.length; i++) {
                    if(some.datosnoupdate[i]['hora']){
                      this.allmulti[1].series.push({ name: some.datosnoupdate[i]['hora'] + ':00:00', value: some.datosnoupdate[i]['user_count']});
                    }
                    if(some.datosnoupdate[i]['fecha']){
                      this.allmulti[1].series.push({ name: some.datosnoupdate[i]['fecha'], value: some.datosnoupdate[i]['user_count']});
                    }

                    if(some.datosnoupdate[i]['month']){
                      this.allmulti[1].series.push({ name: some.datosnoupdate[i]['month'], value: some.datosnoupdate[i]['user_count']});
                    }
                    this.kpitotal = this.kpitotal + some.datosnoupdate[i]['user_count'];
                    this.kpitotalnoupdate = this.kpitotalnoupdate + some.datosnoupdate[i]['user_count'];
                    this.allmulti[1].name = "No Editadas: " + this.kpitotalnoupdate;

                  }
                this.isLoadingResults = false;
              }else{
                  this.allmulti[1].name = "No Editadas: " + this.kpitotalnoupdate;
              }


            },
            (error: any) => {
            this.allmulti[0].series.length = 0;
            this.allmulti[1].series.length = 0;
            this.multi[0].series.length = 0;
            this.isLoadingResults = false;
            console.log(<any>error);
            }
            );
        });
    }
  }


  public getProjectKpiDateLine(id:number, termino:string, status:number, service:number){
    this.isLoadingResults = true;
    if(id > 0 ){
      this.kpitotal = 0;
      this.kpidata = [];
      this.multi[0].series.length = 0;
      this.allmulti[0].series.length = 0;
      this._kpiService.getProjectKpiServiceByDate(this.token.token, id, termino, status, service).then(
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
                      this.multi[0].series.push({ name: some.datos[i]['hora'] + ':00:00', value: some.datos[i]['user_count']});
                      this.kpitotal = this.kpitotal + some.datos[i]['user_count'];
                      this.multi[0].name = "N. Órdenes: " + this.kpitotal;
                    }
                    if(some.datos[i]['fecha']){
                      this.multi[0].series.push({ name: some.datos[i]['fecha'], value: some.datos[i]['user_count']});
                      this.kpitotal = this.kpitotal + some.datos[i]['user_count'];
                      this.multi[0].name = "N. Órdenes: " + this.kpitotal;
                    }

                    if(some.datos[i]['month']){
                      this.multi[0].series.push({ name: some.datos[i]['month'], value: some.datos[i]['user_count']});
                      this.kpitotal = this.kpitotal + some.datos[i]['user_count'];
                      this.multi[0].name = "N. Órdenes: " + this.kpitotal;
                    }

                  }
                }
                //console.log(this.kpidata);
                this.isLoadingResults = false;
              }else{
                this.isLoadingResults = false;
              }
            },
            (error:any) => { 
            this.multi[0].series.length = 0;
            this.allmulti[0].series.length = 0;
            this.isLoadingResults = false;
            console.log(<any>error);
            }  
            )
        })         
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
                      if(some.datos[i]['service_name']){
                        this.kpidatadate[i] = { name: some.datos[i]['service_name'] + ': ' + some.datos[i]['user_count'], value: some.datos[i]['user_count']};
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

  public getServiceEstatus(id:number){
    this.serviceestatus = [];
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
                      if(this.project && this.project.id > 0 && this.kpiselectedoption && this.kpiselectstatus > 0 && this.kpiselectservicio > 0){
                        this.getProjectKpiDateLine(this.project.id, this.kpiselectedoption, this.kpiselectstatus, this.kpiselectservicio);
                      }
                    }              
                  }
                  });    
    }
  }  



  selectChangeKpiDate(event:any){
    this.getProjectKpiDate(this.data.project_id, event.value);
    //console.log(event.value);
  }

  selectChangeKpiDateLine(_event:any){
    //console.log(event);
    if(this.kpioption == 0){
      this.getProjectKpiDateLineByDate(this.project.id, this.kpiselectedoption);
    }
    if(this.kpioption == 1){
      this.getServiceEstatus(this.kpiselectservicio);
      return;
    }
  }
  
  selectChangeKpi(event:any){
    //console.log(event);
    if(event.value == 0){
      this.getProjectKpiDateLineByDate(this.project.id, this.kpiselectedoption);
    }
    if(event.value == 1){
      this.getServiceEstatus(this.kpiselectservicio);
      return;
    }
  }

  selectChangeKpiServicio(_event:any){
    //console.log(event);
    this.getServiceEstatus(this.kpiselectservicio);
  }

  selectChangeKpiStatus(event:any){
    //console.log(event);
    this.getProjectKpiDateLine(this.project.id, this.kpiselectedoption, event.id, this.kpiselectservicio);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }



}
