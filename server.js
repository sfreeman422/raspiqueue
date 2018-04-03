const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api.js');
const youtubeRoutes = require('./routes/youtube-api.js');

const port = 3000;
const app = express();

app.use(express.static(path.join(`${__dirname}/public`)));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(apiRoutes);
app.use(youtubeRoutes);

const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Static route to server HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

io.on('connection', (socket) => {
  // Emit a connected event to the socket, called connected, with the message 'You are connected'.
  socket.emit('connected', 'You are connected.');
  // Listen for queue related events.
  socket.on('queueChange', (message) => {
    console.log(message);
    io.emit('queueChanged');
  });
  socket.on('markPlayed', (message) => {
    console.log(message);
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
});

server.listen(port, (err) => {
  if (err) console.log(err);
  else console.log(`Listening on port ${port}!`);
});

