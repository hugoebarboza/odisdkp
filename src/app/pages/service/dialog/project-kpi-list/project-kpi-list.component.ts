import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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
  kpidatesearchoptions = [
    {value: 'day', name: 'Día'},
    {value: 'week', name: 'Semana'},
    {value: 'month', name: 'Mes Actual'},
  ];
  kpidateselectedoption = '';
  kpidatadate = [];
  kpitotaldate: number = 0;
  proyectos: any;
  title:string = "Indicadores del Proyecto";
  token: any;
  //CHARTS OPTIONS DATE
  showLegend = true;
  showLabels = false;
  explodeSlices = false;
  doughnut = false;
  view = [400, 350];
  colorScheme = {
    domain: ['#C7B42C', '#5AA454', '#A10A28', '#AAAAAA', '#51a351', '#de473c']
  };


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

  ngOnInit() {
    this.kpidateselectedoption = 'day';
    if(this.data && this.data.project_id > 0){
      this.getProjectKpiDate(this.data.project_id, this.kpidateselectedoption);
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


  selectChangeKpiDate(event:any){
    this.getProjectKpiDate(this.data.project_id, event.value);
    //console.log(event.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }



}
