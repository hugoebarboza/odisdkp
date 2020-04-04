import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core';

// MODELS
import { Proyecto, Service } from 'src/app/models/types';

// SERVICES
import { MessagingService, ProjectsService, SettingsService, UserService } from 'src/app/services/service.index';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {

    title: string;
    departamentos: Array<any> = [];
    event = 0;
    identity;
    message;
    proyectos: Array<Proyecto>;
    servicios: Array<Service>;
    subscription: Subscription;
    token: any;


    constructor(
        private _proyectoService: ProjectsService,
        public _userService: UserService,
        public label: SettingsService,
        public msgService: MessagingService,
    ) {
        this.identity = this._userService.getIdentity();
        this.proyectos = this._userService.getProyectos();
        this.token = this._userService.getToken();
        this.departamentos = this._userService.getDepartamentos();
        this._userService.handleAuthentication(this.identity, this.token);
        this.label.getDataRoute().subscribe(data => {
            this.title = data.subtitle;
        });
    }

    ngOnInit() {
        this.msgService.getPermission();
        this.msgService.receiveMessage();
        this.message = this.msgService.currentMessage;

        if (this.identity && this.token && !this.departamentos) {
            this.subscription = this._proyectoService.getDepartamentos(this.token.token).subscribe(
            (response: any) => {
             if (response.status === 'success') {
                this.departamentos = response.datos;
                const key = 'departamentos';
                this._userService.saveStorage(key, this.departamentos);
             }
            },
            (_error: any) => {
                this._userService.logout();
                },
            );
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
         this.subscription.unsubscribe();
        }
    }


    refreshMenu(event: number) {
        if (event === 1) {
        }
    }

}
