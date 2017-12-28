const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const port = 3000;
const app = express();

app.use(express.static(path.join(`${__dirname}/public`)));

const wss = new WebSocket.Server({ port: 3001 });
// Web Socket Server Handler
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    if (message.startsWith('http://') || message.startsWith('https://')) {
      console.log(`Link Detected: ${message}`);
    } else {
      console.log(`Received: ${message}`);
    }
  });
  ws.send('something');
});

// Static routes
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.listen(3000, (err) => {
  if (err) console.log(err);
  else console.log(`Listening on port ${port}!`);
});

