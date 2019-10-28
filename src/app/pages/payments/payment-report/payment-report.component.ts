import { Component, OnInit, Input, NgZone, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TooltipPosition } from '@angular/material';
import { Observable } from 'rxjs/Observable';

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
  styleUrls: ['./payment-report.component.css'],
})
export class PaymentReportComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() id: Observable<any>;
  @Input() project: any;
  @Input() services = [];

  formulario: FormGroup;
  isLoading = true;
  isLoadingPaymentProject = true;
  isLoadingPaymentLine = true;
  isLoadingPaymentStacked = true;
  isLoadingPaymentMonth = true;
  kpipayment = [];
  kpipaymentproject = [];
  kpipaymentprojectmonth = [];
  kpipaymentprojecstacked = [];
  kpipaymentprojectline = [];
  kpidateoption: any = [];
  kpidatatable = [];

  service: any;
  serviceestatus = [];
  servicetype = [];
  token: any;


  // CHART OPTIONS
  private chartxy: any;
  private chartpie: any;
  private chartline: any;
  private chartstacked: any;
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

  }

  ngAfterViewInit() {
    this.id.subscribe( id => {
      const projectid = id;
      if ( projectid && projectid > 0 ) {
        this.servicetype = [];
        this.serviceestatus = [];
        if (this.formulario.value.dateoptions) {
          this.getData(projectid, this.formulario.value.dateoptions);
          this.getDataPaymentProject(projectid, 'month');
          this.getDataPaymentMonth(projectid, 'month');
          this.getDataPaymentProjectLine(projectid, 'year');
          this.getDataPaymentProjectStacked(projectid, 'service');
        }
      }
    });
  }


  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chartxy) {
          this.chartxy.dispose();
      }
      if (this.chartpie) {
        this.chartpie.dispose();
      }
      if (this.chartstacked) {
        this.chartstacked.dispose();
      }
      if (this.chartline) {
        this.chartline.dispose();
      }
    });
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

      const params: ArraySingle = {atribute: 'name', value: 'value_count'};
      this.kpipayment = await this.arraypush(data.datos, params);
      this.kpidatatable = await this.arraypushmulti(data.datos);
      this.isLoading = false;


      /*
      for (let i = 0; i < data.datos.length; i++) {
          count = count + Number(data.datos[i]['user_count']);
          activityvalue = activityvalue + Number(data.datos[i]['value']);
          revenue = revenue + Number(data.datos[i]['value_count']);
          if (revenue > 0) {
            const object: Single = {
              name: data.datos[i]['service_name'],
              value: data.datos[i]['value_count'],
            };

            const objecttable: Table = {
              name: data.datos[i]['service_name'],
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

      console.log(this.kpipayment.length);
      if (this.kpipayment.length === data.datos.length) {
        console.log('pasooooooooooooooo');
        this.isLoading = false;
        this.kpitotalactivity = count;
        this.kpitotalactivityvalue = activityvalue;
        this.kpitotalrevenue = revenue;
        if (this.kpitotalactivity && this.kpitotalactivityvalue && this.kpitotalrevenue) {
          const objecttable: Table = {
            name: 'Totales:',
            date: '',
            activity: this.kpitotalactivity,
            value: this.kpitotalactivityvalue,
            revenue: this.kpitotalrevenue
          };
          this.kpidatatable.push(objecttable);
        }
      }

      if ((index === data.datos.length) && (this.kpipayment.length === 0)) {
        console.log('***************************');
        this.isLoading = false;
      } */

    } else {
      this.kpipayment = [];
      this.isLoading = false;
    }

  }

  getDataPayment(id: number, term: string) {

    this.kpipayment = [];
    this.kpidatatable = [];
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


  async getDataPaymentProject(id: number, term: string) {

    if (id && id > 0) {

      this.kpipaymentproject = [];
      this.isLoadingPaymentProject = true;
      const year: any = new Date().getFullYear();

      const data: any = await this._kpiPayment.getProjectPaymentDate(this.token.token, id, term, year);

      if (data && data.datos) {
        for (let x = 0; x < data.datos.length; x++) {
          if (x === 0) {
            const object: Single = {
              name: 'Mes (' + data.datos[x]['date'] + ' )',
              value: Number(Math.round(data.datos[x]['value_count'])),
            };
            if (object && object.value > 0) {
              this.kpipaymentproject.unshift(object);
            }
          }
          if (x === 1) {
            const object: Single = {
              name: 'Mes (' + data.datos[x]['date'] + ' )',
              value: Number(Math.round(data.datos[x]['value_count'])),
            };
            if (object && object.value > 0) {
              this.kpipaymentproject.unshift(object);
            }
          }
          if (x === 2) {
            const object: Single = {
              name: 'Mes (' + data.datos[x]['date'] + ' )',
              value: Number(Math.round(data.datos[x]['value_count'])),
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
          this.createamXYChart(this.kpipaymentproject);
        }
      } else {
        this.kpipaymentproject = [];
        this.isLoadingPaymentProject = false;
      }

    }
  }


  async getDataPaymentProjectLine(id: number, term: string) {

    if (id && id > 0) {

      this.kpipaymentprojectline = [];
      this.isLoadingPaymentLine = true;
      const year: any = new Date().getFullYear();

      const data: any = await this._kpiPayment.getProjectPaymentDate(this.token.token, id, term, year);
      if (data && data.datos) {
        const params: ArraySingle = {atribute: 'fecha', value: 'value_count'};
        this.kpipaymentprojectline = await this.arraypush(data.datos, params);
        this.isLoadingPaymentLine = false;
        if (this.kpipaymentprojectline.length > 0) {
          this.createamLineChart(this.kpipaymentprojectline);
        }
      } else {
        this.kpipaymentprojectline = [];
        this.isLoadingPaymentLine = false;
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
      } else {
        this.kpipaymentprojectmonth = [];
        this.isLoadingPaymentMonth = false;
      }
    }
  }


  async getDataPaymentProjectStacked(id: number, term: string) {

    if (id && id > 0) {

      this.kpipaymentproject = [];
      this.isLoadingPaymentStacked = true;
      const year: any = new Date().getFullYear();

      const data: any = await this._kpiPayment.getProjectPaymentDate(this.token.token, id, term, year);
      if (data && data.datos) {
        const params: ArraySingle = {atribute: 'shortname', value: 'value_count'};
        this.kpipaymentprojecstacked = await this.arraypush(data.datos, params);
        this.isLoadingPaymentStacked = false;
        if (this.kpipaymentprojecstacked.length > 0) {
          const mm = moment().month('month').format('MMMM');
          const datavalue: object = [{ }];
          datavalue[0]['name'] = mm;
          for (let i = 0; i < this.kpipaymentprojecstacked.length; i++) {

            datavalue[0]['value' + i] = this.kpipaymentprojecstacked[i]['value'];

          }
          this.createamStacked(datavalue, this.kpipaymentprojecstacked);
        }
      } else {
        this.kpipaymentproject = [];
        this.isLoadingPaymentStacked = false;
      }

    }
  }


  async arraypush (array = [], params: ArraySingle) {
    const data = [];
      if (array && array.length > 0) {
        for (let i = 0; i < array.length; i++) {
          const object = {name: array[i][params.atribute],  value: Number(array[i][params.value]) };
          // const object = { name: array[i]['shortname'], value: Math.round(array[i]['value_count']) };
          if (object && object.value > 0) {
            data.push(object);
          }
        }
        return data;
      }
  }

  async arraypushmulti (array = []) {
    const data = [];
    let count = 0;
    let activityvalue = 0;
    let revenue = 0;

      if (array && array.length > 0) {
        for (let i = 0; i < array.length; i++) {
          count = count + Number(array[i]['user_count']);
          activityvalue = activityvalue + Number(array[i]['value']);
          revenue = revenue + Number(array[i]['value_count']);
          const object: Table = {
            name: array[i]['name'],
            shortname: array[i]['shortname'],
            date: array[i]['date'],
            activity: array[i]['user_count'],
            value: array[i]['value'],
            revenue: array[i]['value_count']
          };
          if (object && object.value > 0 && object.revenue > 0) {
            data.push(object);
          }
        }
        const objecttablelast: Table = {
          name: 'Total:',
          shortname: '',
          date: '',
          activity: count,
          value: activityvalue,
          revenue: revenue
        };
        data.push(objecttablelast);
        return data;
      }
  }


  createamXYChart(datasource: any[]) {
    if (datasource && datasource.length > 0) {
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

                  this.chartxy = chart;

              })
              .catch(e => {
                  console.error('Error when creating chart', e);
              });
        });
    }
  }


  createamPieChart(datasource: any[]) {
    // console.log(datasource);
    if (datasource && datasource.length > 0) {
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

                  this.chartpie = chart;

              })
              .catch(e => {
                  console.error('Error when creating chart', e);
              });
        });
    }
  }

  createamStacked(datasource: any, dataseries: any []) {
    if (datasource && datasource.length > 0) {
        this.zone.runOutsideAngular(() => {
          Promise.all([
          ])
              .then(() => {

                // Themes begin
                am4core.useTheme(am4themes_animated);
                // Themes end

                const chart = am4core.create('chartdivstacked', am4charts.XYChart);
                chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

                chart.data = datasource;

                chart.colors.step = 2;
                chart.padding(30, 30, 10, 30);
                chart.legend = new am4charts.Legend();

                const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = 'name';
                categoryAxis.renderer.grid.template.location = 0;

                const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis.min = 0;
                valueAxis.max = 100;
                valueAxis.strictMinMax = true;
                valueAxis.calculateTotals = true;
                valueAxis.renderer.minWidth = 50;

                for (let i = 0; i < dataseries.length; i++) {
                  const series1 = chart.series.push(new am4charts.ColumnSeries());
                  series1.columns.template.width = am4core.percent(80);
                  series1.columns.template.tooltipText =
                    // tslint:disable-next-line:quotemark
                    "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
                  series1.name = dataseries[i]['name'];
                  series1.dataFields.categoryX = 'name';
                  const valuey = 'value' + i;
                  series1.dataFields.valueY = valuey;
                  series1.dataFields.valueYShow = 'totalPercent';
                  series1.dataItems.template.locations.categoryX = 0.5;
                  series1.stacked = true;
                  series1.tooltip.pointerOrientation = 'vertical';

                  const bullet1 = series1.bullets.push(new am4charts.LabelBullet());
                  bullet1.interactionsEnabled = false;
                  // tslint:disable-next-line:quotemark
                  bullet1.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
                  bullet1.label.fill = am4core.color('#ffffff');
                  bullet1.locationY = 0.5;
                }

                this.chartstacked = chart;



                // chart.scrollbarX = new am4core.Scrollbar();
              })
              .catch(e => {
                  console.error('Error when creating chart', e);
              });
        });
    }

  }

  createamLineChart (datasource: any) {
    if (datasource && datasource.length > 0) {
      this.zone.runOutsideAngular(() => {
        Promise.all([
        ])
            .then(() => {
            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            const chart = am4core.create('chartdivline', am4charts.XYChart);
            chart.paddingRight = 20;
            const data = [];

            for (let i = 0; i < datasource.length; i++) {
              const object = {name: datasource[i]['name'],  value: Number(datasource[i]['value']), lineColor: chart.colors.next() };
              if (object ) {
                data.push(object);
              }
            }


            chart.data = data;

            const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.ticks.template.disabled = true;
            categoryAxis.renderer.line.opacity = 0;
            categoryAxis.renderer.grid.template.disabled = true;
            categoryAxis.renderer.minGridDistance = 40;
            categoryAxis.dataFields.category = 'name';
            categoryAxis.startLocation = 0.4;
            categoryAxis.endLocation = 0.6;


            const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.tooltip.disabled = true;
            valueAxis.renderer.line.opacity = 0;
            valueAxis.renderer.ticks.template.disabled = true;
            valueAxis.min = 0;

            const lineSeries = chart.series.push(new am4charts.LineSeries());
            lineSeries.dataFields.categoryX = 'name';
            lineSeries.dataFields.valueY = 'value';
            lineSeries.tooltipText = 'value: {valueY.value}';
            lineSeries.fillOpacity = 0.5;
            lineSeries.strokeWidth = 3;
            lineSeries.propertyFields.stroke = 'lineColor';
            lineSeries.propertyFields.fill = 'lineColor';

            const bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
            bullet.circle.radius = 6;
            bullet.circle.fill = am4core.color('#fff');
            bullet.circle.strokeWidth = 3;

            chart.cursor = new am4charts.XYCursor();
            chart.cursor.behavior = 'panX';
            chart.cursor.lineX.opacity = 0;
            chart.cursor.lineY.opacity = 0;

            chart.scrollbarX = new am4core.Scrollbar();
            chart.scrollbarX.parent = chart.bottomAxesContainer;

            this.chartline = chart;

            })
            .catch(e => {
                console.error('Error when creating chart', e);
            });
      });
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
