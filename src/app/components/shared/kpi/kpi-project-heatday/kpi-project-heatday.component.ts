import { Component, Input, SimpleChanges, OnChanges, OnDestroy, NgZone } from '@angular/core';
import { FormControl } from '@angular/forms';

// MODELS
import { PaymentService, UserService } from 'src/app/services/service.index';

// AMCHARTS
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';



@Component({
  selector: 'app-kpi-project-heatday',
  templateUrl: './kpi-project-heatday.component.html',
  styleUrls: ['./kpi-project-heatday.component.css']
})
export class KpiProjectHeatdayComponent implements OnChanges, OnDestroy {

  @Input() id: number;

  chartxy: any;
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


    {
      'hour': '24',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '01',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '02',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '03',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '04',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '05',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '06',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '07',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '08',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '09',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '10',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '11',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '12',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '13',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '14',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '15',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '16',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '17',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '18',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '19',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '20',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '21',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '22',
      'weekday': 'Tue',
      'value': 0
    },
    {
      'hour': '23',
      'weekday': 'Tue',
      'value': 0
    },



    {
      'hour': '24',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '01',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '02',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '03',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '04',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '05',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '06',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '07',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '08',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '09',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '10',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '11',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '12',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '13',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '14',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '15',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '16',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '17',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '18',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '19',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '20',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '21',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '22',
      'weekday': 'Wed',
      'value': 0
    },
    {
      'hour': '23',
      'weekday': 'Wed',
      'value': 0
    },



    {
      'hour': '24',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '01',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '02',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '03',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '04',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '05',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '06',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '07',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '08',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '09',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '10',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '11',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '12',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '13',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '14',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '15',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '16',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '17',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '18',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '19',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '20',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '21',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '22',
      'weekday': 'Thu',
      'value': 0
    },
    {
      'hour': '23',
      'weekday': 'Thu',
      'value': 0
    },




    {
      'hour': '24',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '01',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '02',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '03',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '04',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '05',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '06',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '07',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '08',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '09',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '10',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '11',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '12',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '13',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '14',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '15',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '16',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '17',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '18',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '19',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '20',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '21',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '22',
      'weekday': 'Fri',
      'value': 0
    },
    {
      'hour': '23',
      'weekday': 'Fri',
      'value': 0
    },




    {
      'hour': '24',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '01',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '02',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '03',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '04',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '05',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '06',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '07',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '08',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '09',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '10',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '11',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '12',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '13',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '14',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '15',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '16',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '17',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '18',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '19',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '20',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '21',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '22',
      'weekday': 'Sat',
      'value': 0
    },
    {
      'hour': '23',
      'weekday': 'Sat',
      'value': 0
    },


  ];

  constructor(
    private zone: NgZone,
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

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chartxy) {
          this.chartxy.dispose();
      }
    });
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
    this.isLoading = true;
    const datedesde = new FormControl();
    const datehasta = new FormControl();

    const data: any = await this._kpiPayment.getProjectServicePayment(this.token.token, project_id, service_id, term, datedesde.value, datehasta.value);

    if (data && data.datos) {
        this.isLoading = false;
        const that = this;
        data.datos.forEach(function (value: any) {
          for (let i = 0; i < that.calendar.length; i++) {
            if (that.calendar[i]['weekday'] === value['day'] && that.calendar[i]['hour'] === value['hour']) {
              const revenue = Number(value['value_count']);
              that.calendar[i]['value'] += revenue;
              break;
            }
          }
        });

        this.createamXYChart(this.calendar);

    } else {
      this.isLoading = false;
    }
  }

  createamXYChart(datasource: any[]) {

    if (datasource && datasource.length > 0) {

        this.zone.runOutsideAngular(() => {
          Promise.all([
          ])
          .then(() => {
            am4core.useTheme(am4themes_animated);
            // Themes end

            const chart = am4core.create('chartdivheatday', am4charts.XYChart);
            chart.maskBullets = false;

            const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            const yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

            xAxis.dataFields.category = 'weekday';
            yAxis.dataFields.category = 'hour';

            xAxis.renderer.grid.template.disabled = true;
            xAxis.renderer.minGridDistance = 40;

            yAxis.renderer.grid.template.disabled = true;
            yAxis.renderer.inversed = true;
            yAxis.renderer.minGridDistance = 30;

            const series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.categoryX = 'weekday';
            series.dataFields.categoryY = 'hour';
            series.dataFields.value = 'value';
            series.sequencedInterpolation = true;
            series.defaultState.transitionDuration = 3000;

            const bgColor = new am4core.InterfaceColorSet().getFor('background');

            const columnTemplate = series.columns.template;
            columnTemplate.strokeWidth = 1;
            columnTemplate.strokeOpacity = 0.2;
            columnTemplate.stroke = bgColor;
            // tslint:disable-next-line:quotemark
            columnTemplate.tooltipText = "{weekday}, {hour}: {value.workingValue.formatNumber('#.')}";
            columnTemplate.width = am4core.percent(100);
            columnTemplate.height = am4core.percent(100);

            series.heatRules.push({
              target: columnTemplate,
              property: 'fill',
              min: am4core.color(bgColor),
              max: chart.colors.getIndex(0)
            });

            // heat legend
            const heatLegend = chart.bottomAxesContainer.createChild(am4charts.HeatLegend);
            heatLegend.width = am4core.percent(100);
            heatLegend.series = series;
            heatLegend.valueAxis.renderer.labels.template.fontSize = 9;
            heatLegend.valueAxis.renderer.minGridDistance = 30;

            // heat legend behavior
            series.columns.template.events.on('over', function(event) {
              handleHover(event.target);
            });

            series.columns.template.events.on('hit', function(event) {
              handleHover(event.target);
            });

            function handleHover(column) {
              if (!isNaN(column.dataItem.value)) {
                heatLegend.valueAxis.showTooltipAt(column.dataItem.value);
              } else {
                heatLegend.valueAxis.hideTooltip();
              }
            }

            series.columns.template.events.on('out', function() {
              heatLegend.valueAxis.hideTooltip();
            });

            chart.data = datasource;

            this.chartxy = chart;
          })
          .catch(e => {
              console.error('Error when creating chart', e);
          });
      });
    }
  }

}
