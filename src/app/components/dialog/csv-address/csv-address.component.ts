import { Component, OnInit, Inject } from '@angular/core';
import { DataService, UserService } from 'src/app/services/service.index';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

import Swal from 'sweetalert2';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Limit, Formato } from 'src/app/pages/service/dialog/csvservice/csvservice.component';

@Component({
  selector: 'app-csv-address',
  templateUrl: './csv-address.component.html',
  styleUrls: ['./csv-address.component.css']
})
export class CsvAddressComponent implements OnInit {

  token: any;
  service_id: number;
  proyectos: any;
  project_id: number;
  country_id: number;

  ccnumber_s: Array<string>;
  ccnumber_obj: Array<object>;

  tarifa: Array<Object> = [];
  constante: Array<Object> = [];
  giro: Array<Object> = [];
  sector: Array<Object> = [];
  zona: Array<Object> = [];
  mercado: Array<Object> = [];

  set: Array<Object> = [];
  alimentadorAll: Array<Object> = [];
  sedAll: Array<Object> = [];

  alimentador: Array<Object> = [];
  sed: Array<Object> = [];
  clavelectura: Array<Object> = [];

  region: Array<Object> = [];
  provinciaAll: Array<Object> = [];
  comunaAll: Array<Object> = [];

  provincia: Array<Object> = [];
  comuna: Array<Object> = [];

  fecha_creatEdit: Array<Object> = [
    {value: 'create_at', name: 'Creado el'},
    {value: 'update_at', name: 'Editado el'}
  ];

  limite: Limit[] = [
    {value: '500', name: '< 500'},
    {value: '1000', name: '< 1000'},
    {value: '2000', name: '< 2000'},
    {value: '0', name: 'Todo (No Recomendado)'}
  ];

 formatos: Formato[] = [
    {value: '0', name: 'Formato original'},
    {value: '1', name: 'Formato mayúscula'}
  ];

  forma: FormGroup;

  loading = false;

  constructor(
    public dialogRef: MatDialogRef<CsvAddressComponent>,
    public dataService: DataService,
    private _userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.service_id = this.data['servicio'];
    this.token = this._userService.getToken();
    this.proyectos = this._userService.getProyectos();
  }

  ngOnInit() {
    const proyecto = this.filterProjectByService();
    if (proyecto && proyecto.id) {
      this.project_id = proyecto.id;
      this.country_id = proyecto.country_id;

      this.getSetAlimentadorSed(this.project_id);
      this.getRegionProvinciaComuna(this.country_id);
      this.getClaveLectura(this.project_id);
      this.getTarifa(this.service_id);
      this.getConstante(this.service_id);
      this.getSector(this.service_id);
      this.getGiro(this.service_id);
      this.getZona(this.service_id);
      this.getMercado(this.service_id);

      this.forma = new FormGroup({
        fecha_creatEdit: new FormControl (null),
        limite: new FormControl (null, [Validators.required]),
        fecha_desde: new FormControl ({value: null, disabled: true}),
        hora_desde: new FormControl (null),
        fecha_hasta: new FormControl ({value: null, disabled: true}),
        hora_hasta: new FormControl (null),
        formato: new FormControl (null, [Validators.required]),
        id_tarifa: new FormControl (null),
        id_constante: new FormControl (null),
        id_zona: new FormControl (null),
        id_giro: new FormControl (null),
        id_sector: new FormControl (null),
        id_mercado: new FormControl (null),
        id_clavelectura: new FormControl (null),
        id_set: new FormControl (null),
        id_alimentador: new FormControl (null),
        id_sed: new FormControl (null),
        id_region: new FormControl (null),
        id_provincia: new FormControl (null),
        id_comuna: new FormControl (null),
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  downloadExcel() {
    if (this.ccnumber_obj.length > 0) {
      const excelFileName = 'ListaUsuarios';
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ccnumber_obj);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, excelFileName);
    }
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  searchClient(form: any) {
    // console.log(JSON.stringify(form));
    this.ccnumber_s = [];
    this.ccnumber_obj = [];
    this.loading = true;

    this.dataService.getClientesPorTablas(this.project_id, this.token.token, form).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            console.log(some);

            if (some.datos && some.datos.data) {
              const userarray = some.datos.data;
              if (userarray.length > 0) {
                for (let i = 0; i < userarray.length; i++) {
                  this.ccnumber_obj.push({'cc_number': userarray[i]['cc_number']});
                  this.ccnumber_s.push(userarray[i]['cc_number']);
                }
              }
            }
            this.loading = false;
          },
          (error) => {
            console.log(<any>error);
            Swal.fire('Importante', 'Busqueda sin resultados', 'error');
            this.loading = false;
          }
        );
      }
    );
  }

  getRegionProvinciaComuna(country_id: number) {
    this.dataService.getRegionProvinciaComuna(country_id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            this.region =  some['region'];
            this.provinciaAll = some['provincia'];
            this.comunaAll =  some['comuna'];
          },
          (_error) => {
            // console.log(<any>error);
          }
        );
      }
    );
  }

  selectSet(setid: any) {

    if (setid) {
      this.alimentador = [];
      this.sed = [];

      this.forma.controls['id_alimentador'].setValue(null);
      this.forma.controls['id_sed'].setValue(null);

      for (let i = 0; i < this.alimentadorAll.length; i++) {
        const element: any = this.alimentadorAll[i];

        if (element.id_set === setid) {
          this.alimentador.push(element);
        }

      }
    }

  }

  selectAlimentador(alimentadorid: any) {

    if (alimentadorid) {
      this.sed = [];

      this.forma.controls['id_sed'].setValue(null);

      for (let i = 0; i < this.sedAll.length; i++) {
        const element: any = this.sedAll[i];

        if (element.id_alimentador === alimentadorid) {
          this.sed.push(element);
        }

      }
    }

  }

  selectRegion(regionid: any) {

    if (regionid) {

      this.provincia = [];
      this.comuna = [];

      this.forma.controls['id_provincia'].setValue(null);
      this.forma.controls['id_comuna'].setValue(null);

      for (let i = 0; i < this.provinciaAll.length; i++) {
        const element: any = this.provinciaAll[i];

        if (element.region_id === regionid) {
          this.provincia.push(element);
        }

      }
    }

  }

  selectProvincia(provinciaid: any) {

    if (provinciaid) {
      this.comuna = [];
      this.forma.controls['id_comuna'].setValue(null);

      for (let i = 0; i < this.comunaAll.length; i++) {
        const element: any = this.comunaAll[i];

        if (element.province_id === provinciaid) {
          this.comuna.push(element);
        }

      }
    }

  }

  validarRegionProvinciaComuna(termino: any, arrayObject: Array<object>, value: string, id: number, descId: string) {
    if (!termino) {
      return false;
    }
    let element: any;
    if (arrayObject.length > 0) {
      arrayObject.forEach(function(valor, _indice, _array) {
       if (valor[descId] === id && valor[value].toLowerCase() === (termino).toLowerCase()) {
        element = valor;
       }
      }, this);
    }
    return element;
  }

  filterProjectByService() {
    for (let i = 0; i < this.proyectos.length; i += 1) {
      const result = this.proyectos[i];
      if (result && result.service) {
        for (let y = 0; y < result.service.length; y += 1) {
          const response = result.service[y];
          if (response && response.id === this.service_id) {
            return result;
          }
        }
      }
    }
  }

  getTarifa(id) {
    this.dataService.getTarifa(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.tarifa = some['datos']['tarifa'];
          },
          (_error) => {
            // console.log(<any>error);
          }
        );
      }
    );
  }

  getSetAlimentadorSed(project_id: number) {
    this.dataService.getSetAlimentadorSed(project_id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.set = some['set'];
            this.alimentadorAll = some['alimentador'];
            this.sedAll = some['sed'];
          },
          (_error) => {
            // console.log(<any>error);
          }
        );
      }
    );
  }

  getClaveLectura(project_id: number) {
    this.dataService.getClaveLectura(project_id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.clavelectura = some['datos']['clavelectura'];
          },
          (_error) => {
            // console.log(<any>error);
          }
        );
      }
    );
  }

  getConstante(id) {
    this.dataService.getConstante(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.constante = some['datos']['constante'];
          },
          (_error) => {
            // console.log(<any>error);
          }
        );
      }
    );
  }

  getGiro(id) {
    this.dataService.getGiro(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.giro = some['datos']['giro'];
          },
          (_error) => {
            // console.log(<any>error);
          }
        );
      }
    );
  }

  getSector(id) {
    this.dataService.getSector(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.sector = some['datos']['sector'];
          },
          (_error) => {
            // console.log(<any>error);
          }
        );
      }
    );
  }

  getZona(id) {
    this.dataService.getZona(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.zona = some['datos']['zona'];
          },
          (_error) => {
            // console.log(<any>error);
          }
        );
      }
    );
  }

  getMercado(id) {
    this.dataService.getMercado(id, this.token.token).then(
      (res: any) => {
        res.subscribe(
          (some) => {
            // console.log(some);
            this.mercado = some['datos']['mercado'];
          },
          (_error) => {
            // console.log(<any>error);
          }
        );
      }
    );
  }

}
