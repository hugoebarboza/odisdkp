import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

// MODELS
import { Month } from 'src/app/models/types';

// SERVICES
import { KpiService, OrderserviceService, PaymentService, UserService } from 'src/app/services/service.index';

// MOMENT
import * as _moment from 'moment';
const moment = _moment;

// TOASTER MESSAGES
import { ToastrService } from 'ngx-toastr';

// AMCHARTS
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';


@Component({
  selector: 'app-kpi-project-forecast',
  templateUrl: './kpi-project-forecast.component.html',
  styleUrls: ['./kpi-project-forecast.component.css']
})
export class KpiProjectForecastComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  @Input() id: number;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  displayedColumns: string[] = [];
  count = 0;
  formulario: FormGroup;
  kpipaymentprojectservice = [];
  kpipaymentprojectservicemonth = [];
  kpipaymentdatatable = [];
  kpipaymentservice = [];
  kpidateoption: any;
  identity: any;
  loading = true;
  isLoading = true;
  isLoadingchart = true;
  isLoadingchartsingle = true;
  isLoadingservice = true;
  isLoadingpaymentmonth = true;
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
    {name: 'Previsión', series: []}
  ];

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

  kpiTableData = new MatTableDataSource();
  project: any;
  proyectos: any;
  serviceestatus = [];
  subscription: Subscription;
  token: any;

  // CHART OPTIONS
  viewvertical: any[] = [1280, 400];
  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showLegendVertical = false;
  showXAxisLabel = true;
  xAxisLabel = 'Fecha';
  xAxisLabelPayment = 'Fecha';
  showYAxisLabel = true;
  yAxisLabel = 'Estatus';
  yAxisLabelPayment = 'Producción';

  colorScheme = {
    domain: ['#5AA454', '#C7B42C', '#A10A28', '#AAAAAA']
  };

  colorSchemePayment = {
    domain: ['#5AA454', '#C7B42C', '#3399FF', '#AAAAAA']
  };

  // AM CHARTS
  chart: any;

  constructor(
    private zone: NgZone,
    private _kpiPayment: PaymentService,
    private _kpiService: KpiService,
    private _orderService: OrderserviceService,
    private _userService: UserService,
    private toasterService: ToastrService,
  ) {
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
  }

  ngOnChanges(_changes: SimpleChanges) {

    this.formulario = new FormGroup({
      dateoptions: new FormControl ('day', [Validators.required]),
      date_rango: new FormControl (null),
    });

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

    this.displayedColumns[4] = 'Previsión';


    if (this.id > 0) {
      this.project = this.filterProjectByService();
      if (this.project && this.project.id > 0 && this.displayedColumns.length > 0) {
        this.getServiceEstatus(this.id);
        if (this.formulario && this.formulario.value.dateoptions) {
          this.getDataPayment(this.project.id, this.id, this.formulario.value.dateoptions);
          this.getDataPaymentService(this.project.id, this.id);
          this.getDataPaymentMonth(this.project.id, this.id, 'month');
        }
      }
    }

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
          this.chart.dispose();
      }
    });
  }


  onResizeVertical(event: any) {
    if (event.target.innerWidth > 1080) {
      let param = event.target.innerWidth / 1.65;
      if (param < 400) {
        param = 400;
      }
      this.view = [param, 400];
    }
  }


  onResize(event) {
    if ( event.target.innerWidth > 1080) {
      this.view = [700, 400];
      return;
    }
    let param = event.target.innerWidth / 7;
    if (param < 400) {
      param = 400;
    }
    this.view = [param, 400];
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

  public getServiceEstatus(id: number) {
    if (id > 0) {
      this.subscription = this._orderService.getServiceEstatus(this.token.token, id).subscribe(
        response => {
                  if (!response) {
                    return;
                  }
                  if (response.status === 'success') {
                    this.serviceestatus = response.datos;
                    if (this.serviceestatus.length > 0) {
                      this.getData(this.serviceestatus);
                    }                  }
                  },
                  (error: any) => {
                  console.log(<any>error);
                  });
    }
  }


  public getData(status: any) {

    this.kpidata = [];
    const year: any = new Date().getFullYear();

    if (status.length > 0 && this.displayedColumns.length > 0) {
        for (let x = 0; x < status.length; x++) {
          const estatus: object = {};
          estatus['status'] = status[x]['name'];
          const forecast = [];
          for (let i = 1; i < (this.displayedColumns.length - 1); i++) {

              this._kpiService.getProjectKpiServiceByStatusAndDate(this.token.token, this.project.id, this.displayedColumns[i], year, status[x].id, this.id)
              .then(
                (res: any) => {
                  res.subscribe(
                    (some: any) => {
                      if (some && some.datos && some.datos.length > 0) {
                        const object: Element = {
                          desc_mes: this.displayedColumns[i],
                          produccion: Math.round(some.datos[0]['user_count']),
                        };
                        const data: Data = {
                          name: this.displayedColumns[i],
                          s: { name: status[x]['name'], value: Math.round(some.datos[0]['user_count']) }
                        };

                        if (this.kpidatavertical.find( ({ name }) => name === data.name )) {
                          const index = this.kpidatavertical.findIndex( ({ name }) => name === data.name );
                          this.kpidatavertical[index].series.push(data.s);

                          if (this.kpidatasingle.find( ({ name }) => name === data.s.name )) {
                            const idx = this.kpidatasingle.findIndex( ({ name }) => name === data.s.name );
                            const value = this.kpidatasingle[idx].value;
                            this.kpidatasingle[idx].value = value + data.s.value;
                          } else {
                            this.kpidatasingle.push(data.s);
                          }

                        }


                        estatus[this.displayedColumns[i]] = object;
                        forecast.push(object.produccion);
                        this.count = this.count + 1;

                        if (forecast.length === 3) {
                          let prevision = 0;
                          forecast.forEach(response => {
                            prevision = prevision + response;
                          });
                          prevision = Math.round(prevision / 3);
                          const objectr = {
                            desc_mes: this.displayedColumns[4],
                            produccion: prevision,
                          };
                          const datar: Data = {
                            name: this.displayedColumns[4],
                            s: { name: status[x]['name'], value: prevision }
                          };

                          if (this.kpidatavertical.find( ({ name }) => name === datar.name )) {
                            const index = this.kpidatavertical.findIndex( ({ name }) => name === datar.name );
                            this.kpidatavertical[index].series.push(datar.s);

                            if (this.kpidatasingle.find( ({ name }) => name === datar.s.name )) {
                              const idx = this.kpidatasingle.findIndex( ({ name }) => name === datar.s.name );
                              const value = this.kpidatasingle[idx].value;
                              this.kpidatasingle[idx].value = value + datar.s.value;
                            } else {
                              this.kpidatasingle.push(datar.s);
                            }

                          }

                          estatus[this.displayedColumns[4]] = objectr;
                          this.count = this.count + 1;
                          if (this.count === (this.serviceestatus.length * 4)) {
                            this.isLoading = false;
                          }
                        }

                      }

                      this.kpidata[x] = estatus;

                      if (this.kpidata && this.kpidata.length === status.length) {
                        if (this.kpidatavertical && this.kpidatavertical.length > 0) {
                          this.GroupedVertical(this.kpidatavertical);
                        }
                        this.kpiTableData = new MatTableDataSource(this.kpidata);
                        this.kpiTableData.paginator = this.paginator;
                        this.kpiTableData.sort = this.sort;
                      }

                    },
                    (error: any) => {
                    if (error.error.codigo === 401) {
                      const object = {
                        desc_mes: this.displayedColumns[i],
                        produccion: 0,
                      };
                      const data: Data = {
                        name: this.displayedColumns[i],
                        s: { name: status[x]['name'], value: 0 }
                      };

                      if (this.kpidatavertical.find( ({ name }) => name === data.name )) {
                        const index = this.kpidatavertical.findIndex( ({ name }) => name === data.name );
                        this.kpidatavertical[index].series.push(data.s);

                        if (this.kpidatasingle.find( ({ name }) => name === data.s.name )) {
                          const idx = this.kpidatasingle.findIndex( ({ name }) => name === data.s.name );
                          const value = this.kpidatasingle[idx].value;
                          this.kpidatasingle[idx].value = value + data.s.value;
                        } else {
                          this.kpidatasingle.push(data.s);
                        }

                      }

                      estatus[this.displayedColumns[i]] = object;
                      forecast.push(object.produccion);
                      this.count = this.count + 1;

                      if ( forecast.length === 3) {
                        let prevision = 0;
                        forecast.forEach(resp => {
                          prevision = prevision + resp;
                        });
                        prevision = Math.round(prevision / 3);
                        const objecte: Element = {
                          desc_mes: this.displayedColumns[4],
                          produccion: prevision,
                        };
                        const datae: Data = {
                          name: this.displayedColumns[4],
                          s: { name: status[x]['name'], value: prevision }
                        };

                        if (this.kpidatavertical.find( ({ name }) => name === datae.name )) {
                          const index = this.kpidatavertical.findIndex( ({ name }) => name === datae.name );
                          this.kpidatavertical[index].series.push(datae.s);

                          if (this.kpidatasingle.find( ({ name }) => name === datae.s.name )) {
                            const idx = this.kpidatasingle.findIndex( ({ name }) => name === datae.s.name );
                            const value = this.kpidatasingle[idx].value;
                            this.kpidatasingle[idx].value = value + datae.s.value;
                          } else {
                            this.kpidatasingle.push(datae.s);
                          }
                        }

                        estatus[this.displayedColumns[4]] = objecte;
                        this.count = this.count + 1;
                        if (this.count === (this.serviceestatus.length * 4)) {
                          this.isLoading = false;
                        }
                      }

                      this.kpidata[x] = estatus;

                      if (this.kpidata && this.kpidata.length === status.length) {
                        if (this.kpidatavertical && this.kpidatavertical.length > 0) {
                          this.GroupedVertical(this.kpidatavertical);
                        }
                        this.kpiTableData = new MatTableDataSource(this.kpidata);
                        this.kpiTableData.paginator = this.paginator;
                        this.kpiTableData.sort = this.sort;
                      }
                    }
                    // console.log(<any>error);
                    }
                    );
                });
          }
        }
    }

  }

  GroupedVertical(data: any) {
    this.kpidataforecast = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i] && data[i].series.length > 1) {
        this.kpidataforecast.push(data[i]);
      }
    }

    if (this.kpidataforecast.length === 4) {
      this.isLoadingchart = false;
      this.isLoadingchartsingle = false;
    }
  }




  async getDataPayment(project_id: number, service_id: number, term: string) {
    this.kpipaymentprojectservice = [];
    this.kpipaymentdatatable = [];
    this.loading = true;
    let datedesde = new FormControl();
    let datehasta = new FormControl();

    this.kpidateoption = this.datesearchoptions.find( ({ value }) => value === term );

    if (term === 'custom') {
      if (this.formulario.value.date_rango && this.formulario.value.date_rango[0] && this.formulario.value.date_rango[1]) {
        datedesde = new FormControl(moment(this.formulario.value.date_rango[0]).format('YYYY[-]MM[-]DD'));
        datehasta = new FormControl(moment(this.formulario.value.date_rango[1]).format('YYYY[-]MM[-]DD'));
      } else {
        this.toasterService.error('Error: Seleccione rango correcto de fechas.', '', {timeOut: 6000});
        this.loading = false;
        return;
      }
    }


    const data: any = await this._kpiPayment.getProjectServicePayment(this.token.token, project_id, service_id, term, datedesde.value, datehasta.value);

    if (data && data.datos) {

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
            date: data.datos[i]['date'],
            activity: data.datos[i]['user_count'],
            value: data.datos[i]['value'],
            revenue: data.datos[i]['value_count']
          };
          if (object) {
            this.kpipaymentprojectservice.push(object);

          }
          if (objecttable) {
            this.kpipaymentdatatable.push(objecttable);
          }
        }
        index = index + 1;
      }

      if (this.kpipaymentprojectservice.length === data.datos.length) {
        this.loading = false;
        const kpitotalactivity = count;
        const kpitotalactivityvalue = activityvalue;
        const kpitotalrevenue = revenue;
        if (kpitotalactivity && kpitotalactivityvalue && kpitotalrevenue) {
          const objecttable: Table = {
            name: 'Totales:',
            date: '',
            activity: kpitotalactivity,
            value: kpitotalactivityvalue,
            revenue: kpitotalrevenue
          };
          this.kpipaymentdatatable.push(objecttable);
        }

      }

      if ((index === data.datos.length) && (this.kpipaymentprojectservice.length === 0)) {
        this.loading = false;
      }
    } else {
      this.kpipaymentprojectservice = [];
      this.kpipaymentdatatable = [];
      this.loading = false;
    }
  }

  async getDataPaymentService(project_id: number, service_id: number) {
    this.kpipaymentservice = [];
    this.isLoadingservice = true;
    const year: any = new Date().getFullYear();


    const data: any = await this._kpiPayment.getProjectServicePaymentDate(this.token.token, project_id, service_id, this.mesactual, year);

    if (data && data.datos) {
      console.log(data.datos);
      for (let x = 0; x < data.datos.length; x++) {
        if (x === 0) {
          const object: Single = {
            name: 'Mes (' + data.datos[x]['date'] + ' )',
            value: Math.round(data.datos[x]['value_count']),
          };
          if (object && object.value > 0) {
            this.kpipaymentservice.unshift(object);
          }
        }
        if (x === 1) {
          const object: Single = {
            name: 'Mes (' + data.datos[x]['date'] + ' )',
            value: Math.round(data.datos[x]['value_count']),
          };
          if (object && object.value > 0) {
            this.kpipaymentservice.unshift(object);
          }
        }
        if (x === 2) {
          const object: Single = {
            name: 'Mes (' + data.datos[x]['date'] + ' )',
            value: Math.round(data.datos[x]['value_count']),
          };
          if (object && object.value > 0) {
            this.kpipaymentservice.unshift(object);
          }
        }
        if (x + 1 === data.datos.length) {
          this.isLoadingservice = false;
        }
      }
      if (this.kpipaymentservice.length === data.datos.length) {
        this.isLoadingservice = false;
        // console.log(this.kpipaymentservice);
        this.createamXYChart(this.kpipaymentservice);
      }
    } else {
      this.kpipaymentservice = [];
      this.isLoadingservice = false;
    }
  }

  async getDataPaymentMonth(project_id: number, service_id: number, term: string) {
    this.kpipaymentprojectservicemonth = [];
    this.isLoadingpaymentmonth = true;
    const datedesde = new FormControl();
    const datehasta = new FormControl();

    const data: any = await this._kpiPayment.getProjectServicePayment(this.token.token, project_id, service_id, term, datedesde.value, datehasta.value);

    if (data && data.datos) {
      for (let i = 0; i < data.datos.length; i++) {
          const object: Single = {
            name: data.datos[i]['name'],
            value: Math.round(data.datos[i]['value_count']),
          };
          if (object && object.value > 0) {
            this.kpipaymentprojectservicemonth.push(object);
          }
          if (i + 1 === data.datos.length) {
            this.isLoadingpaymentmonth = false;
          }
      }
      if (this.kpipaymentprojectservicemonth.length === data.datos.length) {
        this.isLoadingpaymentmonth = false;
        // console.log(this.kpipaymentprojectservicemonth);
        this.createamPieChart(this.kpipaymentprojectservicemonth);
      }
    } else {
      this.kpipaymentprojectservicemonth = [];
      this.isLoadingpaymentmonth = false;
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

                  this.chart = chart;
              })
              .catch(e => {
                  console.error('Error when creating chart', e);
              });
        });
      }, 2000);
    }
  }


  createamPieChart(datasource: any[]) {
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


  ngAfterViewInit() {
  }

}

export interface Data {
  name: string;
  s:
    {
     name: string,
     value: number
    };
}


export interface Element {
  desc_mes: String;
  produccion: number;
}

export interface Single {
  name: String;
  value: number;
}

export interface Table {
  name: String;
  date: String;
  activity: number;
  value: number;
  revenue: number;
}

