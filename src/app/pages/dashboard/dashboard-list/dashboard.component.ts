import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';


// MODELS
import { Proyecto, Service } from 'src/app/models/types';

// SERVICES
import { MessagingService, ProjectsService, SettingsService, UserService } from 'src/app/services/service.index';

// MOMENT
import * as _moment from 'moment';
// const moment = _moment;


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [UserService]
})
export class DashboardComponent implements OnInit, OnDestroy {

    title: string;
    created: FormControl;
    departamentos: Array<any> = [];
    event = 0;
    identity;
    message;
    proyectos: Array<Proyecto>;
    servicios: Array<Service>;
    subscription: Subscription;
    options: FormGroup;
    token: any;


    constructor(
        // private _cdf: CdfService,
        private _proyectoService: ProjectsService,
        public _userService: UserService,
        public label: SettingsService,
        public msgService: MessagingService,
        fb: FormBuilder
    ) {
        this.identity = this._userService.getIdentity();
        this.proyectos = this._userService.getProyectos();
        this.token = this._userService.getToken();
        this._userService.handleAuthentication(this.identity, this.token);
        this.options = fb.group({
            bottom: 0,
            fixed: false,
            top: 0
        });
        this.label.getDataRoute().subscribe(data => {
            this.title = data.subtitle;
        });
    }

    ngOnInit() {
        this.msgService.getPermission();
        this.msgService.receiveMessage();
        this.message = this.msgService.currentMessage;

        if (this.identity && this.token) {
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

    /*
	sendMsj() {

		this.created =  new FormControl(moment().format('YYYY[-]MM[-]DD HH:MM'));

		let data = {
			userId: 'ghsMwBtcYLXKxd2boAuQc8encSk1',
			userIdTo: 'otsLY91D66WnFul0UvMLxlL1dhF3',
			title: 'Titulo de Mensaje',
			message: 'Test Cuerpo de Mensaje',
			create_at: this.created.value,
			status: '1'
		};

		this._cdf.fcmsend(this.token.token, data).subscribe(
			response => {
			  if(!response){
				return false;
			  }
				if(response.status == 200){ 
					console.log(response);
				}
			},
				error => {
				console.log(<any>error);
				}
			);

			// const body = ' nueva incidencia ';

			const msg = {
				toEmail: 'hugoebarboza@gmail.com',
				fromTo: 'hugo.barboza@ocaglobal.com',
				subject: 'OCA GLOBAL - Nueva incidencia #77123',
				message: `
				<!DOCTYPE html>
				<html>
				<head>
				<style >
				</style>
				</head>
				<body>

				<table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" bgcolor="#F9F9F9">
				<tbody>
				  <tr>
					<td align="center">
					<table width="640" cellpadding="0" cellspacing="0" >
					  <tbody>
						<tr>
						<td><p></p></td>
						</tr>

						<tr>
						  <td>
						  <table border="0" cellspacing="0" cellpadding="0" width="100%"  style="border-collapse:collapse;background:#fff;border:1px solid #ededed" bgcolor="#fff">
							<tbody>
							  <tr>
								<td>
								<table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">

								  <tbody>
									  <tr>
										  <td  style="border-bottom-width:1px;padding:12px 0px 12px 24px;background-color: #0b3357;">
										  <div  style="font-size:0pt;line-height:0pt;background-color: #0b3357;" align="left">
											<a href="https://ocaglobal.com" style="color:#45abd9;text-decoration:none" target="_blank">
											<img alt="" src="https://ocaglobal.com/themes/ledel-foundation6-october/assets/img/logo.svg" style="width:130px;border:0px solid" width="130">
										  </a>
										  </div>
										  </td>
									  </tr>
									<tr>
									  <td align="left" style="padding:25px 30px 30px">
									  <h2 style="font-size:16px;font-weight:400;color:#222222;margin:0">
										<p>Gracias por contactar al equipo de soporte de OCA GLOBAL.</p>
										<p>Hemos recibido su solicitud y estamos trabajando para resolver su problema. Le ayudaremos tan pronto como podamos.</p>
										<p></p>
										<p>Para verificar el estado del ticket y agregar comentarios adicionales, siga el enlace aquí
										  <a href="https://odisdkp.firebaseapp.com/#/support" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://support.sendgrid.com/hc/requests/2306369&amp;source=gmail&amp;ust=1561827470902000&amp;usg=AFQjCNHthhPllbak25dNtf46FraBxDF9uQ">odisdkp.firebaseapp.com/#/support</a>.</p>
											<p>Saludos cordiales!</p>
											<p></p>
										<div style="margin-top:25px">
										  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
											<tbody>
											  <tr>
											  <td width="100%" style="padding:15px 0;border-top:1px dotted #c5c5c5">
												<table width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout:fixed" role="presentation">
												  <tbody>
												  <tr>
													<td valign="top" style="padding:0 15px 0 15px;width:40px">
													<img width="40" height="40" alt="" style="height:auto;line-height:100%;outline:none;text-decoration:none;border-radius:5px;" src="https://ci3.googleusercontent.com/proxy/xGsxYfjTvh6KWP4Lx7W_FDfJ5hrmw5YzNi8mji33NvpeZVLJrbcGzQpCDmHxN6OjhGSNobgFjJ4rnYnBGcU1xaIo5cH_JaOEOuPmGSQJNL_HVBWOXal0C2cKf1u_LS6tFrb6JJqHLX52AuZJnnGA5AyLgYDocA5vccvWTdiXZZVM07oRqBesIqndZxnmxx7e1ToFhvl1fEliLx35oWxK2-TVk8jFBCcwAG-CjQn9nbyx5EEF=s0-d-e1-ft#https://secure.gravatar.com/avatar/f375267e4ec6266af88de6e4e70accfc?size=40&amp;default=https%3A%2F%2Fassets.zendesk.com%2Fimages%2F2016%2Fdefault-avatar-80.png&amp;r=g" >
													</td>
													<td width="100%" style="padding:0;margin:0" valign="top">
													  <p style="font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif;font-size:15px;line-height:18px;margin-bottom:0;margin-top:0;padding:0;color:#1b1d1e;margin-left:2px;">
													  <strong>hugoebarbozar</strong>
													  </p>
													  <p style="font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif;font-size:13px;line-height:25px;margin-bottom:15px;margin-top:0;padding:0;color:#bbbbbb;margin-left:2px;">Jun 27, 15:38 MDT</p>
													  <div dir="auto" style="color:#2b2e2f;font-family:'Lucida Sans Unicode','Lucida Grande','Tahoma',Verdana,sans-serif;font-size:14px;line-height:22px;margin:15px 0">
														<p style="color:#2b2e2f;font-family:'Lucida Sans Unicode','Lucida Grande','Tahoma',Verdana,sans-serif;font-size:14px;line-height:22px;margin:15px 0" dir="auto">Secure Email, I receive emails like spam or not secure. I need to resolve it, how can I do ?</p>
													  </div>
													</td>
												  </tr>
												  </tbody>
												</table>
											  </td>
											  </tr>
											</tbody>
										  </table>
										</div>
									  </h2>
									  </td>
									</tr>
								  </tbody>
								</table>
							  </td>
							</tr>
						  </tbody>
						</table>
						</td>
					</tr>
					</tbody>
				  </table>
				  </td>
				</tr>
				<tr>
				<td><p></p></td>
				</tr>
				</tbody>
				</table>


				</body>
				</html>
				`,
			  };

			  this._cdf.httpEmail(this.token.token, msg).subscribe(
				response => {
				  if (!response) {
				  return false;
				  }
				  if (response.status === 200) {
					 console.log(response);
				  }
				},
				  error => {
				   console.log(<any>error);
				  }
				);
	  }	*/

}





