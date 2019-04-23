import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<firebase.User>;


  constructor(
    private firebaseAuth: AngularFireAuth
  ) { 
    this.user = firebaseAuth.authState;
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


  login(email: string, password: string) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
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
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
        } else {
        }
      });

    })
    .catch(err => {
        console.log('Something went wrong:',err.message);
    });

  }


  logout() {
    this.firebaseAuth
      .auth
      .signOut();
  }
}
