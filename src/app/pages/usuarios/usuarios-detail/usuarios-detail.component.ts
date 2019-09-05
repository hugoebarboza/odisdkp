import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';

//DIALOG
import { EditUserComponent } from '../dialog/edituser/edituser.component';


//SERVICES
import { OrderserviceService, UserService } from 'src/app/services/service.index';
import { ShowComponent } from 'src/app/components/dialog/show/show.component';


@Component({
  selector: 'app-usuarios-detail',
  templateUrl: './usuarios-detail.component.html',
  styleUrls: ['./usuarios-detail.component.css']
})
export class UsuariosDetailComponent implements OnInit,  OnDestroy {

  id:number = 0;
  isLoading:boolean = true;
  isLoadingResults:boolean = true;
  isLoadingResultsKpi: boolean = true;
  pageSize: number = 5;
  sub: any;
  subscription: Subscription;
  token: any;
  user: any;
  userordenes = [];

  // options pie chart
  kpidata = [];
  kpitotal: number = 0;
  kpisearchoptions = [
    {value: 'day', name: 'Día'},
    {value: 'week', name: 'Semana'},
    {value: 'month', name: 'Mes Actual'},
    {value: 'year', name: 'Año Actual'},
  ];
  kpiselectedoption = '';
  showLegend = true;
  showLabels = false;
  explodeSlices = false;
  doughnut = false;
  view: any[] = [400, 350];
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#51a351', '#de473c']
  };


  constructor(
    private _route: ActivatedRoute,
    private _orderService: OrderserviceService,
    public _userService: UserService,
    public dialog: MatDialog,
  ) {
    this.token = this._userService.getToken();

    this.sub = this._route.params.subscribe(params => { 
      let id = +params['id'];
      this.id = id;
    });
  }

  ngOnInit() {
    if(this.id && this.id > 0){
      this.kpiselectedoption = 'day';
      this.isLoading = true;
      this.subscription = this._userService.getUserShowInfo(this.token.token, this.id).subscribe(
        response => {
          this.isLoading = false;
          //console.log(response);
          if(!response){
            return;
          }
          if(response.status == 'success'){
            this.user = response.data[0];
            this.loaduserordenes(this.id);
            this.loaduserordeneskpi(this.id);
            //console.log(this.user);
          }
        },
        (error: any) => {
          this.isLoading = false;
          console.log(<any>error);
        }
      )      
    }    
  }

  ngOnDestroy() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }    
  }


  public loaduserordenes(userid:number){
    this.isLoadingResults = true;
    if(userid > 0 ){ 
      this.userordenes = [];            
        this._orderService.gettUserOrdenes(this.token.token, userid, 'create_at', 'desc', this.pageSize, 0).then(
          (res: any) => 
          {
            res.subscribe(
              (some:any) => 
              {
                if(some.datos){
                  //console.log(some.datos);
                  this.userordenes = some.datos.data;
                  //console.log(this.userordenes.length);
                  this.isLoadingResults = false;
                }else{
                  this.isLoadingResults = false;
                }
              },
              (error:any) => { 
              this.userordenes = [];
              this.isLoadingResults = false;
              console.log(<any>error);
              }  
              )
          })      
        }
    }

    public loaduserordeneskpi(userid:number){
      this.isLoadingResultsKpi = true;
      if(userid > 0 ){ 
          this.kpidata = [];            
          this._orderService.gettUserOrdenesKpi(this.token.token, userid, this.kpiselectedoption).then(
            (res: any) => 
            {
              res.subscribe(
                (some:any) => 
                {
                  if(some.datos){
                    //console.log(some.datos);
                    //console.log(some.datos.length);
                    if(some.datos.length > 0){
                      for (let i = 0; i < some.datos.length; i++) {                        
                        if(some.datos[i]['servicetype']){
                          //console.log(some.datos[i]['servicetype']);
                          this.kpidata[i] = { name: some.datos[i]['servicetype'] + ': ' + some.datos[i]['user_count'], value: some.datos[i]['user_count']};
                          this.kpitotal = this.kpitotal + some.datos[i]['user_count'];
                          //console.log(this.kpitotal);
                        }
                      }
                    }
                    //console.log(this.kpidata);
                    this.isLoadingResultsKpi = false;
                  }else{
                    this.isLoadingResultsKpi = false;
                  }
                },
                (error:any) => { 
                this.kpidata = [];
                this.isLoadingResultsKpi = false;
                console.log(<any>error);
                }  
                )
            })      
          }
      }
  

    public loaduserordenesmore(userid:number, limit:number){
      this.isLoadingResults = true;
      this.pageSize = limit;
      if(userid > 0 ){ 
        this.userordenes = [];            
          this._orderService.gettUserOrdenes(this.token.token, userid, 'create_at', 'desc', this.pageSize, 0).then(
            (res: any) => 
            {
              res.subscribe(
                (some:any) => 
                {
                  if(some.datos){
                    console.log(some.datos);
                    this.userordenes = some.datos.data;
                    //console.log(this.userordenes.length);
                    this.isLoadingResults = false;
                  }else{
                    this.isLoadingResults = false;
                  }
                },
                (error:any) => { 
                this.userordenes = [];
                this.isLoadingResults = false;
                console.log(<any>error);
                }  
                )
            })      
          }
      }
  

    selectChangeKpi(event:any){
      this.isLoadingResultsKpi = true;
      if(this.id > 0 ){ 
          this.kpitotal = 0;
          this.kpidata = [];            
          this._orderService.gettUserOrdenesKpi(this.token.token, this.id, event.value).then(
            (res: any) => 
            {
              res.subscribe(
                (some:any) => 
                {
                  if(some.datos){
                    //console.log(some.datos);
                    //console.log(some.datos.length);
                    if(some.datos.length > 0){
                      for (let i = 0; i < some.datos.length; i++) {                        
                        if(some.datos[i]['servicetype']){
                          //console.log(some.datos[i]['servicetype']);
                          this.kpidata[i] = { name: some.datos[i]['servicetype'] + ': ' + some.datos[i]['user_count'], value: some.datos[i]['user_count']};
                          this.kpitotal = this.kpitotal + some.datos[i]['user_count'];
                          //console.log(this.kpitotal);
                        }
                      }
                    }
                    //console.log(this.kpidata);
                    this.isLoadingResultsKpi = false;
                  }else{
                    this.isLoadingResultsKpi = false;
                  }
                },
                (error:any) => { 
                this.kpidata = [];
                this.isLoadingResultsKpi = false;
                console.log(<any>error);
                }  
                )
            })      
          }
    }

    showOrder(order:any) {
      //console.log(order);
      const dialogRef = this.dialog.open(ShowComponent, {      
        width: '1000px',
        disableClose: true,
        data: {order_id: order.order_id, order_number: order.order_number, service_id: order.service_id, 
          category_id: order.category_id, customer_id: order.customer_id, cc_number: order.cc_number, 
          servicetype_id: order.servicetype_id, status_id: order.status_id, estatus: order.estatus, 
          order_date: order.order_date, required_date: order.required_date, vencimiento_date: order.vencimiento_date, observation: order.observation, 
          create_at: order.create_at, usercreate: order.user, update_at: order.update_at, userupdate: order.userupdate, 
          project_name: order.project_name, service_name: order.service_name, servicetype: order.servicetype,
          region: order.region, provincia: order.provincia, comuna: order.comuna, direccion: order.direccion}
  
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result === 1) {
  
          //const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
          // for delete we use splice in order to remove single object from DataService
          //this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
          //this.refreshTable();
        }
      });
    }
  


  startEdit(usuario:any) {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '777px',
      disableClose: true,  
      data: {usuario: usuario}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        //const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
        // this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
       //this.refresh();
      }
    });
  }



}
