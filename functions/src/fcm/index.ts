import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const fcmSend = functions.database.ref('/messages/{userId}/{messageId}').onCreate((event: any) => {

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
          .then((res:any) => {
            console.log("Sent Successfully", res);
          })
          .catch((err:any) => {
            console.log(err);
          });
  
  });
  

  