import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';


//MODELS
import { Month } from 'src/app/models/types';


//SERVICES
import { KpiService, OrderserviceService, UserService } from 'src/app/services/service.index';

//MOMENT
import * as _moment from 'moment';
const moment = _moment;



@Component({
  selector: 'app-kpi-project-forecast',
  templateUrl: './kpi-project-forecast.component.html',
  styleUrls: ['./kpi-project-forecast.component.css']
})
export class KpiProjectForecastComponent implements OnInit, OnChanges {

  @Input() id: number;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  displayedColumns: string[] = [];
  count:number = 0;
  identity: any;
  isLoading: boolean = true;
  isLoadingchart: boolean = true;
  isLoadingchartsingle: boolean = true;
  isMobile: any;
  mesactual: any;
  months: Month[] = [
    {value: 1, name: 'January'},
    {value: 2, name: 'February'},
    {value: 3, name: 'March'},
    {value: 4, name: 'April'},
    {value: 5, name: 'May'},
    {value: 6, name: 'June'},
    {value: 7, name: 'July'},
    {value: 8, name: 'August'},
    {value: 9, name: 'September'},
    {value: 10, name: 'October'},
    {value: 11, name: 'November'},
    {value: 12, name: 'December'}
  ];
  kpidata = [];
  kpidatasingle = [];
  kpidataforecast = [];
  kpidatavertical = [
    {name: 'January', series: [] },
    {name: 'February', series: [] },
    {name: 'March', series: []},
    {name: 'April', series: []},
    {name: 'May', series: []},
    {name: 'June', series: []},
    {name: 'July', series: []},
    {name: 'August', series: []},
    {name: 'September', series: []},
    {name: 'October', series: []},
    {name: 'November', series: []},
    {name: 'December', series: []},
    {name: 'Forecast', series: []}
  ];


  kpiTableData = new MatTableDataSource();
  project: any;
  proyectos: any;
  serviceestatus = [];
  subscription: Subscription;
  token:any;
  year: number;

  //CHART OPTIONS
  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Fecha';
  showYAxisLabel = true;
  yAxisLabel = 'Estatus';

  colorScheme = {
    domain: ['#5AA454','#C7B42C','#A10A28','#AAAAAA']
  };


  constructor(
    private _kpiService: KpiService,
    private _orderService: OrderserviceService,
    private _userService: UserService,
  ) { 
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();
    this.year = new Date().getFullYear();
    //console.log(this.year);
  }

  ngOnInit() {
  }

  ngOnChanges(_changes: SimpleChanges) {

    const mm = moment().month('month').format('MM');
    this.displayedColumns = [];
    this.displayedColumns = ['status'];

    let count = 1;
    for (let e = 0; e < this.months.length; e++) {
        // tslint:disable-next-line:radix
        if ( parseInt(mm) === this.months[e]['value']) {
          this.mesactual = this.months[e]['name'];
        }
        // tslint:disable-next-line:radix
        if ( e >= (parseInt(mm) - 3) && e <= (parseInt(mm) - 1)) {
          this.displayedColumns[count] = this.months[e]['name'];
          count = count + 1;
        }
    }

    this.displayedColumns[4] = "Forecast";


    if(this.id > 0){
      this.project = this.filterProjectByService();
      if(this.project && this.project.id > 0 && this.displayedColumns.length > 0){
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
                      this.getData(this.serviceestatus);
                    }                  }
                  },
                  (error:any) => { 
                  console.log(<any>error);
                  });    
    }
  }

  public getData(status:any){

    //console.log(status);
    //console.log(this.displayedColumns);
  
    this.kpidata = [];

    if(status.length > 0 && this.displayedColumns.length > 0){        
        for(let x = 0; x < status.length; x++){
          const estatus: object = {};
          estatus['status'] = status[x]['name'];
          let forecast = [];          
          for(let i = 1; i < (this.displayedColumns.length - 1); i++){

              this._kpiService.getProjectKpiServiceByStatusAndDate(this.token.token, this.project.id, this.displayedColumns[i], this.year, status[x].id, this.id).then(
                (res: any) => 
                {
                  res.subscribe(
                    (some:any) => 
                    {

                      if(some && some.datos && some.datos.length > 0){                      
                        const object: Element = {
                          desc_mes: this.displayedColumns[i],
                          produccion: some.datos[0]['user_count'],
                        };
                        const data: Data = {
                          name: this.displayedColumns[i],
                          s: { name: status[x]['name'], value: some.datos[0]['user_count'] }
                        };                      
                        
                        if(this.kpidatavertical.find( ({ name }) => name === data.name )){
                          const index = this.kpidatavertical.findIndex( ({ name }) => name === data.name );
                          this.kpidatavertical[index].series.push(data.s);

                          if(this.kpidatasingle.find( ({ name }) => name === data.s.name )){
                            //console.log(data.s);
                            //console.log(idx);
                            //console.log(this.kpidatasingle);
                            const idx = this.kpidatasingle.findIndex( ({ name }) => name === data.s.name );
                            let value = this.kpidatasingle[idx].value;
                            this.kpidatasingle[idx].value = value + data.s.value;
                          }else{
                            this.kpidatasingle.push(data.s);
                          }

                        }
                        

                        estatus[this.displayedColumns[i]] = object;
                        forecast.push(object.produccion);
                        this.count = this.count + 1;
                        
                        if(forecast.length === 3){
                          let prevision = 0;                                              
                          forecast.forEach(res => {
                            prevision = prevision + res;
                          })
                          prevision = Math.round(prevision / 3);
                          const object: Element = {
                            desc_mes: this.displayedColumns[4],
                            produccion: prevision,
                          };
                          const data: Data = {
                            name: this.displayedColumns[4],
                            s: { name: status[x]['name'], value: prevision }
                          };
    
                          if(this.kpidatavertical.find( ({ name }) => name === data.name )){
                            const index = this.kpidatavertical.findIndex( ({ name }) => name === data.name );
                            this.kpidatavertical[index].series.push(data.s);

                            if(this.kpidatasingle.find( ({ name }) => name === data.s.name )){
                              const idx = this.kpidatasingle.findIndex( ({ name }) => name === data.s.name );
                              let value = this.kpidatasingle[idx].value;
                              this.kpidatasingle[idx].value = value + data.s.value;
                            }else{
                              this.kpidatasingle.push(data.s);
                            }
  
                          } 

                          estatus[this.displayedColumns[4]] = object;
                          this.count = this.count + 1;
                          if(this.count == (this.serviceestatus.length * 4)){
                            this.isLoading = false;
                          }                  
                        }

                      }

                      this.kpidata[x] = estatus;
        
                      if (this.kpidata && this.kpidata.length === status.length) {
                        if(this.kpidatavertical && this.kpidatavertical.length > 0){
                          this.GroupedVertical(this.kpidatavertical);
                        }
                        this.kpiTableData = new MatTableDataSource(this.kpidata);
                        this.kpiTableData.paginator = this.paginator;
                        this.kpiTableData.sort = this.sort;            
                      }

                    },
                    (error:any) => {
                    if(error.error.codigo == 401){
                      const object = {
                        desc_mes: this.displayedColumns[i],
                        produccion: 0,
                      };
                      const data: Data = {
                        name: this.displayedColumns[i],
                        s: { name: status[x]['name'], value: 0 }
                      };

                      if(this.kpidatavertical.find( ({ name }) => name === data.name )){
                        const index = this.kpidatavertical.findIndex( ({ name }) => name === data.name );
                        this.kpidatavertical[index].series.push(data.s);

                        if(this.kpidatasingle.find( ({ name }) => name === data.s.name )){
                          const idx = this.kpidatasingle.findIndex( ({ name }) => name === data.s.name );
                          let value = this.kpidatasingle[idx].value;
                          this.kpidatasingle[idx].value = value + data.s.value;
                        }else{
                          this.kpidatasingle.push(data.s);
                        }
                        
                      }
                      
                      estatus[this.displayedColumns[i]] = object;
                      forecast.push(object.produccion);
                      this.count = this.count + 1;

                      if(forecast.length === 3){
                        let prevision = 0;
                        forecast.forEach(res => {
                          prevision = prevision + res;
                        })
                        prevision = Math.round(prevision / 3);
                        const object: Element = {
                          desc_mes: this.displayedColumns[4],
                          produccion: prevision,
                        };
                        const data: Data = {
                          name: this.displayedColumns[4],
                          s: { name: status[x]['name'], value: prevision }
                        };
    
                        if(this.kpidatavertical.find( ({ name }) => name === data.name )){
                          const index = this.kpidatavertical.findIndex( ({ name }) => name === data.name );
                          this.kpidatavertical[index].series.push(data.s);

                          if(this.kpidatasingle.find( ({ name }) => name === data.s.name )){
                            const idx = this.kpidatasingle.findIndex( ({ name }) => name === data.s.name );
                            let value = this.kpidatasingle[idx].value;
                            this.kpidatasingle[idx].value = value + data.s.value;
                          }else{
                            this.kpidatasingle.push(data.s);
                          }


                        }  

                        estatus[this.displayedColumns[4]] = object;
                        this.count = this.count + 1;
                        if(this.count == (this.serviceestatus.length * 4)){
                          this.isLoading = false;
                        }                  
                      }

                      this.kpidata[x] = estatus;
        
                      if (this.kpidata && this.kpidata.length === status.length) {
                        if(this.kpidatavertical && this.kpidatavertical.length > 0){
                          this.GroupedVertical(this.kpidatavertical);                          
                        }
                        this.kpiTableData = new MatTableDataSource(this.kpidata);
                        this.kpiTableData.paginator = this.paginator;
                        this.kpiTableData.sort = this.sort;            
                      }  
                      
                      
                    }
                    console.log(<any>error);
                    }  
                    )
                })
          }          
        }            
    }

  }

  GroupedVertical(data:any){
    this.kpidataforecast = [];
    for(let i = 0; i < data.length; i++){
      if(data[i] && data[i].series.length>1){
        this.kpidataforecast.push(data[i]);
      }
    }

    if(this.kpidataforecast.length === 4){
      this.isLoadingchart = false;
      this.isLoadingchartsingle = false;
    }
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

export interface Data{
  name: string,
  s: 
    {
     name: string,
     value: number
    }  
}


export interface Element {
  desc_mes: String;
  produccion: number;
}



export interface Single {
  name: String;
  value: number;
}
