// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  firebase: {
 	  apiKey: "AIzaSyAPQLUrBXk-5ld5NlCf_s0lmP3yIS1RtjM",
    authDomain: "odisdkp.firebaseapp.com",
    databaseURL: "https://odisdkp.firebaseio.com",
    projectId: "odisdkp",
    storageBucket: "odisdkp.appspot.com",
    messagingSenderId: "625413964133"
  },
  global:{
    url : 'https://odis.api.ocachile.cl/api/v1.0/',
    agmapikey: 'AIzaSyBPUJBehQOjnzd9S3iVkHk8drGUR-AXDKk',
    version: '267e00',
    urlcdf: `https://us-central1-odisdkp.cloudfunctions.net/`,
    cdfkey: `key=AAAAkZ2TwWU:APA91bF2QumX_EAF8t_n5nNMWLRxSaOyCmcW0sKKPEF7tk2KAwQ35_Bv8IBCn2SIl_wHbq8sf8uUNutSxaFbAXnMjplb6nCqtW41eSnqYJgfHtQszi5K2k0VzWoN6R_gQ3Cs1SalV_i5`  
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
