importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');


var config = {
  apiKey: "AIzaSyAPQLUrBXk-5ld5NlCf_s0lmP3yIS1RtjM",
  authDomain: "odisdkp.firebaseapp.com",
  databaseURL: "https://odisdkp.firebaseio.com",
  projectId: "odisdkp",
  storageBucket: "odisdkp.appspot.com",
  messagingSenderId: "625413964133"
};

firebase.initializeApp(config);
const messaging = firebase.messaging();


//messaging.usePublicVapidKey('BGY9x2m1S1YQLp41ZCiUWhv2IQX6VfNRrLNK_r3VNnN4gVINdsxIGIJpcq_jo5gpbINyeNxXh2YCwGZ1jJl4c70');
//messaging.usePublicVapidKey("BGY9x2m1S1YQLp41ZCiUWhv2IQX6VfNRrLNK_r3VNnN4gVINdsxIGIJpcq_jo5gpbINyeNxXh2YCwGZ1jJl4c70")
/*
messaging.setBackgroundMessageHandler(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  var notificationTitle = 'Background Message Title';
  var notificationOptions = {
    body: 'Background Message body.'

  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});*/