import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common"
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';

//ROUTER
import { RouterModule } from '@angular/router';
import { routing, appRoutingProviders } from './app.routing';

//CDK MATERIAL
import { PortalModule } from '@angular/cdk/portal';

//FIREBASE
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';


//MAIN NG-BOOTSTRAP MODULE
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

//PROGRESS BAR
//import { NgProgressModule } from '@ngx-progressbar/core';
//import { NgProgressRouterModule } from '@ngx-progressbar/router';

//UTILITYS
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

//ANGULAR SPLIT
import { AngularSplitModule } from 'angular-split';


//ANGULAR MATERIAL
import { MatBadgeModule, MatTableModule, MatPaginatorModule } from '@angular/material';
import { MatNativeDateModule, MatFormField, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatButtonModule, MatDialogModule, MatButtonToggleModule } from '@angular/material';
import { MatProgressSpinnerModule, MatSortModule, MatSidenavModule, MatListModule, MatIconModule } from "@angular/material";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { LayoutModule } from '@angular/cdk/layout';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { MatChipsModule, MatTabsModule } from '@angular/material';
import { MatSelectModule, MatMenuModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import 'hammerjs';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import {CalendarModule} from 'primeng/calendar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { MatRippleModule, MatSliderModule } from '@angular/material';


//MOMENT
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

//COMPONENT
import { AppComponent } from './app.component';
import { ChangepasswordComponent } from './components/changepassword/changepassword.component';
import { DefaultComponent } from './components/default/default.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DateDialogComponent } from './components/date-dialog/date-dialog.component';
import { ExcelComponent, DialogOverviewDialog } from './components/excel/excel.component';
import { ExcelVehiculoComponent } from './components/excel-vehiculo/excel-vehiculo.component';
import { FileComponent } from './components/dialog/file/file.component';
import { FilelistComponent } from './components/dialog/filelist/filelist.component';
import { FootermainComponent } from './components/shared/footermain/footermain.component';
import { FooterComponent } from './components/footer/footer.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { HeaderComponent } from './components/header/header.component';
import { LoadingComponent } from './components/shared/loading/loading.component';
import { LoginComponent } from './components/login/login.component';
import { MapaComponent } from './components/mapa/mapa/mapa.component';
import { MapaFullWidthComponent } from './components/mapa/mapafullwidth/mapafullwidth.component'; 
import { MenuComponent } from './components/menu/menu.component';
import { MynavComponent } from './components/shared/mynav/mynav.component';
import { NotfoundComponent } from './components/shared/notfound/notfound.component';
import { OrderserviceComponent } from './components/orderservice/orderservice.component';
import { ProgressSpinnerComponent } from './components/shared/progress-spinner/progress-spinner.component';
import { RegisterComponent } from './components/register/register.component';
import { UsertableComponent } from './components/usertable/usertable.component';
import { ViewOrderDetailComponent } from './components/views/vieworderdetail/vieworderdetail.component';
import { VieworderserviceComponent } from './components/views/vieworderservice/vieworderservice.component';
import { ViewprojectcustomerComponent } from './components/views/viewprojectcustomer/viewprojectcustomer.component';
import { ViewprojectorderComponent } from './components/views/viewprojectorder/viewprojectorder.component';


//DIALOG
import { AddComponent } from './components/dialog/add/add.component';
import { AddcustomerComponent } from './components/dialog/addcustomer/addcustomer.component';
import { CargaComponent } from './components/dialog/carga/carga.component';
import { CsvComponent } from './components/dialog/csv/csv.component';
import { DeleteComponent } from './components/dialog/delete/delete.component';
import { DeletecustomerComponent } from './components/dialog/deletecustomer/deletecustomer.component';
import { DownloadComponent } from './components/dialog/download/download.component';
import { EditComponent } from './components/dialog/edit/edit.component';
import { EditcustomerComponent } from './components/dialog/editcustomer/editcustomer.component';
import { LogoutComponent } from './components/dialog/logout/logout.component';
import { ShowComponent } from './components/dialog/show/show.component';
import { ShowcustomerComponent } from './components/dialog/showcustomer/showcustomer.component';
import { SettingsComponent } from './components/dialog/settings/settings.component';
import { SettingscustomerComponent } from './components/dialog/settingscustomer/settingscustomer.component';
import { VehiculoOverviewDialog } from './components/excel-vehiculo/excel-vehiculo.component';
import { ZipComponent } from './components/dialog/zip/zip.component';


//MODULES
import { ServiceModule } from './services/service.module';

//SERVICES
import { AuthguardService } from './services/authguard.service';
import { CargaImagenesService } from './services/carga-imagenes.service';
import { CountriesService } from './services/countries.service';
import { CustomerService } from './services/customer.service';
import { DataService } from './services/data.service';
import { DashboardService } from './services/dashboard.service';
import { ExcelService } from './services/excel.service';
import { ItemFirebaseService } from './services/itemfirebase.service';
import { MapaService } from './services/mapa.service';
import { OrderserviceService } from './services/orderservice.service';
import { ProjectsService } from './services/projects.service';
import { UserService } from './services/user.service';
import { ZipService } from './services/zip.service';

//SLIDE MODULE
import { Ng5SliderModule } from 'ng5-slider';
import { VerticalTimelineModule } from 'angular-vertical-timeline';



//Import toast module
import { ToastModule } from 'primeng/toast';
import { ToastrModule } from 'ngx-toastr';
//import {ToasterModule, ToasterService} from 'angular2-toaster';

//ESPAÑOL DATE
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

//PIPE
import { SplitPipe } from './pipes/split.pipe';
import { KeysPipe } from './pipes/keys.pipe';

//ROUTE FOR LOADING
import { RouterResolver } from './router.resolver';


//MAPS
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule} from 'agm-direction'; 

//MODAL
import { ModalMapaComponent } from './components/modal/modalmapa/modalmapa.component';
import { ModalImageComponent } from './components/modal/modalimage/modalimage.component';

//PWA
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

//DIRECTIVES
import { NgDropFilesDirective } from './directives/ng-drop-files.directive';






registerLocaleData(localeEs);


@NgModule({
  declarations: [
    AppComponent,
    AddComponent,
    AddcustomerComponent,
    CargaComponent,
    ChangepasswordComponent,    
    CsvComponent,
    DashboardComponent,
    DateDialogComponent,
    DefaultComponent,
    DeletecustomerComponent,
    DeleteComponent,
    DialogOverviewDialog,
    DownloadComponent, 
    EditcustomerComponent,
    EditComponent,
    ExcelComponent,
    ExcelVehiculoComponent,
    FileComponent,
    FilelistComponent,  
    FooterComponent,
    ForgotpasswordComponent,
    FootermainComponent, 
    HeaderComponent,
    KeysPipe, 
    LoadingComponent,
    LoginComponent,
    LogoutComponent,
    MapaComponent, 
    MapaFullWidthComponent,
    MenuComponent,
    ModalMapaComponent,
    ModalImageComponent,
    MynavComponent,
    NgDropFilesDirective,
    NotfoundComponent,
    OrderserviceComponent,
    ProgressSpinnerComponent,
    RegisterComponent,
    SettingsComponent, 
    SettingscustomerComponent, 
    ShowComponent,
    ShowcustomerComponent, 
    SplitPipe, 
    UsertableComponent,
    ViewOrderDetailComponent,
    VieworderserviceComponent,
    ViewprojectorderComponent,
    ViewprojectcustomerComponent, 
    VehiculoOverviewDialog,
    ZipComponent, 
  ],
  imports: [    
    AgmDirectionModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAg5Y0POCb-IZd3KgqFHW51BT_7lJGFNwg'
    }),   
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularSplitModule.forRoot(),    
    BrowserModule,    
    BrowserAnimationsModule,    
    CalendarModule,    
    CommonModule,
    FormsModule,    
    HttpModule,
    HttpClientModule,    
    LoadingBarModule,  
    MatBadgeModule,     
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    MatInputModule,
    MatIconModule,     
    MatCardModule,    
    MatProgressSpinnerModule, 
    MatSortModule,    
    MatSelectModule,
    MatStepperModule,
    MatCheckboxModule,
    MatDatepickerModule,    
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatBottomSheetModule,    
    MatButtonToggleModule,
    MatProgressBarModule,
    MatProgressButtonsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatRadioModule,
    MatGridListModule,
    MatRippleModule,
    MatSliderModule,
    MatNativeDateModule,
    MatDialogModule,
    MatTabsModule,
    MatButtonModule,
    MatMenuModule,    
    Ng5SliderModule,    
    NgbModule,
    NgSelectModule,    
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    PortalModule,
    ReactiveFormsModule,      
    routing,
    RouterModule,
    ServiceModule,
    ToastModule,    
    ToastrModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    VerticalTimelineModule
  ],
  entryComponents: [
    AddComponent, AddcustomerComponent, EditComponent, EditcustomerComponent, CsvComponent, 
    DateDialogComponent,
    DeleteComponent, DialogOverviewDialog, DownloadComponent, FileComponent, DeletecustomerComponent, 
    LogoutComponent,
    ModalMapaComponent, ModalImageComponent, 
    ShowComponent, ShowcustomerComponent, SettingsComponent, SettingscustomerComponent, 
    VehiculoOverviewDialog,
    ZipComponent    
  ],
  providers: [
  	appRoutingProviders, UserService, AuthguardService, CargaImagenesService, CountriesService, CustomerService, 
    DashboardService, DataService, ExcelService, ItemFirebaseService, MapaService, NgbActiveModal, 
    OrderserviceService, ProjectsService, ZipService,
    {provide: LOCALE_ID, useValue: 'es' },
    {provide: MAT_DATE_LOCALE, useValue: 'es'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
  ],
  bootstrap: [
  	AppComponent
  ]
})



export class AppModule { 
    

}
