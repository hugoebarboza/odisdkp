import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';
import 'rxjs/add/operator/map';

// CACHE
import { Cacheable } from 'ngx-cacheable';

// GLOBAL
import { GLOBAL } from '../global';

// MODELS
import { Color, Constante, CurrencyValue, Giro, Mercado, Order, Proyecto, ProjectServiceType, Sector, Service, ServiceValue, ServiceType, ServiceTypeValue, Tarifa, Zona } from 'src/app/models/types';

// TOASTER MESSAGES
// import { ToastrService } from 'ngx-toastr';

import Swal from 'sweetalert2';

const cacheBuster$ = new Subject<void>();

@Injectable({
    providedIn: 'root'
})
export class ProjectsService {
    public url: string;
    error: boolean;
    errorMessage = 'NETWORK ERROR, NOT INTERNET CONNECTION!!!!';
    errorMessage500 = '500 SERVER ERROR, CONTACT ADMINISTRATOR!!!!';

    constructor(
        public _http: HttpClient,
        private _snackBar: MatSnackBar,
        // private toasterService: ToastrService,
    ) {
        this.url = GLOBAL.url;
        this.error = false;

    }

    addColor(token: any, data: Color): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'colors/', params, {
            headers: headers
        }).map((resp: any) => resp);
    }

    addCurrencyValue(token: any, data: CurrencyValue): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'currencyvalue', params, {
            headers: headers
        }).map((resp: any) => resp);
    }

    addService(token: any, service: Service, id: number): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(service);
        const params = 'json=' + json;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'project' + '/' + id + '/' + 'service', params, {
            headers: headers
        }).map((resp: any) => resp);
        /*
		this._http.post(this.url+'project'+'/'+id+'/'+'service', params, {headers: headers}).subscribe(
			(data:any) => {

				if(data.status === 'success'){
					swal('Proyecto creado exitosamente con ID: ', data.lastInsertedId +'.', 'success' );
				}else{
					swal('No fue posible procesar su solicitud', data.message, 'error');
				}

				//this.toasterService.success('Proyecto creado.', 'Exito', {timeOut: 6000,});
				},
				(err: HttpErrorResponse) => {
				this.error = err.error.message;
				//console.log(err.error.message);
				//this.toasterService.error('Error: '+this.error, 'Error', {timeOut: 6000,});
				swal('No fue posible procesar su solicitud', err.error.message, 'error');
				});*/
    }

    addProjectServiceCategorie(token: any, id: number, data: ProjectServiceType): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'project/' + id + '/servicecategorie', params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    addProjecType(token: any, id: number, data: ProjectServiceType): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'project/' + id + '/servicetype', params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    addServiceConstante(token: any, id: number, data: Constante): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'service/' + id + '/constante', params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    addServiceGiro(token: any, id: number, data: Giro): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'service/' + id + '/giro', params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    addServiceMercado(token: any, id: number, data: Mercado): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'service/' + id + '/mercado', params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    addServiceSector(token: any, id: number, data: Sector): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'service/' + id + '/sector', params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    addServiceTarifa(token: any, id: number, data: Tarifa): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'service/' + id + '/tarifa', params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    addServiceType(token: any, id: number, data: ServiceType): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'service/' + id + '/servicetype', params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    addServiceZona(token: any, id: number, data: Zona): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'service/' + id + '/zona', params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    addServiceValue(token: any, id: number, data: ServiceValue): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'service/' + id + '/value', params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    addServiceTypeValue(token: any, id: number, data: ServiceTypeValue): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'servicetype/' + id + '/value', params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    cloneService(token: any, service: Service, id: number, service_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(service);
        const params = 'json=' + json;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'project' + '/' + id + '/' + 'service' + '/' + service_id + '/clone/1', params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });

    }

    lectura(token: any, id: number, serviceid: number, label: number): void {
        if (!token) {
            return;
        }
        const json = JSON.stringify(label);
        const params = 'json=' + json;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        this._http.post(this.url + 'project' + '/' + id + '/' + 'service' + '/' + serviceid + '/' + 'lectura' + '/' + label, params, {
            headers: headers
        }).subscribe(
            _data => {}, (err: HttpErrorResponse) => {
                this.error = err.error.message;
            });
    }

    moreimagen(token: any, id: number, serviceid: number, label: number): void {
        if (!token) {
            return;
        }
        const json = JSON.stringify(label);
        const params = 'json=' + json;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        this._http.post(this.url + 'project' + '/' + id + '/' + 'service' + '/' + serviceid + '/' + 'moreimagen' + '/' + label, params, {
            headers: headers
        }).subscribe(
            _data => {}, (err: HttpErrorResponse) => {
                this.error = err.error.message;
            });
    }

    updateCurrencyValue(token: any, id: number, data: CurrencyValue): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'currencyvalue/' + id, params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    updateProject(token: any, project: Proyecto, id: number): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(project);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        // console.log(headers);

        return this._http.post(this.url + 'projectupdate/' + id, params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    updateProjectServiceCategorie(token: any, id: number, data: ProjectServiceType, data_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.put(this.url + 'project/' + id + '/servicecategorie/' + data_id, params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    updateProjecType(token: any, id: number, data: ProjectServiceType, data_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.put(this.url + 'project/' + id + '/servicetype/' + data_id, params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    updateService(token: any, service: Service, id: number, service_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(service);
        const params = 'json=' + json;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.put(this.url + 'project' + '/' + id + '/' + 'service' + '/' + service_id, params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });

        /*
		this._http.put(this.url+'project'+'/'+id+'/'+'service'+'/'+service_id, params, {headers: headers}).subscribe(
    		(data:any) => {
				  //this.toasterService.success('Proyecto actualizado.', 'Exito', {timeOut: 6000,});
					if(data.status === 'success'){
						swal('Proyecto actualizado exitosamente con ID: ', id +'.', 'success' );
					}else{
						swal('No fue posible procesar su solicitud', '', 'error');
					}
			      },
			      (err: HttpErrorResponse) => {
			      //this.error = err.error.message;
			      //console.log(err.error.message);
				  //this.toasterService.error('Error: '+this.error, 'Error', {timeOut: 6000,});
				  swal('No fue posible procesar su solicitud', err.error.message, 'error');
			    });*/
    }

    updateServiceConstante(token: any, id: number, data: Constante, data_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.put(this.url + 'service/' + id + '/constante/' + data_id, params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    updateServiceGiro(token: any, id: number, data: Giro, data_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.put(this.url + 'service/' + id + '/giro/' + data_id, params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    updateServiceMercado(token: any, id: number, data: Mercado, data_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.put(this.url + 'service/' + id + '/mercado/' + data_id, params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    updateServiceSector(token: any, id: number, data: Sector, data_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.put(this.url + 'service/' + id + '/sector/' + data_id, params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    updateServiceTarifa(token: any, id: number, data: Tarifa, data_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.put(this.url + 'service/' + id + '/tarifa/' + data_id, params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    updateServiceType(token: any, id: number, data: ServiceType, data_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.put(this.url + 'service/' + id + '/servicetype/' + data_id, params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    updateServiceZona(token: any, id: number, data: Zona, data_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.put(this.url + 'service/' + id + '/zona/' + data_id, params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    updateServiceValue(token: any, id: number, data: ServiceValue, data_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.put(this.url + 'service/' + id + '/value/' + data_id, params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    updateServiceTypeValue(token: any, id: number, data: ServiceValue, data_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.put(this.url + 'servicetype/' + id + '/value/' + data_id, params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    updateColor(token: any, id: number, data: Color): Observable < any > {
        if (!token) {
            return;
        }

        const json = JSON.stringify(data);
        const params = 'json=' + json;

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.put(this.url + 'colors/' + id, params, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    deleteCurrencyValue(token: any, id: number): Observable < any > {
        if (!token) {
            return;
        }

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.delete(this.url + 'currencyvalue/' + id, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    deleteService(token: any, id: number, service_id: number): void {
        if (!token) {
            return;
        }

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        this._http.delete(this.url + 'project' + '/' + id + '/' + 'service' + '/' + service_id, {
            headers: headers
        }).subscribe(
            (data: any) => {
                // this.toasterService.success('Proyecto eliminado.', 'Exito', {timeOut: 6000,});
                if (data.status === 'success') {
                    Swal.fire('Proyecto eliminado exitosamente con ID: ', id + '.', 'success');
                } else {
                    Swal.fire('No fue posible procesar su solicitud', '', 'error');
                }
            }, (err: HttpErrorResponse) => {
                this.error = err.error.message;
                Swal.fire('No fue posible procesar su solicitud', '', 'error');
            });
    }

    deleteProjectServiceCategorie(token: any, id: number, data_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.delete(this.url + 'project/' + id + '/servicecategorie/' + data_id, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    deleteProjecType(token: any, id: number, data_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.delete(this.url + 'project/' + id + '/servicetype/' + data_id, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    deleteServiceConstante(token: any, id: number, data_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.delete(this.url + 'service/' + id + '/constante/' + data_id, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    deleteServiceGiro(token: any, id: number, data_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.delete(this.url + 'service/' + id + '/giro/' + data_id, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    deleteServiceMercado(token: any, id: number, data_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.delete(this.url + 'service/' + id + '/mercado/' + data_id, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    deleteServiceSector(token: any, id: number, data_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.delete(this.url + 'service/' + id + '/sector/' + data_id, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    deleteServiceTarifa(token: any, id: number, data_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.delete(this.url + 'service/' + id + '/tarifa/' + data_id, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    deleteServiceType(token: any, id: number, data_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.delete(this.url + 'service/' + id + '/servicetype/' + data_id, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    deleteServiceZona(token: any, id: number, data_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.delete(this.url + 'service/' + id + '/zona/' + data_id, {
                headers: headers
            })
            .map((resp: any) => {
                return resp;
            });
    }

    deleteServiceValue(token: any, id: number, data_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.delete(this.url + 'service/' + id + '/value/' + data_id, {
            headers: headers
        }).map((resp: any) => resp);
    }

    deleteServiceTypeValue(token: any, id: number, data_id: number): Observable < any > {
        if (!token) {
            return;
        }

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.delete(this.url + 'servicetype/' + id + '/value/' + data_id, {
            headers: headers
        }).map((resp: any) => resp);
    }

    deleteColor(token: any, id: number): Observable < any > {
        if (!token) {
            return;
        }

        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.delete(this.url + 'colors/' + id, {
            headers: headers
        }).map((resp: any) => resp);
    }

    getQuery(query: string, token: any): Observable < any > {
        if (!token) {
            return;
        }
        const url = this.url + query;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this._http.get(url, {
            headers: headers
        }).map((res: any) => res);
    }

    async getQueryPromise(query: string, token: any) {

        if (!token) {
            return;
        }

        try {
            const url = this.url;
            const href = url + query;
            const requestUrl = href;
            const headers = new HttpHeaders({
                'Content-Type': 'application/json'
            });

            if (!requestUrl) {
                throw new Error(`Error HTTP ${requestUrl}`);
            } else {
                return await this._http.get < any > (requestUrl, {
                        headers: headers
                    }).toPromise()
                    .then()
                    .catch((error) => {
                        this.handleError(error);
                    });
            }
        } catch (err) {
            console.log(err);
        }
    }

    getColor(token: any): Observable < any > {
        if (!token) {
            return;
        }
        return this.getQuery('colors', token);
    }

    getConstante(token: any, id: number): Observable < any > {
        if (!token) {
            return;
        }
        return this.getQuery('service/' + id + '/constante', token);
    }

    getCurrency(token: any): Observable < any > {
        if (!token) {
            return;
        }
        return this.getQuery('currency', token);
    }

    getCurrencyValue(token: any): Observable < any > {
        if (!token) {
            return;
        }
        return this.getQuery('currencyvalue', token);
    }

    getDepartamentos(token: any): Observable < any > {
        if (!token) {
            return;
        }
        return this.getQuery('departamento', token);
    }

    getGiro(token: any, id: number): Observable < any > {
        if (!token) {
            return;
        }
        return this.getQuery('service/' + id + '/giro', token);
    }

    getMercado(token: any, id: number): Observable < any > {
        if (!token) {
            return;
        }
        return this.getQuery('service/' + id + '/mercado', token);
    }

    getProyectos(token: any, id: number): Observable < any > {
        if (!token) {
            return;
        }
        return this.getQuery('departamento/' + id + '/proyecto', token);
    }

    getProject(token: any, id: number) {
        if (!token) {
            return;
        }
        return this.getProjectOrderData('project/' + id, token);
    }

    getProjectSelect(token: any, id: number) {
        if (!token) {
            return;
        }
        return this.getProjectOrderData('projectselect/' + id, token);
    }

    getProjectOrder(token, id: number, termino, date, idstatus, serviceid, servicetypeid) {
        if (!token) {
            return;
        }
        const paginate = `/${termino}/date/${date}/status/${idstatus}/service/${serviceid}/servicetype/${servicetypeid}?limit=All`;

        return this.getProjectOrderData('project/' + id + '/searchorder' + paginate, token);
    }

    getProjectService(token: any, id: number) {
        if (!token) {
            return;
        }
        return this.getQuery('project/' + id + '/service', token);
    }

    getProjectServicePromise(token: any, id: number) {
        if (!token) {
            return;
        }
        return this.getQueryPromise('project/' + id + '/service', token);
    }

    getUserProjectServiceDetailPromise(token: any, user_id: number, project_id: number) {
        if (!token) {
            return;
        }
        return this.getQueryPromise('user/' + user_id + '/projectservice/' + project_id, token);
    }

    @Cacheable({
        cacheBusterObserver: cacheBuster$
      })
    getProjectOrderService(filter: string, searchParams = [], fieldValue: string, columnValue: string, fieldValueDate: string, columnDateDesdeValue: string, columnDateHastaValue: string, fieldValueUsuario: string, columnValueUsuario: string, sort: string, order: string, pageSize: number, page: number, id: number, token: any): Observable<any> {
        // console.log(sort);
        if (!fieldValue) {
          fieldValue = '';
        }

        if (!order) {
          order = 'desc';
        }
        if (!sort) {
          sort = 'create_at';
        }

        const json = JSON.stringify(searchParams);

        const url = this.url;
        const paginate = `?filter=${filter}&searchParams=${json}&fieldValue=${fieldValue}&columnValue=${columnValue}&fieldValueDate=${fieldValueDate}&columnDateDesdeValue=${columnDateDesdeValue}&columnDateHastaValue=${columnDateHastaValue}&fieldValueUsuario=${fieldValueUsuario}&columnValueUsuario=${columnValueUsuario}&sort=${sort}&order=${order}&limit=${pageSize}&page=${page + 1}`;
        const query = 'project/' + id + '/order' + paginate;
        const href = url + query;
        const requestUrl = href;

        const httpOptions = {
          headers: new HttpHeaders({
            'Cache-Control': 'public, max-age=300, s-maxage=600',
            'Content-Type':  'application/json'
          })
        };


        if (!requestUrl || !token) {
            return;
        }

        console.log(requestUrl);

        try {
            return this._http.get<any>(requestUrl, {headers: httpOptions.headers}).shareReplay();
       } catch (err) {
            console.log(err);
       }
      }


    getProjectServiceCategorie(token: any, id: number) {
        if (!token) {
            return;
        }
        return this.getQuery('project/' + id + '/servicecategorie', token);
    }

    getProjectServiceDetail(token: any, id: number) {
        if (!token) {
            return;
        }
        return this.getQuery('project/' + id + '/servicedetail', token);
    }

    getProjectServiceType(token: any, id: number) {
        if (!token) {
            return;
        }
        return this.getQuery('project/' + id + '/servicetype', token);
    }

    getProjectUser(token: any, id: number, role: number) {
        if (!token) {
            return;
        }
        return this.getProjectOrderData('project/' + id + '/role/' + role, token);
    }

    getProjectUserGeoreference(token: any, id: number) {
        if (!token) {
            return;
        }
        return this.getProjectOrderData('project/' + id + '/usergeoreference', token);
    }

    getSector(token: any, id: number): Observable < any > {
        if (!token) {
            return;
        }
        return this.getQuery('service/' + id + '/sector', token);
    }

    getServiceValue(token: any, id): Observable < any > {
        if (!token) {
            return;
        }
        return this.getQuery('service/' + id + '/value', token);
    }

    getServiceTypeValue(token: any, id): Observable < any > {
        if (!token) {
            return;
        }
        return this.getQuery('servicetype/' + id + '/value', token);
    }

    getTarifa(token: any, id: number): Observable < any > {
        if (!token) {
            return;
        }
        return this.getQuery('service/' + id + '/tarifa', token);
    }

    getTipoServicio(token: any, id: number) {
        if (!token) {
            return;
        }
        return this.getQuery('service/' + id + '/servicetype', token);
    }

    getTipoVehiculo(token: any): Observable < any > {
        if (!token) {
            return;
        }
        return this.getQuery('tipovehiculo', token);
    }

    getAllTiposervicioProyecto(token: any, id: number) {
        if (!token) {
            return;
        }
        return this.getQuery('project/' + id + '/tiposervicio', token);
    }

    getZona(token: any, id): Observable < any > {
        if (!token) {
            return;
        }
        return this.getQuery('service/' + id + '/zona', token);
    }

    gettUserGeoreference(token: any, id: number, columnDateDesdeValue: string, columnTimeFromValue: any, columnTimeUntilValue: any) {
        if (!token) {
            return;
        }
        const paginate = `?columnDateDesdeValue=${columnDateDesdeValue}&columnTimeFromValue=${columnTimeFromValue}&columnTimeUntilValue=${columnTimeUntilValue}`;
        return this.getProjectOrderData('user/' + id + '/georeference' + paginate, token);
    }

    gettUserOrdenesGeoreference(token: any, id: number, userid: number) {
        if (!token) {
            return;
        }
        return this.getProjectOrderData('project/' + id + '/user/' + userid + '/ordergeoreference', token);
    }

    async getProjectOrderData(query: string, token: any) {
        if (!token) {
            return;
        }
        const url = this.url;
        const href = url + query;
        const requestUrl = href;
        // console.log(requestUrl);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return await new Promise((resolve, reject) => {
            if (token === '') {
                reject();
            }

            if (query === '') {
                reject();
            }

            resolve(this._http.get < Order > (requestUrl, {
                headers: headers
            }));
        });
    }

    getMasterUserProject(token: any, id: number, role: any): Observable < any > {
        if (!token) {
            return;
        }
        return this.getQuery('project/' + id + '/role/' + role + '/greater', token);
    }


    getUserProject(token: any, id: number, role: any): Observable < any > {
        if (!token) {
            return;
        }
        return this.getQuery('project/' + id + '/role/' + role, token);
    }

    getUserProjectService(token: any, id: number): Observable < any > {
        if (!token) {
            return;
        }
        return this.getQuery('user/' + id + '/projectservice', token);
    }

    getUserProjectServiceDetail(token: any, user_id: number, project_id: number): Observable < any > {
        if (!token) {
            return;
        }
        return this.getQuery('user/' + user_id + '/projectservice/' + project_id, token);
    }

    status(token: any, id: number, serviceid: number, servicedetailid: number, label: number): void {
        if (!token) {
            return;
        }
        const json = JSON.stringify(label);
        const params = 'json=' + json;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        this._http.post(this.url + 'project' + '/' + id + '/' + 'service/' + serviceid + '/' + 'servicedetail/' + servicedetailid + '/status/' + label, params, {
            headers: headers
        }).subscribe(
            _data => {
                // console.log(data);
                // this.dialogData = order;
                // this.toasterService.success('Orden de Trabajo actualizada.', 'Exito', {timeOut: 6000,});
            }, (err: HttpErrorResponse) => {
                this.error = err.error.message;
                // console.log(err.error.message);
                // this.toasterService.error('Error: '+this.error, 'Error', {timeOut: 6000,});
            });
    }

    statusKpi(token: any, id: number, serviceid: number, label: number): void {
        if (!token) {
            return;
        }
        const json = JSON.stringify(label);
        const params = 'json=' + json;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        this._http.post(this.url + 'project' + '/' + id + '/' + 'service' + '/' + serviceid + '/' + 'statuskpi' + '/' + label, params, {
            headers: headers
        }).subscribe(
            _data => {
                // console.log(data);
                // this.dialogData = order;
                // this.toasterService.success('Orden de Trabajo actualizada.', 'Exito', {timeOut: 6000,});
            }, (err: HttpErrorResponse) => {
                this.error = err.error.message;
                // console.log(err.error.message);
                // this.toasterService.error('Error: '+this.error, 'Error', {timeOut: 6000,});
            });
    }

    private handleError(error: HttpErrorResponse) {
        if (!navigator.onLine) {
            // Handle offline error
            console.error('Browser Offline!');
        } else {
            if (error instanceof HttpErrorResponse) {
                // Server or connection error happened
                if (!navigator.onLine) {
                    console.error('Browser Offline!');
                } else {
                    // Handle Http Error (4xx, 5xx, ect.)
                    if (error.status === 500) {
                        this._snackBar.open(this.errorMessage500, '', {
                            duration: 7000,
                        });
                    }

                    if (error.status === 0) {
                        this._snackBar.open(this.errorMessage, '', {
                            duration: 7000,
                        });
                    }
                }
            } else {
                // Handle Client Error (Angular Error, ReferenceError...)
                console.error('Client Error!');
            }
            return throwError(error.error);
        }
    }

}
