import { Component, OnInit } from '@angular/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

@Component({
  selector: 'app-kpi-project-amcharts',
  templateUrl: './kpi-project-amcharts.component.html',
  styleUrls: ['./kpi-project-amcharts.component.css']
})
export class KpiProjectAmchartsComponent implements OnInit {

  am4core: any;
  chart: any;
  pieSeries: any;
  shadow: any;
  hoverState: any;
  hoverShadow: any;

  constructor() { }

  ngOnInit() {
    // Themes begin
    // this.am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    this.chart = am4core.create('chartdiv', am4charts.PieChart);

    // Add and configure Series
    this.pieSeries = this.chart.series.push(new am4charts.PieSeries());
    this.pieSeries.dataFields.value = 'litres';
    this.pieSeries.dataFields.category = 'country';


    // Let's cut a hole in our Pie chart the size of 30% the radius
    this.chart.innerRadius = am4core.percent(30);

    // Put a thick white border around each Slice
    this.pieSeries.slices.template.stroke = am4core.color('#fff');
    this.pieSeries.slices.template.strokeWidth = 2;
    this.pieSeries.slices.template.strokeOpacity = 1;
    this.pieSeries.slices.template
      // change the cursor on hover to make it apparent the object can be interacted with
      .cursorOverStyle = [
        {
          'property': 'cursor',
          'value': 'pointer'
        }
      ];

    this.pieSeries.alignLabels = false;
    this.pieSeries.labels.template.bent = true;
    this.pieSeries.labels.template.radius = 3;
    this.pieSeries.labels.template.padding(0, 0, 0, 0);

    this.pieSeries.ticks.template.disabled = true;

    // Create a base filter effect (as if it's not there) for the hover to return to
    this.shadow = this.pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
    this.shadow.opacity = 0;

    // Create hover state
    this.hoverState = this.pieSeries.slices.template.states.getKey('hover');

    // Slightly shift the shadow and make it more prominent on hover
    this.hoverShadow = this.hoverState.filters.push(new am4core.DropShadowFilter);
    this.hoverShadow.opacity = 0.7;
    this.hoverShadow.blur = 5;

    // Add a legend
    this.chart.legend = new am4charts.Legend();

    this.chart.data = [{
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
