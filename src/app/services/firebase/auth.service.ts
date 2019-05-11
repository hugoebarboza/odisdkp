import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<firebase.User>;
  authState: any = null;

  constructor(
    
    private firebaseAuth: AngularFireAuth
  ) { 
    this.user = firebaseAuth.authState;

    this.firebaseAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });
  }




  signup(email: string, password: string) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });    
  }


  login(token:string, email: string, password: string) {
    if(!token){
      return;
    }
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })


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


  doRegister(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }


  updateUser(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(value.email)
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
    
    //return firebase.auth().sendPasswordResetEmail(value.email);
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



  loginByEmail(token:string, email: string, password: string) {
    if(!token){
      return;
    }
    var credential = firebase.auth.EmailAuthProvider.credential(email, password);
    firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credential).then(function(usercred) {
      var user = usercred.user;
      console.log("Anonymous account successfully upgraded", user);
    }, function(error) {
      console.log("Error upgrading anonymous account", error);
    });
  }

  logintoken(token:string) {
    if(!token){
      return;
    }

    this.firebaseAuth.auth.signInAnonymously()
    .then(value => {
      
      console.log('Nice, it worked!');
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log(user);
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
        } else {
          console.log('badddd');
        }
      });

    })
    .catch(err => {
        console.log('Something went wrong:',err.message);
    });

  }


  async logout() {
    await firebase.auth().signOut();
    /*
    this.firebaseAuth
      .auth
      .signOut();*/
  }
}
