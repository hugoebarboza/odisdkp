import { Component, Input, NgZone, AfterViewInit, OnDestroy } from '@angular/core';

// AMCHART
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

// MODELS
import { UserService } from 'src/app/services/service.index';


@Component({
  selector: 'app-kpi-project-heatmap',
  templateUrl: './kpi-project-heatmap.component.html',
  styleUrls: ['./kpi-project-heatmap.component.css']
})
export class KpiProjectHeatmapComponent implements AfterViewInit, OnDestroy {

  @Input() data = [];

  identity: any;
  chartmap: any;

  constructor(
    private zone: NgZone,
    private _userService: UserService,
  ) {
    this.identity = this._userService.getIdentity();
  }

  ngAfterViewInit() {
    if (this.data && this.data.length > 0) {
      this.createamMapaChart(this.data);
    }
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chartmap) {
          this.chartmap.dispose();
      }
    });
  }


  createamMapaChart (datasource = []) {

    this.zone.runOutsideAngular(() => {
      Promise.all([
      ])
          .then(() => {

          // Datasource join regions in one array
          const result = [];
          datasource.forEach(function (value) {
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
          });

          // Themes begin
          am4core.useTheme(am4themes_animated);
          // Themes end
          const countryMaps = {
            'AL': [ 'albaniaLow' ],
            'DZ': [ 'algeriaLow' ],
            'AD': [ 'andorraLow' ],
            'AO': [ 'angolaLow' ],
            'AR': [ 'argentinaLow' ],
            'AM': [ 'armeniaLow' ],
            'AU': [ 'australiaLow' ],
            'AT': [ 'austriaLow' ],
            'AZ': [ 'azerbaijanLow' ],
            'BH': [ 'bahrainLow' ],
            'BD': [ 'bangladeshLow' ],
            'BY': [ 'belarusLow' ],
            'BE': [ 'belgiumLow' ],
            'BZ': [ 'belizeLow' ],
            'BM': [ 'bermudaLow' ],
            'BT': [ 'bhutanLow' ],
            'BO': [ 'boliviaLow' ],
            'BW': [ 'botswanaLow' ],
            'BR': [ 'brazilLow' ],
            'BN': [ 'bruneiDarussalamLow' ],
            'BG': [ 'bulgariaLow' ],
            'BF': [ 'burkinaFasoLow' ],
            'BI': [ 'burundiLow' ],
            'KH': [ 'cambodiaLow' ],
            'CM': [ 'cameroonLow' ],
            'CA': [ 'canandaLow' ],
            'CV': [ 'capeVerdeLow' ],
            'CF': [ 'centralAfricanRepublicLow' ],
            'TD': [ 'chadLow' ],
            'CL': [ 'chileLow' ],
            'CN': [ 'chinaLow' ],
            'CO': [ 'colombiaLow' ],
            'CD': [ 'congoDRLow' ],
            'CG': [ 'congoLow' ],
            'CR': [ 'costaRicaLow' ],
            'HR': [ 'croatiaLow' ],
            'CZ': [ 'czechRepublicLow' ],
            'DK': [ 'denmarkLow' ],
            'DJ': [ 'djiboutiLow' ],
            'DO': [ 'dominicanRepublicLow' ],
            'EC': [ 'ecuadorLow' ],
            'EG': [ 'egyptLow' ],
            'SV': [ 'elSalvadorLow' ],
            'EE': [ 'estoniaLow' ],
            'SZ': [ 'eswatiniLow' ],
            'FO': [ 'faroeIslandsLow' ],
            'FI': [ 'finlandLow' ],
            'FR': [ 'franceLow' ],
            'GF': [ 'frenchGuianaLow' ],
            'GE': [ 'georgiaLow' ],
            'DE': [ 'germanyLow' ],
            'GR': [ 'greeceLow' ],
            'GL': [ 'greenlandLow' ],
            'GN': [ 'guineaLow' ],
            'HN': [ 'hondurasLow' ],
            'HK': [ 'hongKongLow' ],
            'HU': [ 'hungaryLow' ],
            'IS': [ 'icelandLow' ],
            'IN': [ 'indiaLow' ],
            'GB': [ 'ukLow' ],
            'IE': [ 'irelandLow' ],
            'IL': [ 'israelLow' ],
            'PS': [ 'palestineLow' ],
            'MT': [ 'italyLow' ],
            'SM': [ 'italyLow' ],
            'VA': [ 'italyLow' ],
            'IT': [ 'italyLow' ],
            'JP': [ 'japanLow' ],
            'MX': [ 'mexicoLow' ],
            'RU': [ 'russiaCrimeaLow' ],
            'KR': [ 'southKoreaLow' ],
            'ES': [ 'spainLow' ],
            'US': [ 'usaAlbersLow' ]
          };

          let currentMap: any;
          const country_code = this.identity.country_code;
          const title = this.identity.country_name;

          if ( countryMaps[ country_code ] !== undefined ) {
            currentMap = countryMaps[ country_code ][ 0 ];
            // console.log(currentMap);
          }

          const chart = am4core.create('chartdivmap', am4maps.MapChart);

          chart.titles.create().text = title;

          chart.geodataSource.url = 'https://www.amcharts.com/lib/4/geodata/json/' + currentMap + '.json';
          chart.geodataSource.events.on('parseended', function(ev) {
            const data = [];
            for (let i = 0; i < ev.target.data.features.length; i++) {
              if (result.find( ({ regioncode }) => regioncode === ev.target.data.features[i].id )) {
                data.push({
                  id: ev.target.data.features[i].id,
                  value: result[0]['produccion']
                });

              } else {
                data.push({
                  id: ev.target.data.features[i].id,
                  value: 0
                });
              }
            }
            polygonSeries.data = data;
          });

          // Set projection
          chart.projection = new am4maps.projections.Mercator();

          // Create map polygon series
          const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

          // Set min/max fill color for each area
          polygonSeries.heatRules.push({
            property: 'fill',
            target: polygonSeries.mapPolygons.template,
            min: chart.colors.getIndex(1).brighten(1),
            max: chart.colors.getIndex(1).brighten(-0.3)
          });

          // Make map load polygon data (state shapes and names) from GeoJSON
          polygonSeries.useGeodata = true;

          // Set up heat legend
          const heatLegend = chart.createChild(am4maps.HeatLegend);
          heatLegend.series = polygonSeries;
          heatLegend.align = 'right';
          heatLegend.width = am4core.percent(25);
          heatLegend.marginRight = am4core.percent(4);
          heatLegend.minValue = 0;
          heatLegend.maxValue = 40000000;
          heatLegend.valign = 'bottom';

          // Set up custom heat map legend labels using axis ranges
          const minRange = heatLegend.valueAxis.axisRanges.create();
          minRange.value = heatLegend.minValue;
          minRange.label.text = 'Min.';
          const maxRange = heatLegend.valueAxis.axisRanges.create();
          maxRange.value = heatLegend.maxValue;
          maxRange.label.text = 'Max.';

          // Blank out internal heat legend value axis labels
          heatLegend.valueAxis.renderer.labels.template.adapter.add('text', function() {
            return '';
          });

          // Configure series tooltip
          const polygonTemplate = polygonSeries.mapPolygons.template;
          polygonTemplate.tooltipText = '{name}: {value}';
          polygonTemplate.nonScalingStroke = true;
          polygonTemplate.strokeWidth = 0.5;

          // Create hover state and set alternative fill color
          const hs = polygonTemplate.states.create('hover');
          hs.properties.fill = chart.colors.getIndex(1).brighten(-0.5);

          this.chartmap = chart;
          })
          .catch(e => {
              console.error('Error when creating chart', e);
          });
    });

  }

}
