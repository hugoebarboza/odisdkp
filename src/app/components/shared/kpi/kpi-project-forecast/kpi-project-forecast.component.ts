import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
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


@Component({
  selector: 'app-kpi-project-forecast',
  templateUrl: './kpi-project-forecast.component.html',
  styleUrls: ['./kpi-project-forecast.component.css']
})
export class KpiProjectForecastComponent implements OnInit, OnChanges, OnDestroy {

  @Input() id: number;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  displayedColumns: string[] = [];
  count = 0;
  formulario: FormGroup;
  kpipaymentprojectservice = [];
  kpipaymentdatatable = [];
  kpipaymentservice = [];
  kpidateoption: any;
  identity: any;
  loading = true;
  isLoading = true;
  isLoadingchart = true;
  isLoadingchartsingle = true;
  isLoadingservice = true;
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
    {name: 'Prevision', series: []}
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
  showYAxisLabel = true;
  yAxisLabel = 'Estatus';

  colorScheme = {
    domain: ['#5AA454', '#C7B42C', '#A10A28', '#AAAAAA']
  };


  constructor(
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

    this.displayedColumns[4] = 'Prevision';


    if (this.id > 0) {
      this.project = this.filterProjectByService();
      if (this.project && this.project.id > 0 && this.displayedColumns.length > 0) {
        this.getServiceEstatus(this.id);
        if (this.formulario && this.formulario.value.dateoptions) {
          this.getDataPayment(this.project.id, this.id, this.formulario.value.dateoptions);
          this.getDataPaymentService(this.project.id, this.id);
        }
      }
    }

  }

  ngOnDestroy() {
  if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
                          produccion: some.datos[0]['user_count'],
                        };
                        const data: Data = {
                          name: this.displayedColumns[i],
                          s: { name: status[x]['name'], value: some.datos[0]['user_count'] }
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
                    console.log(<any>error);
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


  findObjectByKey(array, key, value) {
    for (let i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
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
    } else {
      this.kpipaymentservice = [];
      this.isLoadingservice = false;
    }
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

