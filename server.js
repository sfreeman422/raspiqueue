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
// This should probably be a react comonent.
app.get('/api/:roomName', (req, res) => {
  connection.query(`SELECT * FROM rooms WHERE roomName = '${req.params.roomName}'`, (err, results) => {
    if (err) console.log(err);
    if (results.length > 0) {
      const returnObj = {
        roomName: results.roomName,
        roomId: results.roomId,
        adminUser: results.adminUser,

      }
      res.send(results);
    } else {
      res.status(404).send('Sorry, this room does not exist. Would you like to create it?');
    }
  });
});

// Determines if we have a room that already exists with this name. If not, creates one and redirects the user to the newly created room.
app.post('/create/:roomName', (req, res) => {
  connection.query(`INSERT INTO rooms (roomName, adminUser) VALUES ('${req.params.roomName}', 'sfreeman422')`, (err) => {
    if (err) res.send('This room already exists. Try another one!');
    else {
      res.redirect(`/join/${req.params.roomName}`);
    }
  });
});

app.listen(3000, (err) => {
  if (err) console.log(err);
  else console.log(`Listening on port ${port}!`);
});

