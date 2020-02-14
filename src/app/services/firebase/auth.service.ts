import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirePerformance } from '@angular/fire/performance';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import { User } from 'src/app/models/types';
import { FormControl } from '@angular/forms';

// MOMENT
import * as _moment from 'moment';
const moment = _moment;


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: any = null;
  created: FormControl;
  user: Observable<firebase.User>;


  constructor(
    private afp: AngularFirePerformance,
    private afs: AngularFirestore,
    private db: AngularFireDatabase,
    private firebaseAuth: AngularFireAuth,
  ) {
    this.created =  new FormControl(moment().format('YYYY[-]MM[-]DD HH:mm:ss'));
    this.user = firebaseAuth.authState;


    // firebase.auth().signOut();

    /*
    this.firebaseAuth.authState.subscribe((auth) => {
      if(!auth){
        console.log('no login');
      }
      this.authState = auth;
    });*/
  }


  signup(email: string, password: string) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }


  emailLogin(token: string, email: string, password: string) {
    if (!token) {
      return;
    }
    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
        this.updateUserData();
      })
      .catch(error => console.log(error));
  }


  async login(token: string, email: string, password: string) {

    if (!token) {
      return;
    }

    const trace = this.afp.trace$('LoginFiresabe').subscribe();

    try {

      return new Promise<any>((resolve, reject) => {
        this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
        .then(user => {
          this.authState = user;
          // console.log(this.authState.user.uid);
          const key = 'uid';
          this.saveStorage(key, this.authState.user.uid);
          this.afp.trace('LoginFiresabe Init', { metrics: { something: 1 }, attributes: { app: 'odisdkp', user: this.authState.user.uid }, incrementMetric$: { }, });
          trace.unsubscribe();
          // this.updateUserData()
          // trace.putAttribute('verified', `${this.authState.user.uid}`);
          // trace.stop();
          resolve(user);
        }, err => reject(err));
      });
    } catch (err) {
      // trace.putAttribute('errorCode', err.code);
      // trace.stop();
    }

    /*
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
      */
  }


  addUser(identity: any) {

    const userFirebase = {
      uid: this.authState.user.uid,
      name: identity.name,
      email: this.authState.user.email,
      role: identity.role,
      surname: identity.surname,
      timezone: identity.timezone,
      create_at: this.created.value,
      country: identity.country
    };


    return new Promise<any>((resolve, reject) => {
      this.afs.collection('users').doc(this.authState.user.uid).set(userFirebase)
      .then(res => {
        resolve(res);
      }, err => reject(err));
    });

  }


  doRegister(value: User, identity: any) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
       // console.log(resp);
        const userFirebase = {
          uid: res.user.uid,
          name: identity.name,
          email: res.user.email,
          role: identity.role,
          surname: identity.surname,
          timezone: identity.timezone
        };

        this.afs.doc(`users/${ userFirebase.uid }`)
        .set( userFirebase )
        .then( () => {  });

        resolve(res);
      }, err => reject(err));
    });
  }


  doUpdate(identity: any) {
    const path = `users/${this.authState.user.uid}`; // Endpoint on firebase
    const userFirebase = {
      uid: this.authState.user.uid,
      name: identity.name,
      email: this.authState.user.email,
      role: identity.role,
      surname: identity.surname,
      timezone: identity.timezone,
      update_at: this.created.value,
      country: identity.country
    };


    const userDocument = this.afs.collection('users').doc(this.authState.user.uid);

    return new Promise<any>((resolve, reject) => {

          userDocument.ref.get()
          .then(doc => {
                if (doc.exists) {
                  this.afs.doc(path).update(userFirebase)
                  .then(res => {
                    resolve(res);
                  }, err => reject(err));
                } else {
                  this.addUser(identity);
                }
              })
          .catch(error => {
            switch (error.code) {
              case 'invalid-argument': {
                  this.addUser(identity);
                  return console.log('usuario registrado en Firebase');
              }
              default: {
                  return console.log('Error: Getting document:');
              }
            }

          });

    });

  }




  updateUser(value: User) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(value.email)
      .then(res => {
        resolve(res);
      }, err => reject(err));
    });

    // return firebase.auth().sendPasswordResetEmail(value.email);
    /*
    var auth = firebase.auth().currentUser.updatePassword(value.password)
    .then(function(res) {
      console.log(res);
      // Update successful.
    }).catch(function(error) {
      console.log(error);
      // An error happened.
    });
  */

    /*
    const user = firebase.auth().currentUser;
    const credentials = firebase.auth.EmailAuthProvider.credential(value.email, value.password);
    user.reauthenticateWithCredential(credentials)
    .then(() => console.log('reauth ok'));*/

    /*
    const currentUser = firebase.auth().currentUser;
    const credentials = firebase.auth.EmailAuthProvider.credential(value.email, value.password);

    currentUser.reauthenticateWithCredential(credentials).then(function () {
      currentUser.updateEmail(value.email).then(function () {
        currentUser.sendEmailVerification().then(function (res) {
          // Email Sent
          console.log(res);
        }).catch(function (error) {
          // An error happened.
          console.log(error);
        });

      }).catch(function (error) {
        console.log(error);

      });
    });*/


    /*
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, 'password');
    user.reauthenticateWithCredential(credentials)
    .then(() => console.log('reauth ok'));*/

    /*
    return new Promise<any>((resolve, reject) => {
      user.updatePassword(value.password)
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })*/

    /*
    user.updatePassword(value.password).then(function(res) {
      console.log(res);
      // Update successful.
    }).catch(function(error) {
      console.log(error);
      // An error happened.
    });*/
  }



  loginByEmail(token: string, email: string, password: string) {
    if (!token) {
      return;
    }
    const credential = firebase.auth.EmailAuthProvider.credential(email, password);
    firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credential).then(function(usercred) {
      const user = usercred.user;
      console.log('Anonymous account successfully upgraded', user);
    }, function(error) {
      console.log('Error upgrading anonymous account', error);
    });
  }

  logintoken(token: string) {
    if (!token) {
      return;
    }

    this.firebaseAuth.auth.signInAnonymously()
    .then(_value => {
      console.log('Nice, it worked!');
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log(user);
          // var isAnonymous = user.isAnonymous;
          // var uid = user.uid;
        } else {
          console.log('badddd');
        }
      });

    })
    .catch(err => {
        console.log('Something went wrong:', err.message);
    });

  }


  async logout() {
    await firebase.auth().signOut();

    /*
    this.firebaseAuth
      .auth
      .signOut();*/
  }


  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

 //// Helpers ////
 private updateUserData(): void {
  // Writes user name and email to realtime db
  // useful if your app displays information about users or for admin features
  const path = `users/${this.currentUserId}`; // Endpoint on firebase
  const data = {
    email: this.authState.email,
    name: this.authState.displayName
  };

  this.db.object(path).update(data)
    .catch(error => console.log(error));
  }

  saveStorage( key: any, data: any ) {

    if (key && data) {
      const value = JSON.stringify(data);
      localStorage.setItem(key, value);
    } else {
       return;
    }
  }


}
