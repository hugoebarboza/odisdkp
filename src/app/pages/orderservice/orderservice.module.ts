import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import { HttpModule } from '@angular/http';

//COMPONENTS
import { DateDialogComponent } from '../../components/date-dialog/date-dialog.component';
import { ExcelComponent, DialogOverviewDialog } from '../../components/excel/excel.component';
import { ExcelVehiculoComponent } from '../../components/excel-vehiculo/excel-vehiculo.component';
import { FileComponent } from '../../components/dialog/file/file.component';
import { FilelistComponent } from '../../components/dialog/filelist/filelist.component';
import { GestionComponent } from '../../components/gestion/gestion.component';
import { MapaComponent } from '../../components/mapa/mapa/mapa.component';
import { MapaFullWidthComponent } from '../../components/mapa/mapafullwidth/mapafullwidth.component'; 
import { TableroComponent } from '../../components/tablero/tablero.component';
import { UsertableComponent } from '../../components/usertable/usertable.component';
import { ViewOrderDetailComponent } from '../../components/views/vieworderdetail/vieworderdetail.component';
//import { ViewOrderTimeSpentComponent } from '../../components/views/viewordertimespent/viewordertimespent.component';
import { VieworderserviceComponent } from '../../components/views/vieworderservice/vieworderservice.component';
import { ViewOrderServiceSelectComponent } from './components/vieworderserviceselect/vieworderserviceselect.component';
import { ViewprojectcustomerComponent } from '../../components/views/viewprojectcustomer/viewprojectcustomer.component';
import { ViewprojectorderComponent } from '../../components/views/viewprojectorder/viewprojectorder.component';
import { ViewModule } from '../../components/views/view.module';

//DIALOG
import { AddComponent } from '../../components/dialog/add/add.component';
import { AddcustomerComponent } from '../../components/dialog/addcustomer/addcustomer.component';
import { AddSupportComponent } from '../../components/dialog/widget/addsupport/addsupport.component';
import { AddConstanteComponent } from './components/dialog/add-constante/add-constante.component';
import { AddColorComponent } from './components/dialog/add-color/add-color.component';
import { AddGiroComponent } from './components/dialog/add-giro/add-giro.component';
import { AddMercadoComponent } from './components/dialog/add-mercado/add-mercado.component';
import { AddMarcaComponent } from './components/dialog/add-marca/add-marca.component';
import { AddModeloComponent } from './components/dialog/add-modelo/add-modelo.component';
import { AddSectorComponent } from './components/dialog/add-sector/add-sector.component';
import { AddServiceTypeComponent } from './components/dialog/add-service-type/add-service-type.component';
import { AddTarifaComponent } from './components/dialog/add-tarifa/add-tarifa.component';
import { AddZonaComponent } from './components/dialog/add-zona/add-zona.component';
import { ColorListComponent } from './components/dialog/color-list/color-list.component';
import { ConstanteListComponent } from './components/dialog/constante-list/constante-list.component';
import { CargaComponent } from '../../components/dialog/carga/carga.component';
import { CsvComponent } from '../../components/dialog/csv/csv.component';
import { CsvCustomerComponentComponent } from '../../components/dialog/csvcustomercomponent/csvcustomercomponent.component';
import { DeleteComponent } from '../../components/dialog/delete/delete.component';
import { DeletecustomerComponent } from '../../components/dialog/deletecustomer/deletecustomer.component';
import { DownloadComponent } from '../../components/dialog/download/download.component';
import { EditComponent } from '../../components/dialog/edit/edit.component';
import { EditcustomerComponent } from '../../components/dialog/editcustomer/editcustomer.component';
import { GiroListComponent } from './components/dialog/giro-list/giro-list.component';
import { MarcaListComponent } from './components/dialog/marca-list/marca-list.component';
import { MercadoListComponent } from './components/dialog/mercado-list/mercado-list.component';
import { ModeloListComponent } from './components/dialog/modelo-list/modelo-list.component';
import { SectorListComponent } from './components/dialog/sector-list/sector-list.component';
import { ServiceTypeListComponent } from './components/dialog/service-type-list/service-type-list.component';
import { ShowComponent } from '../../components/dialog/show/show.component';
import { ShowcustomerComponent } from '../../components/dialog/showcustomer/showcustomer.component';
import { ShowProfileComponent } from '../../components/dialog/showprofile/showprofile.component';
import { SettingsComponent } from '../../components/dialog/settings/settings.component';
import { SettingscustomerComponent } from '../../components/dialog/settingscustomer/settingscustomer.component';
import { StatusComponent } from './components/dialog/status/status.component';
import { StatusListComponent, SnackErrorComponent, SnackSuccessComponent } from './components/dialog/status-list/status-list.component';
import { StatusCrudComponent } from './components/dialog/status-crud/status-crud.component';
import { TarifaListComponent } from './components/dialog/tarifa-list/tarifa-list.component';
import { VehiculoOverviewDialog } from '../../components/excel-vehiculo/excel-vehiculo.component';
import { ZipComponent } from '../../components/dialog/zip/zip.component';
import { ZonaListComponent } from './components/dialog/zona-list/zona-list.component';


//MODAL
import { ModalMapaComponent } from '../../components/modal/modalmapa/modalmapa.component';
import { ModalImageComponent } from '../../components/modal/modalimage/modalimage.component';


//DIRECTIVES
import { DirectiveModule } from 'src/app/directives/directive.module';

//PROVIDERS
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyInterceptor } from '../../providers/interceptor/my.interceptor';


//MODULES
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule} from 'agm-direction'; 
import { MaterialModule } from '../../material-module';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';

//SERVICES
import { ServiceModule } from 'src/app/services/service.module';


//MOMENT
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


//ROUTER
import { OrderServiceRoutingModule } from './orderservice.routes';

//UTILITY
import 'hammerjs';
import { AngularSplitModule } from 'angular-split';
import { CalendarModule } from 'primeng/calendar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { MarkdownModule } from 'ngx-markdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Ng5SliderModule } from 'ng5-slider';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TableModule } from 'ngx-easy-table';
import { VerticalTimelineModule } from 'angular-vertical-timeline';

//Import toast module
import { ToastModule } from 'primeng/toast';
import { ToastrModule } from 'ngx-toastr';

//ESPAÑOL DATE
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';






//PAGES
import { OrderserviceComponent } from '../../components/orderservice/orderservice.component';


// Global vars
import { environment } from '../../../environments/environment';



registerLocaleData(localeEs);

@NgModule({
  imports: [
    AgmDirectionModule,
    AngularSplitModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: environment.global.agmapikey
    }),
    CalendarModule,
    CommonModule,
    DirectiveModule,
    FlexLayoutModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    MaterialModule,
    MatProgressButtonsModule,
    MarkdownModule.forRoot(),
    NgbModule,
    NgSelectModule,
    Ng2SearchPipeModule,
    NgxMatSelectSearchModule,
    Ng5SliderModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    PipesModule,
    ReactiveFormsModule,
    OrderServiceRoutingModule,
    ScrollingModule,
    SharedModule,
    ServiceModule,
    TableModule,
    ToastModule,    
    ToastrModule.forRoot(),
    VerticalTimelineModule,
    ViewModule
  ],
  declarations: [
    AddComponent,
    AddConstanteComponent,
    AddColorComponent,
    AddcustomerComponent,
    AddGiroComponent,
    AddMarcaComponent,
    AddMercadoComponent,
    AddModeloComponent,
    AddSupportComponent,
    AddServiceTypeComponent,
    AddSectorComponent,
    AddTarifaComponent,
    AddZonaComponent,
    CargaComponent,
    ConstanteListComponent,
    ColorListComponent,
    CsvComponent,
    CsvCustomerComponentComponent,
    DeletecustomerComponent,
    DeleteComponent,
    DownloadComponent,    
    DateDialogComponent,
    DialogOverviewDialog,
    EditcustomerComponent,
    EditComponent,
    ExcelComponent,
    ExcelVehiculoComponent,
    FileComponent,
    FilelistComponent,    
    GestionComponent,
    GiroListComponent,
    MapaComponent,
    MarcaListComponent,
    MapaFullWidthComponent,
    MercadoListComponent,
    ModalMapaComponent,
    ModalImageComponent,
    ModeloListComponent,
    OrderserviceComponent,
    ServiceTypeListComponent,
    SettingsComponent, 
    SettingscustomerComponent,
    SectorListComponent,
    ShowComponent,
    ShowcustomerComponent,
    ShowProfileComponent,
    StatusComponent,
    StatusListComponent,
    SnackErrorComponent,
    SnackSuccessComponent,
    StatusCrudComponent,
    TableroComponent,
    TarifaListComponent,
    UsertableComponent,
    ZonaListComponent,
    ZipComponent,
    VehiculoOverviewDialog,
    ViewOrderDetailComponent,
    ViewprojectorderComponent,
    ViewprojectcustomerComponent, 
    VieworderserviceComponent, 
    ViewOrderServiceSelectComponent, 
  ],
  exports: [
  ],
  entryComponents: [
    AddComponent, 
    AddConstanteComponent,
    AddColorComponent,
    AddcustomerComponent,
    AddGiroComponent,
    AddMarcaComponent,
    AddMercadoComponent,
    AddModeloComponent,
    AddSectorComponent,
    AddSupportComponent,
    AddServiceTypeComponent,
    AddTarifaComponent,
    AddZonaComponent,
    CsvComponent,
    CsvCustomerComponentComponent,
    ColorListComponent,
    DateDialogComponent,
    DeleteComponent, 
    DeletecustomerComponent, 
    DialogOverviewDialog, 
    DownloadComponent, 
    EditComponent,
    EditcustomerComponent,    
    FileComponent,
    MarcaListComponent,
    ModalMapaComponent, 
    ModalImageComponent,
    ModalMapaComponent, 
    ModalImageComponent,
    ModeloListComponent,
    SnackErrorComponent,
    SnackSuccessComponent,
    ShowComponent, 
    ShowcustomerComponent,
    ShowProfileComponent,
    SettingsComponent, 
    SettingscustomerComponent, 
    StatusComponent,
    VehiculoOverviewDialog,
    ZipComponent    
  ],
  providers: [
    NgbActiveModal, 
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: LOCALE_ID, useValue: 'es' },
    {provide: MAT_DATE_LOCALE, useValue: 'es'},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true },
  ],  
})
export class OrderServiceModule { }
