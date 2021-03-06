import { NgModule } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {
  AuthService,
  CargaImagenesService,
  CdfService,
  CountriesService,
  CustomerService,
  DataService,
  DashboardService,
  ExcelService,
  ItemFirebaseService,
  KpiService,
  MapaService,
  MessagingService,
  ModalManageService,
  OrderserviceService,
  ProjectsService,
  RequestCacheService,
  SettingsService,
  SidenavService,
  UserService,
  ZipService,
 } from './service.index';


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
    DataService,
    DashboardService,  
    ExcelService,
    ItemFirebaseService,
    KpiService,
    MapaService,
    MessagingService, 
    ModalManageService,
    OrderserviceService,
    ProjectsService,
    RequestCacheService,
    SettingsService,
    SidenavService,
    UserService,
    ZipService
  ],
  declarations: []
})
export class ServiceModule { }
