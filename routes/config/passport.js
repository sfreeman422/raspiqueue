const LocalStrategy = require('passport-local').Strategy;
const connection = require('../../db/database');
const User = require('../../db/User');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    connection.query(`SELECT * FROM users WHERE id=${id}`, (err, user) => {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy(
    {
      userNameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      console.log('req inside of strategy');
      console.log(req);
      connection.query(`SELECT * FROM users WHERE email=${username}`, (err, user) => {
        if (err) done(err);
        if (user) {
          done(null, false, 'That email is already in use');
        } else {
          const newUser = new User({ username, password });
          connection.query(`INSERT INTO users(email, pass) VALUES ('${newUser.email}', '${newUser.password}')`);
        }
      });
    },
  ));
};
