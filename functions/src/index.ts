import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
//import * as fcm from './fcm'
//import * as express from 'express';
admin.initializeApp(functions.config().firebase);

const cors = require("cors")({ origin: true });


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

        //const db = admin.firestore();

        return admin.firestore().collection('users').doc(userId).get()
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
            console.log("Sent Successfully", response);
            res.end();
          } else {
            res.end();
          }
        })
        .catch((err:any) => {
          console.log(err);
        });
  });
});


exports.helloWorld = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
      res.send("Hello from a Severless Database!")
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
