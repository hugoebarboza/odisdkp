import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp(functions.config().firebase);

/*
const serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://odisdkp.firebaseio.com"
}); */

const cors = require("cors")({ origin: true });


  // Function FCM Send
  export const fcmSend = functions.https.onRequest((req, res) => {

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

