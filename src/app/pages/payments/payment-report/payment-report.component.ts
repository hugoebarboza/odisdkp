import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TooltipPosition } from '@angular/material';

// SERVICES
import { OrderserviceService, PaymentService, UserService } from 'src/app/services/service.index';

// MOMENT
import * as _moment from 'moment';
const moment = _moment;

// TOASTER MESSAGES
import { ToastrService } from 'ngx-toastr';

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
  kpipayment = [];
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

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positionheaderaction = new FormControl(this.positionOptions[2]);
  positiondatasourceaction = new FormControl(this.positionOptions[3]);
  positionleftaction = new FormControl(this.positionOptions[4]);
  positionrightaction = new FormControl(this.positionOptions[5]);


  constructor(
    private _kpiPayment: PaymentService,
    private _orderService: OrderserviceService,
    private _userService: UserService,
    private toasterService: ToastrService,
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

      if (this.id > 0 && this.formulario.value.dateoptions) {
        this.getData(this.id, this.formulario.value.dateoptions);
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
