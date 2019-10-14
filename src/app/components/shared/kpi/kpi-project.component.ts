import { Component, Input, OnInit,  OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';


//SERVICES
import { ProjectsService, UserService, ZipService } from 'src/app/services/service.index';

@Component({
  selector: 'app-kpi-project',
  templateUrl: './kpi-project.component.html',
  styleUrls: ['./kpi-project.component.css']
})
export class KpiProjectComponent implements OnInit, OnChanges, OnDestroy {

    identity: any;
    isLoading: boolean;
    isLoadingResult: boolean = true;
    proyectos: any;
    project: any;
    subscription: Subscription;
    role: number = 6;
    tipoServicio: any;
    title: string = 'Indicadores'
    token: any;
    users = [];

    @Input() id : number;

    constructor(
        private _project: ProjectsService,
        private _userService: UserService,
        public zipService: ZipService,
    ) { 
        this.identity = this._userService.getIdentity();
        this.proyectos = this._userService.getProyectos();
        this.token = this._userService.getToken();
    }
    
    ngOnInit() {

    }

    ngOnDestroy() {
      //console.log('La página se va a cerrar');
      if(this.subscription){
        this.subscription.unsubscribe();
      }
    }
  
  
    ngOnChanges(_changes: SimpleChanges) {
      this.isLoading = true;
      if(this.token.token != null && this.id > 0){
         this.getTipoServicio(this.id);
         this.project = this.filterService();
         if(this.project && this.project.id > 0){
          this.getUserProject(this.project.id);
         }
      }      
    }
  
    cargar(){  
    }

    getTipoServicio(id:number) {
      this.tipoServicio = null;
      this.zipService.getTipoServicio(id, this.token.token).then(
        (res: any) => {
          res.subscribe(
            (some: any) => {
              this.tipoServicio = some['datos'];
              this.isLoadingResult = false;
            },
            (error: any) => {
              this.isLoadingResult = false;
              console.log(<any>error);
            }
          );
        }
      );
    }

    getUserProject(id:number){
      this.subscription = this._project.getUserProject(this.token.token, id, this.role).subscribe(
      response => {
                if(!response){
                  return;
                }
                if(response.status == 'success'){    
                  this.users = response.datos;
                  this.isLoading = false;
                  //console.log(this.users);
                }else{
                  this.isLoading = false;
                }        
                },
                (error: any) => {
                  console.log(<any>error);
                  this.isLoading = false;
                });
      }
    

      filterService(){
        for(var i = 0; i < this.proyectos.length; i += 1){
          var result = this.proyectos[i];
          if(result && result.service){
            for(var y = 0; y < result.service.length; y += 1){
              var response = result.service[y];
              if(response && response.id === this.id){
                return result;
              }
            }
          }
        }
      }  
        
    
    
}
    