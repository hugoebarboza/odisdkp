import * as functions from 'firebase-functions'
const cors = require("cors")({ origin: true, credentials: true  });


// Function Hello
export const listener = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
      res.send("Router Hello from a New Severless Database!")
  });
});


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
