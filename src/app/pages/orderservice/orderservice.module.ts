import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import { HttpModule } from '@angular/http';

// COMPONENTS
import { DateDialogComponent } from '../../components/date-dialog/date-dialog.component';
import { ExcelComponent, DialogOverviewDialog } from '../../components/excel/excel.component';
import { ExcelVehiculoComponent } from '../../components/excel-vehiculo/excel-vehiculo.component';
import { FileComponent } from '../../components/dialog/file/file.component';
import { GestionComponent } from '../../components/gestion/gestion.component';
import { MakeinspectionComponent } from './components/makeinspection/makeinspection.component';
import { MapaComponent } from '../../components/mapa/mapa/mapa.component';
import { MapaFullWidthComponent } from '../../components/mapa/mapafullwidth/mapafullwidth.component';
import { TableOrderComponent } from './components/table-order/table-order.component';
import { TableroComponent } from '../../components/tablero/tablero.component';
import { UsertableComponent } from '../../components/usertable/usertable.component';
import { ViewOrderDetailComponent } from '../../components/views/vieworderdetail/vieworderdetail.component';
import { VieworderserviceComponent } from '../../components/views/vieworderservice/vieworderservice.component';
import { ViewOrderServiceSelectComponent } from './components/vieworderserviceselect/vieworderserviceselect.component';
import { ViewprojectcustomerComponent } from '../../components/views/viewprojectcustomer/viewprojectcustomer.component';
import { ViewprojectorderComponent } from '../../components/views/viewprojectorder/viewprojectorder.component';
import { ViewModule } from '../../components/views/view.module';

// DIALOG
import { AddAlimentadorComponent } from './components/dialog/add-alimentador/add-alimentador.component';
import { AddClavelecturaComponent } from './components/dialog/add-clavelectura/add-clavelectura.component';
import { AddComponent } from '../../components/dialog/add/add.component';
import { AddcustomerComponent } from '../../components/dialog/addcustomer/addcustomer.component';
import { AddConstanteComponent } from './components/dialog/add-constante/add-constante.component';
import { AddColorComponent } from './components/dialog/add-color/add-color.component';
import { AddFormComponent } from './components/dialog/add-form/add-form.component';
import { AddGiroComponent } from './components/dialog/add-giro/add-giro.component';
import { AddJobComponent } from './components/dialog/add-job/add-job.component';
import { AddMercadoComponent } from './components/dialog/add-mercado/add-mercado.component';
import { AddMarcaComponent } from './components/dialog/add-marca/add-marca.component';
import { AddModeloComponent } from './components/dialog/add-modelo/add-modelo.component';
import { AddSectorComponent } from './components/dialog/add-sector/add-sector.component';
import { AddServiceTypeComponent } from './components/dialog/add-service-type/add-service-type.component';
import { AddServiceValueComponent } from './components/dialog/add-service-value/add-service-value.component';
import { AddServiceTypeValueComponent } from './components/dialog/add-service-type-value/add-service-type-value.component';
import { AddSetComponent } from './components/dialog/add-set/add-set.component';
import { AddSedComponent } from './components/dialog/add-sed/add-sed.component';
import { AddTarifaComponent } from './components/dialog/add-tarifa/add-tarifa.component';
import { AddZonaComponent } from './components/dialog/add-zona/add-zona.component';
import { AlimentadorListComponent } from './components/dialog/alimentador-list/alimentador-list.component';
import { ClavelecturaListComponent } from './components/dialog/clavelectura-list/clavelectura-list.component';
import { ClientOrderComponent } from './components/client-order/client-order.component';
import { ColorListComponent } from './components/dialog/color-list/color-list.component';
import { ConstanteListComponent } from './components/dialog/constante-list/constante-list.component';
import { CargaComponent } from '../../components/dialog/carga/carga.component';
import { CsvAddressComponent } from '../../components/dialog/csv-address/csv-address.component';
import { CsvComponent } from '../../components/dialog/csv/csv.component';
import { CsvCustomerComponentComponent } from '../../components/dialog/csvcustomercomponent/csvcustomercomponent.component';
import { DeleteComponent } from '../../components/dialog/delete/delete.component';
import { DeletecustomerComponent } from '../../components/dialog/deletecustomer/deletecustomer.component';
import { DownloadComponent } from '../../components/dialog/download/download.component';
import { EditComponent } from '../../components/dialog/edit/edit.component';
import { EditcustomerComponent } from '../../components/dialog/editcustomer/editcustomer.component';
import { GiroListComponent } from './components/dialog/giro-list/giro-list.component';
import { LogLecturaComponent } from '../../components/dialog/log-lectura/log-lectura.component';
import { LogUbicacionesComponent } from '../../components/dialog/log-ubicaciones/log-ubicaciones.component';
import { MarcaListComponent } from './components/dialog/marca-list/marca-list.component';
import { MercadoListComponent } from './components/dialog/mercado-list/mercado-list.component';
import { ModeloListComponent } from './components/dialog/modelo-list/modelo-list.component';
import { SectorListComponent } from './components/dialog/sector-list/sector-list.component';
import { SendOrderByEmailComponent } from './components/dialog/send-order-by-email/send-order-by-email.component';
import { ServiceTypeListComponent } from './components/dialog/service-type-list/service-type-list.component';
import { ServiceTypeValueListComponent } from './components/dialog/service-type-value-list/service-type-value-list.component';
import { ServiceValueListComponent } from './components/dialog/service-value-list/service-value-list.component';
import { ShowcustomerComponent } from '../../components/dialog/showcustomer/showcustomer.component';
import { ShowProfileComponent } from '../../components/dialog/showprofile/showprofile.component';
import { SettingsComponent } from '../../components/dialog/settings/settings.component';
import { SettingscustomerComponent } from '../../components/dialog/settingscustomer/settingscustomer.component';
import { SetListComponent } from './components/dialog/set-list/set-list.component';
import { SedListComponent } from './components/dialog/sed-list/sed-list.component';
import { StatusComponent } from './components/dialog/status/status.component';
import { StatusListComponent, SnackErrorComponent, SnackSuccessComponent } from './components/dialog/status-list/status-list.component';
import { StatusCrudComponent } from './components/dialog/status-crud/status-crud.component';
import { TarifaListComponent } from './components/dialog/tarifa-list/tarifa-list.component';
import { UserJobProfileComponent } from './components/dialog/user-job-profile/user-job-profile.component';
import { VehiculoOverviewDialog } from '../../components/excel-vehiculo/excel-vehiculo.component';
import { ZipComponent } from '../../components/dialog/zip/zip.component';
import { ZonaListComponent } from './components/dialog/zona-list/zona-list.component';


// MODAL
import { ModalMapaComponent } from '../../components/modal/modalmapa/modalmapa.component';
import { ModalImageComponent } from '../../components/modal/modalimage/modalimage.component';


// DIRECTIVES
import { DirectiveModule } from 'src/app/directives/directive.module';

// PROVIDERS
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyInterceptor } from '../../providers/interceptor/my.interceptor';


// MODULES
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule} from 'agm-direction';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../components/shared/shared.module';

// SERVICES
import { ServiceModule } from 'src/app/services/service.module';


// MOMENT
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


// ROUTER
import { OrderServiceRoutingModule } from './orderservice.routes';

// UTILITY
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
import { VerticalTimelineModule } from 'angular-vertical-timeline';

import { ToastrModule } from 'ngx-toastr';

// ESPAÑOL DATE
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

// PAGES
import { OrderserviceComponent } from './components/orderservice/orderservice.component';


// Global vars
import { environment } from '../../../environments/environment';


registerLocaleData(localeEs);

@NgModule({
  imports: [
    AgmDirectionModule,
    AngularSplitModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: environment.global.agmapikey,
      libraries: ['places']
    }),
    CalendarModule,
    CommonModule,
    DirectiveModule,
    FlexLayoutModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
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
    ToastrModule.forRoot(),
    VerticalTimelineModule,
    ViewModule
  ],
  declarations: [
    AddClavelecturaComponent,
    AddComponent,
    AddConstanteComponent,
    AddColorComponent,
    AddcustomerComponent,
    AddFormComponent,
    AddGiroComponent,
    AddJobComponent,
    AddAlimentadorComponent,
    AddMarcaComponent,
    AddMercadoComponent,
    AddModeloComponent,
    AddServiceTypeComponent,
    AddServiceTypeValueComponent,
    AddServiceValueComponent,
    AddSectorComponent,
    AddSetComponent,
    AddSedComponent,
    AddTarifaComponent,
    AddZonaComponent,
    AlimentadorListComponent,
    CargaComponent,
    ClavelecturaListComponent,
    ClientOrderComponent,
    ConstanteListComponent,
    ColorListComponent,
    CsvComponent,
    CsvCustomerComponentComponent,
    CsvAddressComponent,
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
    GestionComponent,
    GiroListComponent,
    LogLecturaComponent,
    LogUbicacionesComponent,
    MapaComponent,
    MarcaListComponent,
    MapaFullWidthComponent,
    MakeinspectionComponent,
    MercadoListComponent,
    ModalMapaComponent,
    ModalImageComponent,
    ModeloListComponent,
    OrderserviceComponent,
    ServiceTypeListComponent,
    SettingsComponent,
    SettingscustomerComponent,
    SectorListComponent,
    SendOrderByEmailComponent,
    ServiceTypeValueListComponent,
    ServiceValueListComponent,
    ShowcustomerComponent,
    ShowProfileComponent,
    StatusComponent,
    StatusListComponent,
    SnackErrorComponent,
    SnackSuccessComponent,
    StatusCrudComponent,
    SetListComponent,
    SedListComponent,
    TableroComponent,
    TarifaListComponent,
    TableOrderComponent,
    UserJobProfileComponent,
    UsertableComponent,
    VehiculoOverviewDialog,
    ViewOrderDetailComponent,
    ViewprojectorderComponent,
    ViewprojectcustomerComponent,
    VieworderserviceComponent,
    ViewOrderServiceSelectComponent,
    ZonaListComponent,
    ZipComponent,
  ],
  exports: [
  ],
  entryComponents: [
    AddClavelecturaComponent,
    AddComponent,
    AddConstanteComponent,
    AddColorComponent,
    AddcustomerComponent,
    AddFormComponent,
    AddGiroComponent,
    AddJobComponent,
    AddAlimentadorComponent,
    AddMarcaComponent,
    AddMercadoComponent,
    AddModeloComponent,
    AddSectorComponent,
    AddServiceTypeComponent,
    AddServiceTypeValueComponent,
    AddServiceValueComponent,
    AddSetComponent,
    AddSedComponent,
    AddTarifaComponent,
    AddZonaComponent,
    ClientOrderComponent,
    CsvComponent,
    CsvCustomerComponentComponent,
    CsvAddressComponent,
    ColorListComponent,
    DateDialogComponent,
    DeleteComponent,
    DeletecustomerComponent,
    DialogOverviewDialog,
    DownloadComponent,
    EditComponent,
    EditcustomerComponent,
    FileComponent,
    LogLecturaComponent,
    LogUbicacionesComponent,
    MarcaListComponent,
    ModalMapaComponent,
    ModalImageComponent,
    ModalMapaComponent,
    ModalImageComponent,
    ModeloListComponent,
    SendOrderByEmailComponent,
    SnackErrorComponent,
    SnackSuccessComponent,
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
