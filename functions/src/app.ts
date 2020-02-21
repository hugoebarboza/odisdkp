import * as functions from 'firebase-functions'
const express = require('express');
// const cors = require('cors')({ origin: true, credentials: true });

// APP Express
const app = express();

// Importar Routes
const appRoutes = require('./routes/index');

// Routes
app.use('/', appRoutes);


// Function Hi
/*
export const listener = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
      res.send("Router Hello from a New Severless Database!")
  });
});
*/

// Function Hello
/*
export const helloWorld = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
      res.send("Hello from a Old Severless Database!")
  });
});
*/
// Function TimeStamp
export const dkp = functions.https.onRequest(app);


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
