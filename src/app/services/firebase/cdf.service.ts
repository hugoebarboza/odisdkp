import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AngularFirestore } from '@angular/fire/firestore';
// import { AngularFirestore } from 'angularfire2/firestore';
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
    public url: string;
    noreply = 'noreply@ocaglobal.com';


  constructor(
    private _http: Http,
    private afs: AngularFirestore,
  ) {
        this.url = environment.global.urlcdf;
        this.key = environment.global.cdfkey;
        this.headers = undefined;
  }


  addNotification(token= null, params: any) {
  if (!token) {
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
    }, err => reject(err));
    });
  }


  fcmsend(token= null, params: any): Observable<any> {
    if (!token) {
            return;
    }

    // console.log(params);

    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });

    return this._http.post(this.url + 'fcmSend', params, {headers: headers})
        .map( (resp: any) => {
          // console.log(resp);
        return resp;
        }).catch( err => {
          console.log(err);
        return Observable.throw( err );
    });
  }



  httpEmail(token= null, params: any): Observable<any> {
    if (!token) {
            return;
    }

    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });

    const endpoint = 'https://us-central1-odisdkp.cloudfunctions.net/httpEmail';

    return this._http.post(endpoint, params, {headers: headers})
      .map( (resp: any) => {
      return resp;
      }).catch( err => {
      return err ;
      });
  }


  httpEmailToSupport(token= null, toEmail: string, fromTo: string, subject: string, created: any, body: string): Observable<any> {
    if (!token) {
            return;
    }


    const msg: CdfMessage = {
            toEmail: toEmail,
            fromTo: this.noreply,
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


    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });

    const endpoint = 'https://us-central1-odisdkp.cloudfunctions.net/httpEmail';

    return this._http.post(endpoint, msg, {headers: headers})
      .map( (resp: any) => {
      return resp;
      }).catch( err => {
      return err ;
      });
    }



  httpEmailFromOrigin(token= null, toEmail: string, fromTo: string, subject: string, created: any, body: string): Observable<any> {
    if (!token) {
            return;
    }


    const msg: CdfMessage = {
            toEmail: toEmail,
            fromTo: this.noreply,
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

    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });

    const endpoint = 'https://us-central1-odisdkp.cloudfunctions.net/httpEmail';

    return this._http.post(endpoint, msg, {headers: headers})
        .map( (resp: any) => {
        return resp;
      }).catch( err => {
        return err ;
      });
  }



  httpEmailCommentToSupport(token= null, toEmail: string, fromTo: string, subject: string, created: any, body: string): Observable<any> {
    if (!token) {
            return;
    }


    const msg: CdfMessage = {
            toEmail: toEmail,
            fromTo: this.noreply,
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


    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });

    const endpoint = 'https://us-central1-odisdkp.cloudfunctions.net/httpEmail';

    return this._http.post(endpoint, msg, {headers: headers})
        .map( (resp: any) => {
        return resp;
      }).catch( err => {
        return err ;
      });
  }



  httpEmailCommentFromOrigin(token= null, toEmail: string, fromTo: string, subject: string, created: any, createdcomment: any, body: string, bodycomment: string): Observable<any> {
    if (!token) {
            return;
    }

    const msg = {
            toEmail: toEmail,
            fromTo: this.noreply,
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

    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });

    const endpoint = 'https://us-central1-odisdkp.cloudfunctions.net/httpEmail';

    return this._http.post(endpoint, msg, {headers: headers})
        .map( (resp: any) => {
         return resp;
      }).catch( err => {
         return err ;
      });
  }





  httpEmailAddService(token= null, toEmail: string, fromTo: string, subject: string, created: any, body: string, project: { numot: any, description: string, lastInsertedId: number }): Observable<any> {
    if (!token) {
            return;
    }


    const msg: CdfMessage = {
            toEmail: toEmail,
            fromTo: this.noreply,
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

    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });

    const endpoint = 'https://us-central1-odisdkp.cloudfunctions.net/httpEmail';

    return this._http.post(endpoint, msg, {headers: headers})
          .map( (resp: any) => {
          return resp;
          }).catch( err => {
          return err ;
          });
          }


  httpEmailEditService(token= null, toEmail: string, fromTo: string, subject: string, created: any, body: string, project: { numot: any, description: string, lastInsertedId: number }): Observable<any> {
    if (!token) {
            return;
    }

    const msg: CdfMessage = {
            toEmail: toEmail,
            fromTo: this.noreply,
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

    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });

    const endpoint = 'https://us-central1-odisdkp.cloudfunctions.net/httpEmail';

    return this._http.post(endpoint, msg, {headers: headers})
      .map( (resp: any) => {
        return resp;
      }).catch( err => {
        return err ;
      });
  }



  httpEmailAddComment(token= null, toEmail: string, fromTo: string, subject: string, created: any, body: string, project: { address: string, company: string, comentario: string, name: string, observacion: string, description: string, order_number: string, service_name: string, service_type_name: string, id: number, orderid: number, pila: any, file: any, image: any }): Observable<any> {
    if (!token) {
            return;
    }

    let pila = '';
    let image = '';


    if (project.pila && project.pila.length > 0) {
      const value = project.pila;
      for (let i = 0; i < value.length; i++) {
        pila = pila + '<li>' + value[i].name + ': ' + value[i].description + '</li>';
      }
    }


    if (project.image && project.image.id > 0 && project.id > 0 && project.orderid > 0) {
      image =  `<div style="margin-top:25px">
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
            <p style="font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif;font-size:13px;line-height:25px;margin-bottom:15px;margin-top:0;padding:0;color:#bbbbbb;margin-left:2px;">Imágenes adjunta</p>
            <div>
            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border:none;border-collapse:collapse;border-spacing:0;table-layout:fixed;width:100%">
            <tbody>
                <tr>
                  <td style="direction:ltr;text-align:left">
                  <div  lang="x-btn" style="font-family:'Uber18-Text-Bold',Helvetica,Arial,sans-serif!important;font-size:14px;line-height:20px;text-transform:uppercase">
                    <a href="https://odisdkp.firebaseapp.com/#/formview/orderview/${project.id}/${project.orderid}" style="background-color:#276ef1;border-color:#276ef1;border-radius:0px;border-style:solid;border-width:13px 16px;color:#ffffff;display:inline-block;letter-spacing:1px;max-width:300px;min-width:100px;text-align:center;text-decoration:none;text-transform:uppercase" target="_blank" >
                      <span style="float:left;text-align:left">Ver imágenes</span>
                      <span style="padding-top:2px;display:inline-block">
                      <img src="https://ci3.googleusercontent.com/proxy/axtMpR0rilnyjOmpHXDbY1OX1so5KIx1c7N4ECE3jBlwH30xUmvhGOGKbU87XdBRIGH3Z15F6rihfEg9xh84z0jtpziZ3_bNXW1G25P7eB2cgmNXQDw5chmkBgxC=s0-d-e1-ft#https://s3.amazonaws.com/uber-static/emails/2017/01/uber18_arrow_right.png" width="11" height="12" style="Margin-left:10px;border:none;clear:both;display:block;margin-top:2px;max-width:100%;outline:none;text-decoration:none" >
                    </span>
                    </a>
                  </div>
                  </td>
                </tr>
            </tbody>
            </table>
            </div>
            </td>
            </tr>
            </tbody>
            </table>
            </td>
          </tr>
        </tbody>
      </table>
      </div> `;
    }

    /*
    let image = '<table width="100%" border="1">';
    if(project.image && project.image.length > 0){
      let valueimage = project.image;
      console.log(project.image.length);
      for(let i=0; i<valueimage.length; i++){
        image = image + ' <tr>';
        let dataimage = valueimage[i];
        console.log(dataimage);
        console.log(dataimage.length);
        for(let j=0; j<dataimage.length; j++){
          if(dataimage[j] && dataimage[j].archivo){
            image = image + '<td width="50%">';
            image = image + '<img src="data:image/png;base64,'+v+'" width="27" height="27" alt="Red dot" class="CToWUd">';
            image = image + '</td>';
          }
        }
        image = image + ' </tr>';
      }
    }
    image = image + '</table>';
    console.log(image);*/



    const msg: CdfMessage = {
            toEmail: toEmail,
            fromTo: this.noreply,
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
                          ${pila}
                          <li><b>Actividad Realizada:</b> ${project.comentario}</li>
                          <li>Observaciones: ${project.observacion}</li>
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
                        ${image}
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

    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });

    const endpoint = 'https://us-central1-odisdkp.cloudfunctions.net/httpEmail';

    return this._http.post(endpoint, msg, {headers: headers})
      .map( (resp: any) => {
       return resp;
      }).catch( err => {
       return err ;
      });
  }


  httpEmailAddCommentFile(token= null, toEmail: string, fromTo: string, subject: string, created: any, body: string, project: { address: string, company: string, comentario: string, name: string, observacion: string, description: string, order_number: string, service_name: string, service_type_name: string, id: number, orderid: number, pila: any, file: any, image: any }): Observable<any> {
    if (!token) {
            return;
    }

    let pila = '';
    let file = '';
    let image = '';

    if (project.image && project.image.id > 0 && project.id > 0 && project.orderid > 0) {
      image =  `<div style="margin-top:25px">
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
            <p style="font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif;font-size:13px;line-height:25px;margin-bottom:15px;margin-top:0;padding:0;color:#bbbbbb;margin-left:2px;">Imágenes adjunta</p>
            <div>
            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border:none;border-collapse:collapse;border-spacing:0;table-layout:fixed;width:100%">
            <tbody>
                <tr>
                  <td style="direction:ltr;text-align:left">
                  <div  lang="x-btn" style="font-family:'Uber18-Text-Bold',Helvetica,Arial,sans-serif!important;font-size:14px;line-height:20px;text-transform:uppercase">
                    <a href="https://odisdkp.firebaseapp.com/#/formview/orderview/${project.id}/${project.orderid}" style="background-color:#276ef1;border-color:#276ef1;border-radius:0px;border-style:solid;border-width:13px 16px;color:#ffffff;display:inline-block;letter-spacing:1px;max-width:300px;min-width:100px;text-align:center;text-decoration:none;text-transform:uppercase" target="_blank" >
                      <span style="float:left;text-align:left">Ver imágenes</span>
                      <span style="padding-top:2px;display:inline-block">
                      <img src="https://ci3.googleusercontent.com/proxy/axtMpR0rilnyjOmpHXDbY1OX1so5KIx1c7N4ECE3jBlwH30xUmvhGOGKbU87XdBRIGH3Z15F6rihfEg9xh84z0jtpziZ3_bNXW1G25P7eB2cgmNXQDw5chmkBgxC=s0-d-e1-ft#https://s3.amazonaws.com/uber-static/emails/2017/01/uber18_arrow_right.png" width="11" height="12" style="Margin-left:10px;border:none;clear:both;display:block;margin-top:2px;max-width:100%;outline:none;text-decoration:none" >
                    </span>
                    </a>
                  </div>
                  </td>
                </tr>
            </tbody>
            </table>
            </div>
            </td>
            </tr>
            </tbody>
            </table>
            </td>
          </tr>
        </tbody>
      </table>
      </div> `;
    }

    if (project.pila && project.pila.length > 0) {
      const value = project.pila;
      for (let i = 0; i < value.length; i++) {
        pila = pila + '<li>' + value[i].name + ': ' + value[i].description + '</li>';
      }
    }

    if (project.file && project.file.length > 0) {
      const valuefile = project.file;
      file =  `<div style="box-sizing:border-box;width:100%;margin-bottom:30px;background:#ffffff;border:1px solid #f0f0f0">
      <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%">
        <tbody>
          <tr>
            <td  style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding:30px" valign="top">
            <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%">
              <tbody>
                <tr>
                  <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top">
                  <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#294661!important">Archivos</h2>
                  </td>
                </tr>
                <tr>
                  <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top">
                  <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%">
                    <tbody>
                      <tr>
                        <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;width:80%;border-bottom:1px solid #f0f0f0" valign="top" width="25%">&nbsp;</td>
                        <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;width:20%;border-bottom:1px solid #f0f0f0" valign="top" width="25%">
                        <p style="margin:0;color:#294661;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;margin-bottom:10px;margin-top:10px;font-size:12px;text-transform:uppercase">Descarga</p>
                        </td>
                      </tr>`;

      for (let i = 0; i < valuefile.length; i++) {
        file = file +  `<tr><td style="box-sizing:border-box;padding:0;font-family:Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;width:25%;border-bottom:1px solid #f0f0f0" valign="top" width="80%"><p style="margin:0;color:#294661;font-family:Helvetica,Arial,sans-serif;font-weight:300;margin-bottom:10px;font-size:14px;margin-top:10px"><strong>`;
        file = file + valuefile[i].nombreArchivo;
        file = file +  `</strong></p></td><td style="box-sizing:border-box;padding:0;font-family:Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;width:25%;border-bottom:1px solid #f0f0f0" valign="top" width="20%"><p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-weight:300;margin-bottom:10px;font-size:14px;margin-top:10px;color:#4cb04f">`;
        file = file + '<a title="' + valuefile[i].nombreArchivo + '" href="' + valuefile[i].url + '" target="_blank"><img src="https://odisdkp.firebaseapp.com/assets/icons/file-icon-448x300.png" width="37" height="37" border="0" style="border:none;clear:both;display:inline-block;height:27px;max-width:100%;outline:none;text-decoration:none;width:27px;margin-left: 17px;margin-top: 7px;"></a>';
        file = file +  `</p></td></tr>`;
        // file = file + '<div ><a title="'+valuefile[i].nombreArchivo+'" href="'+valuefile[i].url+'" target="_blank"><img src="https://odisdkp.firebaseapp.com/assets/icons/file-icon-448x300.png" width="37" height="37" border="0" style="border:none;clear:both;display:inline-block;height:27px;max-width:100%;outline:none;text-decoration:none;width:27px;margin-left: 17px;margin-top: 7px;"></a></div>';
      }

      file = file + `</tbody></table></td></tr></tbody></table></td></tr></tbody></table></div>`;


      const msg: CdfMessage = {
        toEmail: toEmail,
        fromTo: this.noreply,
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
                      ${pila}
                      <li><b>Actividad Realizada:</b> ${project.comentario}</li>
                      <li>Observaciones: ${project.observacion}</li>
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
                            <p style="font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif;font-size:13px;line-height:25px;margin-bottom:15px;margin-top:0;padding:0;color:#bbbbbb;margin-left:2px;">Documento(s) adjunto(s)</p>
                            <div style="display: flex;margin-left: 0px;margin-right: 0px;">
                            ${file}
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
                    ${image}
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

      const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });

      const endpoint = 'https://us-central1-odisdkp.cloudfunctions.net/httpEmail';

      return this._http.post(endpoint, msg, {headers: headers})
        .map( (resp: any) => {
          return resp;
        }).catch( err => {
          return err ;
        });
    }

  }


   httpEmailShareOrder(token= null, toEmail: string, fromTo: string, subject: string, created: any, body: string, project: { address: string, company: string, comentario: string, name: string, observacion: string, description: string, order_number: string, service_name: string, service_type_name: string, id: number, orderid: number, pila: any, file: any, image: any }): Observable<any> {
   if (!token) {
            return;
    }

    let image = '';

    if (project.image && project.image.id > 0 && project.id > 0 && project.orderid > 0) {
      image =  `<div style="margin-top:25px">
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
            <p style="font-family:'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Verdana,Tahoma,sans-serif;font-size:13px;line-height:25px;margin-bottom:15px;margin-top:0;padding:0;color:#bbbbbb;margin-left:2px;">Imágenes adjunta</p>
            <div>
            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border:none;border-collapse:collapse;border-spacing:0;table-layout:fixed;width:100%">
            <tbody>
                <tr>
                  <td style="direction:ltr;text-align:left">
                  <div  lang="x-btn" style="font-family:'Uber18-Text-Bold',Helvetica,Arial,sans-serif!important;font-size:14px;line-height:20px;text-transform:uppercase">
                    <a href="https://odisdkp.firebaseapp.com/#/formview/orderview/${project.id}/${project.orderid}" style="background-color:#276ef1;border-color:#276ef1;border-radius:0px;border-style:solid;border-width:13px 16px;color:#ffffff;display:inline-block;letter-spacing:1px;max-width:300px;min-width:100px;text-align:center;text-decoration:none;text-transform:uppercase" target="_blank" >
                      <span style="float:left;text-align:left">Ver imágenes</span>
                      <span style="padding-top:2px;display:inline-block">
                      <img src="https://ci3.googleusercontent.com/proxy/axtMpR0rilnyjOmpHXDbY1OX1so5KIx1c7N4ECE3jBlwH30xUmvhGOGKbU87XdBRIGH3Z15F6rihfEg9xh84z0jtpziZ3_bNXW1G25P7eB2cgmNXQDw5chmkBgxC=s0-d-e1-ft#https://s3.amazonaws.com/uber-static/emails/2017/01/uber18_arrow_right.png" width="11" height="12" style="Margin-left:10px;border:none;clear:both;display:block;margin-top:2px;max-width:100%;outline:none;text-decoration:none" >
                    </span>
                    </a>
                  </div>
                  </td>
                </tr>
            </tbody>
            </table>
            </div>
            </td>
            </tr>
            </tbody>
            </table>
            </td>
          </tr>
        </tbody>
      </table>
      </div> `;
    }




      const msg: CdfMessage = {
        toEmail: toEmail,
        fromTo: this.noreply,
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
                    <p>Junto con saludar, se detalla información actualizada de la Orden de Trabajo en asunto.</p>
                    <p><b>DATOS DEL PROYECTO</b></p>
                    <ul>
                      <li>Nombre: ${project.service_name}</li>
                      <li>Num. OT: ${project.order_number}</li>
                      <li>Tipo de Servicio: ${project.service_type_name}</li>
                      <li>${project.comentario}</li>
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

                            <div>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border:none;border-collapse:collapse;border-spacing:0;table-layout:fixed;width:100%">
                            <tbody>
                                <tr>
                                  <td style="direction:ltr;text-align:left">
                                  <div  lang="x-btn" style="font-family:'Uber18-Text-Bold',Helvetica,Arial,sans-serif!important;font-size:14px;line-height:20px;text-transform:uppercase">
                                    <a href="https://odisdkp.firebaseapp.com/#/formview/orderview/${project.id}/${project.orderid}" style="background-color:#276ef1;border-color:#276ef1;border-radius:0px;border-style:solid;border-width:13px 16px;color:#ffffff;display:inline-block;letter-spacing:1px;max-width:300px;min-width:100px;text-align:center;text-decoration:none;text-transform:uppercase" target="_blank" >
                                      <span style="float:left;text-align:left">Ver detalles</span>
                                      <span style="padding-top:2px;display:inline-block">
                                      <img src="https://ci3.googleusercontent.com/proxy/axtMpR0rilnyjOmpHXDbY1OX1so5KIx1c7N4ECE3jBlwH30xUmvhGOGKbU87XdBRIGH3Z15F6rihfEg9xh84z0jtpziZ3_bNXW1G25P7eB2cgmNXQDw5chmkBgxC=s0-d-e1-ft#https://s3.amazonaws.com/uber-static/emails/2017/01/uber18_arrow_right.png" width="11" height="12" style="Margin-left:10px;border:none;clear:both;display:block;margin-top:2px;max-width:100%;outline:none;text-decoration:none" >
                                    </span>
                                    </a>
                                  </div>
                                  </td>
                                </tr>
                            </tbody>
                            </table>
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
                    ${image}
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

      const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });

      const endpoint = 'https://us-central1-odisdkp.cloudfunctions.net/httpEmail';

      return this._http.post(endpoint, msg, {headers: headers})
        .map( (resp: any) => {
          return resp;
        }).catch( err => {
          return err ;
        });
  }

  httpEmailNotification(token= null, data: any): Observable<any> {
    if (!token) {
      return;
    }

    const msg = {
            toEmail: data.toEmail,
            fromTo: this.noreply,
            subject: data.subject,
            message: `
            <!DOCTYPE html>
            <html>
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
                                                  <p>Junto con saludar, se informa que tiene una nueva notificación, generada por ${data.fromTo}.</p>
                                                  <p><b>DESCRIPCIÓN DE LA NOTIFICACIÓN</b></p>
                                                  <p>${data.body}</p>
                                                  <p><b>DATOS DEL PROYECTO</b></p>
                                                  <ul>
                                                    <li>Nombre proyecto: ${data.project}</li>
                                                    <li>Servicio: ${data.service_name}</li>
                                                    <li>Tipo de Servicio: ${data.servicetype_name}</li>
                                                    <li>Num. OT: ${data.order_number}</li>
                                                  </ul>
                                                  <p></p>
                                                  <p></p>
                                                  <p>Para verificar el detalle de la incidencia, siga el enlace aquí:
                                                    <a href="https://odisdkp.firebaseapp.com/#/formview/orderview/${data.service_id}/${data.order_id}" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://support.sendgrid.com/hc/requests/2306369&amp;source=gmail&amp;ust=1561827470902000&amp;usg=AFQjCNHthhPllbak25dNtf46FraBxDF9uQ">odisdkp.firebaseapp.com/#/formview/orderview/${data.service_id}/${data.order_id}</a>.
                                                  </p>
                                                  <p>Saludos cordiales!</p>
                                                  <p></p>
                                                  <div style="margin-top:25px">
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

    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': this.key });

    const endpoint = 'https://us-central1-odisdkp.cloudfunctions.net/httpEmail';

    return this._http.post(endpoint, msg, {headers: headers})
        .map( (resp: any) => {
         return resp;
      }).catch( err => {
         return err ;
      });
  }


}

