import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp(functions.config().firebase);
const cors = require("cors")({ origin: true });

//SEND GRID API KEY
const SENDGRID_API_KEY = functions.config().sendgrid.key;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);
//sgMail.setApiKey(process.env.SENDGRID_API_KEY);




exports.fcmSend = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'POST') {
      return res.status(401).json({
        message: 'Not allowed'
      })
    }
    const userId  = req.body.userId;
    const userIdTo  = req.body.userIdTo;
    const payload = parseBody(req.body, userId, userIdTo);
    
      return admin.firestore().collection('users').doc(userIdTo).get()
        .then((doc:any) => doc.data() )
        .then((user) => {
          const tokens = user.fcmTokens;
          if (!tokens.length) {
               throw new Error('User does not have any tokens!')
          }
          return admin.messaging().sendToDevice(user.fcmTokens , payload)
        })
        .then((response:any) => {
          if (response) {
              console.log("Sent Successfully FCM", response);

              addNotification(req)
              .then(notificacion => {
                console.log("Save FCM Notification", notificacion);
                }, err => {
                console.log(err);
              });

              addUserNotification(req)
              .then(notificacion => {
                console.log("Save User Notification", notificacion);
                }, err => {
                console.log(err);
              });

              addUserNotificationSend(req)
              .then(notificacion => {
                console.log("Save User NotificationSend", notificacion);
                }, err => {
                console.log(err);
              });
                  
            res.end();
          } else {
            console.log("No Sent", response);
            res.end();
          }
        })
        .catch((err:any) => {
          console.log(err);
        });
  });
});

function parseBody(req:any, userId:any, userIdTo:any) {

  const payload = {
      notification: {
          title: req.title,
          body: req.message,
          create_at: req.create_at,
          create_by: userId,
          status: req.status,
          userIdTo: userIdTo,
          idUx: req.idUx,
          descriptionidUx: req.descriptionidUx,
          route: req.routeidUx
        }
      };
  
  return payload;  
}

function addNotification(data:any) {
  return new Promise<any>((resolve, reject) => {
  
    const userId  = data.body.userId;
    const userIdTo  = data.body.userIdTo;
    const payload = parseBody(data.body, userId, userIdTo);

		admin.firestore().collection('fcmnotification').add(payload.notification)
		.then(function(docRef) {
			console.log('Document FCM written with ID: ', docRef.id);
			resolve(docRef);
		}, err => reject(err))
    });
}


function addUserNotification(data:any) {
  return new Promise<any>((resolve, reject) => {

    const userId  = data.body.userId;
    const userIdTo  = data.body.userIdTo;
    const payload = parseBody(data.body, userId, userIdTo);

    admin.firestore().doc(`/users/${userIdTo}`).collection('notifications').add(payload.notification)
		.then(function(docRef) {
			console.log('Document USER FCM written with ID: ', docRef.id);
			resolve(docRef);
		}, err => reject(err))
    });
}


function addUserNotificationSend(data:any) {
  return new Promise<any>((resolve, reject) => {

    const userId  = data.body.userId;
    const userIdTo  = data.body.userIdTo;
    const payload = parseBody(data.body, userId, userIdTo);

    admin.firestore().doc(`/users/${userId}`).collection('notificationsend').add(payload.notification)
		.then(function(docRef) {
			console.log('Document USER FCM written with ID: ', docRef.id);
			resolve(docRef);
		}, err => reject(err))
    });
}


exports.helloWorld = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
      res.send("Hello from a Severless Database!")
  });
});

exports.httpEmail = functions.https.onRequest((req, res) => {

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


/*
exports.fcmSend = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'POST') {
      return res.status(401).json({
        message: 'Not allowed'
      })
    }
    const userId  = req.body.userId
  
    const payload = {
          notification: {
            title: req.body.title,
            body: req.body.message
          }
        };

    return admin.database()
    .ref(`/fcmTokens/${userId}`)
    .once('value')
    .then((token:any) => token.val() )
    .then((userFcmToken ) => {
      return admin.messaging().sendToDevice(userFcmToken , payload)
    })
    .then((response:any) => {
      if (response) {
        console.log("Sent Successfully", res);  
      } else {
        res.end();
      }
    })
    .catch((err:any) => {
      console.log(err);
    });
  });
});
*/


//exports.fcmSend = fcm.fcmSend

/*
exports.fcmSend = functions.database.ref('/messages/{userId}/{messageId}').onCreate((event: any) => {


  const message = event.after.val()
  const userId  = event.params.userId

  const payload = {
        notification: {
          title: message.title,
          body: message.body,
          icon: "https://placeimg.com/250/250/people"
        }
      };


   admin.database()
        .ref(`/fcmTokens/${userId}`)
        .once('value')
        .then(token => token.val() )
        .then(userFcmToken => {
          return admin.messaging().sendToDevice(userFcmToken, payload)
        })
        .then(res => {
          console.log("Sent Successfully", res);
        })
        .catch(err => {
          console.log(err);
        });

});
*/

/*
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
*/


//const database = admin.database().ref('/messages/');

//import * as cors from './http'
//exports.cors = cors.corsEnabledFunctionAuth

//exports.fcmSend = fcm.fcmSend




/*
exports.fcmSend = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, () => {
    if(req.method !== 'POST') {
      return res.status(401).json({
        message: 'Not allowed'
      })
    }

    const userId  = req.params.userId
  
    const payload = {
          notification: {
            title: req.params.title,
            body: req.params.body,
            icon: "https://placeimg.com/250/250/people"
          }
        };

    return admin.database()
    .ref(`/fcmTokens/${userId}`)
    .once('value')
    .then((token:any) => token.val() )
    .then((userFcmToken:any) => {
      return admin.messaging().sendToDevice(userFcmToken, payload)
    })
    .then((response:any) => {
      console.log("Sent Successfully", response);
    })
    .catch((err:any) => {
      console.log(err);
    });


  });
});
*/



/*
exports.fcmSend = functions.https.onRequest((req, res) => {
    cors(req, res, () => {

     return functions.database.ref('/messages/{userId}/{messageId}').onCreate((event: any) => {
            const message = event.after.val()
            const userId  = event.params.userId
          
            const payload = {
                  notification: {
                    title: message.title,
                    body: message.body,
                    icon: "https://placeimg.com/250/250/people"
                  }
                };
            
             admin.database()
                  .ref(`/fcmTokens/${userId}`)
                  .once('value')
                  .then((token:any) => token.val() )
                  .then((userFcmToken:any) => {
                    return admin.messaging().sendToDevice(userFcmToken, payload)
                  })
                  .then((response:any) => {

                    console.log("Sent Successfully", response);
                  })
                  .catch((err:any) => {
                    console.log(err);
                  });
          
          });


    });
});
*/

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
