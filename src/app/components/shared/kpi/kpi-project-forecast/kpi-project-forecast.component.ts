import { Component, Input, ViewChild, OnChanges, SimpleChanges, OnDestroy, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';

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
export class KpiProjectForecastComponent implements OnChanges, OnDestroy {

  @Input() id: number;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  displayedColumns: string[] = [];
  count = 0;
  formulario: FormGroup;
  kpipaymentprojectservice = [];
  kpipaymentprojectservicemonth = [];
  kpipaymentprojectserviceyear = [];
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
  isLoadingpaymentyear = true;
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
  private chartxy: any;
  private chartpie: any;
  chartline: any;
  chartstacked: any;

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionheaderaction = new FormControl(this.positionOptions[2]);
  positiondatasourceaction = new FormControl(this.positionOptions[3]);
  positionleftaction = new FormControl(this.positionOptions[4]);
  positionrightaction = new FormControl(this.positionOptions[5]);


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


  ngOnChanges(_changes: SimpleChanges) {

    this.formulario = new FormGroup({
      dateoptions: new FormControl ('day', [Validators.required]),
      date_rango: new FormControl (null),
    });

    const mm = moment().month('month').format('MM');

    this.displayedColumns = ['status'];

    if (Number(mm) === 1) {
      this.displayedColumns[1] = this.months[10]['name'];
      this.displayedColumns[2] = this.months[11]['name'];
      this.displayedColumns[3] = this.months[0]['name'];
    } else if (Number(mm) === 2) {
      this.displayedColumns[1] = this.months[11]['name'];
      this.displayedColumns[2] = this.months[0]['name'];
      this.displayedColumns[3] = this.months[1]['name'];
    }
    for (let e = 0; e < this.months.length; e++) {
        // tslint:disable-next-line:radix
        if ( parseInt(mm) === this.months[e]['value']) {
          this.mesactual = this.months[e]['name'];
        }
        // tslint:disable-next-line:radix

        if (Number(mm)  > 2 ) {
          if ( e >= (Number(mm) - 3) && e <= (Number(mm) - 1)) {
            this.displayedColumns.push(this.months[e]['name']);
          }
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
          this.getDataPaymentProjectLine(this.project.id, this.id);
        }
      }
    }

  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.zone.runOutsideAngular(() => {
      if (this.chartxy) {
          this.chartxy.dispose();
      }
      if (this.chartpie) {
        this.chartpie.dispose();
      }
      if (this.chartline) {
        this.chartline.dispose();
      }
      if (this.chartstacked) {
        this.chartstacked.dispose();
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

            let year_tem = year;

            if ((i === 1 && this.displayedColumns[i] === 'November')
            || (i === 1 && this.displayedColumns[i] === 'December')
            || (i === 2 && this.displayedColumns[i] === 'December')) {
              year_tem = year - 1;
            }

              this._kpiService.getProjectKpiServiceByStatusAndDate(this.token.token, this.project.id, this.displayedColumns[i], year_tem, status[x].id, this.id)
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

    const mm = moment().month('month').format('MM');

    if (Number(mm) === 1) {

      for (let e = 0; e < this.months.length; e++) {
        for (let i = 0; i < data.length; i++) {
          if (Number(mm) === 1 && data[i]['name'] === this.months[e]['name'] && i === 10) {
            this.kpidataforecast[0] = data[i];
          }
          if (Number(mm) === 1 && data[i]['name'] === this.months[e]['name'] && i === 11) {
            this.kpidataforecast[1] = data[i];
          }
          if (Number(mm) === 1 && data[i]['name'] === this.months[e]['name'] && i === 0) {
            this.kpidataforecast[2] = data[i];
          }
          if (Number(mm) === 2 && data[i]['name'] === this.months[e]['name'] && i === 11) {
            this.kpidataforecast[0] = data[i];
          }
          if (Number(mm) === 2 && data[i]['name'] === this.months[e]['name'] && i === 0) {
            this.kpidataforecast[1] = data[i];
          }
          if (Number(mm) === 2 && data[i]['name'] === this.months[e]['name'] && i === 1) {
            this.kpidataforecast[2] = data[i];
          }
          if (data[i]['name'] === 'Previsión') {
            this.kpidataforecast[3] = data[i];
          }
        }
      }

    } else {

      for (let i = 0; i < data.length; i++) {
        // data = data.reverse();
        if (data[i] && data[i].series.length > 1) {
          this.kpidataforecast.push(data[i]);
        }
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

    if (data && data.datos.length > 0) {

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

    const term = 'month';

    const data: any = await this._kpiPayment.getProjectServicePaymentDate(this.token.token, project_id, service_id, term, year);

    if (data && data.datos.length > 0) {

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

    if (data && data.datos.length > 0) {
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

        if (this.kpipaymentprojectservicemonth.length > 0) {
          const mm = moment().month('month').format('MMMM');
          const datavalue: object = [{ }];
          datavalue[0]['name'] = mm;
          for (let i = 0; i < this.kpipaymentprojectservicemonth.length; i++) {

            datavalue[0]['value' + i] = this.kpipaymentprojectservicemonth[i]['value'];

          }
          this.createamStacked(datavalue, this.kpipaymentprojectservicemonth);
        }

        this.createamPieChart(this.kpipaymentprojectservicemonth);
      }
    } else {
      this.kpipaymentprojectservicemonth = [];
      this.isLoadingpaymentmonth = false;
    }
  }



  async getDataPaymentProjectLine(project_id: number, service_id: number) {

    if (project_id && project_id > 0 && service_id && service_id > 0) {

      this.kpipaymentprojectserviceyear = [];
      this.isLoadingpaymentyear = true;
      const year: any = new Date().getFullYear();
      const term = 'year';

      const data: any = await this._kpiPayment.getProjectServicePaymentDate(this.token.token, project_id, service_id, term, year);

      if (data && data.datos.length > 0) {
        const params: ArraySingle = {atribute: 'date', value: 'value_count'};
        this.kpipaymentprojectserviceyear = await this.arraypush(data.datos, params);
        this.isLoadingpaymentyear = false;
        if (this.kpipaymentprojectserviceyear.length > 0) {
          this.createamLineChart(this.kpipaymentprojectserviceyear);
        }
      } else {
        this.kpipaymentprojectserviceyear = [];
        this.isLoadingpaymentyear = false;
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

                  this.chartxy = chart;
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

                  this.chartpie = chart;

              })
              .catch(e => {
                  console.error('Error when creating chart', e);
              });
        });
      }, 2000);
    }
  }

  createamLineChart (datasource: any) {
    if (datasource && datasource.length > 0) {
      setTimeout(() => {
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
      }, 2000);

    }
  }


  createamStacked(datasource: any, dataseries: any []) {
    if (datasource && datasource.length > 0) {
      setTimeout(() => {
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
        }, 2000);
    }
  }



}

export interface ArraySingle {
  atribute: string;
  value: string;
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

