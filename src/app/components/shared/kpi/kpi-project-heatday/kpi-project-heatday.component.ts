import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

// MODELS
import { PaymentService, UserService } from 'src/app/services/service.index';


@Component({
  selector: 'app-kpi-project-heatday',
  templateUrl: './kpi-project-heatday.component.html',
  styleUrls: ['./kpi-project-heatday.component.css']
})
export class KpiProjectHeatdayComponent implements OnChanges {

  @Input() id: number;

  kpidata = [];
  identity: any;
  isLoading = true;
  proyectos: any;
  project: any;
  token: any;

  calendar = [
    {
      'hour': '24',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '01',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '02',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '03',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '04',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '05',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '06',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '07',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '08',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '09',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '10',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '11',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '12',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '13',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '14',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '15',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '16',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '17',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '18',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '19',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '20',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '21',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '22',
      'weekday': 'Sun',
      'value': 0
    },
    {
      'hour': '23',
      'weekday': 'Sun',
      'value': 0
    },


    {
      'hour': '24',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '01',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '02',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '03',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '04',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '05',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '06',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '07',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '08',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '09',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '10',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '11',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '12',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '13',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '14',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '15',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '16',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '17',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '18',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '19',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '20',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '21',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '22',
      'weekday': 'Mon',
      'value': 0
    },
    {
      'hour': '23',
      'weekday': 'Mon',
      'value': 0
    },


  ];

  constructor(
    private _kpiPayment: PaymentService,
    private _userService: UserService,
  ) {
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();
  }


  ngOnChanges(_changes: SimpleChanges) {
    if (this.id && this.id > 0) {
      this.project = this.filterProjectByService();
      if (this.project && this.project.id > 0) {
        this.getDataPaymentMonth(this.project.id, this.id, 'heatday');
      }
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

  async getDataPaymentMonth(project_id: number, service_id: number, term: string) {
    this.kpidata = [];
    this.isLoading = true;
    const datedesde = new FormControl();
    const datehasta = new FormControl();

    const data: any = await this._kpiPayment.getProjectServicePayment(this.token.token, project_id, service_id, term, datedesde.value, datehasta.value);
    console.log(data);
    if (data && data.datos) {
        this.isLoading = false;

        const result = [];
        data.forEach(function (value) {
          let repeat = false;
          for (let i = 0; i < this.calendar.length; i++) {
            if (result[i]['regioncode'] === value['regioncode']) {
              result[i]['produccion'] += value['produccion'];
              repeat = true;
              break;
            }
          }
          if (repeat === false) {
            const object = {
              regioncode: value['regioncode'],
              produccion: value['produccion']
            };
            result.push(object);
          }
        });

        /*
        const result = [];
        data.forEach(function (value) {
          let repeat = false;
          for (let i = 0; i < result.length; i++) {
            if (result[i]['regioncode'] === value['regioncode']) {
              result[i]['produccion'] += value['produccion'];
              repeat = true;
              break;
            }
          }
          if (repeat === false) {
            const object = {
              regioncode: value['regioncode'],
              produccion: value['produccion']
            };
            result.push(object);
          }
        }); */


        // console.log(this.kpipaymentprojectservicemonth);
        // this.createamPieChart(this.kpipaymentprojectservicemonth);

    } else {
      this.kpidata = [];
      this.isLoading = false;
    }
  }



}
