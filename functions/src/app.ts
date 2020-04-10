import * as functions from 'firebase-functions';
const express = require('express');
// const cors = require('cors')({ origin: true, credentials: true });

// APP Express
const app = express();

// Importar Routes
const appRoutes = require('./routes/index');

// Cors
// app.use(cors);

// Routes
app.use('/', appRoutes);

// Function TimeStamp
export const dkp = functions.https.onRequest(app);
