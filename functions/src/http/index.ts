import * as functions from 'firebase-functions'
const cors = require("cors")({ origin: true });


//SEND GRID API KEY
const SENDGRID_API_KEY = functions.config().sendgrid.key;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);


// Function HTTP Email
export const httpEmail = functions.https.onRequest((req, res) => {
  
  return cors( req, res, () => {

      if(!req || !req.body || !req.body.toEmail) {
        return res.status(401).json({
          message: 'Not allowed'
        })
      }

      //const toName  = req.body.toName;
      const toEmail = req.body.toEmail;
      const fromTo = req.body.fromTo;
      const subject = req.body.subject;
      const message = req.body.message;

      const msg = {
          to: toEmail,
          from: fromTo,
          subject: subject,
          html: message,
      };

      sgMail.send(msg)
          .then(() => res.status(200).send('email sent!') )
          .catch((err:any) => res.status(400).send(err) )

      return res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
      });

      });

});