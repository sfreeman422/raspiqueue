const express = require('express');
const path = require('path');
const mysql = require('mysql');

const port = 3000;
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

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

// Static routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Confirms whether or not a room exists in our DB.
app.get('/api/:roomName', (req, res) => {
  connection.query(`SELECT * FROM rooms WHERE roomName = '${req.params.roomName}'`, (err, results) => {
    if (err) console.log(err);
    if (results.length > 0) {
      const returnObj = {
        status: 200,
        message: 'Room has been found.',
        roomName: results[0].roomName,
        roomId: results[0].roomId,
        adminUser: results[0].adminUser,
      };
      res.send(returnObj);
    } else {
      const returnObj = {
        status: 404,
        message: 'Unable to find the room. Please try a new room, or create this one.',
      };
      res.send(returnObj);
    }
  });
});

// Determines if we have a room that already exists with this name.
// If not, creates one and redirects the user to the newly created room.
app.post('/create/:roomName', (req, res) => {
  connection.query(`INSERT INTO rooms (roomName, adminUser) VALUES ('${req.params.roomName}', 'sfreeman422')`, (err) => {
    if (err) res.send('This room already exists. Try another one!');
    else {
      res.redirect(`/join/${req.params.roomName}`);
    }
  });
});
// Connects us to our instance of socket.
io.on('connection', (client) => {
  console.log('A User has connected');
 
  client.on('disconnect', () => {
    console.log('User has disconnected');
  });
});

server.listen(3000, (err) => {
  if (err) console.log(err);
  else console.log(`Listening on port ${port}!`);
});

