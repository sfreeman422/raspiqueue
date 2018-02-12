const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api.js');
const youtubeRoutes = require('./routes/youtube-api.js');
const util = require('util');

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
  // Listen for a songAdded event. Console log when we receive it.
  socket.on('queueChange', (message) => {
    console.log(message);
    io.emit('updateQueue');
  });
});

server.listen(port, (err) => {
  if (err) console.log(err);
  else console.log(`Listening on port ${port}!`);
});

