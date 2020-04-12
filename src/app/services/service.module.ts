import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {
  AuthService,
  CargaImagenesService,
  CdfService,
  CountriesService,
  CustomerService,
  CustomformService,
  DataService,
  DashboardService,
  ExcelService,
  ItemFirebaseService,
  KpiService,
  LoadingCompletedService,
  LoggingService,
  MapaService,
  MessagingService,
  ModalManageService,
  OrderserviceService,
  PaymentService,
  ProjectsService,
  RequestCacheService,
  SettingsService,
  SidenavService,
  UserService,
  ZipService,
  WebsocketService,
 } from './service.index';

// Providers
import { ErrorsHandler } from '../providers/error/error-handler';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
  ],
  declarations: []
})
export class ServicesModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [
        AsyncPipe,
        AuthService,
        CargaImagenesService,
        CdfService,
        CountriesService,
        CustomerService,
        CustomformService,
        DataService,
        DashboardService,
        ExcelService,
        ErrorsHandler,
        ItemFirebaseService,
        KpiService,
        LoadingCompletedService,
        LoggingService,
        MapaService,
        MessagingService,
        ModalManageService,
        OrderserviceService,
        PaymentService,
        ProjectsService,
        RequestCacheService,
        SettingsService,
        SidenavService,
        UserService,
        ZipService,
        WebsocketService
      ]
    };
  }

}
