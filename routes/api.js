const express = require('express');
const mysql = require('mysql');

const router = express.Router();

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
// Confirms whether or not a room exists in our DB.
router.get('/api/:roomName', (req, res) => {
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
      SELECT users.userName, links.linkName, links.linkUrl, links.linkId, rooms_links.lastModified, rooms.roomId
      FROM rooms_links
      INNER JOIN links
        ON links.linkId = rooms_links.linkId
      INNER JOIN users
        ON users.userId = rooms_links.userId
      INNER JOIN rooms
        ON rooms_links.roomId = rooms.roomId
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
router.post('/api/create/room', (req, res) => {
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

router.post('/api/played', (req, res) => {
  const returnObj = {
    queue: [],
    history: [],
  };
  connection.query(`
  UPDATE rooms_links
    SET played = 1
  WHERE linkId = ${req.body.linkId} && roomId = ${req.body.roomId}
  `, (err, results) => {
    if (err) console.log(err);
    connection.query(`
      SELECT users.userName, links.linkName, links.linkUrl, links.linkId, rooms_links.lastModified, rooms.roomId
      FROM rooms_links
      INNER JOIN links
        ON links.linkId = rooms_links.linkId
      INNER JOIN users
        ON users.userId = rooms_links.userId
      INNER JOIN rooms
        ON rooms_links.roomId = rooms.roomId
      WHERE rooms_links.played = 0 && rooms_links.roomId = ${req.body.roomId}
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
        WHERE rooms_links.played = 1 && rooms_links.roomId = ${req.body.roomId}
        ORDER BY rooms_links.lastModified ASC`, (historyErr, historyResults) => {
        if (historyErr) console.log(historyErr);
        returnObj.history = historyResults;
        res.send(returnObj);
      });
    });
  });
});

module.exports = router;
