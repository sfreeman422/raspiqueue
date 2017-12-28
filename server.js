const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const mysql = require('mysql');

const port = 3000;
const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'musicStream',
});

connection.connect((err) => {
  if (err) console.log(err);
  console.log('Succesfully connected to mysql');
});

app.use(express.static(path.join(`${__dirname}/public`)));

// const wss = new WebSocket.Server({ port: 3001 });
// // Web Socket Server Handler
// wss.on('connection', (ws, req) => {
//   console.log(`Client has connected. IP is ${req.connection.remoteAddress}.`);
//   ws.on('message', (message) => {
//     if (message.startsWith('http://') || message.startsWith('https://')) {
//       console.log(`Link Detected: ${message}`);
//     } else {
//       console.log(`Received: ${message}`);
//     }
//   });
//   ws.send('something', (err) => {
//     if (err) console.log(err);
//   });
// });

// Static routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Joins a room if it exists in our DB. Asks the user to create it if it does not exist.
app.get('/join/:roomName', (req, res) => {
  connection.query(`SELECT * FROM rooms WHERE roomName = '${req.params.roomName}'`, (err, results) => {
    if (err) console.log(err);
    if (results > 0) {
      res.sendFile(path.join(__dirname, '/public/index.html'));
    } else {
      res.send('Sorry, this room does not exist. Would you like to create it?');
    }
  });
});

// Determines if we have a room that already exists with this name. If not, creates one and redirects the user to the newly created room.
app.post('/create/:roomName', (req, res) => {
  connection.query(`SELECT * FROM rooms WHERE roomName = '${req.params.roomName}'`, (err, results) => {
    if (err) res.send(err);
    else if (results.length > 0) {
      console.log('Found a room by that name. Cannot create new');
      res.send('Found a room by that name. Please try another name.');
    } else if (results.length === 0) {
      console.log(`No rooms founds. Creating room called ${req.params.roomName}`);
      connection.query(`INSERT INTO rooms (roomName, adminUser) VALUES ('${req.params.roomName}', 'sfreeman422')`, (error) => {
        if (err) console.log(`Error: ${error}`);
        res.redirect(`/join/${req.params.roomName}`);
      });
    }
  });
});

app.listen(3000, (err) => {
  if (err) console.log(err);
  else console.log(`Listening on port ${port}!`);
});

