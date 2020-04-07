
//importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
//importScripts('https://www.gstatic.com/firebasejs/7.2.0/firebase-app.js');
//importScripts('https://www.gstatic.com/firebasejs/6.4.0/firebase-app.js');


//importScripts('https://www.gstatic.com/firebasejs/6.4.0/firebase-app.js');
//importScripts('https://www.gstatic.com/firebasejs/6.4.0/firebase-performance.js');

importScripts('https://www.gstatic.com/firebasejs/7.13.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.8.2/firebase-analytics.js');
importScripts('https://www.gstatic.com/firebasejs/4.6.1/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/7.13.2/firebase-performance.js');
// importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');
// importScripts('https://www.gstatic.com/firebasejs/7.2.3/firebase-analytics.js');





var firebaseConfig = {           
  //apiKey: "AIzaSyAPQLUrBXk-5ld5NlCf_s0lmP3yIS1RtjM",
  apiKey: "AIzaSyBPUJBehQOjnzd9S3iVkHk8drGUR-AXDKk",
  authDomain: "odisdkp.firebaseapp.com",
  databaseURL: "https://odisdkp.firebaseio.com",
  projectId: "odisdkp",
  storageBucket: "odisdkp.appspot.com",
  messagingSenderId: "625413964133",
  appId: "1:625413964133:web:6d4c9582f63466ce2da18c",
  measurementId: "G-2DDCSXRNXD"
};



firebase.initializeApp(firebaseConfig);
firebase.analytics();
const messaging = firebase.messaging();
// Initialize Performance Monitoring and get a reference to the service
const perf = firebase.performance();
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