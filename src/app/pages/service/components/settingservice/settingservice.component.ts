import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TooltipPosition, MatDialog } from '@angular/material';

declare var swal: any;

//DIALOG
import { AddProjectTypeComponent } from '../../dialog/add-project-type/add-project-type.component';
import { AddProjectCategorieComponent } from '../../dialog/add-project-categorie/add-project-categorie.component';



//MODELS
import { Countries, Customers, Departamento, Estatus, Proyecto, Service, User } from 'src/app/models/types';

//SERVICES
import { CountriesService, ProjectsService, SettingsService, UserService} from 'src/app/services/service.index';



@Component({  
  selector: 'app-settingservice',
  templateUrl: './settingservice.component.html',
  styleUrls: ['./settingservice.component.css']
})
export class SettingServiceComponent implements OnInit, OnDestroy {


  countries: Countries[];
  customers: Customers[];
  departamentos: Departamento[];
  forma: FormGroup;
  id:number;
  identity:any = {};
  isRateLimitReached: boolean = false;
  loading: boolean = true;
  project: Proyecto;
  proyecto: Proyecto;
  proyectos: Array<Proyecto>;
  project_name: string;
  show:boolean = false;
  services: Service;
  subscription: Subscription;
  sub: any;
  title: string;
  token: any = {};
  users: User[] = [];

  estatus: Estatus[] = [
    {id: 1, description: 'Activo', status: 1, create_at: '', update_at: ''},
    {id: 0, description: 'Desactivo', status: 1, create_at: '', update_at: ''},
  ];  


  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  positiondatasourceaction = new FormControl(this.positionOptions[3]);
  positionleftaction = new FormControl(this.positionOptions[4]);
    
  constructor(
    public _countryService: CountriesService,
    public _proyectoService: ProjectsService,
    private _route: ActivatedRoute,
    public _router: Router,
    public _userService: UserService,
    public dialog: MatDialog,
    public label: SettingsService
  ) { 
    this.identity = this._userService.getIdentity();
    this.proyectos = this._userService.getProyectos();
    this.token = this._userService.getToken();

    this.label.getDataRoute().subscribe(data => {
      this.title = data.subtitle;
    });


    this.sub = this._route.params.subscribe(params => { 
      let id = +params['id'];            
      this.id = id;
    });    

  }

  ngOnInit() {
    //console.log(this.estatus);
    if(this.id){
      this.loading = true;         
      this.project = this.filter();
      if(this.project && this.project.project_name){
        this.project_name = this.project.project_name;
        this._proyectoService.getProjectSelect(this.token.token, this.id).then(
          (res:any) => {
            {
              res.subscribe(
                (some) => 
                {
                  if(some.datos){
                    //console.log(some.datos);
                    this.proyecto = some.datos;
                    if(this.proyecto){
                      this.buildform();
                      this.loadCountries();
                      this.loadUser();
                      this.loadCountryCustomer();
                      this.loadCountryDepartamento();
                    }
                    this.loading = false;
                    this.isRateLimitReached = false;
                  }else{
                    this.loading = false;
                    this.isRateLimitReached = false;
                  }
                },
                (error) => { 
                this.loading = false;
                this.isRateLimitReached = false;
                console.log(<any>error);
                }  
                )
          }
          });          
      }else{
        this._router.navigate(['/notfound']);
      }        
    }    
  }

  ngOnDestroy() {
    if(this.subscription){
      this.subscription.unsubscribe();
      //console.log("ngOnDestroy unsuscribe");
    }
  }


  buildform(){
    this.forma = new FormGroup({      
      project_name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      apikey: new FormControl(null, ),
      calendarID: new FormControl(null, ),
      clientid: new FormControl(null, ),
      country_id: new FormControl(null, [Validators.required]),
      customer_id: new FormControl(null, [Validators.required]),      
      department_id: new FormControl(null, [Validators.required]),
      from_date: new FormControl(null),
      gpstime: new FormControl(null),
      status: new FormControl(null, [Validators.required]),            
      time_end: new FormControl(null),
      to_date: new FormControl(null)
    } );
    
    this.forma.setValue({
      'project_name': this.proyecto.project_name ,
      'apikey': this.proyecto.apikey,
      'calendarID': this.proyecto.calendarID,
      'clientid': this.proyecto.clientid,
      'country_id': this.proyecto.country_id,
      'customer_id': this.proyecto.customer_id,
      'department_id': this.proyecto.department_id,
      'from_date': this.proyecto.from_date,
      'gpstime': this.proyecto.gpstime,
      'status': this.proyecto.status,
      'time_end': this.proyecto.time_end,
      'to_date': this.proyecto.to_date
    })
  }

  loadCountryCustomer(){
    if(this.proyecto.country_id){
      this.subscription = this._countryService.getCountryCustomer(this.token.token, this.proyecto.country_id).subscribe(
        response => {
                  if(!response){
                    return;
                  }
                  if(response.status == 'success'){    
                    this.customers = response.datos.customer;
                    //console.log(this.customers);
                  }
                  });
    }
  }

  loadCountryDepartamento(){
    if(this.proyecto.country_id){
      this.subscription = this._countryService.getCountryDepartamentos(this.token.token, this.proyecto.country_id).subscribe(
        response => {
                  if(!response){
                    return;
                  }
                  if(response.status == 'success'){    
                    this.departamentos = response.datos.departamento;
                    //console.log(this.departamentos);
                  }
                  });
    }
  }


  loadCountries(){
    this.subscription = this._countryService.getCountries(this.token.token).subscribe(
      response => {
                if(!response){
                  return;
                }
                if(response.status == 'success'){    
                  this.countries = response.datos;
                  //console.log(this.countries);
                }
                });  
  }

  loadUser(){

    this.subscription = this._proyectoService.getUserProject(this.token.token, this.id, 8).subscribe(
    response => {
              if(!response){
                return;
              }
              if(response.status == 'success'){    
                this.users = response.datos;
                //console.log(this.users);
              }
              });
   }


  confirmEdit() {
		if(this.forma.invalid){
			swal('Importante', 'A ocurrido un error en el procesamiento de formulario', 'error');
			return;
    }

  
    this.project = new Proyecto(
      this.forma.value.apikey, 
      this.forma.value.calendarID, 
      this.forma.value.clientid, 
      '', 
      this.forma.value.country_id, 
      '', 
      this.forma.value.customer_id,
      '',
      this.forma.value.department_id,
      this.forma.value.from_date,
      this.forma.value.gpstime,
      this.id,
      this.forma.value.project_name,
      '',
      this.forma.value.status,
      this.forma.value.time_end,
      this.forma.value.to_date,
      0,
      '',
      0,
      ''
    );

    if(this.forma.value.status == 0){
      swal({
        title: '¿Esta seguro?',
        text: 'Esta a punto de desactivar proyecto ' + this.forma.value.project_name,
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      })
      .then( borrar => {
  
        if (borrar) {

          this._proyectoService.updateProject(this.token.token, this.project, this.id)
          .subscribe( (resp: any) => {              
            if(!resp){
              return;        
            }
            if(resp.status == 'success'){ 
              swal('Proyecto actualizado', this.project.project_name, 'success' );
              this.ngOnInit();
              this.show = false;
            }else{
              swal('Importante', 'A ocurrido un error en el procesamiento de información', 'error');
            }
          },
            error => {
              console.log(<any>error);
              swal('Importante', error.error.message, 'error');
            }       
          );             
        }
  
      });      
      
    }

    if(this.project && this.forma.value.status > 0){
      this._proyectoService.updateProject(this.token.token, this.project, this.id)
      .subscribe( (resp: any) => {              
        if(!resp){
          return;        
        }
        if(resp.status == 'success'){ 
          swal('Proyecto actualizado', this.project.project_name, 'success' );
          this.ngOnInit();
          this.show = false;
        }else{
          swal('Importante', 'A ocurrido un error en el procesamiento de información', 'error');
        }
      },
        error => {
          //swal('Importante', error.error.message, 'error');
          swal('Importante', error, 'error');
        }       
      );     
    }


  }

  filter(){
    if(this.proyectos && this.id){
      for(var i = 0; i < this.proyectos.length; i += 1){
        var result = this.proyectos[i];
        if(result.id === this.id){
            return result;
        }
      }
    }    
  }


  projectType(id: number) {
    const dialogRef = this.dialog.open(AddProjectTypeComponent, {
      width: '777px',
      disableClose: true,  
      data: {
        project_id: this.id,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        //const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
      // this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
      }
    });
  }


  projectCategorie(id: number) {
    const dialogRef = this.dialog.open(AddProjectCategorieComponent, {
      width: '777px',
      disableClose: true,  
      data: {
        project_id: this.id,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        //const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
      // this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
      }
    });
  }



  toggle() {
    this.show = !this.show;
  }


}
