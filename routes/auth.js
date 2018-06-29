const express = require('express');
const passport = require('passport');
const session = require('express-session');

const router = express.Router();

router.use(session({ secret: 'totallykewlsecret' })); // Secret should be changed in PROD.
router.use(passport.initialize());
router.use(passport.session());

require('./config/passport')(passport);

router.post('/api/login', (req, res) => {
  res.send('Testing the login route');
});


// This is all fucked up and needs to be figured out. Dk what i am doing at all.
router.post('/api/signup', (req, res, next) => {
  passport.authenticate('local-signup', (err, user, info) => {
    console.log('inside of passport.authenticate');
    console.log(err);
    console.log(user);
    if (err) return next(err);
    if (user) res.send('User name already exists, try again');
    console.log(info);
    res.send('User successfully added to the db');
  })(req, res, next);
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } res.send('Not authenticated');
};

module.exports = router;
