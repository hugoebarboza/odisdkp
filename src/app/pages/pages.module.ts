import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import { HttpModule } from '@angular/http';

//MODULES
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule} from 'agm-direction'; 
import { MaterialModule } from '../material-module';
import { PipesModule } from '../pipes/pipes.module';
import { SharedModule } from '../components/shared/shared.module';
import { ServiceModule } from '../services/service.module';

//MOMENT
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


//ROUTER
import { PagesRoutingModule } from '../pages/pages.routes';

//UTILITY
import 'hammerjs';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AngularSplitModule } from 'angular-split';
//import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarModule } from 'primeng/calendar';
//import { CalendarModule as AngularCalendar, DateAdapter as AngularDateAdapter } from 'angular-calendar';
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



//COMPONENTS
import { DateDialogComponent } from '../components/date-dialog/date-dialog.component';
import { ExcelComponent, DialogOverviewDialog } from '../components/excel/excel.component';
import { ExcelVehiculoComponent } from '../components/excel-vehiculo/excel-vehiculo.component';
import { FileComponent } from '../components/dialog/file/file.component';
import { FilelistComponent } from '../components/dialog/filelist/filelist.component';
//import { FileListComponent } from '../components/file-list/file-list.component';
//import { FileUploadComponent } from '../components/file-upload/file-upload.component';
import { GestionComponent } from '../components/gestion/gestion.component';
import { MapaComponent } from '../components/mapa/mapa/mapa.component';
import { MapaFullWidthComponent } from '../components/mapa/mapafullwidth/mapafullwidth.component'; 
import { TableroComponent } from '../components/tablero/tablero.component';
import { UsertableComponent } from '../components/usertable/usertable.component';
import { ViewOrderDetailComponent } from '../components/views/vieworderdetail/vieworderdetail.component';
import { ViewOrderTimeSpentComponent } from '../components/views/viewordertimespent/viewordertimespent.component';
import { VieworderserviceComponent } from '../components/views/vieworderservice/vieworderservice.component';
import { ViewprojectcustomerComponent } from '../components/views/viewprojectcustomer/viewprojectcustomer.component';
import { ViewprojectorderComponent } from '../components/views/viewprojectorder/viewprojectorder.component';
//import { ViewProjectDetailComponent } from '../components/views/viewprojectdetail/viewprojectdetail.component';
import { ViewModule } from '../components/views/view.module';

//DIALOG
import { AddComponent } from '../components/dialog/add/add.component';
//import { AddCalendarComponent } from '../components/dialog/addcalendar/addcalendar.component';
import { AddcustomerComponent } from '../components/dialog/addcustomer/addcustomer.component';
//import { AddUserComponent } from '../components/dialog/adduser/adduser.component';
//import { AddServiceComponent } from '../components/dialog/addservice/addservice.component';
import { AddSupportComponent } from '../components/dialog/widget/addsupport/addsupport.component';
import { CargaComponent } from '../components/dialog/carga/carga.component';
import { CsvComponent } from '../components/dialog/csv/csv.component';
import { CsvCustomerComponentComponent } from '../components/dialog/csvcustomercomponent/csvcustomercomponent.component';
//import { CsvServiceComponent } from '../components/dialog/csvservice/csvservice.component';
import { DeleteComponent } from '../components/dialog/delete/delete.component';
import { DeletecustomerComponent } from '../components/dialog/deletecustomer/deletecustomer.component';
//import { DeleteServiceComponent } from '../components/dialog/deleteservice/deleteservice.component';
import { DownloadComponent } from '../components/dialog/download/download.component';
import { EditComponent } from '../components/dialog/edit/edit.component';
import { EditcustomerComponent } from '../components/dialog/editcustomer/editcustomer.component';
//import { EditServiceComponent } from '../components/dialog/editservice/editservice.component';
//import { EditUserComponent } from '../components/dialog/edituser/edituser.component';
import { ShowComponent } from '../components/dialog/show/show.component';
import { ShowcustomerComponent } from '../components/dialog/showcustomer/showcustomer.component';
//import { ShowProfileSecurityComponent } from '../components/dialog/showprofilesecurity/showprofilesecurity.component';
import { ShowProfileComponent } from '../components/dialog/showprofile/showprofile.component';
import { SettingsComponent } from '../components/dialog/settings/settings.component';
import { SettingscustomerComponent } from '../components/dialog/settingscustomer/settingscustomer.component';
import { VehiculoOverviewDialog } from '../components/excel-vehiculo/excel-vehiculo.component';
import { ZipComponent } from '../components/dialog/zip/zip.component';
//MODAL
import { ModalMapaComponent } from '../components/modal/modalmapa/modalmapa.component';
import { ModalImageComponent } from '../components/modal/modalimage/modalimage.component';
//import { ModalUploadImageComponent } from '../components/modal/modaluploadimage/modaluploadimage.component';


//DIRECTIVES
import { DropZoneDirective } from '../directives/drop-zone.directive';
import { NgDropFilesDirective } from '../directives/ng-drop-files.directive';

//PAGES
//import { CalendarComponent } from './calendar/calendar.component';
import { OrderserviceComponent } from '../components/orderservice/orderservice.component';


// Global vars
import { GLOBAL } from '../services/global';

registerLocaleData(localeEs);

@NgModule({
  imports: [
    AngularEditorModule,
    AgmDirectionModule,
    AngularSplitModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: GLOBAL.agmapikey
    }),
    CalendarModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    HttpModule,
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
    PagesRoutingModule,
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
    //AddCalendarComponent,
    AddcustomerComponent,
    //AddServiceComponent,
    AddSupportComponent,
    //AddUserComponent,
    //CalendarComponent,
    CargaComponent,
    CsvComponent,
    CsvCustomerComponentComponent,
    //CsvServiceComponent,
    DeletecustomerComponent,
    DeleteComponent,
    //DeleteServiceComponent,
    DownloadComponent,    
    DateDialogComponent,
    DialogOverviewDialog,
    DropZoneDirective,
    EditcustomerComponent,
    EditComponent,
    //EditServiceComponent,
    //EditUserComponent,  
    ExcelComponent,
    ExcelVehiculoComponent,
    FileComponent,
    FilelistComponent,
    //FileListComponent,
    //FileUploadComponent,
    GestionComponent,
    MapaComponent, 
    MapaFullWidthComponent,
    ModalMapaComponent,
    ModalImageComponent,
    //ModalUploadImageComponent,
    NgDropFilesDirective,
    OrderserviceComponent,
    //ServiceComponent,
    SettingsComponent, 
    SettingscustomerComponent, 
    ShowComponent,
    ShowcustomerComponent,
    //ShowProfileSecurityComponent,
    ShowProfileComponent,
    TableroComponent,    
    UsertableComponent,
    ZipComponent,
    VehiculoOverviewDialog,
    ViewOrderTimeSpentComponent,
    //ViewProjectDetailComponent,
    ViewOrderDetailComponent,
    ViewprojectorderComponent,
    ViewprojectcustomerComponent, 
    VieworderserviceComponent,
  ],
  exports: [
    //ChangepasswordComponent,
    //DashboardComponent,
    //ProfileComponent,
    //UsuariosComponent,
    //FileListComponent,
    //FileUploadComponent,
  ],
  entryComponents: [
    AddComponent, 
    //AddCalendarComponent,
    AddcustomerComponent, 
    //AddServiceComponent,
    AddSupportComponent,
    //AddUserComponent,
    CsvComponent,
    CsvCustomerComponentComponent,
    //CsvServiceComponent,
    DateDialogComponent,
    DeleteComponent, 
    DeletecustomerComponent, 
    //DeleteServiceComponent,
    DialogOverviewDialog, 
    DownloadComponent, 
    EditComponent,
    EditcustomerComponent, 
    //EditServiceComponent,
    //EditUserComponent,
    FileComponent, 
    ModalMapaComponent, 
    ModalImageComponent,
    //ModalUploadImageComponent,
    ModalMapaComponent, 
    ModalImageComponent,
    //ModalUploadImageComponent,
    ShowComponent, 
    ShowcustomerComponent,
    //ShowProfileSecurityComponent,
    ShowProfileComponent,
    SettingsComponent, 
    SettingscustomerComponent, 
    VehiculoOverviewDialog,
    ZipComponent    
  ],
  providers: [
    NgbActiveModal, 
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: LOCALE_ID, useValue: 'es' },
    {provide: MAT_DATE_LOCALE, useValue: 'es'},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],  
})
export class PagesModule { }
