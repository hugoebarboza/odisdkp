import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

export interface CdfMessage {
	toEmail: string;
	fromTo: string;
	subject: string;
	message: string;
}


@Injectable()
export class CdfService  {

    public headers: Headers = undefined;
    public key: string;
    public url:string;
	

	constructor(		
		private _http: Http,
		private afs: AngularFirestore,
	){
        this.url = environment.global.urlcdf;
        this.key = environment.global.cdfkey;
        this.headers = undefined;
	}


	addNotification(token=null, params:any){
	if(!token){
		return;
	}
	return new Promise<any>((resolve, reject) => {
		this.afs.collection('fcmnotification').add({
			body: params.message,
			title: params.title,
			create_at: params.create_at,
			create_by: params.userId
		})
		.then(function(docRef) {
			console.log('Document written with ID: ', docRef.id);
			resolve(docRef);
		}, err => reject(err))
    	});
	}


	fcmsend(token=null, params:any): Observable<any>{
		if(!token){
            return;
		}

        let headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });
		
		return this._http.post(this.url+'fcmSend', params, {headers: headers})
			.map( (resp: any) => {
				return resp;
			}).catch( err => {
				return Observable.throw( err );
			});		
	}



	httpEmail(token=null, params:any): Observable<any>{
		if(!token){
            return;
		}

		let headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });

		const endpoint = 'https://us-central1-odisdkp.cloudfunctions.net/httpEmail';

		return this._http.post(endpoint, params, {headers: headers})
			.map( (resp: any) => {
				return resp;
			}).catch( err => {
				return err ;
			});		
	}


	httpEmailToSupport(token=null, toEmail: string, fromTo: string, subject: string, created:any, body:string): Observable<any>{
		if(!token){
            return;
		}

		const msg: CdfMessage = {
            toEmail: toEmail,
            fromTo: fromTo,
            subject: subject,
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
						<img src="https://odisdkp.firebaseapp.com/assets/img/logo.png" alt="logo_oca" width="138" >
					  </a>
					  </div>
					  </td>
					  </tr>                                            


					  <tr>
                        <td align="left" style="padding:25px 30px 30px">
                        <h2 style="font-size:16px;font-weight:400;color:#222222;margin:0">
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
                                <strong>${fromTo}</strong>
                                </p>
                                <p style="font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif;font-size:13px;line-height:25px;margin-bottom:15px;margin-top:0;padding:0;color:#bbbbbb;margin-left:2px;">${created}</p>
                                <div dir="auto" style="color:#2b2e2f;font-family:'Lucida Sans Unicode','Lucida Grande','Tahoma',Verdana,sans-serif;font-size:14px;line-height:22px;margin:15px 0">
                                <p style="color:#2b2e2f;font-family:'Lucida Sans Unicode','Lucida Grande','Tahoma',Verdana,sans-serif;font-size:14px;line-height:22px;margin:15px 0" dir="auto">${body}</p>
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
		  

		let headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });

		const endpoint = 'https://us-central1-odisdkp.cloudfunctions.net/httpEmail';

		return this._http.post(endpoint, msg, {headers: headers})
			.map( (resp: any) => {
				return resp;
			}).catch( err => {
				return err ;
			});		
	}



	httpEmailFromOrigin(token=null, toEmail: string, fromTo: string, subject: string, created:any, body:string): Observable<any>{
		if(!token){
            return;
		}

		const msg: CdfMessage = {
            toEmail: toEmail,
            fromTo: fromTo,
            subject: subject,
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
						<img src="https://odisdkp.firebaseapp.com/assets/img/logo.png" alt="logo_oca" width="138" >
					  </a>
					  </div>
					  </td>
					  </tr>                                            


					  <tr>
                        <td align="left" style="padding:25px 30px 30px">
                        <h2 style="font-size:16px;font-weight:400;color:#222222;margin:0">
                        <p>Gracias por contactar al equipo de soporte de OCA GLOBAL.</p>
                        <p>Hemos recibido su solicitud y estamos trabajando para resolverla. Le ayudaremos tan pronto como podamos.</p>
                        <p></p>
                        <p>Para verificar el estado de la solicitud y agregar comentarios adicionales, siga el enlace aquí
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
                                <strong>${fromTo}</strong>
                                </p>
                                <p style="font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif;font-size:13px;line-height:25px;margin-bottom:15px;margin-top:0;padding:0;color:#bbbbbb;margin-left:2px;">${created}</p>
                                <div dir="auto" style="color:#2b2e2f;font-family:'Lucida Sans Unicode','Lucida Grande','Tahoma',Verdana,sans-serif;font-size:14px;line-height:22px;margin:15px 0">
                                <p style="color:#2b2e2f;font-family:'Lucida Sans Unicode','Lucida Grande','Tahoma',Verdana,sans-serif;font-size:14px;line-height:22px;margin:15px 0" dir="auto">${body}</p>
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

		let headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });

		const endpoint = 'https://us-central1-odisdkp.cloudfunctions.net/httpEmail';

		return this._http.post(endpoint, msg, {headers: headers})
			.map( (resp: any) => {
				return resp;
			}).catch( err => {
				return err ;
			});		
	}



	httpEmailCommentToSupport(token=null, toEmail: string, fromTo: string, subject: string, created:any, body:string): Observable<any>{
		if(!token){
            return;
		}

		const msg: CdfMessage = {
            toEmail: toEmail,
            fromTo: fromTo,
            subject: subject,
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
						<img src="https://odisdkp.firebaseapp.com/assets/img/logo.png" alt="logo_oca" width="138" >
					  </a>
					  </div>
					  </td>
					  </tr>                                            

					  <tr>
                        <td align="left" style="padding:25px 30px 30px">
                        <h2 style="font-size:16px;font-weight:400;color:#222222;margin:0">
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
                                <strong>${fromTo}</strong>
                                </p>
                                <p style="font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif;font-size:13px;line-height:25px;margin-bottom:15px;margin-top:0;padding:0;color:#bbbbbb;margin-left:2px;">${created}</p>
                                <div dir="auto" style="color:#2b2e2f;font-family:'Lucida Sans Unicode','Lucida Grande','Tahoma',Verdana,sans-serif;font-size:14px;line-height:22px;margin:15px 0">
                                <p style="color:#2b2e2f;font-family:'Lucida Sans Unicode','Lucida Grande','Tahoma',Verdana,sans-serif;font-size:14px;line-height:22px;margin:15px 0" dir="auto">${body}</p>
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
		  

		let headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });

		const endpoint = 'https://us-central1-odisdkp.cloudfunctions.net/httpEmail';

		return this._http.post(endpoint, msg, {headers: headers})
			.map( (resp: any) => {
				return resp;
			}).catch( err => {
				return err ;
			});		
	}



	httpEmailCommentFromOrigin(token=null, toEmail: string, fromTo: string, subject: string, created:any, createdcomment:any, body:string, bodycomment:string): Observable<any>{
		if(!token){
            return;
		}

		const msg = {
            toEmail: toEmail,
            fromTo: fromTo,
            subject: subject,
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
						<img src="https://odisdkp.firebaseapp.com/assets/img/logo.png" alt="logo_oca" width="138" >
					  </a>
					  </div>
					  </td>
					  </tr>                                            


					  <tr>
                        <td align="left" style="padding:25px 30px 30px">
                        <h2 style="font-size:16px;font-weight:400;color:#222222;margin:0">
                        <p>Hemos recibido un nuevo comentario sobre su solicitud.</p>
                        <p></p>
                        <p>Para verificar el estado de la solicitud y agregar comentarios adicionales, siga el enlace aquí
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
                                <strong>${fromTo}</strong>
                                </p>
                                <p style="font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif;font-size:13px;line-height:25px;margin-bottom:15px;margin-top:0;padding:0;color:#bbbbbb;margin-left:2px;">${createdcomment}</p>
                                <div dir="auto" style="color:#2b2e2f;font-family:'Lucida Sans Unicode','Lucida Grande','Tahoma',Verdana,sans-serif;font-size:14px;line-height:22px;margin:15px 0">
                                <p style="color:#2b2e2f;font-family:'Lucida Sans Unicode','Lucida Grande','Tahoma',Verdana,sans-serif;font-size:14px;line-height:22px;margin:15px 0" dir="auto">${bodycomment}</p>
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
                                <strong>${toEmail}</strong>
                                </p>
                                <p style="font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif;font-size:13px;line-height:25px;margin-bottom:15px;margin-top:0;padding:0;color:#bbbbbb;margin-left:2px;">${created}</p>
                                <div dir="auto" style="color:#2b2e2f;font-family:'Lucida Sans Unicode','Lucida Grande','Tahoma',Verdana,sans-serif;font-size:14px;line-height:22px;margin:15px 0">
                                <p style="color:#2b2e2f;font-family:'Lucida Sans Unicode','Lucida Grande','Tahoma',Verdana,sans-serif;font-size:14px;line-height:22px;margin:15px 0" dir="auto">${body}</p>
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

		let headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });

		const endpoint = 'https://us-central1-odisdkp.cloudfunctions.net/httpEmail';

		return this._http.post(endpoint, msg, {headers: headers})
			.map( (resp: any) => {
				return resp;
			}).catch( err => {
				return err ;
			});		
	}





	httpEmailAddService(token=null, toEmail: string, fromTo: string, subject: string, created:any, body:string, project : { numot: any, description: string, lastInsertedId: number }): Observable<any>{
		if(!token){
            return;
		}

		const msg: CdfMessage = {
            toEmail: toEmail,
            fromTo: fromTo,
            subject: subject,
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
						<img src="https://odisdkp.firebaseapp.com/assets/img/logo.png" alt="logo_oca" width="138" >
					  </a>
					  </div>
					  </td>
					  </tr>                                            


					  <tr>
                        <td align="left" style="padding:25px 30px 30px">
                        <h2 style="font-size:16px;font-weight:400;color:#222222;margin:0">
                        <p>Estimad@s,</p>
                        <p>Junto con saludar, se detalla información de la solicitud de Gestión de nuevo Proyecto con Num. OT: ${project.numot} y Nombre: ${project.description}, creado el día (${created}).</p>
                        <p></p>
                        <p>Para verificar el estado del proyecto y agregar comentarios adicionales, siga el enlace aquí
                          <a href="https://odisdkp.firebaseapp.com/#/service/${project.lastInsertedId}" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://support.sendgrid.com/hc/requests/2306369&amp;source=gmail&amp;ust=1561827470902000&amp;usg=AFQjCNHthhPllbak25dNtf46FraBxDF9uQ">odisdkp.firebaseapp.com/#/service</a>.</p>
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
                                <strong>${fromTo}</strong>
                                </p>
                                <p style="font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif;font-size:13px;line-height:25px;margin-bottom:15px;margin-top:0;padding:0;color:#bbbbbb;margin-left:2px;">${created}</p>
                                <div dir="auto" style="color:#2b2e2f;font-family:'Lucida Sans Unicode','Lucida Grande','Tahoma',Verdana,sans-serif;font-size:14px;line-height:22px;margin:15px 0">
                                <p style="color:#2b2e2f;font-family:'Lucida Sans Unicode','Lucida Grande','Tahoma',Verdana,sans-serif;font-size:14px;line-height:22px;margin:15px 0" dir="auto">${body}</p>
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

		let headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });

		const endpoint = 'https://us-central1-odisdkp.cloudfunctions.net/httpEmail';

		return this._http.post(endpoint, msg, {headers: headers})
			.map( (resp: any) => {
				return resp;
			}).catch( err => {
				return err ;
			});		
	}


	httpEmailEditService(token=null, toEmail: string, fromTo: string, subject: string, created:any, body:string, project : { numot: any, description: string, lastInsertedId: number }): Observable<any>{
		if(!token){
            return;
		}

		const msg: CdfMessage = {
            toEmail: toEmail,
            fromTo: fromTo,
            subject: subject,
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
						<img src="https://odisdkp.firebaseapp.com/assets/img/logo.png" alt="logo_oca" width="138" >
					  </a>
					  </div>
					  </td>
					  </tr>                                            


					  <tr>
                        <td align="left" style="padding:25px 30px 30px">
                        <h2 style="font-size:16px;font-weight:400;color:#222222;margin:0">
                        <p>Estimad@s,</p>
                        <p>Junto con saludar, se detalla información de la solicitud de actualización de Proyecto con Num. OT: ${project.numot} y Nombre: ${project.description}, actualizado el día (${created}).</p>
                        <p></p>
                        <p>Para verificar el estado del proyecto y agregar comentarios adicionales, siga el enlace aquí
                          <a href="https://odisdkp.firebaseapp.com/#/service/${project.lastInsertedId}" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://support.sendgrid.com/hc/requests/2306369&amp;source=gmail&amp;ust=1561827470902000&amp;usg=AFQjCNHthhPllbak25dNtf46FraBxDF9uQ">odisdkp.firebaseapp.com/#/service</a>.</p>
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
                                <strong>${fromTo}</strong>
                                </p>
                                <p style="font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif;font-size:13px;line-height:25px;margin-bottom:15px;margin-top:0;padding:0;color:#bbbbbb;margin-left:2px;">${created}</p>
                                <div dir="auto" style="color:#2b2e2f;font-family:'Lucida Sans Unicode','Lucida Grande','Tahoma',Verdana,sans-serif;font-size:14px;line-height:22px;margin:15px 0">
                                <p style="color:#2b2e2f;font-family:'Lucida Sans Unicode','Lucida Grande','Tahoma',Verdana,sans-serif;font-size:14px;line-height:22px;margin:15px 0" dir="auto">${body}</p>
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

		let headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });

		const endpoint = 'https://us-central1-odisdkp.cloudfunctions.net/httpEmail';

		return this._http.post(endpoint, msg, {headers: headers})
			.map( (resp: any) => {
				return resp;
			}).catch( err => {
				return err ;
			});		
	}



	httpEmailAddComment(token=null, toEmail: string, fromTo: string, subject: string, created:any, body:string, project : { address: string, company : string, comentario: string, name: string, observacion: string, description : string, order_number: string, service_name:string, service_type_name:string, id : number, pila: any }): Observable<any>{
		if(!token){
            return;
    }

    let pila = '';
    if(project.pila && project.pila.length > 0){
      let value = project.pila;
      for(let i=0; i<value.length; i++){
        pila = pila + '<li>' + value[i].name +': '+ value[i].description + '</li>';
      }

    }


		const msg: CdfMessage = {
            toEmail: toEmail,
            fromTo: fromTo,
            subject: subject,
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
						<img src="https://odisdkp.firebaseapp.com/assets/img/logo.png" alt="logo_oca" width="138" >
					  </a>
					  </div>
					  </td>
					  </tr>                                            


					  <tr>
                        <td align="left" style="padding:25px 30px 30px">
                        <h2 style="font-size:16px;font-weight:400;color:#222222;margin:0">
                        <p>Estimad@s,</p>
                        <p>Junto con saludar, detallo información actualizada del proyecto y adjunto documentos de inspección ejecutada el día (${created}).</p>
                        <p><b>DATOS DEL PROYECTO</b></p>
                        <ul>
                          <li>Nombre: ${project.service_name}</li>
                          <li>Num. OT: ${project.order_number}</li>
                          <li>Dirección General: ${project.address}</li>
                          <li>Descripción: ${project.description}</li>
                          <li>Contratista: ${project.company}</li>
                          <li>Tipo de Servicio: ${project.service_type_name}</li>
                          <li><b>Actividad Realizada:</b> ${project.comentario}</li>
                          <li>Observaciones: ${project.observacion}</li>
                          ${pila}                          
                        </ul>
                        <p></p>
                        <p></p>
                        <p>Para verificar el estado del proyecto y agregar comentarios adicionales, siga el enlace aquí
                          <a href="https://odisdkp.firebaseapp.com/#/service/${project.id}" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://support.sendgrid.com/hc/requests/2306369&amp;source=gmail&amp;ust=1561827470902000&amp;usg=AFQjCNHthhPllbak25dNtf46FraBxDF9uQ">odisdkp.firebaseapp.com/#/service</a>.</p>
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
                                <strong>${fromTo}</strong>
                                </p>
                                <p style="font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif;font-size:13px;line-height:25px;margin-bottom:15px;margin-top:0;padding:0;color:#bbbbbb;margin-left:2px;">${created}</p>
                                <div dir="auto" style="color:#2b2e2f;font-family:'Lucida Sans Unicode','Lucida Grande','Tahoma',Verdana,sans-serif;font-size:14px;line-height:22px;margin:15px 0">
                                <p style="color:#2b2e2f;font-family:'Lucida Sans Unicode','Lucida Grande','Tahoma',Verdana,sans-serif;font-size:14px;line-height:22px;margin:15px 0" dir="auto">${body}</p>
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

		let headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });

		const endpoint = 'https://us-central1-odisdkp.cloudfunctions.net/httpEmail';

		return this._http.post(endpoint, msg, {headers: headers})
			.map( (resp: any) => {
				return resp;
			}).catch( err => {
				return err ;
			});		
	}


}

