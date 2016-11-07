const express = require('express');
app = express();



app

  .use(express.static(__dirname))
  .get('/', (req, res) => {
    res.sendFile('universe.html', {root: __dirname});
  })
  .listen('8080', () => {console.log('Running at localhost:8080')})
