const express = require('express');
const cors = require('cors')({ origin: true, credentials: true });

// APP Express
const app = express();
app.use(auth);

app.get('/timestamp', cors, (req: any, res: any) => {
    res.send(`${Date.now()}`);
  }
);

app.get('/timestampcache', cors, (req: any, res: any) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600',)
    res.send(`${Date.now()}`);
  }
);


app.get('/hi', cors, (req: any, res: any) => {
    res.send("Router Hiiiii from a New CLF Severless Database!")
  }
);

app.get('/hello', cors, (req: any, res: any) => {
    res.send("Helloooo from a New CLF Severless Database!");
  }
);


app.get('/', cors, (req: any, res: any) => {
    res.status(200).json({
      ok: true,
      mensaje: 'Petición realizada correctamente'
    });
    }
  );


function auth (req: any, res: any, next: any) {
  if (req.query.admin === 'true') {
    next()
  } else {
    res.send('ERROR: No aut...')
  }
}


module.exports = app;