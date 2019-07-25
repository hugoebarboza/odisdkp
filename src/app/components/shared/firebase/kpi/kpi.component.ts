import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrderserviceService, UserService, ProjectsService } from 'src/app/services/service.index';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { ServiceType } from 'src/app/models/types';
import * as _moment from 'moment';
import { Month } from 'src/app/pages/calendar/calendar-list/calendar.component';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
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
  public isLoading: boolean = false;
  public kpiCollection: AngularFirestoreCollection<any>;
  public datatype: ServiceType[] = [];
  public kpiyear = [];
  public mesactual;

  view: any[] = [360, 400];
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
    private firebaseAuth: AngularFireAuth,
    private _afs: AngularFirestore,
    private _userService: UserService,
    public dataService: ProjectsService,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
   }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.kpiTableData = null;
    const mm = moment().month('month').format('MM');

    this.displayedColumns[0] = 'servicetype';

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
    //console.log("pasoooo");
    //console.log(this.displayedColumns);
    this.getProject(this.id);
  }

  getProject(id: number) {
    this.subscription = this._orderService.getService(this.token, id).subscribe(
     response => {
               if (response.status === 'success') {
               this.project_id = response.datos['project_id'];
                  if (this.project_id > 0) {
                    //console.log(response.datos);
                    this.cargar();
                  }
               }
      });
   }

   cargar() {
    this.isLoading = true;
    // console.log(this.id);

    const that = this;
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
                //console.log(this.datatype);

                const startOfMonth = moment().startOf('year').format('YYYY-MM-DD hh:mm:ss');
                const endOfMonth   = moment().endOf('year').format('YYYY-MM-DD hh:mm:ss');

                //console.log(startOfMonth);
                //console.log(endOfMonth);

                if (this.datatype.length > 0) {
                  for (let i = 0; i < this.datatype.length; i++) {
                    const ruta = 'kpi/projects/' + this.project_id + '/' + this.id + '/' + this.datatype[i]['id'] + '/';
                    //console.log(ruta);
                    // tslint:disable-next-line:max-line-length
                    this.kpiCollection = this._afs.collection(ruta, ref => ref.where('create_at', '>=', startOfMonth).where('create_at', '<=', endOfMonth).orderBy('create_at', 'asc'));
                    this.kpiCollection.snapshotChanges()
                      .map(actions => {
                        //console.log('PASOOOOO');
                        return actions.map(a => {
                          const data = a.payload.doc.data();
                          const id = a.payload.doc.id;
                          data.name = this.datatype[i]['name'];
                          //console.log({ id, ...data });
                          return { id, ...data };
                        });
                      }).subscribe(res => {
                        const servicetypekpi: object = {};
                        servicetypekpi['servicetype'] = this.datatype[i]['name'];
                        servicetypekpi['servicetype_id'] = this.datatype[i]['id'];

                        for (let e = 0; e < this.months.length; e++) {
                          let validar = false;
                          for (let r = 0; r < res.length; r++) {
                            if (res[r]['mes'] === this.months[e]['value']) {
                              validar = true;
                              let object: object = {};
                              object = res[r];
                              object['desc_mes'] = this.months[e]['name'];
                              servicetypekpi[this.months[e]['name']] = object;
                            }
                          }
                          if (!validar) {
                            const object: object = {};
                            object['mes'] = this.months[e]['value'];
                            object['desc_mes'] = this.months[e]['name'];
                            object['porcentaje'] = 0;
                            servicetypekpi[this.months[e]['name']] = object;
                          }
                        }
                        //console.log('QUE FUNCIONE :)');

                        this.kpiyear[i] = servicetypekpi;
                        //console.log(this.kpiyear);
                        this.kpiTableData = new MatTableDataSource(this.kpiyear);
                        this.kpiTableData.paginator = this.paginator;
                        this.kpiTableData.sort = this.sort;

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
