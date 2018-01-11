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

