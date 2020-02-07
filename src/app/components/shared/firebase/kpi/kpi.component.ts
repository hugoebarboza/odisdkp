import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { OrderserviceService, UserService, ProjectsService } from 'src/app/services/service.index';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// FIREBASE
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

// MODELS
import { ServiceType } from 'src/app/models/types';

// MOMENT
import * as _moment from 'moment';
import { Month } from 'src/app/pages/calendar/calendar-list/calendar.component';
const moment = _moment;

@Component({
  selector: 'app-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.css']
})
export class KpiComponent implements OnInit, OnChanges {

  @Input() id: number;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  kpiTableData = new MatTableDataSource();

  public project_id: number;
  public subscription: Subscription;
  public identity: any;
  public token: any;
  public isLoading = false;
  public kpiCollection: AngularFirestoreCollection<any>;
  public kpiCollectionlast: AngularFirestoreCollection<any>;
  public datatype: ServiceType[] = [];
  public kpiyear = [];
  public mesactual: any;
  public kpimes = [];
  public kpimesTypes = [];

  view: any[];
  colorScheme = {
    domain: ['#51a351', '#de473c']
  };

  public months: Month[] = [
    {value: 1, name: 'Enero'},
    {value: 2, name: 'Febrero'},
    {value: 3, name: 'Marzo'},
    {value: 4, name: 'Abril'},
    {value: 5, name: 'Mayo'},
    {value: 6, name: 'Junio'},
    {value: 7, name: 'Julio'},
    {value: 8, name: 'Agosto'},
    {value: 9, name: 'Septiembre'},
    {value: 10, name: 'Octubre'},
    {value: 11, name: 'Noviembre'},
    {value: 12, name: 'Diciembre'}
  ];

  displayedColumns: string[] = [];

  constructor(
    private _orderService: OrderserviceService,
    private _afs: AngularFirestore,
    private _userService: UserService,
    public dataService: ProjectsService,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.view = [innerWidth / 7, 300];
   }

  ngOnInit() {
  }

  ngOnChanges(_changes: SimpleChanges) {

    const mm = moment().month('month').format('MM');
    this.displayedColumns = [];
    this.displayedColumns = ['servicetype'];

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

    this.getProject(this.id);

  }

  onResize(event) {
    let param = event.target.innerWidth / 7;

    if (param < 300) {
      param = 300;
    }
    this.view = [param, 300];
  }

  getProject(id: number) {
    this.subscription = this._orderService.getService(this.token, id).subscribe(
     response => {
               if (response.status === 'success') {
               this.project_id = response.datos['project_id'];
                  if (this.project_id > 0) {
                    // console.log(response.datos);
                    this.cargar();
                  }
               }
      });
   }

   cargar() {
    this.isLoading = true;
    // console.log(this.id);
    this.subscription = this.dataService.getTipoServicio(this.token.token, this.id)
    .subscribe(
    response => {
      // console.log(response);
              if (!response) {
                // this.status = 'error';
                this.isLoading = false;
                return;
              }
              if (response.status === 'success') {

                this.datatype = response.datos;
                // console.log(this.datatype);

                const startOfMonth = moment().startOf('year').format('YYYY-MM-DD hh:mm:ss');
                const endOfMonth   = moment().endOf('year').format('YYYY-MM-DD hh:mm:ss');

                // console.log(startOfMonth);
                // console.log(endOfMonth);

                if (this.datatype.length > 0) {

                  for (let i = 0; i < this.datatype.length; i++) {
                    const ruta = 'kpi/projects/' + this.project_id + '/' + this.id + '/' + this.datatype[i]['id'] + '/';
                    this.kpiCollectionlast = this._afs.collection(ruta, ref => ref.orderBy('create_at', 'desc').limit(1));
                    this.kpiCollectionlast.snapshotChanges()
                      .map(actions => {
                        return actions.map(a => {
                          const data = a.payload.doc.data();
                          const id = a.payload.doc.id;
                          data.name = this.datatype[i]['name'];
                          // console.log({ id, ...data });
                          return { id, ...data };
                        });
                      }).subscribe(res => {

                        if (res && res.length > 0) {
                          for (let r = 0; r < res.length; r++) {
                            this.kpimes[i] = [
                                              { name: 'Avance ' + res[r]['porcentaje'] + '%' , value: res[r]['porcentaje']},
                                              {name: 'Pendiente ' + (100 - res[r]['porcentaje']) + '%' , value: (100 - res[r]['porcentaje'])}
                                             ];

                          }
                        } else {
                            this.kpimes[i] = [{ name: 'Avance 0%' , value: 0}, {name: 'Pendiente 100%' , value: 100}];
                        }

                      });

                    // tslint:disable-next-line:max-line-length
                    this.kpiCollection = this._afs.collection(ruta, ref => ref.where('create_at', '>=', startOfMonth).where('create_at', '<=', endOfMonth).orderBy('create_at', 'asc'));
                    this.kpiCollection.snapshotChanges()
                      .map(actions => {
                        return actions.map(a => {
                          const data = a.payload.doc.data();
                          const id = a.payload.doc.id;
                          data.name = this.datatype[i]['name'];
                          // console.log({ id, ...data });
                          return { id, ...data };
                        });
                      }).subscribe(res => {
                        const servicetypekpi: object = {};
                        servicetypekpi['servicetype'] = this.datatype[i]['name'];
                        servicetypekpi['servicetype_id'] = this.datatype[i]['id'];
                        this.kpimesTypes[i] = this.datatype[i]['name'];

                        for (let e = 0; e < this.months.length; e++) {

                          let validar = false;
                          for (let r = 0; r < res.length; r++) {
                            if (res[r]['mes'] === this.months[e]['value']) {
                              validar = true;
                              const object: Elementt = {
                                desc_mes: this.months[e]['name'],
                                create_at: res[r]['mes'],
                                id: res[r]['id'],
                                mes: res[r]['mes'],
                                name: res[r]['name'],
                                porcentaje: res[r]['porcentaje'],
                                uid: res[r]['uid'],
                              };
                              servicetypekpi[this.months[e]['name']] = object;
                            }
                          }
                          if (!validar) {
                            const object: Elementt = {
                              desc_mes: this.months[e]['name'],
                              create_at: 'S/N',
                              id: 'S/N',
                              mes: this.months[e]['value'],
                              name: 'S/N',
                              porcentaje: 0,
                              uid: 'S/N',
                            };
                            servicetypekpi[this.months[e]['name']] = object;
                          }
                        }

                        this.kpiyear[i] = servicetypekpi;
                        if ( this.kpiyear.length === this.datatype.length) {
                          this.kpiTableData = new MatTableDataSource(this.kpiyear);
                          this.kpiTableData.paginator = this.paginator;
                          this.kpiTableData.sort = this.sort;
                        }

                      });

                  }

                }

                this.isLoading = false;

              }
              },
              error => {
                // this.status = 'error';
                this.isLoading = false;
                console.log(<any>error);
              }

              );

  }


}

export interface Elementt {
  create_at: String;
  desc_mes: String;
  id: String;
  mes: number;
  name: String;
  porcentaje: number;
  uid: String;
}

