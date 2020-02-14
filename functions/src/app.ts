import * as functions from 'firebase-functions'
const cors = require("cors")({ origin: true, credentials: true  });
const express = require('express');
const app = express();

app.get('/timestamp', (req: any, res: any) => {
  return cors( req, res, () => {
    res.send(`${Date.now()}`);
  });
  }
)

app.get('/timestampcache', (req: any, res: any) => {
  return cors( req, res, () => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600',)
    res.send(`${Date.now()}`);
  });
  }
)


// Function Hi
export const listener = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
      res.send("Router Hello from a New Severless Database!")
  });
});

// Function Hello
export const helloWorld = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
      res.send("Hello from a Old Severless Database!")
  });
});

// Function TimeStamp
export const timestamp = functions.https.onRequest(app);


// EXPRESS ////////////////////////////////////////////////
/*
const express = require('express');
const app = express;

module.exports = app;


app.get ('/hello', (req: any, res: any) => {
  cors( req, res, () => {
    res.send("Hello from a Severless Database!");
  });
  }
)*/
//////////////////////////////////////////////////////////
