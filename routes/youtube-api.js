const express = require('express');

const router = express.Router();

router.get('/youtube', (req, res) => {
  res.send('lol');
});

module.exports = router;
