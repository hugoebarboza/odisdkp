import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

import * as firebase from 'firebase/app';
import '@firebase/messaging';

import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class MessagingService {


  messaging = firebase.messaging();
  currentMessage = new BehaviorSubject(null);

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    ) {
   }
   /*
   init(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        navigator.serviceWorker.ready.then((registration) => {
            // Don't crash an error if messaging not supported
            if (!firebase.messaging.isSupported()) {
                  console.log('paso');
                   resolve();
                   return;
            }

            const messaging = firebase.messaging();
            console.log('paso1111');
            // Register the Service Worker
            messaging.useServiceWorker(registration);
            console.log('paso2222');
            // Initialize your VAPI key
            messaging.usePublicVapidKey(
                  environment.firebase.apiKey
            );

            // Optional and not covered in the article
            // Listen to messages when your app is in the foreground
            messaging.onMessage((payload) => {
                console.log(payload);
            });
            // Optional and not covered in the article
            // Handle token refresh
            messaging.onTokenRefresh(() => {
                messaging.getToken().then(
                (refreshedToken: string) => {
                    console.log(refreshedToken);
                }).catch((err) => {
                    console.error(err);
                });
            });
            console.log('paso3333');
            resolve();
        }, (err) => {
            reject(err);
        });
    });
  }*/




  updateTokenDatabase(token) {
    this.afAuth.authState.take(1).subscribe(user => {
      if (!user) { return; }
      const data = { [user.uid]: token };
      this.db.object('fcmTokens/').update(data);
    });
  }

  updateToken(token: string) {
    this.afAuth.authState.take(1).subscribe(user => {
      if (!user) { return; }
      this.afs.collection('users').doc(user.uid)
      .get()
      .subscribe((data) => {
        if (data) {
        this.afs.collection('users')
        .doc(user.uid)
        .update({fcmTokens: token})
        .then(() => {
        })
        .catch(function(error) {
          console.error('Error writing document: ', error);
        });
      }
      }
    );
      // this.db.object('fcmTokens/').update(data)
    });
  }


 async getPermission() {
  await this.messaging.requestPermission()
      .then(() => {
        // console.log('Have permission');
        return this.messaging.getToken()
         .then(
          (refreshedToken: string) => {
              // console.log(refreshedToken);
              this.updateToken(refreshedToken);
          }).catch((err) => {
              console.error(err);
          });
        // return this.messaging.getToken();
      })
      .then(_token => {
        // console.log(token);
        // this.updateToken(token);
      })
      .catch((err) => {
        console.log('Unable to get permission to notify.', err);
      });
  }

  receiveMessage() {
       this.messaging.onMessage((payload) => {
        // console.log('Message received. ', payload);
        this.currentMessage.next(payload);
      });
  }


}
