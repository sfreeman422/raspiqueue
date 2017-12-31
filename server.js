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
  // Gets general information about our room.
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
      // Gets our current queue.
      connection.query(`
      SELECT links.roomId, links.linkId, links.linkUrl, links.linkName
      FROM links
      INNER JOIN rooms
      ON links.roomId = rooms.roomId
      WHERE rooms.roomId = ${results[0].roomId}
      && links.played = 0
      ORDER BY lastModified ASC`, (error, queueResults) => {
        if (error) console.log(error);
        returnObj.queue = queueResults;
        connection.query(`
        SELECT links.roomId, links.linkId, links.linkUrl, links.linkName
        FROM links
        INNER JOIN rooms
        ON links.roomId = rooms.roomId
        WHERE rooms.roomId = ${results[0].roomId}
        && links.played = 1
        ORDER BY lastModified DESC`, (histErr, historyResults) => {
          if (err) console.log(err);
          returnObj.history = historyResults;
          res.send(returnObj);
        });
      });
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
  connection.query(`INSERT INTO rooms (roomName, adminUser) VALUES ('${req.params.roomName}', '${req.params.adminUser}')`, (err) => {
    if (err) res.send('This room already exists. Try another one!');
    else {
      res.redirect(`/join/${req.params.roomName}`);
    }
  });
});
// Connects us to our instance of socket.
io.sockets.on('connection', (client) => {
  // Grabs the ip address of our user.
  const userIP = client.request.connection.remoteAddress;
  console.log(`New connection from ${userIP}`);
  client.on('disconnect', () => {
    console.log(`User has disconnected at ${userIP}`);
  });
});

server.listen(port, (err) => {
  if (err) console.log(err);
  else console.log(`Listening on port ${port}!`);
});

