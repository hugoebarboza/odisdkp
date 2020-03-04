import * as functions from 'firebase-functions'
const cors = require('cors')({ origin: true, credentials: true });

//SEND GRID API KEY
const SENDGRID_API_KEY = functions.config().sendgrid.key;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

// Function HTTP Email
export const notification = functions.https.onRequest((req: any, res) => {

return cors( req, res, () => {

    if(!req) {
        return;
    }

    const formnotificacion: any = JSON.parse(req.body.formnotificacion);
    const order: any = JSON.parse(req.body.order);
    const project: any = JSON.parse(req.body.project);
    const service: any = JSON.parse(req.body.service);
    const servicetype: any = JSON.parse(req.body.servicetype);

    for( const form of formnotificacion) {
        const users = form.user;
        for( const user of users) {
            if (user) {

                const body = {
                    toEmail: user.email,
                    fromTo: req.body.mail,
                    subject: 'OCA GLOBAL - Nueva notificación - ' + form.main,
                    body: form.body,
                    project: project.project_name,
                    service_name: service.service_name,
                    servicetype_name: servicetype.name,
                    order_number: order.order_number,
                    service_id: order.service_id,
                    order_id: order.order_id    
                }


                const msg = {
                    to: user.email,
                    from: 'noreply@ocaglobal.com',
                    subject: body.subject,
                    html: makehtml(body),
                };
            
                sgMail.send(msg)
                .then()
                .catch((err:any) => res.status(400).send(err) )
            }
        }
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Petición realizada correctamente'
    });



    });

});

function makehtml(data: any) {
    const mensaje = `
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
    `;

    return mensaje;
}
