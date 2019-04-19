import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// MOMENT
import * as _moment from 'moment';
import { Subscription } from 'rxjs';
const moment = _moment;

// MODELS
import { Comuna, Provincia, Region } from '../../../models/types';

// SERVICES
import { CountriesService, UserService } from '../../../services/service.index';

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
      this.loadRegion();
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  loadRegion() {
    this.subscription = this._regionService.getRegion(this.token.token, this.identity.country).subscribe(
    response => {
       if (response.status === 'success') {
              this.region = response.datos.region;
            } else {
              this.region = null;
            }
     });
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
       this.resultsprovincias = null;
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
       this.resultscomunas = null;
     }

  }

  onSelectComuna(comunaid: number) {
  // this.states = this._dataService.getStates().filter((item)=> item.countryid == countryid);
  }

}
