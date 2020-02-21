import * as functions from 'firebase-functions'
const cors = require("cors")({ origin: true });


//SEND GRID API KEY
const SENDGRID_API_KEY = functions.config().sendgrid.key;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);


// Function HTTP Email
export const httpEmail = functions.https.onRequest((req, res) => {

  cors( req, res, () => { 

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
          //html: `<strong>Hola ${toName}. Tiene una nueva notificación!!!</strong>`,
          //text: `Hola ${toName}. Tiene una nueva notificación!!! `,
          /* custom templates
          templateId: 'd-3ce0b6c7294849e5bcdffee694bad8b9',
          substitutionWrappers: ['{{', '}}'],
          substitutions: {
            name: toName
            // and other custom properties here
          }*/
      };

      return sgMail.send(msg)
              
          .then(() => res.status(200).send('email sent!') )
          .catch((err:any) => res.status(400).send(err) )

      });

});