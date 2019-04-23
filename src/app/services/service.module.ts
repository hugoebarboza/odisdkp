import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  AuthService,
  CargaImagenesService,
  CountriesService,
  CustomerService,
  DataService,
  DashboardService,
  ExcelService,
  ItemFirebaseService,
  MapaService,
  OrderserviceService,
  ProjectsService,
  SettingsService,
  UserService,
  ZipService
 } from './service.index';


@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    AuthService,
    CargaImagenesService,
    CountriesService,
    CustomerService,
    DataService,
    DashboardService,  
    ExcelService,
    ItemFirebaseService,
    MapaService,
    OrderserviceService,
    ProjectsService,
    SettingsService,
    UserService,
    ZipService
  ],
  declarations: []
})
export class ServiceModule { }
