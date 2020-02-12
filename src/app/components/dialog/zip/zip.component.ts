import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// MOMENT
import * as _moment from 'moment';
import { Subscription } from 'rxjs/Subscription';
const moment = _moment;

// MODELS
import { Comuna, Provincia, Region } from 'src/app/models/types';

// SERVICES
import { CountriesService, UserService } from 'src/app/services/service.index';

@Component({
  selector: 'app-zip',
  templateUrl: './zip.component.html',
  styleUrls: ['./zip.component.css']
})
export class ZipComponent {

  title = 'Zip de Imágenes';
  date = new FormControl(moment(new Date()).format('YYYY[-]MM[-]DD'));
  tiposervicio: Array<Object> = [];
  zona: Array<Object> = [];
  zona_id = 0;
  tipoServicio_id = 0;

  subscription: Subscription;
  public token: any;
  public identity: any;
  public termino: string;
  public results: Object = [];
  public resultsprovincias: Object = [];
  public resultscomunas: Object = [];
  public region: Region;
  public provincia: Provincia;
  public comuna: Comuna;
  public project_id: any;

  selectedColumnnDate = {
    fieldValue: '',
    criteria: '',
    columnValueDesde: this.date.value,
    columnValueHasta: this.date.value
  };

  constructor(
    public dialogRef: MatDialogRef<ZipComponent>,
    private _regionService: CountriesService,
    private _userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data ) {
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.tiposervicio = data['tiposervicio'];
      this.zona = data['zona'];
      this.data.date = this.date.value;
      this.data.dateend = this.date.value;
      this.project_id = data['project_id'];
      this.loadRegion();
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async loadRegion() {
    const data = await this._userService.getRegion();

    if (data) {
      this.region = data.datos.region;
    } else {
      this.region = null;
    }
    /*
    this.subscription = this._regionService.getRegion(this.token.token, this.identity.country).subscribe(
    response => {
       if (response.status === 'success') {
              this.region = response.datos.region;
            } else {
              this.region = null;
            }
     });*/
  }

  onSelectRegion(regionid: number) {
    if (regionid > 0) {
      this.resultscomunas = null;
      this.subscription = this._regionService.getProvincia(this.token.token, regionid).subscribe(
       response => {
             if (!response) {
               return;
             }
             if (response.status === 'success') {
               this.resultsprovincias = response.datos.provincia;
               this.data.id_provincia = 0;
               this.data.id_comuna = 0;
             }
             });
     } else {
        this.data.id_region = 0;
        this.data.id_provincia = 0;
        this.data.id_comuna = 0;
        this.resultsprovincias = null;
        this.resultscomunas = null;
     }
  }

  onSelectProvincia(provinciaid: number) {
    if (provinciaid > 0) {
      this.subscription = this._regionService.getComuna(this.token.token, provinciaid).subscribe(
       response => {
             if (!response) {
               return;
             }
             if (response.status === 'success') {
               this.resultscomunas = response.datos.comuna;
               this.data.id_comuna = 0;
             }
             });
     } else {
      this.data.id_provincia = 0;
      this.data.id_comuna = 0;
      this.resultscomunas = null;
     }

  }

  onSelectComuna(_comunaid: number) {
  // this.states = this._dataService.getStates().filter((item)=> item.countryid == countryid);
  }


  stardownload(result) {
    if (result !== undefined) {
      console.log(result);

      let link = 'http://gasco.ocachile.cl/gasco/ocaglobalzip/zip.php?project_id=' + this.project_id + '&tiposervicio=' +
                  result['selectedValueservicio'] + '&createUpdate=' + result['createEdit']  + '&startdate=' +
                  moment(result['date']).format('YYYY-MM-DD') + '&enddate=';

      if (result['dateend'] !== undefined) {
        link = link + moment(result['dateend']).format('YYYY-MM-DD');
      } else {
        link = link + moment(result['date']).format('YYYY-MM-DD');
      }

      if (result['selectedValuezona'] !== undefined) {
      link = link + '&zona=' + result['selectedValuezona'];
      }

      // tslint:disable-next-line:max-line-length
      link =  link + '&idr=' + result['id_region'] + '&idp=' + result['id_provincia'] + '&idc=' + result['id_comuna'];
      window.open(link, '_blank');
    }
  }

}
