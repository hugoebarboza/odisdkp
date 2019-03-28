import { Component, OnInit, Output, EventEmitter, OnChanges, OnDestroy, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';


//SERVICES
import { OrderserviceService } from '../../services/orderservice.service';
import { UserService } from '../../services/user.service';




@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css']
})
export class GestionComponent implements OnInit, OnChanges, OnDestroy {

public identity: any;
public isLoadingResults: boolean;
public project: string;
public project_id: number;
public servicename: string;
public token: any;




  @Input() id : number;
  @Output() ServicioSeleccionado: EventEmitter<string>;


  constructor(    
    private _dataService: OrderserviceService,
    private _userService: UserService,
  ) { 
    this.identity = this._userService.getIdentity();
    this.ServicioSeleccionado = new EventEmitter();
    this.token = this._userService.getToken();
  }

  ngOnInit() {
    //this.breakpoint = (window.innerWidth <= 400) ? 3 : 3;

  }

  ngOnChanges(changes: SimpleChanges) {
    this.loadInfo();
  }
  
  ngOnDestroy() {
    //this.subscription.unsubscribe();
  }

  onResize(event) {
    //this.breakpoint = (event.target.innerWidth <= 400) ? 3 : 1;
  }  


  public loadInfo(){
    this.isLoadingResults = true;
    this._dataService.getService(this.token.token, this.id).subscribe(
                response => 
                      {
                        if(response.status == 'success'){
                          this.servicename = String (response.datos.service_name);                     
                          this.ServicioSeleccionado.emit(this.servicename);
                          this.isLoadingResults = false;
                        }else{
                        this.isLoadingResults = false;
                        }
                    },
                    (error) => {
                      this.isLoadingResults = false;
                      //localStorage.removeItem('identity');
                      //localStorage.removeItem('token');
                      //localStorage.removeItem('proyectos');
                      //localStorage.removeItem('expires_at');
                      //this._router.navigate(["/login"]);          
                      console.log(<any>error);
                    }  
                    );    

  }  



}
