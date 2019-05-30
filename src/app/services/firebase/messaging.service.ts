import { Injectable }          from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth }     from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';


import * as firebase from 'firebase/app'; 
import '@firebase/messaging';

import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'


@Injectable()
export class MessagingService {

  
  messaging = firebase.messaging()
  currentMessage = new BehaviorSubject(null)

  constructor(
    private afs: AngularFirestore, 
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase, 
    ) {
   }


  updateTokenDatabase(token) {
    this.afAuth.authState.take(1).subscribe(user => {
      if (!user) return;
      console.log(user.uid);
      const data = { [user.uid]: token }
      //console.log(data);
      this.db.object('fcmTokens/').update(data)
    })
  }

  updateToken(token) {
    this.afAuth.authState.take(1).subscribe(user => {
      if (!user) return;
      //console.log(user.uid);
      //console.log(data);
      this.afs.collection('users').doc(user.uid)
      .get()
      .subscribe((data) => 
      { if(data) {
        //console.log(data.data());
        this.afs.collection('users')
        .doc(user.uid)
        .update({fcmTokens: token})
        .then(() => {
          console.log('done token user update');
        })
        .catch(function(error) {
          console.error('Error writing document: ', error);
        });
      }
      }
    );
      //this.db.object('fcmTokens/').update(data)
    })
  }


  getPermission() {
      this.messaging.requestPermission()
      .then(() => {
        console.log('Have permission');
        return this.messaging.getToken()
      })
      .then(token => {
        //console.log(token)
        this.updateToken(token)
      })
      .catch((err) => {
        console.log('Unable to get permission to notify.', err);
      });
    }

    
  receiveMessage() {
       this.messaging.onMessage((payload) => {
        //console.log("Message received. ", payload);
        this.currentMessage.next(payload)
      });
  }


}