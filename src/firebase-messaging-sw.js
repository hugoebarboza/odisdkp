
//importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
//importScripts('https://www.gstatic.com/firebasejs/7.2.0/firebase-app.js');
//importScripts('https://www.gstatic.com/firebasejs/6.4.0/firebase-app.js');


importScripts('https://www.gstatic.com/firebasejs/6.4.0/firebase-app.js');
//importScripts('https://www.gstatic.com/firebasejs/6.4.0/firebase-performance.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/7.2.0/firebase-analytics.js');





var firebaseConfig = {           
  apiKey: "AIzaSyAPQLUrBXk-5ld5NlCf_s0lmP3yIS1RtjM",
  authDomain: "odisdkp.firebaseapp.com",
  databaseURL: "https://odisdkp.firebaseio.com",
  projectId: "odisdkp",
  storageBucket: "odisdkp.appspot.com",
  messagingSenderId: "625413964133",
  appId: "1:625413964133:web:6d4c9582f63466ce2da18c",
  measurementId: "G-2DDCSXRNXD"
};



firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
//const perf = firebase.performance();


/*
importScripts('https://www.gstatic.com/firebasejs/7.0.0/firebase-app.js');

importScripts('https://www.gstatic.com/firebasejs/7.0.0/firebase-analytics.js');

var firebaseConfig = {
    apiKey: "AIzaSyAPQLUrBXk-5ld5NlCf_s0lmP3yIS1RtjM",
    authDomain: "odisdkp.firebaseapp.com",
    databaseURL: "https://odisdkp.firebaseio.com",
    projectId: "odisdkp",
    storageBucket: "odisdkp.appspot.com",
    messagingSenderId: "625413964133",
    appId: "1:625413964133:web:6d4c9582f63466ce2da18c",
    measurementId: "G-2DDCSXRNXD"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const messaging = firebase.messaging();
*/