import { NgModule } from '@angular/core';
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
 } from './service.index';

// Providers
import { ErrorsHandler } from '../providers/error/error-handler';



@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
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
    ItemFirebaseService,
    KpiService,
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
    ErrorsHandler
  ],
  declarations: []
})
export class ServiceModule { }
