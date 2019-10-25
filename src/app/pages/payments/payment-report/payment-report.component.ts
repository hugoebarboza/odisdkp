import { Component, OnInit, Input, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TooltipPosition } from '@angular/material';

// MODELS
import { Month } from 'src/app/models/types';


// SERVICES
import { OrderserviceService, PaymentService, UserService } from 'src/app/services/service.index';

// MOMENT
import * as _moment from 'moment';
const moment = _moment;

// TOASTER MESSAGES
import { ToastrService } from 'ngx-toastr';

// AMCHART
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';


@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.css']
})
export class PaymentReportComponent implements OnInit {

  @Input() id: number;
  @Input() project: any;
  @Input() services = [];

  formulario: FormGroup;
  isLoading = true;
  isLoadingPaymentProject = true;
  isLoadingPaymentMonth = true;
  kpipayment = [];
  kpipaymentproject = [];
  kpipaymentprojectmonth = [];
  kpidateoption: any = [];
  kpidatatable = [];
  kpitotalactivity = 0;
  kpitotalactivityvalue = 0;
  kpitotalrevenue = 0;
  service: any;
  serviceestatus = [];
  servicetype = [];
  token: any;


  // CHART OPTIONS
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

  datesearchoptions = [
    {value: 'day', name: 'Día'},
    {value: 'week', name: 'Semana'},
    {value: 'month', name: 'Mes Actual'},
    {value: 'year', name: 'Año Actual'},
    {value: 'custom', name: 'Personalizado'},
  ];

  es = {
    firstDayOfWeek: 0,
    dayNames: [ 'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado' ],
    dayNamesShort: [ 'dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb' ],
    dayNamesMin: [ 'D', 'L', 'M', 'X', 'J', 'V', 'S' ],
    monthNames: [ 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
    'septiembre', 'octubre', 'noviembre', 'diciembre' ],
    monthNamesShort: [ 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic' ],
    today: 'Hoy',
    clear: 'Borrar'
  };

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


  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionheaderaction = new FormControl(this.positionOptions[2]);
  positiondatasourceaction = new FormControl(this.positionOptions[3]);
  positionleftaction = new FormControl(this.positionOptions[4]);
  positionrightaction = new FormControl(this.positionOptions[5]);


  constructor(
    private toasterService: ToastrService,
    private zone: NgZone,
    private _kpiPayment: PaymentService,
    private _orderService: OrderserviceService,
    private _userService: UserService,
  ) {
    this.token = this._userService.getToken();

  }

  ngOnInit() {

    this.formulario = new FormGroup({
      dateoptions: new FormControl ('day', [Validators.required]),
      date_rango: new FormControl (null),
      // service: new FormControl (null),
      // servicetype: new FormControl (null),
      // status: new FormControl (null)
    });

    if (this.id > 0) {
      this.servicetype = [];
      this.serviceestatus = [];

      const mm = moment().month('month').format('MM');

      for (let e = 0; e < this.months.length; e++) {
        // tslint:disable-next-line:radix
        if ( parseInt(mm) === this.months[e]['value']) {
          this.mesactual = this.months[e]['name'];
        }
      }

      if (this.id > 0 && this.formulario.value.dateoptions && this.mesactual) {
        this.getData(this.id, this.formulario.value.dateoptions);
        this.getDataPaymentProject(this.id);
        this.getDataPaymentMonth(this.id, 'month');
      }

    }


  }

  onResize(event: any) {
    if (event.target.innerWidth > 1080) {
      let param = event.target.innerWidth / 1.65;
      if (param < 400) {
        param = 400;
      }
      this.view = [param, 400];
    }
  }


  async getData(id: number, term: string) {

    this.isLoading = true;


    const data: any = await this.getDataPayment(id, term);

    if (data && data.datos) {
      // console.log(data.datos);
      let index = 0;
      let count = 0;
      let activityvalue = 0;
      let revenue = 0;

      for (let i = 0; i < data.datos.length; i++) {
          count = count + Number(data.datos[i]['user_count']);
          activityvalue = activityvalue + Number(data.datos[i]['value']);
          revenue = revenue + Number(data.datos[i]['value_count']);
          if (revenue > 0) {
            const object: Single = {
              name: data.datos[i]['name'],
              value: data.datos[i]['value_count'],
            };

            const objecttable: Table = {
              name: data.datos[i]['name'],
              shortname: data.datos[i]['shortname'],
              date: data.datos[i]['date'],
              activity: data.datos[i]['user_count'],
              value: data.datos[i]['value'],
              revenue: data.datos[i]['value_count']
            };
            if (object) {
              this.kpipayment.push(object);

            }
            if (objecttable) {
              this.kpidatatable.push(objecttable);
            }
          }
      index = index + 1;
      }

      if (this.kpipayment.length === data.datos.length) {
        this.isLoading = false;
        this.kpitotalactivity = count;
        this.kpitotalactivityvalue = activityvalue;
        this.kpitotalrevenue = revenue;
        if (this.kpitotalactivity && this.kpitotalactivityvalue && this.kpitotalrevenue) {
          const objecttable: Table = {
            name: 'Totales:',
            shortname: '',
            date: '',
            activity: this.kpitotalactivity,
            value: this.kpitotalactivityvalue,
            revenue: this.kpitotalrevenue
          };
          this.kpidatatable.push(objecttable);
        }
      }

      if ((index === data.datos.length) && (this.kpipayment.length === 0)) {
        this.isLoading = false;
      }

    } else {
      this.kpipayment = [];
      this.isLoading = false;
    }

  }

  getDataPayment(id: number, term: string) {

    this.kpipayment = [];
    this.kpidatatable = [];
    this.kpitotalactivity = 0;
    this.kpitotalrevenue = 0;
    let datedesde = new FormControl();
    let datehasta = new FormControl();

    this.kpidateoption = this.datesearchoptions.find( ({ value }) => value === term );

    if (term === 'custom') {
      if (this.formulario.value.date_rango && this.formulario.value.date_rango[0] && this.formulario.value.date_rango[1]) {
        datedesde = new FormControl(moment(this.formulario.value.date_rango[0]).format('YYYY[-]MM[-]DD'));
        datehasta = new FormControl(moment(this.formulario.value.date_rango[1]).format('YYYY[-]MM[-]DD'));
      } else {
        this.toasterService.error('Error: Seleccione rango correcto de fechas.', '', {timeOut: 6000});
        return;
      }
    }
    if (id && id > 0) {
      return this._kpiPayment.getProjectPayment(this.token, id, term, datedesde.value, datehasta.value);
    }
  }


  selectChangeServicio(event: any) {
    if (event && event.id && event.id > 0) {
      this.getServiceEstatus(event.id);
    }
  }

  public getServiceEstatus(id: number) {
    this.serviceestatus = [];
    this.servicetype = [];

    if (id > 0) {

        this._orderService.getServiceType(this.token.token, id).subscribe(
          response => {
                    if (!response) {
                      return;
                    }
                    if (response.status === 'success') {
                      this.servicetype = response.datos;
                      console.log(this.servicetype);
                    }
          });

        this._orderService.getServiceEstatus(this.token.token, id).subscribe(
          response => {
                    if (!response) {
                      return;
                    }
                    if (response.status === 'success') {
                      this.serviceestatus = response.datos;
                      console.log(this.serviceestatus);
                    }
          });
    }
  }


  async getDataPaymentProject(id: number) {

    if (id && id > 0) {

      this.kpipaymentproject = [];
      this.isLoadingPaymentProject = true;
      const year: any = new Date().getFullYear();

      const data: any = await this._kpiPayment.getProjectPaymentDate(this.token.token, id, this.mesactual, year);
      if (data && data.datos) {
        for (let x = 0; x < data.datos.length; x++) {
          if (x === 0) {
            const object: Single = {
              name: 'Mes (' + data.datos[x]['date'] + ' )',
              value: Math.round(data.datos[x]['value_count']),
            };
            if (object && object.value > 0) {
              this.kpipaymentproject.unshift(object);
            }
          }
          if (x === 1) {
            const object: Single = {
              name: 'Mes (' + data.datos[x]['date'] + ' )',
              value: Math.round(data.datos[x]['value_count']),
            };
            if (object && object.value > 0) {
              this.kpipaymentproject.unshift(object);
            }
          }
          if (x === 2) {
            const object: Single = {
              name: 'Mes (' + data.datos[x]['date'] + ' )',
              value: Math.round(data.datos[x]['value_count']),
            };
            if (object && object.value > 0) {
              this.kpipaymentproject.unshift(object);
            }
          }
          if (x + 1 === data.datos.length) {
            this.isLoadingPaymentProject = false;
          }
        }
        if (this.kpipaymentproject.length === data.datos.length) {
          this.isLoadingPaymentProject = false;
          // console.log(this.kpipaymentservice);
          this.createamXYChart(this.kpipaymentproject);
        }
      } else {
        this.kpipaymentproject = [];
        this.isLoadingPaymentProject = false;
      }

    }
  }

  async getDataPaymentMonth(id: number, term: string) {
    if (id && id > 0 && term) {
      this.kpipaymentprojectmonth = [];
      this.isLoadingPaymentMonth = true;
      const datedesde = new FormControl();
      const datehasta = new FormControl();

      const data: any = await this._kpiPayment.getProjectPayment(this.token, id, term, datedesde.value, datehasta.value);

      if (data && data.datos) {
        const params: ArraySingle = {atribute: 'shortname', value: 'value_count'};
        this.kpipaymentprojectmonth = await this.arraypush(data.datos, params);
        this.isLoadingPaymentMonth = false;
        if (this.kpipaymentprojectmonth.length > 0) {
          this.createamPieChart(this.kpipaymentprojectmonth);
        }

        /* for (let i = 0; i < data.datos.length; i++) {
            const object: Single = {
              name: data.datos[i]['shortname'],
              value: Math.round(data.datos[i]['value_count']),
            };
            if (object) {
              this.kpipaymentprojectmonth.push(object);
            }
            if (i + 1 === data.datos.length) {
              this.isLoadingPaymentMonth = false;
            }
        }


        if (this.kpipaymentprojectmonth.length === data.datos.length) {
          this.isLoadingPaymentMonth = false;
          this.createamPieChart(this.kpipaymentprojectmonth);
        } */

      } else {
        this.kpipaymentprojectmonth = [];
        this.isLoadingPaymentMonth = false;
      }
    }
  }

  async arraypush (array = [], params: ArraySingle) {
    const data = [];
      if (array && array.length > 0) {
        for (let i = 0; i < array.length; i++) {
          const object = {name: array[i][params.atribute],  value: array[i][params.value] };
          // const object = { name: array[i]['shortname'], value: Math.round(array[i]['value_count']) };
          if (object && object.value > 0) {
            data.push(object);
          }
        }
        return data;
      }
  }


  createamXYChart(datasource: any[]) {
    if (datasource && datasource.length > 0) {
      setTimeout(() => {
        this.zone.runOutsideAngular(() => {
          Promise.all([
              // import('@amcharts/amcharts4/core'),
              // import('@amcharts/amcharts4/charts'),
              // import('@amcharts/amcharts4/themes/animated')
          ])
              .then(() => {
                  // this.am4core = modules[0];
                  // this.am4charts = modules[1];
                  // this.am4themes_animated = modules[2].default;
                  // this.am4core.useTheme(this.am4themes_animated);

                  // const chart = am4core.create(this.chartdiv, am4charts.XYChart);
                  am4core.useTheme(am4themes_animated);
                  const chart = am4core.create('chartdiv', am4charts.XYChart);

                  chart.paddingRight = 20;

                  chart.data = datasource;

                  const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                  categoryAxis.dataFields.category = 'name';
                  categoryAxis.renderer.grid.template.location = 0;
                  categoryAxis.renderer.minGridDistance = 30;

                  categoryAxis.renderer.labels.template.adapter.add('dy', function(dy, target) {
                    if (target.dataItem && target.dataItem.index && 2 === 2) {
                      return dy + 25;
                    }
                    return dy;
                  });

                  chart.yAxes.push(new am4charts.ValueAxis());

                  // Create series
                  const series = chart.series.push(new am4charts.ColumnSeries());
                  series.dataFields.valueY = 'value';
                  series.dataFields.categoryX = 'name';
                  series.name = 'value';
                  series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]';
                  series.columns.template.fillOpacity = .8;

                  const columnTemplate = series.columns.template;
                  columnTemplate.strokeWidth = 2;
                  columnTemplate.strokeOpacity = 1;

              })
              .catch(e => {
                  console.error('Error when creating chart', e);
              });
        });
      }, 2000);
    }
  }


  createamPieChart(datasource: any[]) {
    // console.log(datasource);
    if (datasource && datasource.length > 0) {
      setTimeout(() => {
        this.zone.runOutsideAngular(() => {
          Promise.all([
          ])
              .then(() => {
                  am4core.useTheme(am4themes_animated);
                  const chart = am4core.create('chartpiediv', am4charts.PieChart);

                  // Add and configure Series
                  const pieSeries = chart.series.push(new am4charts.PieSeries());
                  pieSeries.dataFields.value = 'value';
                  pieSeries.dataFields.category = 'name';


                  // Let's cut a hole in our Pie chart the size of 30% the radius
                  chart.innerRadius = am4core.percent(30);

                  // Put a thick white border around each Slice
                  pieSeries.slices.template.stroke = am4core.color('#fff');
                  pieSeries.slices.template.strokeWidth = 2;
                  pieSeries.slices.template.strokeOpacity = 1;
                  pieSeries.slices.template
                    // change the cursor on hover to make it apparent the object can be interacted with
                    .cursorOverStyle = [
                      {
                        'property': 'cursor',
                        'value': 'pointer'
                      }
                    ];

                  pieSeries.alignLabels = false;
                  pieSeries.labels.template.bent = true;
                  pieSeries.labels.template.radius = 3;
                  pieSeries.labels.template.padding(0, 0, 0, 0);

                  pieSeries.ticks.template.disabled = true;

                  // Create a base filter effect (as if it's not there) for the hover to return to
                  const shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
                  shadow.opacity = 0;

                  // Create hover state
                  const hoverState = pieSeries.slices.template.states.getKey('hover');

                  // Slightly shift the shadow and make it more prominent on hover
                  const hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
                  hoverShadow.opacity = 0.7;
                  hoverShadow.blur = 5;

                  // Add a legend
                  chart.legend = new am4charts.Legend();

                  chart.data = datasource;

              })
              .catch(e => {
                  console.error('Error when creating chart', e);
              });
        });
      }, 2000);
    }
  }


}

export interface ArraySingle {
  atribute: string;
  value: string;
}


export interface Single {
  name: string;
  value: number;
}

export interface Table {
  name: string;
  shortname: string;
  date: string;
  activity: number;
  value: number;
  revenue: number;
}
