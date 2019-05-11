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


/*
//COMPONENTS
import { DateDialogComponent } from '../components/date-dialog/date-dialog.component';
import { ExcelComponent, DialogOverviewDialog } from '../components/excel/excel.component';
import { ExcelVehiculoComponent } from '../components/excel-vehiculo/excel-vehiculo.component';
import { FileComponent } from '../components/dialog/file/file.component';
import { FilelistComponent } from '../components/dialog/filelist/filelist.component';
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
import { ViewModule } from '../components/views/view.module';

//DIALOG
import { AddComponent } from '../components/dialog/add/add.component';
import { AddcustomerComponent } from '../components/dialog/addcustomer/addcustomer.component';
import { AddSupportComponent } from '../components/dialog/widget/addsupport/addsupport.component';
import { CargaComponent } from '../components/dialog/carga/carga.component';
import { CsvComponent } from '../components/dialog/csv/csv.component';
import { CsvCustomerComponentComponent } from '../components/dialog/csvcustomercomponent/csvcustomercomponent.component';
import { DeleteComponent } from '../components/dialog/delete/delete.component';
import { DeletecustomerComponent } from '../components/dialog/deletecustomer/deletecustomer.component';
import { DownloadComponent } from '../components/dialog/download/download.component';
import { EditComponent } from '../components/dialog/edit/edit.component';
import { EditcustomerComponent } from '../components/dialog/editcustomer/editcustomer.component';
import { ShowComponent } from '../components/dialog/show/show.component';
import { ShowcustomerComponent } from '../components/dialog/showcustomer/showcustomer.component';
import { ShowProfileComponent } from '../components/dialog/showprofile/showprofile.component';
import { SettingsComponent } from '../components/dialog/settings/settings.component';
import { SettingscustomerComponent } from '../components/dialog/settingscustomer/settingscustomer.component';
import { VehiculoOverviewDialog } from '../components/excel-vehiculo/excel-vehiculo.component';
import { ZipComponent } from '../components/dialog/zip/zip.component';
//MODAL
import { ModalMapaComponent } from '../components/modal/modalmapa/modalmapa.component';
import { ModalImageComponent } from '../components/modal/modalimage/modalimage.component';
*/

//DIRECTIVES
//import { DropZoneDirective } from '../directives/drop-zone.directive';
//import { NgDropFilesDirective } from '../directives/ng-drop-files.directive';

//PAGES
//import { OrderserviceComponent } from '../components/orderservice/orderservice.component';


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
    //ViewModule
  ],
  declarations: [
    //AddComponent,
    //AddcustomerComponent,
    //AddSupportComponent,
    //CargaComponent,
    //CsvComponent,
    //CsvCustomerComponentComponent,
    //DeletecustomerComponent,
    //DeleteComponent,
    //DownloadComponent,    
    //DateDialogComponent,
    //DialogOverviewDialog,
    //DropZoneDirective,
    //EditcustomerComponent,
    //EditComponent,
    //ExcelComponent,
    //ExcelVehiculoComponent,
    //FileComponent,
    //FilelistComponent,
    //GestionComponent,
    //MapaComponent, 
    //MapaFullWidthComponent,
    //ModalMapaComponent,
    //ModalImageComponent,
    //NgDropFilesDirective,
    //OrderserviceComponent,
    //SettingsComponent, 
    //SettingscustomerComponent, 
    //ShowComponent,
    //ShowcustomerComponent,
    //ShowProfileComponent,
    //TableroComponent,    
    //UsertableComponent,
    //ZipComponent,
    //VehiculoOverviewDialog,
    //ViewOrderTimeSpentComponent,
    //ViewOrderDetailComponent,
    //ViewprojectorderComponent,
    //ViewprojectcustomerComponent, 
    //VieworderserviceComponent,
  ],
  exports: [
  ],
  entryComponents: [
    //AddComponent, 
    //AddcustomerComponent, 
    //AddSupportComponent,
    //CsvComponent,
    //CsvCustomerComponentComponent,
    //DateDialogComponent,
    //DeleteComponent, 
    //DeletecustomerComponent, 
    //DialogOverviewDialog, 
    //DownloadComponent, 
    //EditComponent,
    //EditcustomerComponent, 
    //FileComponent, 
    //ModalMapaComponent, 
    //ModalImageComponent,
    //ModalMapaComponent, 
    //ModalImageComponent,
    //ShowComponent, 
    //ShowcustomerComponent,
    //ShowProfileComponent,
    //SettingsComponent, 
    //SettingscustomerComponent, 
    //VehiculoOverviewDialog,
    //ZipComponent    
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
