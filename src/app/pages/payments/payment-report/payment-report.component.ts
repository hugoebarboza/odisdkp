import { Component, OnInit, Input } from '@angular/core';

//SERVICES
import { PaymentService, UserService } from 'src/app/services/service.index';


@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.css']
})
export class PaymentReportComponent implements OnInit {

  @Input() id: number;
  @Input() kpiselectedoption: string;

  isLoading: boolean = true;
  kpipayment = [];
  kpidatatable = [];
  kpitotalactivity:number = 0;
  kpitotalactivityvalue:number = 0;
  kpitotalrevenue:number = 0;
  service:any; 
  token:any;


  //CHART OPTIONS
  view: any[] = [1280, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = '';

  colorScheme = {
    domain: ['#5AA454', '#6a5acd', '#C7B42C', '#AAAAAA']
  };


  constructor(
    private _kpiPayment: PaymentService,
    private _userService: UserService,
    
  ) { 
    this.token = this._userService.getToken();

  }

  ngOnInit() {
    if(this.id > 0){
      if(!this.kpiselectedoption){
        this.kpiselectedoption = 'month';
      }    
      this.getData(this.id);
    }
  }

  onResize(event:any) {
    //console.log(event.target.innerWidth);
    if(event.target.innerWidth > 1080){
      let param = event.target.innerWidth / 1.65;
      if(param < 400){
        param = 400;
      }
      this.view = [param, 400];
    }
  }


  async getData(id:number){
    await this.getDataPayment(id)
    .then((data)=>{ 
      if(data && data.datos){
        console.log(data.datos);
        let index:number = 0;
        let count: number = 0;
        let activityvalue: number = 0;
        let revenue:number = 0;
        //this.kpipayment = data.datos;
        for(let i = 0; i < data.datos.length; i++){
            count = count + Number(data.datos[i]['user_count']);
            activityvalue = activityvalue + Number(data.datos[i]['value']);
            revenue = revenue + Number(data.datos[i]['value_count']);
            if(revenue > 0){
              const object: Single = {
                name: data.datos[i]['name'],
                value: data.datos[i]['value_count'],
              };
  
              const objecttable: Table = {
                name: data.datos[i]['name'],
                date: data.datos[i]['date'],
                activity: data.datos[i]['user_count'],
                value: data.datos[i]['value'],
                revenue: data.datos[i]['value_count']
              }
              if(object){
                this.kpipayment.push(object);
                
              }
              if(objecttable){
                this.kpidatatable.push(objecttable);
              }  
            }
        index = index + 1;
        }
        if(this.kpipayment.length === data.datos.length){
          this.isLoading = false;
          this.kpitotalactivity = count;
          this.kpitotalactivityvalue = activityvalue;
          this.kpitotalrevenue = revenue;
          if(this.kpitotalactivity && this.kpitotalactivityvalue && this.kpitotalrevenue){
            const objecttable: Table = {
              name: "Totales:",
              date: "",
              activity: this.kpitotalactivity,
              value: this.kpitotalactivityvalue,
              revenue: this.kpitotalrevenue
            }
            this.kpidatatable.push(objecttable);  
          }
        }

        if((index === data.datos.length) && (this.kpipayment.length === 0)){
          this.isLoading = false;
        }

      }
    })
    .catch((error)=>{ 
      console.log(error);
      this.kpipayment = [];
      this.isLoading = false;
    });
    
  }

  getDataPayment(id:number){
    this.kpipayment = [];
    this.kpitotalactivity = 0;
    this.kpitotalrevenue = 0;
    if(id && id > 0){
      return this._kpiPayment.getProjectPayment(this.token, id, this.kpiselectedoption);
    }
  }



  

}

export interface Single {
  name: String;
  value: number;
}

export interface Table {
  name: String;
  date: String;
  activity: number;
  value:number,
  revenue:number
}
