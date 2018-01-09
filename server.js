const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
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
app.use(bodyParser.urlencoded({ extended: true }));

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
      // Retrieves all information necessary for our queue.
      connection.query(`
      SELECT users.userName, links.linkName, links.linkUrl, rooms_links.lastModified
      FROM rooms_links
      INNER JOIN links
        ON links.linkId = rooms_links.linkId
      INNER JOIN users
        ON users.userId = rooms_links.userId
      WHERE rooms_links.played = 0 && rooms_links.roomId = ${results[0].roomId}
      ORDER BY rooms_links.lastModified ASC`, (queueErr, queueResults) => {
        if (queueErr) console.log(queueErr);
        returnObj.queue = queueResults;
        connection.query(`
        SELECT users.userName, links.linkName, links.linkUrl, rooms_links.lastModified
        FROM rooms_links
        INNER JOIN links
          ON links.linkId = rooms_links.linkId
        INNER JOIN users
          ON users.userId = rooms_links.userId
        WHERE rooms_links.played = 1 && rooms_links.roomId = ${results[0].roomId}
        ORDER BY rooms_links.lastModified ASC`, (historyErr, historyResults) => {
          if (historyErr) console.log(historyErr);
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
app.post('/api/create/room', (req, res) => {
  connection.query(`INSERT INTO rooms (roomName, adminUser, pass) VALUES ('${req.body.roomName}', '${req.body.adminUserId}', '${req.body.pass}')`, (err) => {
    if (err) {
      console.log(err);
      if (err.code === 'ER_DUP_ENTRY') {
        res.send('This room already exists. Try another one!');
      } else {
        res.send('An unexpected error occurred. Please try again.');
      }
    } else {
      res.redirect(`/join/${req.body.roomName}`);
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

