import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  DataService,
  DashboardService,
  CargaImagenesService,
  CountriesService,
  CustomerService,
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
    DataService,
    DashboardService,  
    CargaImagenesService,
    CountriesService,
    CustomerService,
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
