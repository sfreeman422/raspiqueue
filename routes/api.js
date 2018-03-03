const express = require('express');
const mysql = require('mysql');
const robinSort = require('../utils/roundRobin');

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
      SELECT users.userName, links.linkName, links.linkUrl, links.linkId, rooms_links.upvotes, rooms_links.downvotes, rooms_links.lastModified, rooms.roomId
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
        returnObj.queue = robinSort(queueResults);
        connection.query(`
        SELECT users.userName, links.linkName, links.linkUrl, rooms_links.lastModified, rooms_links.upvotes, rooms_links.downvotes
        FROM rooms_links
        INNER JOIN links
          ON links.linkId = rooms_links.linkId
        INNER JOIN users
          ON users.userId = rooms_links.userId
        WHERE rooms_links.played = 1 && rooms_links.roomId = ${results[0].roomId}
        ORDER BY rooms_links.lastModified DESC`, (historyErr, historyResults) => {
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
  connection.query(`
  UPDATE rooms_links
    SET played = 1, upvotes = ${req.body.upvotes}, downvotes= ${req.body.downvotes}
  WHERE linkId = ${req.body.linkId} && roomId = ${req.body.roomId}
  `, (err) => {
    if (err) console.log(err);
    res.send({
      status: 200,
      message: `Updated video at ID: ${req.body.linkId}`,
    });
  });
});

router.post('/api/addSong', (req, res) => {
  // Removes apostrophe characters from the title so that it does not mess up our sql syntax.
  req.body.title = req.body.title.replace(/'/g, '');
  req.body.title = req.body.title.replace(/"/g, '');
  // Attempts to insert the link into the links table.
  connection.query(`
  INSERT INTO links (linkName, linkUrl, linkThumbnail) VALUES ('${req.body.title}', '${req.body.video_id}', '${req.body.thumbnail}')`, (addErr, addResults) => {
    if (addErr) {
      // If we have an error due to a duplicate entry in the links table...
      if (addErr.code === 'ER_DUP_ENTRY') {
        // Get the ID of the video that already exists in the links table.
        connection.query(`
        SELECT linkId
        FROM links
        WHERE linkUrl='${req.body.video_id}'`, (dupErr, dupId) => {
          // If there was an error getting the ID of the pre-existing video in the links table, log it.
          if (dupErr) console.log(dupErr);
          // If we successfully have the ID, find it in the rooms_links table and link it to our room.
          connection.query(`
          INSERT INTO rooms_links (linkId, roomId, userId, played, upvotes, downvotes) VALUES (${dupId[0].linkId}, ${req.body.roomId}, ${req.body.userId}, 0, 0, 0)`, (roomLinkErr, roomLink) => {
            // If we have an error and it is due to a duplicate of a song being added to a room...
            if (roomLinkErr) {
              if (roomLinkErr.code === 'ER_DUP_ENTRY') {
                // Update the row that has both our roomId and linkId to have a played of 0.
                connection.query(`
                UPDATE rooms_links
                  SET played = 0
                WHERE linkId = ${dupId[0].linkId} && roomId=${req.body.roomId}
                `, (updateRowErr) => {
                  if (updateRowErr) console.log(updateRowErr);
                  res.json({
                    status: 200,
                    message: 'Added song to queue successfully',
                  });
                });
              }
            }
          });
        });
      }
    } else {
      connection.query(`
      INSERT INTO rooms_links (linkId, roomId, userId, played, upvotes, downvotes) VALUES (LAST_INSERT_ID(), ${req.body.roomId}, ${req.body.userId}, 0, 0, 0)`, (roomLinkErr, roomLink) => {
        if (roomLinkErr) console.log(roomLinkErr);
        res.json({
          status: 200,
          message: 'Added song to queue successfully',
        });
      });
    }
  });
});
module.exports = router;
