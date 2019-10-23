import { Component, OnInit, Input, NgZone } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TooltipPosition } from '@angular/material';

// TOASTER MESSAGES
import { ToastrService } from 'ngx-toastr';

// AMCHARTS
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

// SERVICES
import { KpiService, UserService } from 'src/app/services/service.index';



// MOMENT
import * as _moment from 'moment';
const moment = _moment;

@Component({
  selector: 'app-kpi-project-amcharts',
  templateUrl: './kpi-project-amcharts.component.html',
  styleUrls: ['./kpi-project-amcharts.component.css']
})
export class KpiProjectAmchartsComponent implements OnInit {

  @Input() id: number;
  @Input() projectid: number;

  formulario: FormGroup;
  identity: any;
  isLoading = true;
  kpidatadatetime = [];
  kpidateoption: any;
  datesearchoptions = [
    {value: 'day', name: 'Día'},
    {value: 'week', name: 'Semana'},
    {value: 'month', name: 'Mes Actual'},
    {value: 'year', name: 'Año Actual'},
    {value: 'custom', name: 'Personalizado'},
  ];
  token: any;

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
    private zone: NgZone,
    private _kpiService: KpiService,
    private _userService: UserService,
    private toasterService: ToastrService,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    if (this.id > 0 && this.projectid > 0) {

      this.formulario = new FormGroup({
        dateoptions: new FormControl ('day', [Validators.required]),
        date_rango: new FormControl (null),
      });

      this.kpidateoption = 'day';
      this.getDataDateTime(this.projectid, this.kpidateoption, this.id);
    }
  }

  async getDataDateTime(project: number, term: string, service: number) {

    // console.log(termino);
    this.isLoading = true;
    this.kpidatadatetime = [];
    let datedesde = new FormControl();
    let datehasta = new FormControl();

    this.kpidateoption = this.datesearchoptions.find( ({ value }) => value === term );

    if (term === 'custom') {
      if (this.formulario.value.date_rango && this.formulario.value.date_rango[0] && this.formulario.value.date_rango[1]) {
        datedesde = new FormControl(moment(this.formulario.value.date_rango[0]).format('YYYY[-]MM[-]DD'));
        datehasta = new FormControl(moment(this.formulario.value.date_rango[1]).format('YYYY[-]MM[-]DD'));
      } else {
        this.toasterService.error('Error: Seleccione rango correcto de fechas.', '', {timeOut: 6000});
        this.isLoading = false;
        return;
      }
    }


    const data: any = await this._kpiService.getProjectKpiServiceByDateTime(this.token.token, project, term, service, datedesde.value, datehasta.value);

    if (data && data.datos && data.datos.length > 0) {
      for (let i = 0; i < data.datos.length; i++) {
        const object: Single = {
          date: new Date(data.datos[i]['fecha']),
          value: Math.round(data.datos[i]['value_count']),
        };
        this.kpidatadatetime.push(object);
      }
      if (this.kpidatadatetime.length === data.datos.length) {
          this.createamXYChart(this.kpidatadatetime);
          this.isLoading = false;
      }
    } else {
      this.isLoading = false;
      this.kpidatadatetime = [];
    }

  }

  createamXYChart(datasource: any[]) {

    if (datasource && datasource.length > 0) {
      setTimeout(() => {

        this.zone.runOutsideAngular(() => {
          Promise.all([
          ])
          .then(() => {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Create chart
            const chart = am4core.create('chartdiv', am4charts.XYChart);
            chart.paddingRight = 20;

            chart.data = datasource;

            const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.baseInterval = {
              'timeUnit': 'minute',
              'count': 1
            };
            dateAxis.tooltipDateFormat = 'HH:mm, d MMMM';

            const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.tooltip.disabled = true;
            valueAxis.title.text = 'Órdenes de Trabajo';

            const series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.dateX = 'date';
            series.dataFields.valueY = 'value';
            series.tooltipText = 'Órdenes: [bold]{valueY}[/]';
            series.fillOpacity = 0.3;


            chart.cursor = new am4charts.XYCursor();
            chart.cursor.lineY.opacity = 0;
            const scrollbarX = new am4charts.XYChartScrollbar();
            scrollbarX.series.push(series);
            chart.scrollbarX = scrollbarX;
            dateAxis.start = 0.8;
            dateAxis.keepSelection = true;

            /*
            function generateChartData() {
              const chartData = [];
              // current date
              const firstDate = new Date();
              // now set 500 minutes back
              firstDate.setMinutes(firstDate.getDate() - 500);
              // and generate 500 data items
              let visits = 500;
              for (let i = 0; i < 500; i++) {
                  const newDate = new Date(firstDate);
                  // each time we add one minute
                  newDate.setMinutes(newDate.getMinutes() + i);
                  // some random number
                  visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
                  // add data item to the array
                  chartData.push({
                      date: newDate,
                      visits: visits
                  });
                  console.log(chartData);
              }
              return chartData;
            }*/



          })
          .catch(e => {
              console.error('Error when creating chart', e);
          });
      });
      }, 2000);
    }
  }


  SerpentineChart(datasource: any[]) {
    console.log(datasource);
    if (datasource && datasource.length > 0) {
      setTimeout(() => {

        this.zone.runOutsideAngular(() => {
          Promise.all([
          ])
          .then(() => {
          })
          .catch(e => {
              console.error('Error when creating chart', e);
          });
      });
      }, 2000);
    }
  }

  amChart() {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    const chart = am4core.create('chartdiv', am4charts.PieChart);

    // Add and configure Series
    const pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'litres';
    pieSeries.dataFields.category = 'country';


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

    chart.data = [{
      'country': 'Lithuania',
      'litres': 511.9
    }, {
      'country': 'Germany',
      'litres': 165.8
    }, {
      'country': 'Australia',
      'litres': 139.9
    }, {
      'country': 'Austria',
      'litres': 128.3
    }, {
      'country': 'UK',
      'litres': 99
    }, {
      'country': 'Belgium',
      'litres': 60
    }];
  }

}

export interface Single {
  date: any;
  value: number;
}
