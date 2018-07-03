const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const youtube = require('./routes/youtube');
const auth = require('./routes/auth');
const connection = require('./db/database');

const port = process.env.PORT || 3000;
const app = express();


app.use(express.static(path.join(`${__dirname}/public`)));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(apiRoutes);
app.use(youtube);
app.use(auth);

const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Static route to serverHTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

let LEADING_TIME = 0;

io.sockets.on('connection', (socket) => {
  const shittyNouns = ['Guy', 'Cat', 'Car', 'Chicken', 'Clown', 'Pearl', 'Son', 'Father'];
  const shittyAdjectives = ['Beautiful', 'Flaming', 'Hungry', 'Upset', 'Angry', 'Happy', 'Whatever'];

  const userName = shittyAdjectives[Math.floor(Math.random() * Math.floor(shittyAdjectives.length - 1))] + shittyNouns[Math.floor(Math.random() * Math.floor(shittyNouns.length - 1))];

  connection.query(`INSERT INTO users (userName, pass, email, isPublic, isInUse) VALUES ('${userName}', 'fakepassword', '${userName}@fake.com', true, true)`, (error, results) => {
    if (error) {
      console.log('MYSQL Error on inserting temp user...');
      console.log(error);
      console.log('sending back other random userName...');
      connection.query('SELECT * FROM users WHERE isPublic = true', (publicERr, publicResult) => {
        if (publicErr) {
          console.log(publicErr);
        } else {
          socket.emit('connected', { userId: publicResult.insertId });
        }
      });
    } else {
      console.log(results.insertId);
      // Emit a connected event to the socket, called connected, with the message 'You are connected'.
      socket.emit('connected', { userId: results.insertId });
      console.log('Successfully added temp user to the DB');
    }
  });

  socket.on('disconnect', (user) => {
    console.log(`User ${user} disconnected!`);
  });

  // Listen for queue related events.
  socket.on('queueChange', (message) => {
    console.log(message);
    io.emit('queueChanged');
  });

  socket.on('markPlayed', (message) => {
    console.log(message);
    LEADING_TIME = 0;
    io.emit('syncWithServer', LEADING_TIME);
    io.emit('queueChanged');
  });

  socket.on('addVideo', (message) => {
    console.log(message);
    io.emit('queueChanged');
  });

  // Listen for chat related events
  socket.on('message', (message) => {
    console.log(message);
    io.emit('messageReceived');
  });

  // Handles a voting situation.
  // Still need to determine how we will use this and what our source of truth will be.
  socket.on('vote', (voteInfo) => {
    if (voteInfo.type === 'up') {
      io.emit('upvoteIncremented');
    } io.emit('downvoteIncremented');
  });

  socket.on('timeSync', (time) => {
    if (time > LEADING_TIME) {
      LEADING_TIME = time;
      io.emit('syncWithServer', LEADING_TIME);
    }
  });
});

server.listen(port, (err) => {
  if (err) console.log(err);
  else console.log(`Listening on port ${port}!`);
});

